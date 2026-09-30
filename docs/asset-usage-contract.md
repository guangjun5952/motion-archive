# 资产使用说明与调用协议

目的：让助手能按口播的表达任务挑选完整动效模板，并知道如何调用、哪里仍需改源码。资产分类保持风格、动效模板、字体、背景，不拆散完整编排。

## 当前交付

已为 9 个模板、5 套风格、2 个字体补齐协议。现有发布包保持原字节，说明是 `prototype/usage/` 内按资产版本保存的 JSON + Markdown 旁挂文件。`catalog.json` 是说明索引，资产页面/API/CLI 自动按 ID 和版本关联。

本次检查源码、参数 schema、渲染脚本透传、文件路径和包 SHA-256；未重新渲染原模板，也没有实现自动改源码或脚本到成片的编排器。

## 必填内容

- `schemaVersion: asset-usage-1`、说明 `version`、`assetId`、`assetVersion`。
- `summary / useWhen / avoidWhen / keywords`：表达任务与选择边界，不能只写视觉风格标签。
- `capacity / duration`：对象数量、文字容量、帧率帧数和时长边界。保守推荐限制与源码硬限制要区分，未做排版测量就不能称安全容量。
- `parameters`：key、label、schema、mode、binding、default（确知时）、note。
- `variants`：原复刻/纯动效/风格/文件，以及已发布画幅的实际包、入口、渲染管线、尺寸和哈希。只记录真正发布的入口。
- `invocation.inputSchema / example`：可校验的调用请求。
- `styleCompatibility / limitations / evidence`：风格绑定是否自动、预渲染片段、光学限制、检查级别；字体还需说明字形覆盖是否测试。

## 四类参数

| mode | 含义 |
| --- | --- |
| runtime-prop | 已在源码中接入且渲染脚本透传的参数，可生成 props.json |
| source-edit | 派生源码修改要求，需要定位绑定、实现、复核，不可作为 Remotion props 直接传入 |
| selection | 选择已经存在的原版、几何版或画幅入口 |
| consumer | 字体、背景、风格由目标工程加载/映射的配置 |

`sourceInputs` 对应源码修改要求；`runtimeProps` 对应真正运行参数。调用计划不会自动执行渲染，也不会自动应用源码修改。纯动效版不是换上风格 ID 即可自动成片的万能模板。

## 现有入口

```sh
node prototype/workflow/cli.mjs search 八步
node prototype/workflow/cli.mjs usage editing-workflow
node prototype/workflow/cli.mjs plan editing-workflow /tmp/request.json
node prototype/workflow/cli.mjs export editing-workflow
node prototype/workflow/cli.mjs usage-check
```

`/tmp/request.json` 示例：

```json
{"variant":"styled","sourceInputs":{"labels":["收集","整理","转写","选段","配图","合成","检查","输出"]}}
```

上述请求返回 `source-edit-required`，指向 `src/scene/index.tsx :: LABELS`，不会假装已经渲染。

Finqube 六秒卡片模板已有真实 props：

```json
{"variant":"styled","runtimeProps":{"incomeTitle":"追踪收入","fisheyeStrength":0.34}}
```

将其中 `runtimeProps` 写入派生工程的 `props.json` 后，执行该协议给出的 `node src/render.mjs out.mp4 --props=props.json`，保留两遍渲染。其他模板不能套用这条命令。

HTTP：`GET /api/usage?id=资产ID`；`GET /api/assets?q=表达任务`；`POST /api/usage/plan`，正文为 `{"assetId":"...","input":{...}}`。

## 后续入库

1. 依据真实源码填写协议，绑定每个参数，核对原版/纯动效/画幅/预渲染管线。
2. 将协议放到项目 `assetDefinitions[id].usageContract` 或 `usageContracts[id]`，`assetVersion` 与发布版本一致。
3. 发布门禁拒绝缺失/不完整/错版本协议；Store 拒绝新正式资产绕过元数据校验。文件上传自动生成文件级协议。
4. 新源码包携带 `usage-contracts.json`、`USAGE.md`。包名已存在时必须提高版本，不允许覆盖。
5. `usage-check`、调用示例与边界检查通过后，确认工作台说明、下载与复制 JSON 一致。对新内容渲染仍遵循复刻质量检查，不以协议校验替代。

老包补录使用新的说明侧车文件，不能重写老包。修改已发布说明时新增说明版本，更新索引；不要更改旧版本说明文件。
