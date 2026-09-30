import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createReadStream,createWriteStream} from 'node:fs';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'release-manifest.json'),'utf8'));
for(const rel of manifest.installDirectories){
 try{await fs.access(path.join(root,rel));throw new Error(`已有数据 ${rel}；为避免覆盖，请在全新目录安装。`);}catch(e){if(e.code!=='ENOENT')throw e;}
}
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'motion-archive-'));
try{
 const local=process.argv[2]==='--archive'?process.argv[3]:null;
 const archive=local?path.resolve(local):path.join(temp,manifest.file);
 if(!local){
  console.log('Downloading library asset pack…');
  const res=await fetch(manifest.url);if(!res.ok||!res.body)throw new Error(`下载失败 HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body),createWriteStream(archive));
 }
 const hash=createHash('sha256');for await(const chunk of createReadStream(archive))hash.update(chunk);
 if(hash.digest('hex')!==manifest.sha256)throw new Error('素材包 SHA-256 校验失败');
 const {stdout}=await exec('tar',['-tzf',archive],{maxBuffer:16*1024*1024});
 for(const name of stdout.split('\n').filter(Boolean)){
  if(name.startsWith('/')||name.split('/').includes('..')||!manifest.installDirectories.some(d=>name===d||name.startsWith(d+'/')))throw new Error('不安全的归档路径');
 }
 const stage=path.join(temp,'stage');await fs.mkdir(stage);
 await exec('tar',['-xzf',archive,'-C',stage]);
 for(const rel of manifest.installDirectories){await fs.mkdir(path.dirname(path.join(root,rel)),{recursive:true});await fs.cp(path.join(stage,rel),path.join(root,rel),{recursive:true,errorOnExist:true,force:false});}
 console.log('Installed and SHA-256 verified. Run npm start.');
}finally{await fs.rm(temp,{recursive:true,force:true});}
