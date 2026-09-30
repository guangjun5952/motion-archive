export function resolvedStyle(asset){
 if(!asset.styleSpec)return null;
 const spec=structuredClone(asset.styleSpec);
 for(const key of Object.keys(spec.palette)){const value=asset.usageConfig?.[key];if(/^#[0-9a-f]{6}$/i.test(value||''))spec.palette[key]=value;}
 return spec;
}
