# 财务卡片巡游 · 使用说明

五张财务卡片空间巡游，依次突出收入、发票、交易，最后拉远总览。

资产版本：1.1.0；说明版本：1.1.0

## 适合
- 连续介绍多个财务功能
- 从局部数据推进到整体业务视图

## 不适合
- 单个数值上涨或下降
- 任意数量卡片的自由排列

## 参数
- **variant** (selection)：选择原复刻、纯动效或独立风格入口。绑定：variants[id]。
- **cardContent** (source-edit)：卡片内部数据。绑定：src/Finqube.tsx :: Income / Invoice / Transactions / Categories / Breakdown。公司、金额、分类仍是组件中的固定内容，需源码编辑。
- **accent** (runtime-prop)：accent。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **dark** (runtime-prop)：dark。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **incomeTitle** (runtime-prop)：incomeTitle。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **invoiceTitle** (runtime-prop)：invoiceTitle。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **transactionsTitle** (runtime-prop)：transactionsTitle。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **endingTitle** (runtime-prop)：endingTitle。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **motionBlur** (runtime-prop)：motionBlur。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。
- **fisheyeStrength** (runtime-prop)：fisheyeStrength。绑定：src/Root.tsx schema → src/Finqube.tsx / src/Lens.tsx。仅 styled 入口已核对；两遍渲染脚本会将 --props 透传。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled",
  "runtimeProps": {
    "incomeTitle": "追踪收入",
    "fisheyeStrength": 0.34
  }
}
```

## 入口
- styled: /packages/finqube-001-1.1.0.zip；npm run render；node src/render.mjs out.mp4 --props=props.json
- motion: /packages/finqube-combo-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/finqube-combo-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/finqube-combo-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 鱼眼为径向桶形畸变近似，强度尚未按原片精确标定。
- 场景采用 CSS 透视，最终画面经 WebGL 镜头处理；源场景修改后需重新执行两遍渲染。
- 卡片细节、字体和运动模糊仍是近似重建。
- 仅复现 19–25 秒，无音频；v1、v2 保留用于对照。
- sourceInputs 是给派生工程的修改要求，不是 Remotion props；当前不会自动应用源码修改。
- 只有明确列出的 runtime-prop 支持运行时传参；选择新风格、改变数量或时长不能默认为已支持。
- 新增画幅按源码重新排布，仅覆盖 16:9 与 9:16；不是任意比例响应式。新画幅的文案与风格调整按源码修改，不自动接受原入口的 runtimeProps。

验证级别：source-and-package-audit。本次元数据补录不等于新的视觉或渲染验收。
