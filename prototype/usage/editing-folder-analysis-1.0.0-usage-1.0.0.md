# 参考工程分析 · 文件夹展开 · 使用说明

光标触发文件夹，三个文件沿弧线错峰展开，再横向移镜。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 解释参考资料或工程的组成
- 展示一个文件夹中的三份材料

## 不适合
- 超过三个文件且不改布局
- 把展开效果用于无文件关系的数字比较

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **heading** (source-edit)：文件夹主体文字。绑定：src/scene/index.tsx :: 参考工程分析。修改原主体文字，不额外添加常驻标题。
- **fileLabels** (source-edit)：三个文件说明。绑定：src/scene/index.tsx :: function File。保留三项顺序，核对 File 的标签和扩展名。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/editing-folder-analysis-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/editing-folder-analysis-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 原工程以 SVG 二维变换与层级模糊模拟运镜，未使用真实三维摄像机；纯动效保留此实现，不新增物理三维。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
