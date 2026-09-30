# March Madness · 日历与奖品发布 · 使用说明

26.43秒参考重建。开场短句 → 篮球与 March Madness → 整页日历翻动 → Every weekday → 奖品组合 → 升级短句 → 笔记本推进 → 规则短句 → 社交手机推进 → 开奖短句 → 明日手机预告 → 参与提示和篮球。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 日更活动、奖品升级和次日预告

## 不适合
- 把所有商品都理解成可自由旋转的三维模型

## 参数
- **variant** (selection)：画幅和绘制模式。绑定：src/Root.tsx :: Root / Composition。每个变体有独立包；修改 Composition 尺寸不能代替适配。
- **sceneCopy** (source-edit)：逐镜文案修改说明。绑定：src/Gates.tsx :: March。这是派生源码的修改要求，不是运行时 prop。需逐处替换字面量、检查容量，再由同一时序生成几何版。
- **motionCurves** (source-edit)：弹簧与缓动源码。绑定：src/math.ts :: bounce / ease / track。按镜头调整调用值；不是全片统一阻尼参数，也没有自动修改器。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/eagle-march-20260922-portrait-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/eagle-march-20260922-portrait-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/eagle-march-20260922-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/eagle-march-20260922-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- PS5、Xbox 与 iPhone 表面来自参考静态局部，不能任意转头看到背面。
- 篮球、笔记本和社交页面是简化程序模型，材质细节与原片不同。
- 全部运动由帧时间决定；时点来自每秒2帧分镜采样及关键片段检查，不是原始关键帧恢复。
- 五子帧曝光累积保留速度方向拖尾；局部景深为分层模糊近似，非光线追踪。
- 纯动效入口替换文字/图像/材质为几何占位；源包仍含复刻绘制分支，不支持传 styleId 自动换风格。
- 横竖屏均有指定布局；不保证其他画幅或任意长度文字自动适配。
- 嵌入时须保留 src/Root.tsx 的 Film 曝光容器；直接使用单帧 Scene 组件会绕开运动模糊。

验证级别：agent-keyframe-and-continuous-sample-review。本次元数据补录不等于新的视觉或渲染验收。
