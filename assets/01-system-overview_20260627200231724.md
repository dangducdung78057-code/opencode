# StageOS 工程系统总览

## 一、产品定位

StageOS / 艺演助手面向中小学舞台演出场景，围绕“节目、队形、服装、配色、采购、预览、导出”形成一套可落地的 AI 工程系统。

## 二、主流程

```txt
导入表格 / 用户输入
  ↓
节目类型识别
  ↓
学段与尺码策略
  ↓
队形确认
  ↓
大屏主题色与服装配色 RAG
  ↓
服装款式 / 材质 / 配饰 / 电商标签
  ↓
总控采购计划 + 倒排计划 + 自检
  ↓
2D 图纸 / 3D 模特 / 高清照片 / 15秒视频
  ↓
用户确认
  ↓
PDF / PNG / JPEG / JSON / Markdown 导出
```

## 三、模块边界

| 层级 | 模块 | 职责 |
|---|---|---|
| 数据层 | 表格导入 / 用户输入 | 人数、男女、身高、节目、预算、场地 |
| 规则层 | costume-master-final | 总控服装采购计划、风险自检、倒排计划 |
| 配色层 | color-rag-engine-v2 | 大屏主题色、男女服装配色、占比公式 |
| 商品层 | costume-commerce-module | 电商搜索标签、搜索入口、服装建议卡 |
| 视觉层 | system-modules / 3d / render-pipeline | 2D、3D、高清图片、视频占位 |
| 导出层 | export 接口预留 | PDF、PNG、JPEG、JSON、Markdown、Excel |
```
