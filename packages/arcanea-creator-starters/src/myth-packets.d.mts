export interface MythBrief {
  schema: "arcanea.myth-brief.v1";
  projectId: string;
  title: string;
  audience: "ages-8-12" | "teens" | "adults" | "family";
  setting: string;
  selectedMyths: string[];
  currency: "USD" | "EUR" | "GBP";
  reviewRateMicrosPerHour: number;
  maxProductionCostMicros: number;
  deliverables: MythDeliverable[];
}
export interface MythDeliverable {
  id: string;
  format: "text" | "image" | "audio" | "video";
  acceptedUnits: number;
  attemptsPerUnit: number;
  unitCostMicros: number;
  reviewMinutesPerAttempt: number;
}
export interface MythRecord {
  id: string;
  label: string;
  tradition: string;
  livingTradition: boolean;
  geography: { status: string; place: string };
  source: {
    work: string;
    attribution: string;
    anchor: string;
    url: string;
    evidenceStatus: string;
    editionRights: "unresolved";
  };
  adaptationPrompt: string;
  reviewQuestions: string[];
}
export interface MythAtlas {
  schema: string;
  revision: string;
  records: MythRecord[];
}
export interface MythPacket {
  schema: string;
  packetId: string;
  project: { id: string; title: string; audience: string; setting: string };
  provenance: {
    atlasRevision: string;
    atlasDigest: string;
    briefDigest: string;
  };
  research: (MythRecord & { sourceDigest: string })[];
  creativeProposals: {
    mythId: string;
    sourceDigest: string;
    status: string;
    prompt: string;
    setting: string;
  }[];
  budget: {
    currency: string;
    moneyUnit: string;
    maxProductionCostMicros: number;
    totalCostMicros: number;
    remainingMicros: number;
    withinBudget: boolean;
    estimates: (MythDeliverable & {
      plannedAttempts: number;
      reviewMinutes: number;
      generationCostMicros: number;
      reviewCostMicros: number;
      totalCostMicros: number;
    })[];
    assumptions: string[];
  };
  review: {
    stage: string;
    canonStatus: string;
    commercialClearance: string;
    livingTraditionReviewRequired: boolean;
    releaseEligible: false;
    questions: { mythId: string; question: string }[];
    requiredDecisions: string[];
  };
  executionBoundary: string;
}
export const compilerVersion: string;
export function digest(value: unknown): string;
export function validateAtlas(atlas: unknown): MythAtlas;
export function validateBrief(brief: unknown, atlas: unknown): MythBrief;
export function compilePacket(brief: unknown, atlas: unknown): MythPacket;
export function packetMarkdown(packet: MythPacket): string;
