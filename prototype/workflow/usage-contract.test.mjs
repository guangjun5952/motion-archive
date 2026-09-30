import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {assertUsage,invocationPlan,fileUsage} from './usage-contract.mjs';
import {libraryView,saveLibrary} from './library.mjs';
import {Store} from './store.mjs';
const db=JSON.parse(await fs.readFile(new URL('../data/workflow.json',import.meta.url),'utf8'));
const items=libraryView(db).items;
test('全部现有正式资产都有按版本匹配的说明、真实文件与来源哈希',async()=>{
 assert.equal(items.filter(a=>a.type==='template').length,23);
 const checked=new Set();
 for(const a of items){const c=assertUsage(a);invocationPlan(a,c.invocation.example);for(const v of c.variants){if(!v.package||checked.has(v.package))continue;checked.add(v.package);const root=new URL('..',import.meta.url);const data=await fs.readFile(new URL('.'+v.package,root));assert.equal(createHash('sha256').update(data).digest('hex'),v.packageSha256);await fs.access(new URL('.'+v.package.replace(/\.zip$/,'')+'/'+(v.runtime.file||v.runtime.entry),root));}}
});
test('八步模板限制数量，源码修改不能冒充运行时 props',()=>{
 const a=items.find(a=>a.id==='editing-workflow');
 assert.throws(()=>invocationPlan(a,{variant:'styled',runtimeProps:{labels:['x']}}),/未开放/);
 assert.throws(()=>invocationPlan(a,{variant:'styled',sourceInputs:{labels:['a','b','c']}}),/容量/);
 const p=invocationPlan(a,{variant:'styled',sourceInputs:{labels:['收集','整理','转写','选段','配图','合成','检查','输出']}});
 assert.equal(p.execution,'source-edit-required');assert.equal(p.renderExecuted,false);assert.match(p.sourceEdits[0].binding,/LABELS/);
});
test('Finqube 运行参数做范围校验，几何入口不能误收品牌内容',()=>{
 const a=items.find(a=>a.id==='finqube-combo');
 assert.equal(invocationPlan(a,{variant:'styled',runtimeProps:{incomeTitle:'收入',fisheyeStrength:.3}}).execution,'render-existing');
 assert.throws(()=>invocationPlan(a,{variant:'styled',runtimeProps:{fisheyeStrength:.9}}),/范围/);
 assert.throws(()=>invocationPlan(a,{variant:'motion',runtimeProps:{incomeTitle:'收入'}}),/未验证/);
 assert.throws(()=>invocationPlan(a,{variant:'unknown'}),/请选择/);
 assert.throws(()=>invocationPlan(a,{variant:'styled',runtimeProps:{accent:'red'}}),/格式/);
});
test('保存名称和偏好不会丢失协议，前端不能伪造生产调用资格',()=>{
 const copy=structuredClone(db);const before=libraryView(copy).items;
 saveLibrary(copy,{items:[...before,{id:'demo-usage',name:'Fake',type:'template',callable:true,usageContract:{fake:true}}],folders:copy.library.folders});
 const after=libraryView(copy).items;
 assert.deepEqual(after.find(a=>a.id==='editing-workflow').usageContract,before.find(a=>a.id==='editing-workflow').usageContract);
 assert.equal(after.find(a=>a.id==='demo-usage').callable,false);assert.equal(after.find(a=>a.id==='demo-usage').usageContract,undefined);
});
test('后续入库必须有协议，导入字体自动具备文件调用协议',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'usage-gate-'));const store=new Store(dir,new URL('./seed.json',import.meta.url));
 try{
 await assert.rejects(store.mutate(db=>db.assets.push({id:'new',type:'template',version:'1.0.0',productionReady:true})),/缺少使用说明/);
 assert.equal((await store.read()).assets.some(a=>a.id==='new'),false);
 const a={id:'font',type:'font',version:'1.0.0',file:'/uploads/a.ttf',fontFamily:'A',callable:true};a.usageContract=fileUsage(a);
 await store.mutate(db=>{db.library={items:[a],folders:[],overrides:{}};});assert.equal((await store.read()).library.items.length,1);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
