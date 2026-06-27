# StageOS 集成路线

## Phase 1：主系统壳层

- 建立模块注册表。
- 建立统一输入数据结构。
- 主系统只做流程编排，不复制模块内部逻辑。

## Phase 2：服装总控接入

- 接入 `/api/stageos/costume-master-plan`。
- 补齐 `/render-context`、`/reverse-schedule`、`/confirm`、`/export`。

## Phase 3：视觉模块接入

- 2D 图纸读取学生序号、性别、身高。
- 3D 模特读取确认队形与服装颜色。
- 高清照片与 15 秒视频读取 render-context。

## Phase 4：电商搜索升级

- 当前：平台搜索链接。
- 后续：电商开放 API / 联盟 API / 店铺授权接口。
- 保留人工验货与样衣试穿流程。

## Phase 5：正式产品化

- 用户确认流程。
- 版本管理。
- 导出 PDF / JSON / PNG / JPEG / Markdown。
- 数据隐私策略与自动删除/用户确认删除机制。
