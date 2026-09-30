# 生活与交易 · 镜像叙事 · 使用说明

镜像人物、交易图表、分屏与桌面构成的完整叙事，适合生活习惯与交易行为的类比。

资产版本：1.0.1；说明版本：1.0.0

## 适合
- 将生活行为与专业表现做类比
- 习惯、责任、自我改善的连续叙事

## 不适合
- 精确数据可视化
- 任意人物动作或写实三维角色

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **shotCopy** (source-edit)：逐镜文案修改要求。绑定：src/Trading.tsx :: Scene。按 Scene 中各镜头文本修改，不能用一条标题覆盖全片。
- **chartContent** (source-edit)：图表与任务内容。绑定：src/Trading.tsx :: Chart / Tasks。数值或行数改变后重新检查几何关系。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/trading-001-1.0.1.zip；npm run render；未声明运行时参数透传
- motion: /packages/trading-mirror-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 毛玻璃使用 SVG 透光层、柔化高光及固定纹理近似，并非物理三维折射。
- 四个子帧合成短曝光运动模糊；极速运动的采样精度仍有限。
- Studio 默认合成为单采样即时预览，最终视频需 npm run render 才包含子帧模糊。
- 保留原片音轨；人物、界面及运镜为近似重建，需要继续对照确认。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
