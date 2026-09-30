# 森林绿与荧光绿 · 流动光场 · 使用说明

深绿与浅绿场景、荧光引导球、白色财务卡片和六层流动光场。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 需要本风格的配色、文字外观和材质参考

## 不适合
- 未经适配直接套用到所有模板
- 只传入风格 ID 就期待源码自动换肤

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **dark** (consumer)：配色 dark。绑定：styleSpec.palette.dark。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **accent** (consumer)：配色 accent。绑定：styleSpec.palette.accent。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **surface** (consumer)：配色 surface。绑定：styleSpec.palette.surface。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **light** (consumer)：配色 light。绑定：styleSpec.palette.light。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **guide** (consumer)：配色 guide。绑定：styleSpec.palette.guide。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **typography** (source-edit)：字体与材质映射。绑定：src/Space.tsx；目标模板文字与材质组件。先核对字体文件和目标组件，再做显式映射。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "style"
}
```

## 入口
- style: /packages/finqube-full-001-1.0.0.zip；目标工程加载；未声明运行时参数透传

## 限制
- 引导球及背景光路径根据原片采样重建，未达到逐帧精确匹配。
- 新增场景使用 CSS 透视与 Z 轴层级，不是 Three.js 网格场景。
- 字体、人物图标与界面细节仍是近似重建，尚未加入完整物理快门模糊。
- 19–25 秒继续复用已确认的鱼眼巡游，未修改该片段。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
