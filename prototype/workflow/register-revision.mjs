// Local assistant entry point: register an actual render and freeze its source.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Store} from './store.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [projectId,revisionId,videoArg,projectArg,note='']=process.argv.slice(2);
if(!projectId||!/^v\d+$/.test(revisionId||'')||!videoArg||!projectArg)throw new Error('用法: register-revision.mjs <项目ID> <v2> <工作台内视频路径> <Remotion工程路径> [说明]');
const store=new Store(path.join(root,'data'),path.join(root,'workflow/seed.json'));
const video=path.resolve(root,videoArg.replace(/^\//,''));if(!video.startsWith(path.join(root,'workflow/media')+path.sep))throw new Error('视频必须在 workflow/media 内');const stat=await fs.stat(video);if(stat.size<1000)throw new Error('视频无效');
const source=path.resolve(projectArg);for(const f of ['package.json','tsconfig.json','src/index.ts'])await fs.access(path.join(source,f));
await store.mutate(async db=>{const p=db.projects.find(p=>p.id===projectId);if(!p)throw new Error('项目不存在');if(p.status==='published')throw new Error('已发布项目的版本升级暂不支持；请创建新的复现项目');if(p.revisions.some(r=>r.id===revisionId))throw new Error('该版本已存在，不允许覆盖');
 const snapshot=path.join('data','revisions',p.id,revisionId);await fs.mkdir(path.join(root,snapshot),{recursive:true});await fs.cp(path.join(source,'src'),path.join(root,snapshot,'src'),{recursive:true});for(const f of ['package.json','tsconfig.json'])await fs.copyFile(path.join(source,f),path.join(root,snapshot,f));
 if(await fs.stat(path.join(source,'public')).catch(()=>null))await fs.cp(path.join(source,'public'),path.join(root,snapshot,'public'),{recursive:true});
 p.revisions.push({id:revisionId,label:revisionId+' · Remotion 复现',video:'/'+path.relative(root,video),snapshot,createdAt:new Date().toISOString(),notes:note,limitations:p.revisions.at(-1)?.limitations||[],pipeline:JSON.parse(await fs.readFile(path.join(source,'package.json'),'utf8')).motionArchive?.pipeline,runtime:path.relative(path.dirname(root),source)+'/src/index.ts',review:{status:'pending',note:''}});p.status='in_review';delete p.package;});
console.log('新版本已登记；确认状态已重置，源码快照已冻结。');
