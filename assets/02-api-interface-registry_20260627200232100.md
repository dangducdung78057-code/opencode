# StageOS 接口注册表

## 一、主系统接口

| 接口 | 方法 | 作用 |
|---|---|---|
| `/api/stageos/system/status` | GET | 查看主系统状态 |
| `/api/stageos/system/module-registry` | GET | 查看模块注册表 |
| `/api/stageos/system/orchestrate` | POST | 按 pipeline 编排推荐调用顺序 |

## 二、已存在模块接口

| 模块 | 接口 | 作用 |
|---|---|---|
| render-pipeline | `/api/stageos/render-preview` | 六视角照片级预览 prompt / 图片 |
| system-modules | `/api/stageos/blueprint-plan` | 图纸化队形计划 |
| system-modules | `/api/stageos/indoor-2d-preview` | 室内 2D 同身高比例预览 |
| 3d-mannequin | `/api/stageos/3d-mannequin` | 3D 模特场景配置 |
| photo-video | `/api/stageos/render-photo-v2` | 高清照片级 V2 |
| photo-video | `/api/stageos/render-video-15s` | 15秒视频任务占位 |
| color-rag-v2 | `/api/stageos/color-rag` | 大屏+服装配色 RAG |
| costume-commerce | `/api/stageos/costume-commerce/suggest` | 服装电商标签与建议 |
| costume-commerce | `/api/stageos/costume-commerce/photo` | 服装照片建议图 / prompt |
| costume-commerce | `/api/stageos/costume-commerce/search` | 平台搜索入口 |
| costume-style | `/api/stageos/costume-style-engine/recommend` | 款式建议 |
| costume-style | `/api/stageos/costume-style-engine/search-tags` | 搜索标签 |
| costume-style | `/api/stageos/costume-style-engine/self-check` | 自检 |
| costume-master | `/api/stageos/costume-master-plan` | 总控采购计划 |
| costume-master | `/api/stageos/costume-master-plan/search-tags` | 搜索标签 |
| costume-master | `/api/stageos/costume-master-plan/self-check` | 输出前自检 |

## 三、必须预留接口

```txt
/api/stageos/costume-master-plan/render-context
/api/stageos/costume-master-plan/reverse-schedule
/api/stageos/costume-master-plan/platform-search
/api/stageos/costume-master-plan/confirm
/api/stageos/costume-master-plan/export
```

## 四、调用原则

1. 总控采购计划先于所有视觉模块。
2. 视觉模块只能读取确认后的结构化服装、配色、队形数据。
3. 搜索接口当前只生成平台搜索入口，不伪造真实 SKU。
4. 如果接电商开放 API，应在 `platform-search` 下扩展，不能污染规则引擎。


## RAG知识库与AI提示词契约接口

| Method | Route | 用途 |
|---|---|---|
| POST | `/api/stageos/rag/retrieve` | 根据用户输入召回舞台色彩、队形、场景、舞蹈编导、反面示例等知识卡。 |
| POST | `/api/stageos/rag/compile-prompt` | 把用户填写信息转为 AI 可精准识别的 `STAGEOS_AI_PROMPT_CONTRACT_v2`。 |
| POST | `/api/stageos/rag/self-review` | 对业务模块草稿进行 RAG 自审、隐藏审美标签检查、事实核查。 |
| POST | `/api/stageos/rag/gated-output` | 输出网关；未通过则 block 或要求修订。 |

### 强制调用链

```txt
用户输入
→ /api/stageos/rag/compile-prompt
→ 具体业务模块
→ /api/stageos/rag/gated-output
→ 用户可见答案
```
