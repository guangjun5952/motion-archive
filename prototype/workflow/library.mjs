import {readFileSync} from 'node:fs';
import {assertUsage} from './usage-contract.mjs';
function withUsage(a){
 let contracts=[];try{contracts=JSON.parse(readFileSync(new URL('../usage/catalog.json',import.meta.url),'utf8')).contracts;}catch(e){if(e.code!=='ENOENT')throw e;}
 const usageContract=a.usageContract||contracts.find(c=>c.assetId===a.id&&c.assetVersion===a.version);
 return {...a,usageContract,usageStatus:usageContract?'documented':'needs-review'};
}
export function compactAssets(assets){
 const result=[];
 for(const a of assets){
  if(!['style','combo','template'].includes(a.type))continue;
  const parts=assets.filter(x=>x.projectId===a.projectId&&!['style','combo','template'].includes(x.type));
  result.push({...a,type:a.type==='style'?'style':'template',components:a.type==='style'?[]:parts,dependencies:a.type==='style'?[]:assets.filter(x=>x.projectId===a.projectId&&x.type==='style').map(x=>({id:x.id,version:x.version})),description:a.type==='style'?a.description:'包含空间布局、动态背景、运镜、文字弹跳与鱼眼镜头的完整动效模板。'});
 }
 return result;
}
export function libraryView(db){
 const managed=db.library||{items:[],folders:['产品演示','文字演绎','UI 操作'],overrides:{}};
 return {items:[...db.assets.filter(a=>!managed.deletedIds?.includes(a.id)).map(a=>({...a,...managed.overrides?.[a.id],id:a.id,type:a.type,productionReady:true})),...managed.items.filter(a=>!managed.deletedIds?.includes(a.id))].map(withUsage),folders:managed.folders};
}
export function saveLibrary(db,body){
 if(!Array.isArray(body.items)||body.items.length>500||!Array.isArray(body.folders))throw new Error('资产列表无效');
 const folderList=body.folders.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.slice(0,60)).slice(0,100);
 const overrides={},items=[];
 for(const item of body.items){
  if(db.library?.deletedIds?.includes(item?.id))continue;
  if(!item||typeof item.id!=='string'||typeof item.name!=='string'||!['style','template','font','background'].includes(item.type))throw new Error('资产格式无效');
  const imported=db.library?.items.find(a=>a.id===item.id&&a.file);
  if(imported){items.push({...imported,name:item.name.slice(0,100),desc:String(item.desc||'').slice(0,400),fav:!!item.fav,folders:(item.folders||[]).filter(x=>folderList.includes(x)),config:{...imported.config,sample:String(item.config?.sample||imported.config.sample).slice(0,300),fit:item.config?.fit==='contain'?'contain':'cover'}});continue;}
  if(['font','background'].includes(item.type))throw new Error('请通过文件导入创建字体和背景');
  const base=db.assets.find(a=>a.id===item.id);
  if(base){overrides[item.id]={name:item.name.slice(0,100),description:String(item.desc??item.description??'').slice(0,400),tags:(item.tags||[]).filter(x=>typeof x==='string').slice(0,20),folders:(item.folders||[]).filter(x=>folderList.includes(x)),fav:!!item.fav,usageConfig:item.usageConfig||{}};}
  else {if(item.image&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(item.image))throw new Error('参考图片格式无效');items.push({...item,usageContract:undefined,callable:false,productionReady:false,package:undefined,preview:undefined,runtime:undefined,source:undefined});}
 }
 db.library={...db.library,items,folders:folderList,overrides,initialized:true};return libraryView(db);
}

export function deleteLibraryAsset(db,id){
 if(typeof id!=='string'||!libraryView(db).items.some(a=>a.id===id))throw new Error('资产不存在或已删除');
 db.library ||= {items:[],folders:[],overrides:{}};
 db.library.deletedIds=[...new Set([...(db.library.deletedIds||[]),id])];
 db.library.items=db.library.items.filter(a=>a.id!==id);
 delete db.library.overrides?.[id];
 db.library.initialized=true;
 return libraryView(db);
}
