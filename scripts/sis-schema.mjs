#!/usr/bin/env node

export const SIS_VAULT_NAMES = ["strategic", "technical", "creative", "operational", "wisdom", "horizon"];
export const SIS_CONFIDENCE_LEVELS = ["low", "medium", "high"];

export const SIS_ENTRY_TYPES = {
  generic: {
    description: "Default freeform memory entry.",
    requiredMetadata: [],
  },
  project_learning: {
    description: "Reusable learning tied to a project or product surface.",
    requiredMetadata: ["project"],
  },
  routine_learning: {
    description: "Learning about a routine, habit, ritual, or workflow.",
    requiredMetadata: ["routine"],
  },
  state_learning: {
    description: "Learning about a state, energy mode, or flow condition.",
    requiredMetadata: ["state"],
  },
  prompt_pack: {
    description: "Reusable prompt or prompt pack memory.",
    requiredMetadata: ["packName"],
  },
  creative_asset: {
    description: "Creative asset, song, library artifact, or aesthetic pattern.",
    requiredMetadata: ["assetName"],
  },
};

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseTagsValue(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (!value) return [];
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseMetadataValue(value) {
  if (!value) return {};
  if (isPlainObject(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isPlainObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

export function buildTypedMetadata(input) {
  const metadata = {
    ...parseMetadataValue(input.metadata),
  };

  if (input.project && !metadata.project) metadata.project = String(input.project).trim();
  if (input.routine && !metadata.routine) metadata.routine = String(input.routine).trim();
  if (input.state && !metadata.state) metadata.state = String(input.state).trim();
  if (input.packName && !metadata.packName) metadata.packName = String(input.packName).trim();
  if (input.assetName && !metadata.assetName) metadata.assetName = String(input.assetName).trim();

  return metadata;
}

export function getEntryTypeDefinition(entryType) {
  return SIS_ENTRY_TYPES[entryType] ?? SIS_ENTRY_TYPES.generic;
}

export function validateSisWriteInput(input) {
  const errors = [];
  const warnings = [];
  const vault = String(input.vault || "").trim().toLowerCase();
  const content = String(input.content || "").trim();
  const confidence = input.confidence ? String(input.confidence).trim().toLowerCase() : "medium";
  const entryType = input.entryType ? String(input.entryType).trim() : "generic";
  const tags = parseTagsValue(input.tags);
  const metadata = buildTypedMetadata(input);

  if (!SIS_VAULT_NAMES.includes(vault)) {
    errors.push(`Invalid vault: ${vault}`);
  }

  if (!content) {
    errors.push("content is required");
  }

  if (!SIS_CONFIDENCE_LEVELS.includes(confidence)) {
    errors.push(`Invalid confidence: ${confidence}`);
  }

  if (!SIS_ENTRY_TYPES[entryType]) {
    errors.push(`Invalid entryType: ${entryType}`);
  }

  if (SIS_ENTRY_TYPES[entryType]) {
    for (const key of SIS_ENTRY_TYPES[entryType].requiredMetadata) {
      if (!metadata[key]) {
        errors.push(`entryType ${entryType} requires metadata.${key}`);
      }
    }
  }

  if (vault === "horizon" && input.context == null) {
    warnings.push("Horizon entry without context is allowed but discouraged.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalized: {
      vault,
      content,
      confidence,
      entryType,
      tags,
      metadata,
      category: input.category ? String(input.category).trim() : undefined,
      source: input.source ? String(input.source).trim() : undefined,
      author: input.author ? String(input.author).trim() : undefined,
      context: input.context ? String(input.context).trim() : undefined,
    },
  };
}

export function normalizeSisReadEntry(vault, entry) {
  const content =
    entry.content ??
    entry.insight ??
    entry.learning ??
    entry.text ??
    entry.value ??
    entry.wish ??
    entry.pattern ??
    entry.summary ??
    JSON.stringify(entry);
  const createdAt =
    entry.createdAt ??
    entry.created_at ??
    entry.timestamp ??
    entry.date ??
    null;
  const tags = Array.isArray(entry.tags) ? entry.tags : [];
  const metadata = isPlainObject(entry.metadata) ? entry.metadata : {};
  const entryType = entry.entryType ?? metadata.entryType ?? "generic";

  return {
    vault,
    id: entry.id ?? null,
    createdAt,
    tags,
    content: String(content),
    entryType,
    metadata,
    raw: entry,
  };
}

export function validateCanonicalSisEntry(vault, entry) {
  const errors = [];
  const warnings = [];

  if (!entry || typeof entry !== "object") {
    return { valid: false, errors: ["entry must be an object"], warnings };
  }

  if (!entry.id) errors.push("missing id");
  if (!entry.createdAt) warnings.push("missing createdAt");

  if (vault === "horizon") {
    if (!entry.wish && !entry.content) errors.push("horizon entry missing wish");
    return { valid: errors.length === 0, errors, warnings };
  }

  if (!entry.insight && !entry.content) errors.push("entry missing insight/content");
  if (entry.confidence && !SIS_CONFIDENCE_LEVELS.includes(String(entry.confidence))) {
    errors.push(`invalid confidence ${entry.confidence}`);
  }

  const entryType = entry.entryType ?? entry.metadata?.entryType ?? "generic";
  if (!SIS_ENTRY_TYPES[entryType]) {
    errors.push(`invalid entryType ${entryType}`);
  } else {
    const metadata = isPlainObject(entry.metadata) ? entry.metadata : {};
    for (const key of SIS_ENTRY_TYPES[entryType].requiredMetadata) {
      if (!metadata[key]) {
        warnings.push(`entryType ${entryType} missing metadata.${key}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
