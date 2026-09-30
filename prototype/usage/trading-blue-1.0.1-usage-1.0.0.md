# 冰蓝玻璃与深黑 · 使用说明

蓝色弥散光、玻璃人物高光、深浅场景对比。

资产版本：1.0.1；说明版本：1.0.0

## 适合
- 需要本风格的配色、文字外观和材质参考

## 不适合
- 未经适配直接套用到所有模板
- 只传入风格 ID 就期待源码自动换肤

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **light** (consumer)：配色 light。绑定：styleSpec.palette.light。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **dark** (consumer)：配色 dark。绑定：styleSpec.palette.dark。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **accent** (consumer)：配色 accent。绑定：styleSpec.palette.accent。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **ink** (consumer)：配色 ink。绑定：styleSpec.palette.ink。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **highlight** (consumer)：配色 highlight。绑定：styleSpec.palette.highlight。供目标模板映射，不会自动修改模板中的硬编码颜色。
- **typography** (source-edit)：字体与材质映射。绑定：src/Trading.tsx；目标模板文字与材质组件。先核对字体文件和目标组件，再做显式映射。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "style"
}
```

## 入口
- style: /packages/trading-001-1.0.1.zip；目标工程加载；未声明运行时参数透传

## 限制
- 毛玻璃使用 SVG 透光层、柔化高光及固定纹理近似，并非物理三维折射。
- 四个子帧合成短曝光运动模糊；极速运动的采样精度仍有限。
- Studio 默认合成为单采样即时预览，最终视频需 npm run render 才包含子帧模糊。
- 保留原片音轨；人物、界面及运镜为近似重建，需要继续对照确认。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
