# 八步流程 · 巡游连线 · 使用说明

八个流程节点沿路径串联，镜头连续巡游，高亮逐个交接。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 恰好八步的操作流程
- 从开始到输出的顺序说明

## 不适合
- 三步或任意节点数量而不重排路径
- 需要并行分支或循环的流程

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **labels** (source-edit)：八个节点名称。绑定：src/scene/index.tsx :: LABELS。保持 8 项；前两项原用英文字体，更换中文时同时改字体绑定。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/editing-workflow-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/editing-workflow-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 原工程以 SVG 二维变换与层级模糊模拟运镜，未使用真实三维摄像机；纯动效保留此实现，不新增物理三维。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
