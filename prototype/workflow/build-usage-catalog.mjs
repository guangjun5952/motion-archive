import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {assertUsage,fileUsage,usageMarkdown,USAGE_VERSION} from './usage-contract.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const str=(maxLength=80)=>({type:'string',minLength:1,maxLength});
const list=(n,max=40)=>({type:'array',minItems:n,maxItems:n,items:str(max)});
const profiles={
 'finqube-combo':{summary:'五张财务卡片空间巡游，依次突出收入、发票、交易，最后拉远总览。',useWhen:['连续介绍多个财务功能','从局部数据推进到整体业务视图'],avoidWhen:['单个数值上涨或下降','任意数量卡片的自由排列'],keywords:['财务','多功能','巡游','总览'],capacity:'五卡布局固定；四组主体标题，前三组最多 28 字符、末组 40 字符（源码 schema 限制）。',slots:[['cardContent','卡片内部数据',str(800),'src/Finqube.tsx','Income / Invoice / Transactions / Categories / Breakdown','公司、金额、分类仍是组件中的固定内容，需源码编辑。']]},
 'trading-mirror':{summary:'镜像人物、交易图表、分屏与桌面构成的完整叙事，适合生活习惯与交易行为的类比。',useWhen:['将生活行为与专业表现做类比','习惯、责任、自我改善的连续叙事'],avoidWhen:['精确数据可视化','任意人物动作或写实三维角色'],keywords:['镜像','对比','交易','习惯'],capacity:'按原片多镜头顺序；人物和图表结构固定。替换段落需重新核对每镜停留。',slots:[['shotCopy','逐镜文案修改要求',str(1600),'src/Trading.tsx','Scene','按 Scene 中各镜头文本修改，不能用一条标题覆盖全片。'],['chartContent','图表与任务内容',str(800),'src/Trading.tsx','Chart / Tasks','数值或行数改变后重新检查几何关系。']]},
 'finqube-full-template':{summary:'从自由职业痛点进入产品、工作区和价格，最后行动号召的完整产品介绍。',useWhen:['产品价值与多个功能的完整介绍','痛点—产品—价格—行动号召结构'],avoidWhen:['只需几秒的单句强调','未经重编排缩短到任意时长'],keywords:['产品','自由职业','价格','工作区','完整介绍'],capacity:'整条叙事按 shots 固定；长文案、价格与卡片内容需要逐镜编辑。',slots:[['shotCopy','分镜文案',str(2200),'src/Film.tsx','Intro / Mess / Funnel / Product / Orbit / Workspace / Free / Pricing / End','保持既有镜头任务与文字单元。'],['nestedCards','嵌套财务片段的修改要求',str(800),'src/render.mjs','render','先检查嵌套片段来源与工程；不可仅改外层而保留旧风格片段。']]},
 'discipline-focus':{summary:'自律主题：主体字、日历翻页、任务与人物场景串联，强调长期行动。',useWhen:['自律或持续行动的观点叙事','时间积累与任务完成的说明'],avoidWhen:['当作任意日期的通用日历','以静态替字替代整页翻转'],keywords:['自律','日历','时间','任务','观点'],capacity:'原镜头数量与翻页结构固定；文字时点按 cuts 和场景内部节点编辑。',slots:[['shotCopy','逐镜主体文案',str(1600),'src/Film.tsx','CenterWords / cuts','保留词级出现与强调节奏，默认不新增上方旁白字幕。'],['taskContent','任务与时间内容',str(800),'src/Film.tsx','Task','修改日历或任务时必须保持整组件运动一致。']]},
 'saas-spatial-chat':{summary:'输入卡片、生成按钮、编辑界面与双面画廊组成的 SaaS 产品演示。',useWhen:['AI 输入到生成结果的演示','软件编辑流程与多结果画廊展示'],avoidWhen:['无需软件界面的纯观点强调','期待照片内部具有真实运动'],keywords:['AI','生成','软件','画廊','输入','结果'],capacity:'15 镜头、画廊原有 40 层；数量变化需重新校准布局和遮挡。',slots:[['shotCopy','输入和界面文案',str(1800),'src/Film.tsx','Chat / Generate / List / Words','在每个组件中替换，不能假设统一 compositionProps 已存在。'],['galleryMedia','画廊图片替换要求',str(1000),'src/Film.tsx','Gallery','替换 staticFile 所指素材；图片内部仍为静态。']]},
 'editing-creative-core':{summary:'流程卡片错峰进入，时间线去重与压缩，最后突出人的创意。',useWhen:['说明 AI 处理重复工作、人负责创意','从机械流程转向核心价值'],avoidWhen:['泛用步骤列表','精确展示任意剪辑软件的实际功能'],keywords:['AI','机械劳动','创意','去重','压缩'],capacity:'保留流程—时间线—创意三段结构；字数范围是保守调用约束，不等于排版已测量。',slots:[['openingText','开场主体文字',str(24),'src/scene/index.tsx','模板化的流程','修改 CN 的 text 属性。'],['closingText','结尾强调文字',str(24),'src/scene/index.tsx','你的创意','同时检查文字光晕和落位。']]},
 'editing-folder-analysis':{summary:'光标触发文件夹，三个文件沿弧线错峰展开，再横向移镜。',useWhen:['解释参考资料或工程的组成','展示一个文件夹中的三份材料'],avoidWhen:['超过三个文件且不改布局','把展开效果用于无文件关系的数字比较'],keywords:['文件夹','参考','分析','三份资料','展开'],capacity:'1 个文件夹、3 个文件；图标与扩展名绑定，替换需在 File 中完成。',slots:[['heading','文件夹主体文字',str(20),'src/scene/index.tsx','参考工程分析','修改原主体文字，不额外添加常驻标题。'],['fileLabels','三个文件说明',list(3,20),'src/scene/index.tsx','function File','保留三项顺序，核对 File 的标签和扩展名。']]},
 'editing-workflow':{summary:'八个流程节点沿路径串联，镜头连续巡游，高亮逐个交接。',useWhen:['恰好八步的操作流程','从开始到输出的顺序说明'],avoidWhen:['三步或任意节点数量而不重排路径','需要并行分支或循环的流程'],keywords:['流程','八步','步骤','顺序','连线'],capacity:'固定 8 节点；XS、YS、camera 路径与激活时点相互绑定。每项最多 12 字符是保守调用限制，仍需视觉检查。',slots:[['labels','八个节点名称',list(8,12),'src/scene/index.tsx','LABELS','保持 8 项；前两项原用英文字体，更换中文时同时改字体绑定。']]},
 'editing-three-inputs':{summary:'三张文件卡片展开、逐个推进聚焦、景深切换，最后拉回总览。',useWhen:['解释三种输入或三部分材料','三个对象逐一介绍后汇总'],avoidWhen:['超过三项的列表','只强调单个物体而不需要逐项介绍'],keywords:['三部分','输入','聚焦','文件','总览'],capacity:'固定 3 卡；保留开合与焦点时点。标题最多 16 字符为保守调用限制。',slots:[['titles','三张卡片标题',list(3,16),'src/scene/index.tsx','const titles','修改 titles 数组；若替换输入类型，同时核对图像与标签。'],['media','三张卡片图片路径',list(3,240),'src/scene/media.ts','export const media','当前为内嵌图片数组，路径不能直接传入，需在派生工程修改加载方式。']]},
};
const db=JSON.parse(await fs.readFile(path.join(root,'data/workflow.json'),'utf8'));
const assets=[...db.assets.map(a=>({...a,...db.library?.overrides?.[a.id]})),...(db.library?.items||[])].filter(a=>!db.library?.deletedIds?.includes(a.id));
const contracts=[];
for(const a of assets){
 if(a.file){const c=fileUsage(a);c.name=a.name;contracts.push(c);continue;}
 if(!a.package)continue;
 const pkgDir=path.join(root,a.package.slice(1).replace(/\.zip$/,''));
 const pkg=JSON.parse(await fs.readFile(path.join(pkgDir,'package.json'),'utf8'));
 const variants=[];
 async function variant(id,item){
  const dir=path.join(root,item.package.slice(1).replace(/\.zip$/,'')),p=JSON.parse(await fs.readFile(path.join(dir,'package.json'),'utf8'));
  const rt=item.runtime;await fs.access(path.join(dir,rt.file||rt.entry));
  return {id,kind:a.type,package:item.package,packageSha256:createHash('sha256').update(await fs.readFile(path.join(root,item.package.slice(1)))).digest('hex'),runtime:rt,install:'npm install',render:a.type==='template'?'npm run render':null,renderScript:p.scripts?.render,video:a.constraints,preview:item.preview,...(id==='styled'&&a.id==='finqube-combo'?{runtimePropsInvocation:'node src/render.mjs out.mp4 --props=props.json'}:{})};
 }
 variants.push(await variant(a.type==='style'?'style':'styled',a));
 if(a.motionOnly)variants.push(await variant('motion',a.motionOnly));
 for(const [aspect,v] of Object.entries(a.aspectVariants||{})){if(v.package!==a.package)variants.push(await variant('styled-'+aspect,{...a,...v}));if(v.motionOnly&&v.motionOnly.package!==a.motionOnly?.package)variants.push(await variant('motion-'+aspect,v.motionOnly));}
 const p=profiles[a.id];let parameters=[],sourceProperties={},runtimeProperties={};
 if(p){for(const [key,label,schema,file,anchor,note] of p.slots){const contents=await fs.readFile(path.join(pkgDir,file),'utf8');if(!contents.includes(anchor.split(' / ')[0]))throw new Error(a.id+': 找不到绑定 '+anchor);parameters.push({key,label,mode:'source-edit',schema,binding:file+' :: '+anchor,note});sourceProperties[key]=schema;}}
 if(a.id==='finqube-combo'){
  const defaults={accent:'#d9ff83',dark:'#042f20',incomeTitle:'Track Income',invoiceTitle:'Manage Invoices',transactionsTitle:'Organize Transactions',endingTitle:'Understand\nBusiness',motionBlur:true,fisheyeStrength:.34};
  for(const [key,value] of Object.entries(defaults)){const schema=key==='fisheyeStrength'?{type:'number',minimum:0,maximum:.6}:typeof value==='boolean'?{type:'boolean'}:['accent','dark'].includes(key)?{type:'string',pattern:'^#[0-9a-fA-F]{6}$'}:{type:'string',maxLength:key==='endingTitle'?40:28};runtimeProperties[key]=schema;parameters.push({key,label:key,mode:'runtime-prop',default:value,schema,binding:'src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx',note:'仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。'});}
 }
 if(a.type==='style'){for(const [key,value] of Object.entries(a.styleSpec?.palette||{})){parameters.push({key,label:'配色 '+key,mode:'consumer',default:value,schema:{type:'string',pattern:'^#[0-9a-fA-F]{6}$'},binding:'styleSpec.palette.'+key,note:'供目标模板映射，不会自动修改模板中的硬编码颜色。'});}parameters.push({key:'typography',label:'字体与材质映射',mode:'source-edit',schema:str(800),binding:(a.runtime.file||a.runtime.entry)+'；目标模板文字与材质组件',note:'先核对字体文件和目标组件，再做显式映射。'});sourceProperties.typography=str(800);}
 parameters.unshift({key:'variant',label:'选择原复刻、纯动效或独立风格入口',mode:'selection',binding:'variants[id]',schema:{type:'string',enum:variants.map(v=>v.id)}});
 const inputSchema={type:'object',properties:{variant:{type:'string',enum:variants.map(v=>v.id)},...(Object.keys(runtimeProperties).length?{runtimeProps:{type:'object',properties:runtimeProperties,additionalProperties:false}}:{}),sourceInputs:{type:'object',properties:sourceProperties,additionalProperties:false}},required:['variant'],additionalProperties:false};
 const c={schemaVersion:USAGE_VERSION,version:'1.0.0',assetId:a.id,assetVersion:a.version,name:a.name,summary:p?.summary||a.description,useWhen:p?.useWhen||['需要本风格的配色、文字外观和材质参考'],avoidWhen:p?.avoidWhen||['未经适配直接套用到所有模板','只传入风格 ID 就期待源码自动换肤'],keywords:p?.keywords||Object.keys(a.styleSpec?.palette||{}),capacity:p?.capacity||'风格不定义节点数量和时长，遵循目标模板容量。',duration:{seconds:a.constraints.durationInFrames/a.constraints.fps,policy:'fixed-source-timing',note:'不是已验证的可拉伸时长。新口播不匹配时需调整派生工程并复核两版。'},parameters,variants,invocation:{inputSchema,example:{variant:a.type==='style'?'style':'styled',...(a.id==='finqube-combo'?{runtimeProps:{incomeTitle:'追踪收入',fisheyeStrength:.34}}:{})}},styleCompatibility:{automaticBinding:false,referenceStyleIds:(a.dependencies||[]).map(x=>x.id),note:'纯动效入口用于保留运动；绑定新风格仍需显式修改绘制层。'},limitations:[...(a.constraints.notes||[]),...(a.usageNotes||[]),'sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。','只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。'],evidence:{level:'source-and-package-audit',auditedAt:new Date().toISOString(),sourceRevision:a.revisionId,entry:a.runtime.file,sourceSha256:createHash('sha256').update(await fs.readFile(path.join(pkgDir,a.runtime.file))).digest('hex'),renderVerifiedThisChange:false}};
 assertUsage({...a,usageContract:c});contracts.push(c);
}
const out=path.join(root,'usage');await fs.mkdir(out,{recursive:true});
// Metadata-only additions: never rewrite the source packages or approved snapshots.
for(const c of contracts){const base=`${c.assetId}-${c.assetVersion}-usage-${c.version}`;await fs.writeFile(path.join(out,base+'.json'),JSON.stringify(c,null,2)+'\n',{flag:'wx'});await fs.writeFile(path.join(out,base+'.md'),usageMarkdown(c),{flag:'wx'});c.documents={json:'/usage/'+base+'.json',markdown:'/usage/'+base+'.md'};}
await fs.writeFile(path.join(out,'catalog.json'),JSON.stringify({schemaVersion:USAGE_VERSION,contracts},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({assets:contracts.length,templates:contracts.filter(x=>profiles[x.assetId]).length,output:out}));
