import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export function inspectExternalSourceBytes(bytes) {
  if (!Buffer.isBuffer(bytes)) {
    throw new TypeError("External source evidence must be inspected as bytes.");
  }
  return {
    bytes: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

export function verifyExternalSourceBytes(bytes, evidence) {
  if (
    !evidence ||
    typeof evidence.id !== "string" ||
    !/^[a-f0-9]{64}$/.test(evidence.sha256 ?? "") ||
    !Number.isSafeInteger(evidence.bytes) ||
    evidence.bytes < 1
  ) {
    throw new Error("External source evidence record is incomplete or invalid.");
  }
  const observed = inspectExternalSourceBytes(bytes);
  if (observed.bytes !== evidence.bytes) {
    throw new Error(
      `${evidence.id} byte count changed: expected ${evidence.bytes}, observed ${observed.bytes}.`,
    );
  }
  if (observed.sha256 !== evidence.sha256) {
    throw new Error(
      `${evidence.id} SHA-256 changed: expected ${evidence.sha256}, observed ${observed.sha256}.`,
    );
  }
  return observed;
}

export function verifyExternalSourceFile(path, evidence) {
  return verifyExternalSourceBytes(readFileSync(path), evidence);
}
