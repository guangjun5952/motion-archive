# Discipline · 自律与时间 · 使用说明

自律主题：主体字、日历翻页、任务与人物场景串联，强调长期行动。

资产版本：1.0.0；说明版本：1.1.0

## 适合
- 自律或持续行动的观点叙事
- 时间积累与任务完成的说明

## 不适合
- 当作任意日期的通用日历
- 以静态替字替代整页翻转

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **shotCopy** (source-edit)：逐镜主体文案。绑定：src/Film.tsx :: CenterWords / cuts。保留词级出现与强调节奏，默认不新增上方旁白字幕。
- **taskContent** (source-edit)：任务与时间内容。绑定：src/Film.tsx :: Task。修改日历或任务时必须保持整组件运动一致。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/discipline-001-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/discipline-focus-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/discipline-focus-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/discipline-focus-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 景深按图层深度近似，使用清晰范围和模糊上限，不是物理光圈散景。
- 人物、字体与材质仍为近似重建。
- 主体文字可在源码中修改；没有暴露统一的文案参数面板。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。
- 新增画幅按源码重新排布，仅覆盖 16:9 与 9:16；不是任意比例响应式。新画幅的文案与风格调整按源码修改，不自动接受原入口的 runtimeProps。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
