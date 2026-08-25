import { createHash } from "node:crypto";

import canonicalizeModule from "canonicalize";

const canonicalize = canonicalizeModule as unknown as (
  input: unknown,
) => string | undefined;

function assertUnicodeScalarString(value: string, path: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError(`Invalid Unicode scalar value at ${path}`);
      }
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new TypeError(`Invalid Unicode scalar value at ${path}`);
    }
  }
}

function assertIJsonValue(value: unknown, path = "$"): void {
  if (value === null || typeof value === "boolean") return;

  if (typeof value === "string") {
    assertUnicodeScalarString(value, path);
    return;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Non-finite JSON number at ${path}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertIJsonValue(entry, `${path}[${index}]`),
    );
    return;
  }

  if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(`Non-JSON object at ${path}`);
    }
    for (const [key, entry] of Object.entries(value)) {
      assertUnicodeScalarString(key, `${path}.[key]`);
      if (
        entry === undefined ||
        typeof entry === "function" ||
        typeof entry === "symbol"
      ) {
        throw new TypeError(`Non-I-JSON value at ${path}.${key}`);
      }
      assertIJsonValue(entry, `${path}.${key}`);
    }
    return;
  }

  throw new TypeError(`Non-I-JSON value at ${path}`);
}

export function canonicalJson(value: unknown): string {
  assertIJsonValue(value);
  const serialized = canonicalize(value);
  if (serialized === undefined) {
    throw new TypeError("Value cannot be represented as canonical JSON");
  }
  return serialized;
}

export function canonicalSha256(value: unknown): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")}`;
}

export function normalizeWorldContextQuery(query: string): string {
  return query.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
}

export function normalizedTokens(value: string): string[] {
  return normalizeWorldContextQuery(value).match(/[\p{L}\p{N}]+/gu) ?? [];
}
