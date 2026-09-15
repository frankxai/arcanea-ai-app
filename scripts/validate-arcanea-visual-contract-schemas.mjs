import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SCHEMA_ROOT = join(ROOT, "schemas/arcanea-visual");
const SCHEMA_FILES = {
  "arcanea.machine_preflight_receipt.v2":
    "arcanea.machine_preflight_receipt.v2.schema.json",
  "arcanea.visual_prompt_contract.v1":
    "arcanea.visual_prompt_contract.v1.schema.json",
  "arcanea.visual_execution_grant.v1":
    "arcanea.visual_execution_grant.v1.schema.json",
  "arcanea.visual_output_receipt.v1":
    "arcanea.visual_output_receipt.v1.schema.json",
};

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const schemas = Object.fromEntries(
  Object.entries(SCHEMA_FILES).map(([id, file]) => [
    id,
    readJson(join(SCHEMA_ROOT, file)),
  ]),
);

function typeMatches(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object")
    return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  return typeof value === type;
}

function resolveRef(rootSchema, ref) {
  if (!ref.startsWith("#/")) throw new Error(`Unsupported schema ref: ${ref}`);
  return ref
    .slice(2)
    .split("/")
    .reduce(
      (value, key) => value?.[key.replaceAll("~1", "/").replaceAll("~0", "~")],
      rootSchema,
    );
}

function inspect(value, schema, path, rootSchema) {
  const errors = [];
  if (schema.$ref) {
    const resolved = resolveRef(rootSchema, schema.$ref);
    if (!resolved) return [`${path}: unresolved ref ${schema.$ref}`];
    return inspect(value, resolved, path, rootSchema);
  }
  if (schema.oneOf) {
    const alternatives = schema.oneOf.map((candidate) =>
      inspect(value, candidate, path, rootSchema),
    );
    if (
      alternatives.filter((candidate) => candidate.length === 0).length !== 1
    ) {
      errors.push(`${path}: must match exactly one oneOf branch`);
    }
    return errors;
  }
  if (Object.hasOwn(schema, "const")) {
    if (JSON.stringify(value) !== JSON.stringify(schema.const)) {
      errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
    }
  }
  if (schema.enum && !schema.enum.some((item) => item === value)) {
    errors.push(`${path}: must be one of ${schema.enum.join(", ")}`);
  }
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => typeMatches(value, type))) {
      errors.push(`${path}: expected ${types.join(" or ")}`);
      return errors;
    }
  }
  if (typeof value === "string") {
    if (schema.minLength && value.length < schema.minLength) {
      errors.push(`${path}: shorter than ${schema.minLength}`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: does not match ${schema.pattern}`);
    }
    if (schema.format === "date-time" && !Number.isFinite(Date.parse(value))) {
      errors.push(`${path}: invalid date-time`);
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: below ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: above ${schema.maximum}`);
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: fewer than ${schema.minItems} items`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path}: more than ${schema.maxItems} items`);
    }
    if (
      schema.uniqueItems &&
      new Set(value.map((item) => JSON.stringify(item))).size !== value.length
    ) {
      errors.push(`${path}: items must be unique`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(
          ...inspect(item, schema.items, `${path}[${index}]`, rootSchema),
        );
      });
    }
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties ?? {}, key)) {
          errors.push(`${path}.${key}: additional property`);
        }
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        errors.push(
          ...inspect(value[key], childSchema, `${path}.${key}`, rootSchema),
        );
      }
    }
  }
  return errors;
}

function validateInstance(value, schemaId, label) {
  const schema = schemas[schemaId];
  if (!schema) throw new Error(`No registered schema for ${schemaId}.`);
  const errors = inspect(value, schema, label, schema);
  if (errors.length) {
    throw new Error(`${label} violates ${schemaId}:\n- ${errors.join("\n- ")}`);
  }
}

for (const [schemaId, schema] of Object.entries(schemas)) {
  if (
    schema.$schema !== "https://json-schema.org/draft/2020-12/schema" ||
    !schema.$id?.startsWith("https://arcanea.ai/schemas/") ||
    schema.type !== "object" ||
    schema.additionalProperties !== false ||
    schema.properties?.schema?.const !== schemaId ||
    new Set(schema.required ?? []).size !== (schema.required ?? []).length
  ) {
    throw new Error(`Schema declaration is incomplete: ${schemaId}.`);
  }
}

const campaign = readJson(
  join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
);
const jobs = campaign.rounds.flatMap((round) => round.jobs);
for (const job of jobs) {
  validateInstance(
    job.promptContract,
    "arcanea.visual_prompt_contract.v1",
    job.id,
  );
}

const publicPromptRoot = join(
  ROOT,
  "apps/web/public/downloads/arcanea-constellation/prompts",
);
const publicPromptFiles = existsSync(publicPromptRoot)
  ? readdirSync(publicPromptRoot).filter((name) =>
      /^acv-\d{3}\.json$/i.test(name),
    )
  : [];
if (publicPromptFiles.length !== jobs.length) {
  throw new Error(
    `Public Prompt Atlas has ${publicPromptFiles.length} JSON contracts; expected ${jobs.length}.`,
  );
}
for (const job of jobs) {
  const publicContract = readJson(
    join(publicPromptRoot, `${job.id.toLowerCase()}.json`),
  );
  validateInstance(
    publicContract,
    "arcanea.visual_prompt_contract.v1",
    `public:${job.id}`,
  );
  if (JSON.stringify(publicContract) !== JSON.stringify(job.promptContract)) {
    throw new Error(`Public Prompt Atlas contract drifted: ${job.id}.`);
  }
}

const authorityRoot = join(
  ROOT,
  "planning-with-files/arcanea-visual-authority",
);
const preflightFiles = existsSync(authorityRoot)
  ? readdirSync(authorityRoot).filter((name) =>
      /preflight.*\.json$/i.test(name),
    )
  : [];
let currentPreflightCount = 0;
for (const file of preflightFiles) {
  const preflight = readJson(join(authorityRoot, file));
  if (preflight.schema === "arcanea.machine_preflight_receipt.v2") {
    validateInstance(preflight, preflight.schema, file);
    currentPreflightCount += 1;
  }
}
const grantFiles = existsSync(authorityRoot)
  ? readdirSync(authorityRoot).filter((name) => /grant.*\.json$/i.test(name))
  : [];
for (const file of grantFiles) {
  const grant = readJson(join(authorityRoot, file));
  if (grant.schema === "arcanea.visual_execution_grant.v1") {
    validateInstance(grant, grant.schema, file);
  }
}

const resultsRoot = join(ROOT, "planning-with-files/arcanea-visual-results");
const resultFiles = existsSync(resultsRoot)
  ? readdirSync(resultsRoot).filter((name) =>
      /^acv-\d{3}-r\d+\.json$/i.test(name),
    )
  : [];
for (const file of resultFiles) {
  const receipt = readJson(join(resultsRoot, file));
  validateInstance(receipt, "arcanea.visual_output_receipt.v1", file);
}

const preflightLabel = `${currentPreflightCount} storage-bound preflight${
  currentPreflightCount === 1 ? "" : "s"
}`;
console.log(
  `Arcanea visual contract schemas passed: ${Object.keys(schemas).length} schemas, ${jobs.length} source contracts, ${publicPromptFiles.length} public copies, ${preflightLabel}, ${grantFiles.length} grants, ${resultFiles.length} output receipts.`,
);
