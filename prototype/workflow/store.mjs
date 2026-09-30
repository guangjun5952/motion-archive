import {assertUsage} from './usage-contract.mjs';
import {compactAssets} from './library.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
export class Store {
 constructor(dir,seed){this.dir=dir;this.file=path.join(dir,'workflow.json');this.seed=seed;this.queue=Promise.resolve();}
 async read(){try{return JSON.parse(await fs.readFile(this.file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return JSON.parse(await fs.readFile(this.seed,'utf8'));}}
 mutate(fn){const job=this.queue.then(async()=>{const db=await this.read();const existing=new Set([...(db.assets||[]),...(db.library?.items||[])].map(a=>a.id+":"+a.version));const result=await fn(db);for(const a of [...(db.assets||[]),...(db.library?.items||[])])if((a.productionReady||a.callable)&&!existing.has(a.id+":"+a.version))assertUsage(a);await fs.mkdir(this.dir,{recursive:true});const tmp=this.file+'.tmp';await fs.writeFile(tmp,JSON.stringify(db,null,2));await fs.rename(tmp,this.file);return result;});this.queue=job.catch(()=>{});return job;}
}
export function reviewProject(p,{status,note,revisionId}){
 if(!['approved','changes_requested'].includes(status))throw new Error('请选择确认通过或需要修改');
 const r=p.revisions.find(r=>r.id===revisionId);if(!r||r!==p.revisions.at(-1))throw new Error('仅可确认最新版本');
 if(p.status==='published')throw new Error('已发布版本不可修改，请创建新版本');
 r.review={status,note:String(note||'').slice(0,2000),at:new Date().toISOString(),actor:'user'};
 p.status=status==='approved'?'approved':'changes_requested';return p;
}
export function buildAssets(p,ids){
 const r=p.revisions.at(-1);if(p.status!=='approved'||r?.review?.status!=='approved')throw new Error('请先确认最新复现版本，再执行入库');
 if(p.assetRuntime){const selected=p.candidates.filter(c=>ids.includes(c.id));if(!selected.length)throw new Error('至少选择一项候选资产');if(selected.some(c=>c.type==='style'&&!p.assetDefinitions?.[c.id]?.styleSpec))throw new Error('风格缺少配色与材质数据，无法入库');return selected.map(c=>({...c,...p.assetDefinitions?.[c.id],version:'1.0.0',projectId:p.id,revisionId:r.id,source:p.source,segment:p.segment,createdAt:new Date().toISOString(),preview:r.video,productionReady:true,runtime:p.assetRuntime[c.type],constraints:{...p.videoConfig,notes:r.limitations},dependencies:[],verification:'user-approved'}));}
 const all=p.componentCandidates||p.candidates;const chosen=ids.includes('finqube-combo')?all.filter(c=>c.type!=='style'||ids.includes(c.id)):all.filter(c=>ids.includes(c.id));const candidates=chosen;if(!candidates.length)throw new Error('至少选择一项候选资产');
 // Motion and layout stay paired until cross-layout reuse is proven.
 if(candidates.some(c=>['motion','combo'].includes(c.type))&&!candidates.some(c=>c.type==='layout'))throw new Error('这个动作依赖五卡空间布局，请一起入库');
 if(candidates.some(c=>c.type==='combo')&&!candidates.some(c=>c.type==='style'))throw new Error('完整组合需要一起保存全部四项依赖');
 const createdAt=new Date().toISOString();return compactAssets(candidates.map(c=>({...c,selected:undefined,version:'1.0.0',projectId:p.id,revisionId:r.id,source:p.source,segment:p.segment,createdAt,preview:r.video,productionReady:true,scope:'reference-study',verification:'user-approved',runtime:{entry:'src/Finqube.tsx',export:c.type==='background'?'GreenAtmosphere':c.type==='layout'?'layoutSlots':c.type==='motion'?'cameraAt':c.type==='style'?'defaults':'FinqubeStudy',file:c.type==='motion'?'src/motion.ts':'src/Finqube.tsx',...(r.pipeline==='fisheye-two-pass'&&c.type==='combo'?{entry:'src/index.ts',export:'LensVideo',file:'src/Lens.tsx',compositionId:'FinqubeFisheye',render:'node src/render.mjs out.mp4',pipeline:r.pipeline}: {})},dependencies:c.type==='combo'?p.candidates.filter(x=>x.type!=='combo').map(x=>({id:x.id,version:'1.0.0'})):c.type==='motion'?[{id:'finqube-cluster',version:'1.0.0'}]:[],constraints:{fps:60,width:720,height:1280,durationInFrames:360,renderer:r.pipeline==='fisheye-two-pass'?'remotion-css-perspective-webgl-lens':'remotion-css-perspective',titleMaxLength:28,notes:r.limitations}})));
}
