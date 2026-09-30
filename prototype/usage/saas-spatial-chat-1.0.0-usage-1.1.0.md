# SaaS Chat · 像素生成与空间画廊 · 使用说明

输入卡片、生成按钮、编辑界面与双面画廊组成的 SaaS 产品演示。

资产版本：1.0.0；说明版本：1.1.0

## 适合
- AI 输入到生成结果的演示
- 软件编辑流程与多结果画廊展示

## 不适合
- 无需软件界面的纯观点强调
- 期待照片内部具有真实运动

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **shotCopy** (source-edit)：输入和界面文案。绑定：src/Film.tsx :: Chat / Generate / List / Words。在每个组件中替换，不能假设统一 compositionProps 已存在。
- **galleryMedia** (source-edit)：画廊图片替换要求。绑定：src/Film.tsx :: Gallery。替换 staticFile 所指素材；图片内部仍为静态。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/saas-chat-001-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/saas-spatial-chat-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-portrait: /packages/saas-spatial-chat-portrait-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-portrait: /packages/saas-spatial-chat-portrait-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 像素网格和背景层已程序化重建，但花园和游戏机仍不具备原片的摄影级材质。
- 照片内部运动未重建，海报数量和画面与原片仍有差异。
- 运镜与翻转时点依据采样估计，并非原工程关键帧恢复。
- 文案、素材路径及运动参数在 src/Film.tsx 修改；尚未暴露统一 compositionProps。
- 风格配置记录 v2 外观，修改配置不会自动替换源码中的全部硬编码材质。
- 包中图片及音轨来自用户参考视频；照片内部为静态。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。
- 新增画幅按源码重新排布，仅覆盖 16:9 与 9:16；不是任意比例响应式。新画幅的文案与风格调整按源码修改，不自动接受原入口的 runtimeProps。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
