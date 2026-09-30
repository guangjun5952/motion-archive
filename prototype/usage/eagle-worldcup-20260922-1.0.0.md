# World Cup · 抽奖与参与路径 · 使用说明

25.57秒参考重建。双票与Win → 航班奖金短句 → 五月日历视角变化 → 奖励引导 → 座位与世界杯 → 飞机和航班额度 → 参与方式 → 票券投入Invest → 四周四次奖励 → 开奖日期及参与提示。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 活动奖励、日期规则与入场券积累

## 不适合
- 需要原片体育场和飞机写实模型的镜头

## 参数
- **variant** (selection)：画幅和绘制模式。绑定：src/Root.tsx :: Root / Composition。每个变体有独立包；修改 Composition 尺寸不能代替适配。
- **sceneCopy** (source-edit)：逐镜文案修改说明。绑定：src/Gates.tsx :: Worldcup。这是派生源码的修改要求，不是运行时 prop。需逐处替换字面量、检查容量，再由同一时序生成几何版。
- **motionCurves** (source-edit)：弹簧与缓动源码。绑定：src/math.ts :: bounce / ease / track。按镜头调整调用值；不是全片统一阻尼参数，也没有自动修改器。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/eagle-worldcup-20260922-portrait-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/eagle-worldcup-20260922-portrait-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/eagle-worldcup-20260922-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/eagle-worldcup-20260922-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 体育场座椅和飞机是程序化简化模型，未还原原片实景质感。
- 月历为展示布局，不是任意年月的日历组件。
- 全部运动由帧时间决定；时点来自每秒2帧分镜采样及关键片段检查，不是原始关键帧恢复。
- 五子帧曝光累积保留速度方向拖尾；局部景深为分层模糊近似，非光线追踪。
- 纯动效入口替换文字/图像/材质为几何占位；源包仍含复刻绘制分支，不支持传 styleId 自动换风格。
- 横竖屏均有指定布局；不保证其他画幅或任意长度文字自动适配。
- 嵌入时须保留 src/Root.tsx 的 Film 曝光容器；直接使用单帧 Scene 组件会绕开运动模糊。

验证级别：agent-keyframe-and-continuous-sample-review。本次元数据补录不等于新的视觉或渲染验收。
