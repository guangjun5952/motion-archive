# 机械劳动与创意 · 使用说明

流程卡片错峰进入，时间线去重与压缩，最后突出人的创意。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 说明 AI 处理重复工作、人负责创意
- 从机械流程转向核心价值

## 不适合
- 泛用步骤列表
- 精确展示任意剪辑软件的实际功能

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **openingText** (source-edit)：开场主体文字。绑定：src/scene/index.tsx :: 模板化的流程。修改 CN 的 text 属性。
- **closingText** (source-edit)：结尾强调文字。绑定：src/scene/index.tsx :: 你的创意。同时检查文字光晕和落位。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/editing-creative-core-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/editing-creative-core-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 原工程以 SVG 二维变换与层级模糊模拟运镜，未使用真实三维摄像机；纯动效保留此实现，不新增物理三维。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
