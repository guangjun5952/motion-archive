# Motion Archive · 光郡的动效库

一个本地运行的动效资产管理工具：把风格、动效模板、字体和背景放在同一套可检索、可预览、可调用的库里。

内置目录含 **23 个模板、5 个风格、10 个背景、2 个字体条目**。模板包含已发布的参考复刻、纯动效版本和已有横竖屏变体；具体覆盖以每项 usageContract 为准。

[浏览模板目录](TEMPLATES.md) · [下载素材包](https://github.com/guangjun5952/motion-archive/releases/tag/v1.0.0) · [参数协议](docs/asset-usage-contract.md)

## 安装与启动

需要 Node.js 20+，以及系统 tar 命令（macOS/Linux 通常已自带；Windows 可使用 WSL）。管理工具无需第三方 npm 依赖。

```sh
git clone https://github.com/guangjun5952/motion-archive.git
cd motion-archive
npm ci
npm run setup
npm start
```

打开 http://127.0.0.1:4180 。`setup` 下载并校验 Release 素材包，安装预览、已发布源码包、源快照和导入素材。首次运行需要网络与约 2 GB 临时可用空间（下载包约 768 MB）；安装后管理工具可离线运行。脚本拒绝覆盖已经存在的数据，请勿对正在使用的库重复执行。

也可手动下载 Release 中的 `motion-library-v1.0.0.tar.gz`，核对 `release-manifest.json` 中的 SHA-256，再在全新的仓库目录解压。

## 功能

- 分类、搜索、标签、收藏、文件夹与网格/列表浏览。
- 风格预览，模板带风格／纯动效预览，已有横竖屏入口切换。
- 字体、图片和视频导入；本地保存管理数据。
- `asset-usage-1` 使用协议、调用配置、实际参数边界与源码包下载。
- 独立复刻工作流：登记参考 → 版本复核 → 确认 → 发布到本地库。

```sh
npm test
npm run usage-check
node prototype/workflow/cli.mjs search 运镜
node prototype/workflow/cli.mjs usage finqube-combo
```

管理界面不会自动渲染 Remotion 视频。渲染需打开对应源码包，按该包说明安装 Remotion/Chromium 等依赖；部分管线还需要 ffmpeg、Python 或本机字体。没有把所有模板宣称为任意时长、内容和画幅都可通用替换。

## 数据与源码

- `prototype/`：管理界面、本地 API、CLI、参数校验及测试。
- `prototype/usage/`：按资产版本维护的调用协议。
- `catalog/`、`TEMPLATES.md`：现有模板源码仓库与广场链接。
- Release：预览、源码包、修订快照及素材。大文件不进入 Git 历史。
- `launcher/`：可选 macOS 启动器源码；按其 README 本地构建。

用户数据保存在 `prototype/data/workflow.json`。备份该目录及 `prototype/packages`、`prototype/uploads`、`prototype/workflow/media`。这些运行数据默认被 Git 忽略。

## 开源范围与限制

管理工具代码使用 MIT 许可证。参考复刻中的照片、视频、音乐、商标、字体及其他第三方素材不因本仓库开源而改为 MIT；保留各自权利与使用条件，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。不对素材的商用授权作统一承诺。

这是原工作台的独立公开副本：已去除本机个人绝对路径、参考文件位置和评审备注，公开包重新计算校验值。原冻结源码和已发布包没有被修改。保留参考作品署名和来源链接。部分参考仍为近似重建，逐项限制写在使用协议中。

默认仅监听 127.0.0.1；这是可信本机使用的工具，未设计为面向公网的多用户服务。
