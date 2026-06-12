export const SIS_VAULT_NAMES = [
  "technical",
  "strategic",
  "creative",
  "operational",
  "wisdom",
  "horizon",
];

const CONFIDENCE_VALUES = new Set(["low", "medium", "high"]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function parseMetadata(value, errors) {
  if (value === undefined || value === null || value === "") {
    return {};
  }
  if (isObject(value)) {
    return value;
  }
  if (typeof value !== "string") {
    errors.push("metadata must be a JSON object");
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    if (!isObject(parsed)) {
      errors.push("metadata must be a JSON object");
      return {};
    }
    return parsed;
  } catch (error) {
    errors.push(
      `metadata is invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {};
  }
}

export function validateSisWriteInput(input) {
  const errors = [];
  const warnings = [];
  const vault = typeof input.vault === "string" ? input.vault.trim() : "";
  const content = typeof input.content === "string" ? input.content.trim() : "";

  if (!SIS_VAULT_NAMES.includes(vault)) {
    errors.push(`vault must be one of: ${SIS_VAULT_NAMES.join(", ")}`);
  }
  if (!content) {
    errors.push("content is required");
  }

  const confidence = input.confidence || "medium";
  if (!CONFIDENCE_VALUES.has(confidence)) {
    errors.push("confidence must be low, medium, or high");
  }

  const metadata = parseMetadata(input.metadata, errors);
  for (const [key, value] of [
    ["project", input.project],
    ["routine", input.routine],
    ["state", input.state],
    ["packName", input.packName],
    ["assetName", input.assetName],
  ]) {
    if (value !== undefined && value !== null && value !== "") {
      metadata[key] = String(value);
    }
  }

  const normalized = {
    vault,
    content,
    tags: normalizeTags(input.tags),
    category:
      typeof input.category === "string" && input.category.trim()
        ? input.category.trim()
        : "general",
    source:
      typeof input.source === "string" && input.source.trim()
        ? input.source.trim()
        : "manual",
    confidence,
    author:
      typeof input.author === "string" && input.author.trim()
        ? input.author.trim()
        : undefined,
    context:
      typeof input.context === "string" && input.context.trim()
        ? input.context.trim()
        : undefined,
    entryType:
      typeof input.entryType === "string" && input.entryType.trim()
        ? input.entryType.trim()
        : "generic",
    metadata,
  };

  if (normalized.tags.length === 0) {
    warnings.push("entry has no tags");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalized,
  };
}

export function validateCanonicalSisEntry(vault, entry) {
  const errors = [];
  const warnings = [];

  if (!SIS_VAULT_NAMES.includes(vault)) {
    errors.push(`unknown vault: ${vault}`);
  }
  if (!isObject(entry)) {
    return { errors: ["entry must be an object"], warnings };
  }
  if (!nonEmptyString(entry.id)) {
    errors.push("id is required");
  }
  if (!nonEmptyString(entry.createdAt)) {
    errors.push("createdAt is required");
  } else if (Number.isNaN(Date.parse(entry.createdAt))) {
    errors.push("createdAt must be an ISO-compatible timestamp");
  }
  if (entry.tags !== undefined && !Array.isArray(entry.tags)) {
    errors.push("tags must be an array when present");
  }
  if (entry.metadata !== undefined && !isObject(entry.metadata)) {
    errors.push("metadata must be an object when present");
  }

  if (vault === "horizon") {
    if (!nonEmptyString(entry.wish)) {
      errors.push("wish is required for horizon entries");
    }
    if (entry.author !== undefined && !nonEmptyString(entry.author)) {
      warnings.push("author is present but empty");
    }
    return { errors, warnings };
  }

  if (!nonEmptyString(entry.insight)) {
    errors.push("insight is required");
  }
  if (!nonEmptyString(entry.category)) {
    errors.push("category is required");
  }
  if (!nonEmptyString(entry.source)) {
    errors.push("source is required");
  }
  if (!CONFIDENCE_VALUES.has(entry.confidence)) {
    errors.push("confidence must be low, medium, or high");
  }

  return { errors, warnings };
}
