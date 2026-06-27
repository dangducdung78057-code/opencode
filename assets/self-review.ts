import type { StageOSBaseInput } from "@stageos/shared";
import type { StageOSAestheticTagResult, StageOSFactCheckResult, StageOSGatedOutputRequest, StageOSGatedOutputResult, StageOSRetrievedCard, StageOSSelfReviewRequest, StageOSSelfReviewResult } from "./types";
import { retrieveKnowledgeCards } from "./retriever";

const SENIOR_FORBIDDEN = ["儿童", "女童", "男童", "童装", "青少年", "大童", "公主风", "甜美风", "可爱风", "粉嫩", "荧光"];
const PRIVACY_FORBIDDEN = ["真实姓名", "学生姓名", "学校logo", "学校 Logo", "真实脸", "真人脸", "可识别身份"];
const SEQUIN_ZERO_PROGRAMS = ["chorus", "mixed_chorus", "recitation", "western_orchestra", "folk_orchestra", "instrument", "acrobatics_martial_arts"];
const NON_COMPETITION_PROGRAMS = [
  "cheerleading",
  "sports_opening_ceremony",
  "class_showcase",
  "new_year_gala",
  "holiday_festival",
  "reunion_gala",
  "non_competition_group_show",
];
const HIGH_RISK_CHOREO_TERMS = ["托举", "抛接", "翻腾", "空翻", "高难度技巧", "竞技难度", "快速穿插", "复杂跑位"];

function containsAny(text: string, terms: string[]): string[] {
  return terms.filter((term) => text.includes(term));
}

function buildAestheticTagResult(cards: StageOSRetrievedCard[], draft: string): StageOSAestheticTagResult {
  const allTags = Array.from(new Set(cards.flatMap((card) => card.tags)));
  const antiPatternHits = allTags.filter((tag) => tag.includes("anti-pattern") && draft.toLowerCase().includes(tag.toLowerCase()));
  const blockedTags = Array.from(new Set([
    ...antiPatternHits,
    ...containsAny(draft, ["低端", "土气", "廉价模板", "高饱和混色", "杂乱LED", "密度过高"]),
  ]));

  return {
    allowedTags: allTags.filter((tag) => !tag.includes("anti-pattern")).slice(0, 30),
    blockedTags,
    requiredChecks: Array.from(new Set(cards.flatMap((card) => card.outputConstraints))).slice(0, 30),
    riskTags: containsAny(draft, ["均码", "无尺码表", "普通网购", "亮片", "强反光", "真实姓名"]),
    antiPatternHits,
  };
}

function factCheck(input: StageOSBaseInput, draft: string): StageOSFactCheckResult {
  const facts: StageOSFactCheckResult["facts"] = [];
  const add = (key: string, passed: boolean, message: string, severity: "info" | "warning" | "hard_block" = "warning") => {
    facts.push({ key, passed, message, severity });
  };

  add("count-consistency", input.maleCount + input.femaleCount === input.performerCount, "男女人数之和必须等于总人数。", "hard_block");
  add("students-consistency", input.students.length === 0 || input.students.length === input.performerCount, "学生列表长度必须与总人数一致。", "hard_block");

  const privacyHits = containsAny(draft, PRIVACY_FORBIDDEN);
  add("privacy", privacyHits.length === 0, privacyHits.length ? `发现隐私风险词: ${privacyHits.join("、")}` : "未发现真实姓名/真实脸/学校Logo风险。", privacyHits.length ? "hard_block" : "info");

  if (input.schoolStage === "senior") {
    const hits = containsAny(draft, SENIOR_FORBIDDEN);
    add("senior-keyword-policy", hits.length === 0, hits.length ? `高中段禁止关键词: ${hits.join("、")}` : "高中段关键词策略通过。", hits.length ? "hard_block" : "info");
  }

  if (SEQUIN_ZERO_PROGRAMS.includes(input.programType)) {
    const sequinHits = containsAny(draft, ["亮片", "闪片", "大面积珠片", "强反光"]);
    add("sequin-zero-program", sequinHits.length === 0, sequinHits.length ? `${input.programType} 禁止亮片/强反光: ${sequinHits.join("、")}` : "亮片/反光约束通过。", sequinHits.length ? "hard_block" : "info");
  }

  if (input.venueType === "indoor" && !input.screenThemeColor) {
    add("indoor-default-warm-light", draft.includes("暖面光") || draft.includes("暖光"), "室内且未提供大屏主题色时，必须标注默认暖面光。", "warning");
  }

  if (NON_COMPETITION_PROGRAMS.includes(input.programType)) {
    const highRiskHits = containsAny(draft, HIGH_RISK_CHOREO_TERMS);
    add(
      "non-competition-difficulty-boundary",
      highRiskHits.length === 0,
      highRiskHits.length ? `非赛级大型校园活动不得默认生成高危/赛级动作: ${highRiskHits.join("、")}` : "非赛级大型校园活动难度边界通过。",
      highRiskHits.length ? "hard_block" : "info",
    );
    add(
      "non-competition-reverse-schedule",
      draft.includes("倒排") || draft.includes("T-") || draft.includes("样衣") || draft.includes("试穿"),
      "大型团体非赛级活动必须包含倒排计划或采购/排练节点。",
      "warning",
    );
  }

  if (input.performanceDate && draft.includes("普通网购")) {
    add("urgent-online-shopping", !draft.includes("7天内") && !draft.includes("急单"), "急单场景不得把普通网购作为主方案。", "warning");
  }

  const passed = facts.every((fact) => fact.passed || fact.severity !== "hard_block");
  return { passed, facts };
}

function requiredRevisionsFromChecks(factCheckResult: StageOSFactCheckResult, aesthetic: StageOSAestheticTagResult): string[] {
  const revisions = factCheckResult.facts
    .filter((fact) => !fact.passed)
    .map((fact) => fact.message);
  if (aesthetic.blockedTags.length) {
    revisions.push(`删除或替换反面审美/避坑命中项: ${aesthetic.blockedTags.join("、")}`);
  }
  if (aesthetic.riskTags.length) {
    revisions.push(`补充风险说明或Plan B: ${aesthetic.riskTags.join("、")}`);
  }
  return revisions;
}

export function selfReviewStageOSOutput(request: StageOSSelfReviewRequest): StageOSSelfReviewResult {
  const retrievedCards = retrieveKnowledgeCards({ input: request.input, query: request.query ?? request.draft, domains: request.domains, topK: 16 });
  const aestheticTags = buildAestheticTagResult(retrievedCards, request.draft);
  const factCheckResult = factCheck(request.input, request.draft);
  const requiredRevisions = requiredRevisionsFromChecks(factCheckResult, aestheticTags);
  const hardBlocks = factCheckResult.facts.filter((fact) => !fact.passed && fact.severity === "hard_block");

  return {
    ok: hardBlocks.length === 0 && requiredRevisions.length === 0,
    status: hardBlocks.length ? "block" : requiredRevisions.length ? "revise" : "pass",
    retrievedCards,
    aestheticTags,
    factCheck: factCheckResult,
    violations: [...hardBlocks.map((fact) => fact.message), ...aestheticTags.blockedTags],
    requiredRevisions,
    safeOutputPolicy: "任何用户可见建议必须先经过RAG召回、隐藏审美标签拦截、反面示例约束和事实核查。未通过时返回修订要求，不输出可执行建议。",
  };
}

export function gateStageOSOutput(request: StageOSGatedOutputRequest): StageOSGatedOutputResult {
  const review = selfReviewStageOSOutput(request);
  let gatedDraft = request.draft;
  if (review.status === "block") {
    gatedDraft = "BLOCKED_BY_STAGEOS_RAG_GATE: 输出命中硬拦截规则，必须先修订。";
  } else if (review.status === "revise" && request.allowAutoRewrite !== false) {
    gatedDraft = `${request.draft}\n\n【StageOS RAG自审修订要求】\n${review.requiredRevisions.map((item) => `- ${item}`).join("\n")}`;
  }

  return {
    ...review,
    originalDraft: request.draft,
    gatedDraft,
  };
}
