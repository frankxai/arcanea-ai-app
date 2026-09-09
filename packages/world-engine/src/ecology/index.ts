import ecologyEntrySchema from "./ecology-entry.schema.json" with { type: "json" };

export { ecologyEntrySchema };
export * from "./types.js";
export {
  analyzeEcosystem,
  assertValidEcologyEntry,
  createEcologyProposal,
  validateEcologyEntry,
} from "./validate.js";
export { buildEcologyVisualPrompt } from "./prompt.js";
