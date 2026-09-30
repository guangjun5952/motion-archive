import {fileUsage} from './usage-contract.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export function inspectUpload(name,bytes){
 const ext=path.extname(name).toLowerCase();const font=['.woff2','.woff','.ttf','.otf'].includes(ext);
 const background=['.png','.jpg','.jpeg','.webp','.gif','.mp4','.webm'].includes(ext);
 if(!font&&!background)throw new Error('支持 WOFF2、WOFF、TTF、OTF 字体及 PNG、JPG、WebP、GIF、MP4、WebM 背景');
 if(!bytes.length||bytes.length>(font?10:50)*1024*1024)throw new Error(font?'字体最大 10 MB':'背景最大 50 MB');
 const ascii=(s,e)=>bytes.toString('ascii',s,e);
 const valid={'.woff2':ascii(0,4)==='wOF2','.woff':ascii(0,4)==='wOFF','.otf':ascii(0,4)==='OTTO','.ttf':bytes.subarray(0,4).equals(Buffer.from([0,1,0,0])),'.png':bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'.jpg':bytes[0]===255&&bytes[1]===216,'.jpeg':bytes[0]===255&&bytes[1]===216,'.webp':ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP','.gif':['GIF87a','GIF89a'].includes(ascii(0,6)),'.mp4':ascii(4,8)==='ftyp','.webm':bytes.subarray(0,4).equals(Buffer.from([26,69,223,163]))}[ext];
 if(!valid)throw new Error('文件内容与扩展名不匹配');return {ext,type:font?'font':'background',mediaKind:font?'font':['.mp4','.webm'].includes(ext)?'video':'image'};
}
export async function importUpload(root,name,bytes){const info=inspectUpload(name,bytes),id='file-'+randomUUID();const relative='/uploads/'+id+info.ext;await fs.mkdir(path.join(root,'uploads'),{recursive:true});await fs.writeFile(path.join(root,relative),bytes);const asset={id,type:info.type,mediaKind:info.mediaKind,name:path.basename(name).replace(/\.[^.]+$/,''),originalName:path.basename(name),desc:'自定义导入',art:'file',file:relative,bytes:bytes.length,fontFamily:info.type==='font'?'Archive_'+id.replaceAll('-','_'):undefined,config:{sample:'让灵感开始流动\nMake it move. 0123456789',fit:'cover'},tags:[info.type==='font'?'自定义字体':'自定义背景'],folders:[],fav:false,status:'已导入',version:'1.0.0',duration:0,created:Date.now(),productionReady:false,callable:true};asset.usageContract=fileUsage(asset);return asset;}
