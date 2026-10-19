// Pinned shared World Repo schema, including optional v1.1 extensions.
// This evaluator supports only the keywords in that schema, not arbitrary schemas.
import { createRequire } from "node:module";

const schema = createRequire(import.meta.url)("./world-manifest.schema.json");
const keywords = new Set([
  "$schema",
  "$id",
  "title",
  "description",
  "default",
  "format",
  "type",
  "required",
  "properties",
  "additionalProperties",
  "items",
  "enum",
  "pattern",
  "minLength",
  "maxLength",
  "maxItems",
  "minimum",
  "maximum",
]);
const record = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const pointer = (base, key) =>
  `${base}/${String(key).replace(/~/g, "~0").replace(/\//g, "~1")}`;

// Check open JSON payloads too, without serializing away undefined, nonfinite
// numbers or sparse arrays, invoking accessors, or recursing on cycles.
function jsonValue(input) {
  const active = new Set();
  const stack = [{ value: input }];
  while (stack.length) {
    const { value, leave } = stack.pop();
    if (leave) {
      active.delete(value);
      continue;
    }
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    )
      continue;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return false;
      continue;
    }
    if (!Array.isArray(value) && !record(value)) return false;
    if (active.has(value)) return false;
    active.add(value);
    stack.push({ value, leave: true });
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const keys = Reflect.ownKeys(descriptors);
    if (Array.isArray(value)) {
      if (
        keys.length !== value.length + 1 ||
        keys.some(
          (key) => key !== "length" && !/^(0|[1-9]\d*)$/.test(String(key)),
        )
      )
        return false;
      for (let index = 0; index < value.length; index++) {
        const item = descriptors[index];
        if (!item || !item.enumerable || !Object.hasOwn(item, "value"))
          return false;
        stack.push({ value: item.value });
      }
    } else {
      for (const key of keys) {
        const item = descriptors[key];
        if (
          typeof key !== "string" ||
          !item.enumerable ||
          !Object.hasOwn(item, "value")
        )
          return false;
        stack.push({ value: item.value });
      }
    }
  }
  return true;
}

function compile(node) {
  for (const key of Object.keys(node)) {
    if (!keywords.has(key))
      throw new Error(`Unsupported pinned manifest schema keyword: ${key}`);
  }
  const properties = new Map(
    Object.entries(node.properties || {}).map(([key, child]) => [
      key,
      compile(child),
    ]),
  );
  const additional = record(node.additionalProperties)
    ? compile(node.additionalProperties)
    : null;
  const item = node.items ? compile(node.items) : null;
  const pattern = node.pattern ? new RegExp(node.pattern, "u") : null;
  return (value, at, errors) => {
    const validType =
      node.type === "object"
        ? record(value)
        : node.type === "array"
          ? Array.isArray(value)
          : node.type === "integer"
            ? Number.isInteger(value)
            : typeof value === node.type;
    if (!validType) {
      errors.push(`${at}: must be ${node.type}`);
      return;
    }
    if (node.enum && !node.enum.includes(value))
      errors.push(`${at}: must be one of ${node.enum.join(" | ")}`);
    if (typeof value === "string") {
      const length = [...value].length;
      if (node.minLength !== undefined && length < node.minLength)
        errors.push(`${at}: minimum length ${node.minLength}`);
      if (node.maxLength !== undefined && length > node.maxLength)
        errors.push(`${at}: maximum length ${node.maxLength}`);
      if (pattern && !pattern.test(value))
        errors.push(`${at}: does not match the required pattern`);
    }
    if (typeof value === "number") {
      if (node.minimum !== undefined && value < node.minimum)
        errors.push(`${at}: minimum ${node.minimum}`);
      if (node.maximum !== undefined && value > node.maximum)
        errors.push(`${at}: maximum ${node.maximum}`);
    }
    if (Array.isArray(value)) {
      if (node.maxItems !== undefined && value.length > node.maxItems)
        errors.push(`${at}: maximum ${node.maxItems} items`);
      if (item)
        value.forEach((child, index) =>
          item(child, pointer(at, index), errors),
        );
    } else if (record(value)) {
      for (const key of node.required || []) {
        if (!Object.hasOwn(value, key))
          errors.push(`${pointer(at, key)}: required`);
      }
      for (const [key, child] of Object.entries(value)) {
        const validate = properties.get(key) || additional;
        if (validate) validate(child, pointer(at, key), errors);
        else if (node.additionalProperties === false)
          errors.push(`${pointer(at, key)}: unknown field`);
      }
    }
  };
}
const validate = compile(schema);

/** Validate JSON data without changing it or resolving any URI. Formats remain
 * annotations as in the pinned 2020-12 schema; this is not rights/approval proof.
 * @param {unknown} manifest
 * @returns {{valid:boolean, errors:string[]}}
 */
export function validateManifest(manifest) {
  const errors = [];
  try {
    if (!record(manifest))
      return { valid: false, errors: ["manifest must be an object"] };
    if (!jsonValue(manifest))
      return {
        valid: false,
        errors: [
          "manifest must contain only JSON data; cycles and accessors are invalid",
        ],
      };
    validate(manifest, "manifest", errors);
    // Preserve SDK semantic checks that the shared schema only describes.
    if (
      typeof manifest.license?.spdx === "string" &&
      !manifest.license.spdx.length
    )
      errors.push("manifest/license/spdx: must not be empty");
    const splits = manifest.royalty?.splits;
    if (
      Array.isArray(splits) &&
      splits.length &&
      splits.every((split) => record(split) && Number.isInteger(split.bps))
    ) {
      if (splits.reduce((sum, split) => sum + split.bps, 0) !== 10000)
        errors.push("manifest/royalty/splits: must sum to 10000 bps");
    }
    if (Array.isArray(manifest.provenance)) {
      manifest.provenance.forEach((entry, index) => {
        if (typeof entry?.timestamp === "string" && !entry.timestamp.length)
          errors.push(
            `manifest/provenance/${index}/timestamp: must not be empty`,
          );
      });
    }
  } catch {
    return {
      valid: false,
      errors: ["manifest must contain inspectable JSON data"],
    };
  }
  return { valid: errors.length === 0, errors };
}
