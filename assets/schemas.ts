import { z } from "zod";

export const stageOSGenderSchema = z.enum(["male", "female"]);
export const stageOSSchoolStageSchema = z.enum(["primary", "junior", "senior"]);
export const stageOSVenueTypeSchema = z.enum(["indoor", "outdoor", "concert_hall", "stadium", "classroom_stage"]);
export const stageOSProgramTypeSchema = z.enum([
  "chorus",
  "mixed_chorus",
  "recitation",
  "drama",
  "classical_dance",
  "folk_dance",
  "modern_jazz_street",
  "ballet",
  "western_orchestra",
  "folk_orchestra",
  "instrument",
  "host",
  "etiquette_award",
  "acrobatics_martial_arts",
  "cheerleading",
  "sports_opening_ceremony",
  "class_showcase",
  "new_year_gala",
  "holiday_festival",
  "reunion_gala",
  "non_competition_group_show",
]);

export const stageOSStudentProfileSchema = z.object({
  studentId: z.string().min(1),
  gender: stageOSGenderSchema,
  heightCm: z.number().min(90).max(220),
  roleLabel: z.string().optional(),
  voicePart: z.string().optional(),
  instrumentPart: z.string().optional(),
});

export const stageOSConfirmedFormationSchema = z.object({
  summary: z.string().min(1),
  rows: z.array(z.number().int().positive()).optional(),
  layoutName: z.string().optional(),
  centerAxis: z.string().optional(),
  spacingRule: z.string().optional(),
  coordinates: z.array(z.object({
    studentId: z.string().min(1),
    x: z.number(),
    y: z.number(),
    z: z.number().optional(),
  })).optional(),
});

export const stageOSBaseInputSchema = z.object({
  schoolStage: stageOSSchoolStageSchema,
  ageRange: z.string().optional(),
  grade: z.string().optional(),
  programType: stageOSProgramTypeSchema,
  programTheme: z.string().min(1),
  programLevel: z.string().optional(),
  performerCount: z.number().int().positive(),
  maleCount: z.number().int().nonnegative(),
  femaleCount: z.number().int().nonnegative(),
  students: z.array(stageOSStudentProfileSchema),
  venueType: stageOSVenueTypeSchema,
  perPersonBudget: z.number().nonnegative().optional(),
  screenThemeColor: z.string().optional(),
  lightingStyle: z.string().optional(),
  specialExpectation: z.string().optional(),
  confirmedFormation: stageOSConfirmedFormationSchema,
  performanceDate: z.string().optional(),
  rehearsalFrequencyPerWeek: z.union([z.literal(2), z.literal(3), z.literal(5)]).optional(),
}).superRefine((value, ctx) => {
  if (value.maleCount + value.femaleCount !== value.performerCount) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "maleCount + femaleCount must equal performerCount" });
  }
  if (value.students.length && value.students.length !== value.performerCount) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "students.length must equal performerCount when provided" });
  }
});

export const stageOSOrchestrateRequestSchema = z.object({
  input: stageOSBaseInputSchema,
  requestedOutputs: z.array(z.enum([
    "costume_plan",
    "search_tags",
    "blueprint",
    "indoor_2d",
    "three_d",
    "photo",
    "video_15s",
    "export",
  ])).default(["costume_plan"]),
});
