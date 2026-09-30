// Invocation metadata is separate from frozen render packages.
export const USAGE_VERSION='asset-usage-1';
export function assertUsage(asset){
 const c=asset.usageContract;
 if(!c||c.schemaVersion!==USAGE_VERSION)throw new Error(`${asset.id}: 缺少使用说明和调用参数 usageContract`);
 if(c.assetId!==asset.id||c.assetVersion!==asset.version)throw new Error(`${asset.id}: 使用说明与资产版本不匹配`);
 if(!c.summary||!Array.isArray(c.useWhen)||!c.useWhen.length||!Array.isArray(c.avoidWhen)||!c.avoidWhen.length||!Array.isArray(c.limitations)||!Array.isArray(c.parameters)||!c.parameters.length||!c.invocation?.inputSchema||!c.invocation?.example||!c.variants?.length)throw new Error(`${asset.id}: 使用说明不完整`);
 for(const p of c.parameters)if(!p.key||!p.label||!p.binding||!['runtime-prop','source-edit','selection','consumer'].includes(p.mode))throw new Error(`${asset.id}: 参数必须注明真实绑定和修改方式`);
 return c;
}
export function validateValue(value,schema,label='input'){
 if(schema.enum&&!schema.enum.includes(value))throw new Error(`${label}: 请选择 ${schema.enum.join(', ')}`);
 const types={object:v=>v!==null&&typeof v==='object'&&!Array.isArray(v),array:Array.isArray,string:v=>typeof v==='string',number:v=>typeof v==='number'&&Number.isFinite(v),integer:Number.isInteger,boolean:v=>typeof v==='boolean'};
 if(schema.type&&!types[schema.type]?.(value))throw new Error(`${label}: 类型应为 ${schema.type}`);
 if(schema.type==='object'){
  for(const k of schema.required||[])if(!(k in value))throw new Error(`${label}.${k}: 必填`);
  for(const [k,v] of Object.entries(value)){const s=schema.properties?.[k];if(!s&&schema.additionalProperties===false)throw new Error(`${label}.${k}: 未开放的参数`);if(s)validateValue(v,s,`${label}.${k}`);}
 }
 if(schema.type==='array'){
  if(value.length<(schema.minItems??0)||value.length>(schema.maxItems??Infinity))throw new Error(`${label}: 项数超出模板容量`);
  value.forEach((v,i)=>validateValue(v,schema.items||{},`${label}[${i}]`));
 }
 if(schema.type==='string'&&(value.length<(schema.minLength??0)||value.length>(schema.maxLength??Infinity)||(schema.pattern&&!new RegExp(schema.pattern).test(value))))throw new Error(`${label}: 长度或格式不符合约束`);
 if(typeof value==='number'&&(value<(schema.minimum??-Infinity)||value>(schema.maximum??Infinity)))throw new Error(`${label}: 超出参数范围`);
}
export function invocationPlan(asset,input){
 const c=assertUsage(asset);validateValue(input,c.invocation.inputSchema);
 const variant=c.variants.find(v=>v.id===input.variant);if(!variant)throw new Error('版本入口不存在');
 const runtimeProps=input.runtimeProps||{},sourceInputs=input.sourceInputs||{};
 if(Object.keys(runtimeProps).length&&variant.id!=='styled')throw new Error('该变体未验证运行时参数，不能直接传入');
 if(Object.keys(sourceInputs).length&&variant.id.startsWith('motion'))throw new Error('源码绑定按原复刻审计；先在 styled 派生工程修改，再同步生成纯动效版');
 const edits=Object.keys(sourceInputs).map(key=>({key,value:sourceInputs[key],...c.parameters.find(p=>p.key===key&&p.mode==='source-edit')}));
 return {schemaVersion:'asset-call-plan-1',assetId:asset.id,assetVersion:asset.version,usageVersion:c.version,variant,execution:edits.length?'source-edit-required':variant.kind==='template'?'render-existing':'consumer-integration',runtimeProps,sourceEdits:edits,steps:[...(edits.length?['复制指定源码包到新工程，按 sourceEdits 修改；不修改已发布包。']:[]),...(Object.keys(runtimeProps).length?['将 runtimeProps 保存为 props.json，通过 variants.runtimePropsInvocation 传递。']:[]),...(variant.kind==='template'?['安装指定包依赖，执行变体的 render；保留两遍渲染或子帧曝光管线。']:['按参数 binding 在目标工程中加载此资产。']),'检查文字容量、焦点、运动与导出；源改动后原复刻和纯动效两版同步验证。'],limitations:c.limitations,renderExecuted:false};
}
export function fileUsage(asset){
 const font=asset.type==='font';
 return {schemaVersion:USAGE_VERSION,version:'1.0.0',assetId:asset.id,assetVersion:asset.version,summary:font?'作为目标工程的字体文件加载，使用前检查实际字形覆盖。':'作为目标工程的背景媒体加载；保留原文件，不自动修改内部画面。',useWhen:font?['需要当前字体外观的主体文字或标签']:['需要该图像或视频作为背景'],avoidWhen:font?['未经检查直接认定支持所有中文、英文或字重']:['把背景文件当作可分层的动效模板'],parameters:[{key:font?'fontFamily':'fit',label:font?'加载后的字体名称':'背景填充方式',mode:'consumer',binding:font?'FontFace + document.fonts.add；目标组件 fontFamily':'目标 Img / OffthreadVideo 的 style.objectFit',default:font?asset.fontFamily:asset.config?.fit||'cover'}],variants:[{id:'file',kind:asset.type,file:asset.file}],invocation:{inputSchema:{type:'object',properties:{variant:{type:'string',enum:['file']}},required:['variant'],additionalProperties:false},example:{variant:'file'}},limitations:font?['字形覆盖和授权范围未自动验证；字体替换后检查换行及排版。']:['裁切、循环和静音需由目标工程显式设置；媒体本身不提供相机或文字编辑参数。'],evidence:{level:'file-import',originalName:asset.originalName}};
}
export function searchableUsage(asset){const c=asset.usageContract;return [asset.name,asset.id,asset.type,asset.description,asset.desc,...(asset.tags||[]),c?.summary,...(c?.useWhen||[]),...(c?.keywords||[])].filter(Boolean).join(' ').toLowerCase();}
export function usageMarkdown(c){return `# ${c.name||c.assetId} · 使用说明\n\n${c.summary}\n\n资产版本：${c.assetVersion}；说明版本：${c.version}\n\n## 适合\n${c.useWhen.map(x=>'- '+x).join('\n')}\n\n## 不适合\n${c.avoidWhen.map(x=>'- '+x).join('\n')}\n\n## 参数\n${c.parameters.map(p=>`- **${p.key}** (${p.mode})：${p.label}。绑定：${p.binding}。${p.note||''}`).join('\n')}\n\n## 调用示例（调用计划，不等于已经渲染）\n\`\`\`json\n${JSON.stringify(c.invocation.example,null,2)}\n\`\`\`\n\n## 入口\n${c.variants.map(v=>`- ${v.id}: ${v.package||v.file}；${v.render||'目标工程加载'}；${v.runtimePropsInvocation||'未声明运行时参数透传'}`).join('\n')}\n\n## 限制\n${c.limitations.map(x=>'- '+x).join('\n')}\n\n验证级别：${c.evidence?.level||'未记录'}。本次元数据补录不等于新的视觉或渲染验收。\n`;}
