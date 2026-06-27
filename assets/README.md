# @stageos/rag-core

StageOS 新系统的 RAG 知识库、自审网关与 AI 提示词契约核心包。

## 作用

```txt
用户填写信息
→ 结构化归一化
→ RAG知识库路由
→ 隐藏审美标签引擎
→ 反面示例/避坑硬约束
→ 事实核查
→ AI可执行提示词
→ 业务模块草稿
→ gated-output自审
→ 用户可见结果
```

## 已包含知识域

```txt
stage_color_visual_communication
formation_library
scene_adaptation
group_dance_choreography
negative_example_guard
costume_purchase_rules
output_fact_check
```

## 核心函数

```ts
retrieveKnowledgeCards(request)
compileStageOSPromptContract(request)
selfReviewStageOSOutput(request)
gateStageOSOutput(request)
```

## 约束

- 任何业务模块不得绕过 RAG 直接输出。
- 反面示例库作为硬约束，不作为普通建议。
- 高中段不得输出儿童/青少年/大童/公主风/甜美风/可爱风等关键词。
- 照片、视频、2D、3D 预览不得输出真实姓名、真实脸和学校 Logo。
- 电商相关只能输出搜索关键词/平台入口，不得伪造真实 SKU、库存和价格。
