import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const docPath = new URL(
  "../../docs/strategy/ARCANEA_BUILD_SETUP_PLANNING_EVALUATION_2026-10.md",
  import.meta.url,
);
const evaluationDoc = readFileSync(docPath, "utf8");

test("evaluation document references required issue, commit, and draft review context", () => {
  assert.match(evaluationDoc, /Issue #527/);
  assert.match(evaluationDoc, /94b5e0a1dc7b47b09df9f5410d0f92ae7def7e95/);
  assert.match(evaluationDoc, /Pull Request #526/);
  assert.match(evaluationDoc, /5-6 October/);
  assert.match(evaluationDoc, /Novelcrafter/);
  assert.match(
    evaluationDoc,
    /https:\/\/arcanea\.ai\/schemas\/world-manifest\.v1\.json/,
  );
});

function validateWorldManifest(manifest) {
  if (typeof manifest !== "object" || manifest === null) {
    return { valid: false, reason: "Manifest must be a non-null object" };
  }
  if (
    manifest.$schema !== "https://arcanea.ai/schemas/world-manifest.v1.json"
  ) {
    return { valid: false, reason: "Invalid or missing $schema declaration" };
  }
  if (typeof manifest.projectId !== "string" || !manifest.projectId) {
    return { valid: false, reason: "Missing projectId" };
  }
  if (typeof manifest.title !== "string" || !manifest.title) {
    return { valid: false, reason: "Missing title" };
  }
  if (
    typeof manifest.revisionHash !== "string" ||
    manifest.revisionHash.length !== 64
  ) {
    return {
      valid: false,
      reason: "revisionHash must be a 64-character hex SHA-256 string",
    };
  }
  if (!Array.isArray(manifest.entities)) {
    return { valid: false, reason: "entities must be an array" };
  }
  if (!Array.isArray(manifest.chapters)) {
    return { valid: false, reason: "chapters must be an array" };
  }
  return { valid: true };
}

test("world manifest validator approves compliant output payload", () => {
  const validPayload = {
    $schema: "https://arcanea.ai/schemas/world-manifest.v1.json",
    projectId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Veldoria Chronicles",
    version: "1.0.0",
    revisionHash:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    entities: [
      {
        id: "ent_01",
        name: "Caelen Vance",
        type: "character",
        summary: "Master weaver of the Starlight Guild.",
      },
    ],
    chapters: [
      {
        id: "chap_01",
        title: "The Cold Season",
        content: "Snow fell over the obsidian towers...",
        sourceRevisions: [
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ],
      },
    ],
    exportedAt: "2026-10-12T12:00:00Z",
  };

  const result = validateWorldManifest(validPayload);
  assert.strictEqual(result.valid, true);
});

test("world manifest validator rejects non-compliant or broken payloads", () => {
  const brokenPayloads = [
    null,
    {},
    {
      $schema: "https://arcanea.ai/schemas/world-manifest.v1.json",
      projectId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Missing Revision Hash",
    },
    {
      $schema: "https://arcanea.ai/schemas/world-manifest.v1.json",
      projectId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Bad SHA-256",
      revisionHash: "short-hash",
      entities: [],
      chapters: [],
    },
  ];

  for (const payload of brokenPayloads) {
    const result = validateWorldManifest(payload);
    assert.strictEqual(result.valid, false);
  }
});
