import type { StageOSModuleDescriptor, StageOSPipelineStep } from "./types";

export const STAGEOS_MODULE_REGISTRY: StageOSModuleDescriptor[] = [

  {
    id: "stageos-rag-core",
    title: "StageOS RAG知识库、自审网关与AI提示词契约",
    category: "system",
    status: "implemented",
    packagePath: "packages/stageos-rag-core",
    routes: [
      "/api/stageos/rag/retrieve",
      "/api/stageos/rag/compile-prompt",
      "/api/stageos/rag/self-review",
      "/api/stageos/rag/gated-output",
      "/api/stageos/rag/knowledge-map",
    ],
    consumes: ["StageOSBaseInput", "DraftOutput", "PromptTask"],
    produces: ["RetrievedKnowledgeCards", "AIExecutablePromptContract", "SelfReviewResult", "GatedOutput"],
    notes: "所有业务模块输出前必须经过此RAG网关。隐藏审美标签、反面示例、避坑系统和事实核查均在此执行；大型团体非赛级活动也在此路由。",
  },
  {
    id: "large-group-noncompetition-rag-domain",
    title: "大型团体非赛级演出RAG场景域",
    category: "planning",
    status: "implemented",
    packagePath: "packages/stageos-rag-core",
    routes: [
      "/api/stageos/rag/compile-prompt",
      "/api/stageos/rag/retrieve",
      "/api/stageos/rag/gated-output"
    ],
    consumes: ["StageOSBaseInput", "programType", "venueType", "confirmedFormation", "rehearsalFrequencyPerWeek"],
    produces: ["LargeGroupEventPromptContract", "DifficultyBoundary", "ReverseSchedulePolicy", "PitfallGuard"],
    notes: "覆盖啦啦操、运动会开幕式、班级展示、元旦晚会、节假日活动、团拜会、集体演讲展示等非赛级校园活动。",
  },
  {
    id: "costume-master-final",
    title: "服装总控采购计划引擎",
    category: "costume",
    status: "implemented",
    packagePath: "modules/stageos-costume-master-final",
    routes: [
      "/api/stageos/costume-master-plan",
      "/api/stageos/costume-master-plan/search-tags",
      "/api/stageos/costume-master-plan/self-check",
    ],
    consumes: ["StageOSBaseInput"],
    produces: ["CostumeMasterPlan", "SearchTags", "RiskPrecheck", "ReverseSchedule", "aiExecutablePrompt"],
    notes: "总控层，必须先于视觉模块执行。",
  },
  {
    id: "costume-master-reserved-interfaces",
    title: "服装总控预留接口",
    category: "costume",
    status: "reserved",
    routes: [
      "/api/stageos/costume-master-plan/render-context",
      "/api/stageos/costume-master-plan/reverse-schedule",
      "/api/stageos/costume-master-plan/platform-search",
      "/api/stageos/costume-master-plan/confirm",
      "/api/stageos/costume-master-plan/export",
    ],
    consumes: ["CostumeMasterPlan", "UserConfirmation"],
    produces: ["RenderContext", "ConfirmedCostumePlan", "ExportFile"],
    notes: "下一步最先补 render-context。",
  },
  {
    id: "color-rag-engine-v2",
    title: "大屏主题色与服装配色 RAG 引擎 v2",
    category: "color",
    status: "implemented",
    packagePath: "modules/stageos-color-rag-engine-module-v2",
    routes: ["/api/stageos/color-rag"],
    consumes: ["StageOSBaseInput"],
    produces: ["ScreenPalette", "MaleCostumeColor", "FemaleCostumeColor", "ColorRatioFormula"],
  },
  {
    id: "system-modules",
    title: "图纸化计划与 2D 同身高比例预览",
    category: "planning",
    status: "implemented",
    packagePath: "modules/stageos-system-modules",
    routes: ["/api/stageos/blueprint-plan", "/api/stageos/indoor-2d-preview"],
    consumes: ["StageOSBaseInput", "ConfirmedFormation", "ConfirmedCostumePlan"],
    produces: ["SVG", "PNG", "JPEG", "PromptFactors"],
  },
  {
    id: "3d-mannequin-module",
    title: "3D 同身高比例人形模特交互预览",
    category: "visual",
    status: "implemented",
    packagePath: "modules/stageos-3d-mannequin-module",
    routes: ["/api/stageos/3d-mannequin"],
    consumes: ["StageOSBaseInput", "ConfirmedFormation", "RenderContext"],
    produces: ["SceneConfig", "PNG", "JPEG"],
  },
  {
    id: "render-pipeline",
    title: "高清照片级六视角预览",
    category: "visual",
    status: "implemented",
    packagePath: "modules/stageos-render-pipeline",
    routes: ["/api/stageos/render-preview"],
    consumes: ["RenderContext", "SceneConfig"],
    produces: ["ImagePrompt", "PNG", "JPEG"],
  },
  {
    id: "photo-video-render-module",
    title: "照片级 V2 与 15 秒视频占位",
    category: "visual",
    status: "implemented",
    packagePath: "modules/stageos-photo-video-render-module",
    routes: ["/api/stageos/render-photo-v2", "/api/stageos/render-video-15s", "/api/stageos/render-video-15s/:jobId"],
    consumes: ["RenderContext", "SceneConfig"],
    produces: ["PhotoPrompt", "VideoPrompt", "VideoJob"],
  },
  {
    id: "costume-commerce-module",
    title: "服装电商识别标签与照片建议卡",
    category: "commerce",
    status: "implemented",
    packagePath: "modules/stageos-costume-commerce-module",
    routes: [
      "/api/stageos/costume-commerce/suggest",
      "/api/stageos/costume-commerce/photo",
      "/api/stageos/costume-commerce/search",
    ],
    consumes: ["CostumeMasterPlan"],
    produces: ["ShoppingSearchTags", "SearchUrls", "CostumePhotoCard"],
  },
];

export function buildPipeline(requestedOutputs: string[]): StageOSPipelineStep[] {
  const steps: StageOSPipelineStep[] = [
    {
      order: 1,
      moduleId: "stageos-rag-core",
      route: "/api/stageos/rag/compile-prompt",
      purpose: "把用户填写信息转成AI可精准识别的提示词契约，并路由到对应RAG知识库。",
      required: true,
    },
    {
      order: 2,
      moduleId: "costume-master-final",
      route: "/api/stageos/costume-master-plan",
      purpose: "基于RAG提示词契约生成服装总控采购计划、风险自检、Plan B 和倒排计划。",
      required: true,
    },
    {
      order: 3,
      moduleId: "stageos-rag-core",
      route: "/api/stageos/rag/gated-output",
      purpose: "对业务模块草稿进行RAG自审、反面示例拦截和事实核查。",
      required: true,
    },
  ];

  if (requestedOutputs.includes("search_tags")) {
    steps.push({
      order: steps.length + 1,
      moduleId: "costume-commerce-module",
      route: "/api/stageos/costume-commerce/suggest",
      purpose: "把服装款式、颜色、材质、配饰转成电商可识别搜索标签。",
      required: false,
    });
  }

  if (requestedOutputs.includes("blueprint")) {
    steps.push({ order: steps.length + 1, moduleId: "system-modules", route: "/api/stageos/blueprint-plan", purpose: "生成图纸化队形计划。", required: false });
  }

  if (requestedOutputs.includes("indoor_2d")) {
    steps.push({ order: steps.length + 1, moduleId: "system-modules", route: "/api/stageos/indoor-2d-preview", purpose: "生成室内 2D 同身高比例预览。", required: false });
  }

  if (requestedOutputs.includes("three_d")) {
    steps.push({ order: steps.length + 1, moduleId: "3d-mannequin-module", route: "/api/stageos/3d-mannequin", purpose: "生成 3D 同身高比例模特场景。", required: false });
  }

  if (requestedOutputs.includes("photo")) {
    steps.push({ order: steps.length + 1, moduleId: "render-pipeline", route: "/api/stageos/render-preview", purpose: "生成六视角高清照片级预览。", required: false });
  }

  if (requestedOutputs.includes("video_15s")) {
    steps.push({ order: steps.length + 1, moduleId: "photo-video-render-module", route: "/api/stageos/render-video-15s", purpose: "创建 15 秒视频渲染任务。", required: false });
  }

  return steps;
}
