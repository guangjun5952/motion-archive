# 三部分文件 · 聚焦展开 · 使用说明

三张文件卡片展开、逐个推进聚焦、景深切换，最后拉回总览。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 解释三种输入或三部分材料
- 三个对象逐一介绍后汇总

## 不适合
- 超过三项的列表
- 只强调单个物体而不需要逐项介绍

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **titles** (source-edit)：三张卡片标题。绑定：src/scene/index.tsx :: const titles。修改 titles 数组；若替换输入类型，同时核对图像与标签。
- **media** (source-edit)：三张卡片图片路径。绑定：src/scene/media.ts :: export const media。当前为内嵌图片数组，路径不能直接传入，需在派生工程修改加载方式。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/editing-three-inputs-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/editing-three-inputs-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 原工程以 SVG 二维变换与层级模糊模拟运镜，未使用真实三维摄像机；纯动效保留此实现，不新增物理三维。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
