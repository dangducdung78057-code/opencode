export type StageOSGender = "male" | "female";

export type StageOSSchoolStage = "primary" | "junior" | "senior";

export type StageOSVenueType = "indoor" | "outdoor" | "concert_hall" | "stadium" | "classroom_stage";

export type StageOSProgramType =
  | "chorus"
  | "mixed_chorus"
  | "recitation"
  | "drama"
  | "classical_dance"
  | "folk_dance"
  | "modern_jazz_street"
  | "ballet"
  | "western_orchestra"
  | "folk_orchestra"
  | "instrument"
  | "host"
  | "etiquette_award"
  | "acrobatics_martial_arts"
  | "cheerleading"
  | "sports_opening_ceremony"
  | "class_showcase"
  | "new_year_gala"
  | "holiday_festival"
  | "reunion_gala"
  | "non_competition_group_show";

export interface StageOSStudentProfile {
  studentId: string;
  gender: StageOSGender;
  heightCm: number;
  roleLabel?: string;
  voicePart?: string;
  instrumentPart?: string;
}

export interface StageOSConfirmedFormation {
  summary: string;
  rows?: number[];
  layoutName?: string;
  centerAxis?: string;
  spacingRule?: string;
  coordinates?: Array<{
    studentId: string;
    x: number;
    y: number;
    z?: number;
  }>;
}

export interface StageOSBaseInput {
  schoolStage: StageOSSchoolStage;
  ageRange?: string;
  grade?: string;
  programType: StageOSProgramType;
  programTheme: string;
  programLevel?: string;
  performerCount: number;
  maleCount: number;
  femaleCount: number;
  students: StageOSStudentProfile[];
  venueType: StageOSVenueType;
  perPersonBudget?: number;
  screenThemeColor?: string;
  lightingStyle?: string;
  specialExpectation?: string;
  confirmedFormation: StageOSConfirmedFormation;
  performanceDate?: string;
  rehearsalFrequencyPerWeek?: 2 | 3 | 5;
}

export interface StageOSModuleDescriptor {
  id: string;
  title: string;
  category: "planning" | "color" | "costume" | "commerce" | "visual" | "export" | "system";
  status: "implemented" | "placeholder" | "reserved";
  packagePath?: string;
  routes: string[];
  consumes: string[];
  produces: string[];
  notes?: string;
}

export interface StageOSPipelineStep {
  order: number;
  moduleId: string;
  route: string;
  purpose: string;
  required: boolean;
}
