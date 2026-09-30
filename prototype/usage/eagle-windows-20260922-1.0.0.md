# Windows · 彩色文件夹与手势 · 使用说明

4.83秒参考重建。中心文件夹与标签 → 背景文件夹错峰、手指推进 → 点击换粉色 → 恢复青色并展开纸页 → 手势退出、拉远六格。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 表达文件整理、分类与文件夹管理

## 不适合
- 要求可替换为任意数量文件夹而不重排

## 参数
- **variant** (selection)：画幅和绘制模式。绑定：src/Root.tsx :: Root / Composition。每个变体有独立包；修改 Composition 尺寸不能代替适配。
- **sceneCopy** (source-edit)：逐镜文案修改说明。绑定：src/Windows.tsx :: Windows。这是派生源码的修改要求，不是运行时 prop。需逐处替换字面量、检查容量，再由同一时序生成几何版。
- **motionCurves** (source-edit)：弹簧与缓动源码。绑定：src/math.ts :: bounce / ease / track。按镜头调整调用值；不是全片统一阻尼参数，也没有自动修改器。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/eagle-windows-20260922-portrait-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/eagle-windows-20260922-portrait-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/eagle-windows-20260922-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/eagle-windows-20260922-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 手部采用重新绘制的轮廓，不是原片插画；颗粒纹理为程序近似。
- 文件夹开合采用多片矢量变换，非真实三维网格与光照。
- 全部运动由帧时间决定；时点来自每秒2帧分镜采样及关键片段检查，不是原始关键帧恢复。
- 五子帧曝光累积保留速度方向拖尾；局部景深为分层模糊近似，非光线追踪。
- 纯动效入口替换文字/图像/材质为几何占位；源包仍含复刻绘制分支，不支持传 styleId 自动换风格。
- 横竖屏均有指定布局；不保证其他画幅或任意长度文字自动适配。
- 嵌入时须保留 src/Root.tsx 的 Film 曝光容器；直接使用单帧 Scene 组件会绕开运动模糊。

验证级别：agent-keyframe-and-continuous-sample-review。本次元数据补录不等于新的视觉或渲染验收。
