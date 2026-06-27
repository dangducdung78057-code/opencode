import type { StageOSBaseInput, StageOSProgramType, StageOSSchoolStage, StageOSVenueType } from "@stageos/shared";

export type StageOSKnowledgeDomain =
  | "stage_color_visual_communication"
  | "formation_library"
  | "scene_adaptation"
  | "group_dance_choreography"
  | "negative_example_guard"
  | "costume_purchase_rules"
  | "output_fact_check";

export type StageOSRuleSeverity = "info" | "warning" | "hard_block";

export interface StageOSKnowledgeCard {
  id: string;
  domain: StageOSKnowledgeDomain;
  title: string;
  summary: string;
  programTypes: StageOSProgramType[] | ["all"];
  schoolStages: StageOSSchoolStage[] | ["all"];
  venueTypes: StageOSVenueType[] | ["all"];
  tags: string[];
  positiveRules: string[];
  negativeRules: string[];
  ratioFormulas?: string[];
  outputConstraints: string[];
  sourceType: "user_confirmed_rule" | "internal_stageos_rule";
  version: string;
}

export interface StageOSRetrievedCard extends StageOSKnowledgeCard {
  score: number;
  matchedReasons: string[];
}

export interface StageOSRagRetrieveRequest {
  input: StageOSBaseInput;
  query?: string;
  domains?: StageOSKnowledgeDomain[];
  topK?: number;
}

export interface StageOSAestheticTagResult {
  allowedTags: string[];
  blockedTags: string[];
  requiredChecks: string[];
  riskTags: string[];
  antiPatternHits: string[];
}

export interface StageOSFactCheckResult {
  passed: boolean;
  facts: Array<{ key: string; passed: boolean; message: string; severity: StageOSRuleSeverity }>;
}

export interface StageOSSelfReviewRequest {
  input: StageOSBaseInput;
  draft: string;
  query?: string;
  domains?: StageOSKnowledgeDomain[];
}

export interface StageOSSelfReviewResult {
  ok: boolean;
  status: "pass" | "revise" | "block";
  retrievedCards: StageOSRetrievedCard[];
  aestheticTags: StageOSAestheticTagResult;
  factCheck: StageOSFactCheckResult;
  violations: string[];
  requiredRevisions: string[];
  safeOutputPolicy: string;
}

export interface StageOSGatedOutputRequest extends StageOSSelfReviewRequest {
  allowAutoRewrite?: boolean;
}

export interface StageOSGatedOutputResult extends StageOSSelfReviewResult {
  originalDraft: string;
  gatedDraft: string;
}
