# Just Create · 创意与行动混剪 · 使用说明

23.70秒参考重建。软件图标和创意短句 → 勇气与划线 → 火花 → 棋子与想法 → 每笔绘画 → 每个音符 → 每个文字 → 色条与工具切换 → 人物与杰作 → JUST CREATE拉远 → 空白背景收尾。

资产版本：1.0.0；说明版本：1.0.0

## 适合
- 讲解从创意到行动、技能练习和创作工具

## 不适合
- 需要实拍手部和人物内部动作完全可编辑

## 参数
- **variant** (selection)：画幅和绘制模式。绑定：src/Root.tsx :: Root / Composition。每个变体有独立包；修改 Composition 尺寸不能代替适配。
- **sceneCopy** (source-edit)：逐镜文案修改说明。绑定：src/Create.tsx :: Create。这是派生源码的修改要求，不是运行时 prop。需逐处替换字面量、检查容量，再由同一时序生成几何版。
- **motionCurves** (source-edit)：弹簧与缓动源码。绑定：src/math.ts :: bounce / ease / track。按镜头调整调用值；不是全片统一阻尼参数，也没有自动修改器。

## 调用示例（调用计划，不等于已经渲染）
```json
{
  "variant": "styled"
}
```

## 入口
- styled: /packages/eagle-create-20260922-portrait-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion: /packages/eagle-create-20260922-portrait-motion-1.0.0.zip；npm run render；未声明运行时参数透传
- styled-landscape: /packages/eagle-create-20260922-landscape-styled-1.0.0.zip；npm run render；未声明运行时参数透传
- motion-landscape: /packages/eagle-create-20260922-landscape-motion-1.0.0.zip；npm run render；未声明运行时参数透传

## 限制
- 实拍和人物使用从参考截取的局部静帧，重新取景；内部视频运动未重建。
- 棋子、粒子和工具形状为程序近似，不能当作原始三维模型。
- 全部运动由帧时间决定；时点来自每秒2帧分镜采样及关键片段检查，不是原始关键帧恢复。
- 五子帧曝光累积保留速度方向拖尾；局部景深为分层模糊近似，非光线追踪。
- 纯动效入口替换文字/图像/材质为几何占位；源包仍含复刻绘制分支，不支持传 styleId 自动换风格。
- 横竖屏均有指定布局；不保证其他画幅或任意长度文字自动适配。
- 嵌入时须保留 src/Root.tsx 的 Film 曝光容器；直接使用单帧 Scene 组件会绕开运动模糊。

验证级别：agent-keyframe-and-continuous-sample-review。本次元数据补录不等于新的视觉或渲染验收。
