import fs from 'node:fs/promises';
import {assertUsage,invocationPlan,searchableUsage} from './usage-contract.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {libraryView} from './library.mjs';
import {Store} from './store.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const db=await new Store(path.join(root,'data'),path.join(root,'workflow/seed.json')).read();
const [command,query='']=process.argv.slice(2);
if(command==='projects')console.log(JSON.stringify(db.projects,null,2));
else if(command==='search')console.log(JSON.stringify(libraryView(db).items.filter(a=>a.productionReady||a.callable).filter(a=>searchableUsage(a).includes(query.toLowerCase())),null,2));
else if(command==='usage-check'){let failed=0;for(const a of libraryView(db).items){try{assertUsage(a);console.log('OK '+a.type+' '+a.id);}catch(e){failed++;console.error(e.message);}}process.exitCode=failed?1:0;}
else if(command==='usage'||command==='plan'){const a=libraryView(db).items.find(a=>a.id===query);if(!a)throw new Error('资产不存在');console.log(JSON.stringify(command==='usage'?assertUsage(a):invocationPlan(a,JSON.parse(await fs.readFile(process.argv[4],'utf8'))),null,2));}
else if(command==='export'){const a=libraryView(db).items.filter(a=>a.productionReady||a.callable).find(a=>a.id===query);if(!a){console.error('没有已确认并入库的资产：'+query);process.exitCode=1;}else console.log(JSON.stringify({asset:a,packagePath:a.package?path.join(root,a.package):undefined,filePath:a.file?path.join(root,a.file):undefined,render:a.package?'npm install && npm run render':undefined},null,2));}
else {console.error('用法: cli.mjs projects | search [词] | export <asset-id> | usage <asset-id> | plan <asset-id> <input.json> | usage-check');process.exitCode=1;}
