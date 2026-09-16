import { createHash } from "node:crypto";

export const MACHINE_PREFLIGHT_SCHEMA = "arcanea.machine_preflight_receipt.v2";
export const STORAGE_EVIDENCE_SCHEMA = "arcanea.storage_preflight_evidence.v1";
export const STORAGE_POLICY = "starlight-machine-performance-contract-v1.1";
export const STORAGE_HARD_FLOOR_PERCENT = 8;
export const STORAGE_MEDIA_ADMISSION_PERCENT = 15;

export const hashJson = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

const isSha256 = (value) =>
  typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);

const parseInstant = (value, label) => {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(`${label} is invalid.`);
  return timestamp;
};

export function buildStorageEvidence(storagePlan) {
  if (
    !storagePlan ||
    typeof storagePlan !== "object" ||
    typeof storagePlan.schemaVersion !== "string" ||
    typeof storagePlan.planId !== "string" ||
    storagePlan.planId.trim().length < 3 ||
    !Number.isFinite(Date.parse(storagePlan.generatedAt)) ||
    typeof storagePlan.mode !== "string" ||
    storagePlan.mode.trim().length < 2 ||
    typeof storagePlan.machine?.volume !== "string" ||
    !Number.isFinite(storagePlan.machine?.freeGiB) ||
    storagePlan.machine.freeGiB < 0 ||
    !Number.isFinite(storagePlan.machine?.freePercent) ||
    storagePlan.machine.freePercent < 0 ||
    storagePlan.machine.freePercent > 100 ||
    typeof storagePlan.posture?.storageState !== "string"
  ) {
    throw new Error(
      "Storage evidence must be a complete Starlight storage-intelligence plan.",
    );
  }

  const evidenceBody = {
    schema: STORAGE_EVIDENCE_SCHEMA,
    policy: STORAGE_POLICY,
    planId: storagePlan.planId,
    generatedAt: new Date(storagePlan.generatedAt).toISOString(),
    mode: storagePlan.mode,
    volume: storagePlan.machine.volume,
    freeGiB: storagePlan.machine.freeGiB,
    freePercent: storagePlan.machine.freePercent,
    storageState: storagePlan.posture.storageState,
    hardFloorPercent: STORAGE_HARD_FLOOR_PERCENT,
    mediaAdmissionPercent: STORAGE_MEDIA_ADMISSION_PERCENT,
    mediaGenerationAllowed:
      storagePlan.machine.freePercent >= STORAGE_MEDIA_ADMISSION_PERCENT,
    rawPlanHash: hashJson(storagePlan),
  };
  return { ...evidenceBody, evidenceHash: hashJson(evidenceBody) };
}

export function deriveMachinePosture(performancePosture, storageEvidence) {
  if (
    performancePosture === "hold" ||
    storageEvidence?.mediaGenerationAllowed !== true
  ) {
    return "hold";
  }
  return performancePosture;
}

export function validateMachinePreflightReceipt(
  receipt,
  { now = Date.now(), requireExecutable = true } = {},
) {
  if (!receipt || typeof receipt !== "object") {
    throw new Error("Machine preflight receipt is missing.");
  }
  const { receiptHash, ...receiptBody } = receipt;
  if (!isSha256(receiptHash) || receiptHash !== hashJson(receiptBody)) {
    throw new Error("Machine preflight receipt hash is invalid.");
  }
  const storageEvidence = receipt.storageEvidence;
  const { evidenceHash, ...storageEvidenceBody } = storageEvidence ?? {};
  const checkedAt = parseInstant(receipt.checkedAt, "Preflight checkedAt");
  const expiresAt = parseInstant(receipt.expiresAt, "Preflight expiresAt");
  const storageGeneratedAt = parseInstant(
    storageEvidence?.generatedAt,
    "Storage evidence generatedAt",
  );
  const expectedPosture = deriveMachinePosture(
    receipt.performancePosture,
    storageEvidence,
  );

  if (
    receipt.schema !== MACHINE_PREFLIGHT_SCHEMA ||
    receipt.workload !== "image-generation" ||
    receipt.sourceWorkload !== "overnight" ||
    !["allow", "bounded", "hold"].includes(receipt.performancePosture) ||
    receipt.posture !== expectedPosture ||
    receipt.maxParallelCalls !== 1 ||
    receipt.ppPlanHash !== hashJson(receipt.ppPlan) ||
    receipt.ppPlan?.workload !== receipt.sourceWorkload ||
    receipt.ppPlan?.decision !== receipt.performancePosture ||
    receipt.ppPlan?.timestamp !== receipt.checkedAt ||
    receipt.ppPlan?.budget?.maxParallelism < receipt.maxParallelCalls ||
    storageEvidence?.schema !== STORAGE_EVIDENCE_SCHEMA ||
    storageEvidence?.policy !== STORAGE_POLICY ||
    storageEvidence?.hardFloorPercent !== STORAGE_HARD_FLOOR_PERCENT ||
    storageEvidence?.mediaAdmissionPercent !==
      STORAGE_MEDIA_ADMISSION_PERCENT ||
    storageEvidence?.mediaGenerationAllowed !==
      storageEvidence?.freePercent >= STORAGE_MEDIA_ADMISSION_PERCENT ||
    !Number.isFinite(storageEvidence?.freeGiB) ||
    storageEvidence.freeGiB < 0 ||
    !Number.isFinite(storageEvidence?.freePercent) ||
    storageEvidence.freePercent < 0 ||
    storageEvidence.freePercent > 100 ||
    !isSha256(storageEvidence?.rawPlanHash) ||
    !isSha256(evidenceHash) ||
    evidenceHash !== hashJson(storageEvidenceBody) ||
    typeof receipt.checkedBy !== "string" ||
    receipt.checkedBy.trim().length < 2 ||
    typeof receipt.evidence !== "string" ||
    receipt.evidence.trim().length < 3 ||
    checkedAt > now + 60_000 ||
    storageGeneratedAt > now + 60_000 ||
    Math.abs(storageGeneratedAt - checkedAt) > 15 * 60_000 ||
    expiresAt <= checkedAt ||
    expiresAt > Math.min(checkedAt, storageGeneratedAt) + 30 * 60_000 ||
    expiresAt <= now
  ) {
    throw new Error(
      "Machine preflight must bind current PP and storage evidence, preserve the media floor, and limit execution to one parallel call.",
    );
  }

  if (
    requireExecutable &&
    (!["allow", "bounded"].includes(receipt.posture) ||
      storageEvidence.mediaGenerationAllowed !== true)
  ) {
    throw new Error(
      "Machine preflight is held by performance or storage policy.",
    );
  }
  return receipt;
}
