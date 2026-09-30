import {assertUsage,invocationPlan,searchableUsage} from './usage-contract.mjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {Store,reviewProject,buildAssets} from './store.mjs';
import {libraryView,saveLibrary,deleteLibraryAsset} from './library.mjs';
import {importUpload} from './uploads.mjs';
import {bundle} from './packaging.mjs';
const exec=promisify(execFile),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),repo=path.dirname(root);
const store=new Store(process.env.MOTION_DATA_DIR||path.join(root,'data'),path.join(root,'workflow/seed.json'));
const port=Number(process.env.PORT||4180);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.zip':'application/zip','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.webp':'image/webp','.gif':'image/gif','.webm':'video/webm'};
const send=(res,code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
async function body(req){let b='';for await(const chunk of req){b+=chunk;if(b.length>16000000)throw new Error('请求过大');}return JSON.parse(b||'{}');}
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1:4180'),parts=url.pathname.split('/').filter(Boolean);
 if(req.method!=='GET'&&req.headers.origin&&req.headers.origin!==`http://127.0.0.1:${port}`&&req.headers.origin!==`http://localhost:${port}`)return send(res,403,{error:'只接受本地工作台操作'});
 if(url.pathname==='/api/library/import'&&req.method==='POST'){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>50*1024*1024)throw new Error('文件最大 50 MB');chunks.push(chunk);}const asset=await importUpload(root,url.searchParams.get('name')||'',Buffer.concat(chunks));await store.mutate(db=>{db.library ||= {items:[],folders:[],overrides:{}};db.library.items.unshift(asset);});return send(res,200,asset);}
 if(url.pathname==='/api/workflow'&&req.method==='GET')return send(res,200,await store.read());
 if(url.pathname==='/api/library/delete'&&req.method==='POST'){const data=await body(req);return send(res,200,await store.mutate(db=>deleteLibraryAsset(db,data.id)));}
 if(url.pathname==='/api/library'&&req.method==='GET')return send(res,200,libraryView(await store.read()));
 if(url.pathname==='/api/library'&&req.method==='POST')return send(res,200,await (async()=>{const data=await body(req);return store.mutate(db=>saveLibrary(db,data));})());
 if(url.pathname==='/api/usage'&&req.method==='GET'){const items=libraryView(await store.read()).items;const id=url.searchParams.get('id');const rows=items.filter(a=>!id||a.id===id);if(id&&!rows.length)return send(res,404,{error:'资产不存在'});return send(res,200,rows.map(a=>({id:a.id,status:a.usageStatus,usageContract:a.usageContract})));}
 if(url.pathname==='/api/usage/plan'&&req.method==='POST'){const b=await body(req),a=libraryView(await store.read()).items.find(a=>a.id===b.assetId);if(!a)throw new Error('资产不存在');return send(res,200,invocationPlan(a,b.input));}
 if(url.pathname==='/api/assets'&&req.method==='GET'){const db=await store.read(),q=(url.searchParams.get('q')||'').toLowerCase();return send(res,200,libraryView(db).items.filter(a=>a.productionReady||a.callable).filter(a=>searchableUsage(a).includes(q)));}
 if(parts[0]==='api'&&parts[1]==='projects'&&parts[3]==='review'&&req.method==='POST'){const b=await body(req);const result=await store.mutate(async db=>{const p=db.projects.find(x=>x.id===parts[2]);if(!p)throw new Error('项目不存在');const r=p.revisions.at(-1);if(!r)throw new Error('尚无复现版本');await fs.access(path.join(root,r.video));return reviewProject(p,b);});return send(res,200,result);}
 if(parts[0]==='api'&&parts[1]==='projects'&&parts[3]==='publish'&&req.method==='POST'){const b=await body(req);const result=await store.mutate(async db=>{const p=db.projects.find(x=>x.id===parts[2]);if(!p)throw new Error('项目不存在');if(p.status==='published')return p;const assets=buildAssets(p,Array.isArray(b.ids)?b.ids:[]).map(a=>({...a,version:p.libraryVersion||a.version,usageContract:p.assetDefinitions?.[a.id]?.usageContract||p.usageContracts?.[a.id]}));for(const a of assets)assertUsage(a);p.package=await bundle(root,p,assets);p.status='published';p.publishedAt=new Date().toISOString();db.assets.push(...assets.map(a=>({...a,package:p.package})));return p;});return send(res,200,result);}
 if(url.pathname==='/api/import-eagle'&&req.method==='POST'){const b=await body(req);const file=path.resolve(String(b.path||'')),dir=path.dirname(file);if(!dir.endsWith('.info')||!file.toLowerCase().endsWith('.mp4'))throw new Error('请提供 Eagle .info 文件夹中的 MP4 路径');const meta=JSON.parse(await fs.readFile(path.join(dir,'metadata.json'),'utf8'));await fs.access(file);if(path.basename(dir)!==meta.id+'.info')throw new Error('Eagle ID 不匹配');const id='eagle-'+meta.id;
 const result=await store.mutate(db=>{const old=db.projects.find(p=>p.source.eagleId===meta.id);if(old)return old;const p={id,title:meta.name,status:'reference_ready',createdAt:new Date().toISOString(),source:{eagleId:meta.id,name:meta.name,path:file,url:meta.url||'',duration:meta.duration,width:meta.width,height:meta.height,fps:null},segment:{start:0,end:Math.min(6,meta.duration||6),description:'待选择复现片段'},revisions:[],candidates:[]};db.projects.unshift(p);return p;});return send(res,200,result);}
 if(parts[0]==='api')return send(res,404,{error:'接口不存在'});
 if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'方法不允许'});
 const requested=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+requested);if(!file.startsWith(root+path.sep)||requested.startsWith('/data/')||requested.endsWith('.mjs'))return send(res,403,{error:'无权限'});
 const stat=await fs.stat(file);if(!stat.isFile())throw new Error('Not found');const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
 const range=req.headers.range;if(range){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(!m)return res.writeHead(416).end();const start=Number(m[1]),end=Math.min(Number(m[2]||stat.size-1),stat.size-1);if(start>end||start>=stat.size)return res.writeHead(416).end();res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`});createReadStream(file,{start,end}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res);}
 }catch(e){send(res,e.code==='ENOENT'?404:400,{error:e.message});}});
server.listen(port,'127.0.0.1',()=>console.log(`Motion Archive workflow: http://127.0.0.1:${port}`));
