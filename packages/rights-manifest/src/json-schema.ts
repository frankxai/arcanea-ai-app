import { z } from "zod";

import { RightsManifest } from "./schema.ts";

/** JSON Schema (draft 2020-12) for the rights manifest, generated from the Zod source of truth. */
export function rightsManifestJsonSchema(): Record<string, unknown> {
  const schema = z.toJSONSchema(RightsManifest, {
    target: "draft-2020-12",
    io: "input",
  }) as Record<string, unknown>;
  return {
    $id: "https://arcanea.ai/schemas/arcanea.rights_manifest.v0.schema.json",
    title: "Arcanea Rights Manifest v0",
    description:
      "Machine-readable rights, provenance and licensing record for a creative asset. Validation of cross-field rules (RM001+) happens in @arcanea/rights-manifest; this document covers structure only.",
    ...schema,
  };
}
