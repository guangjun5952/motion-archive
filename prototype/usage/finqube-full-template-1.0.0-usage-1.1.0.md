# Finqube · 完整产品演绎 · 使用说明

从自由职业痛点进入产品、工作区和价格，最后行动号召的完整产品介绍。

资产版本：1.0.0；说明版本：1.1.0

## 适合
- 产品价值与多个功能的完整介绍
- 痛点—产品—价格—行动号召结构

## 不适合
- 只需几秒的单句强调
- 未经重编排缩短到任意时长

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **shotCopy** (source-edit)：分镜文案。绑定：src/Film.tsx :: Intro / Mess / Funnel / Product / Orbit / Workspace / Free / Pricing / End。保持既有镜头任务与文字单元。
- **nestedCards** (source-edit)：嵌套财务片段的修改要求。绑定：src/render.mjs :: render。先检查嵌套片段来源与工程；不可仅改外层而保留旧风格片段。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/finqube-full-001-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/finqube-full-template-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/finqube-full-template-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/finqube-full-template-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 引导球及背景光路径根据原片采样重建，未达到逐帧精确匹配。
- 新增场景使用 CSS 透视与 Z 轴层级，不是 Three.js 网格场景。
- 字体、人物图标与界面细节仍是近似重建，尚未加入完整物理快门模糊。
- 19–25 秒继续复用已确认的鱼眼巡游，未修改该片段。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。
- 新增画幅按源码重新排布，仅覆盖 16:9 与 9:16；不是任意比例响应式。新画幅的文案与风格调整按源码修改，不自动接受原入口的 runtimeProps。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
