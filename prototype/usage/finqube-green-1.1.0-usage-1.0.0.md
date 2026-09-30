# 森林绿与荧光绿 · 使用说明

深绿画布、亮绿强调、白色界面卡片。

资产版本：1.1.0；说明版本：1.0.0

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
- **typography** (source-edit)：字体与材质映射。绑定：src/Finqube.tsx；目标模板文字与材质组件。先核对字体文件和目标组件，再做显式映射。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "style"
}
```

## 入口
- style: /packages/finqube-001-1.1.0.zip；目标工程加载；未声明运行时参数透传

## 限制
- 鱼眼为径向桶形畸变近似，强度尚未按原片精确标定。
- 场景采用 CSS 透视，最终画面经 WebGL 镜头处理；源场景修改后需重新执行两遍渲染。
- 卡片细节、字体和运动模糊仍是近似重建。
- 仅复现 19–25 秒，无音频；v1、v2 保留用于对照。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
