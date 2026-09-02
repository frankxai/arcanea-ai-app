import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Ajv2020 from "ajv/dist/2020.js";
import {
  ECOLOGY_ELEMENTS,
  ECOLOGY_GATE_CONTEXT,
  ECOLOGY_GATES,
  ECOLOGY_KINDS,
  ecologyEntrySchema,
  analyzeEcosystem,
  buildEcologyVisualPrompt,
  validateEcologyEntry,
  type EcologyEntry,
  type ForgeEcologyRequest,
} from "@arcanea/world-engine";
import { z } from "zod";

const ajv = new Ajv2020({ allErrors: true, strict: true });

const RFC3339_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/;

function isStrictDateTime(value: string): boolean {
  const match = RFC3339_DATE_TIME.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const offsetHour = offsetHourText === undefined ? 0 : Number(offsetHourText);
  const offsetMinute = offsetMinuteText === undefined ? 0 : Number(offsetMinuteText);
  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return false;
  if (offsetHour > 23 || offsetMinute > 59) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= daysInMonth && Number.isFinite(Date.parse(value));
}

function isAbsoluteUri(value: string): boolean {
  if (/\s/.test(value) || !/^[A-Za-z][A-Za-z\d+.-]*:/.test(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol.length > 1;
  } catch {
    return false;
  }
}

ajv.addFormat("date-time", { type: "string", validate: isStrictDateTime });
ajv.addFormat("uri", { type: "string", validate: isAbsoluteUri });
const validateEcologySchema = ajv.compile(ecologyEntrySchema as object);

function structuralValidation(entry: unknown) {
  const valid = validateEcologySchema(entry);
  return {
    valid,
    errors: valid
      ? []
      : (validateEcologySchema.errors ?? []).map((error) => ({
          path: error.instancePath || "$",
          code: `schema:${error.keyword}`,
          message: error.message ?? "JSON Schema validation failed.",
          params: error.params,
        })),
  };
}

function json(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function invalid(tool: string, details: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ tool, ok: false, details }, null, 2) }],
    isError: true,
  };
}

function forgeBrief(request: ForgeEcologyRequest) {
  const gateContext = ECOLOGY_GATE_CONTEXT[request.gate];
  return {
    contract: "Arcanea EcologyEntry@1.0.0",
    canonState: "proposal",
    request,
    gateAnchor: {
      gate: request.gate,
      guardian: gateContext.guardian,
      godbeast: gateContext.godbeast,
    },
    requiredSequence: [
      "survival problem",
      "body and structural logic",
      "closed lifecycle",
      "energy and recovery budget",
      "three or more consequential relationships",
      "covenant gift, cost, balance, taboo, and breach",
      "removal test",
      "APL Spark / Shape / Sharpen visual direction",
      "sourceClaims separated from proposalMechanics",
    ],
    provenanceFirewall: {
      sourceClaims: "Only paraphrased facts supported by non-generated source IDs.",
      proposalMechanics: "Every inference or invention; state must remain proposal.",
      forbidden: "Generated output may not substantiate a canon or source claim.",
    },
    completionRule:
      "Author the full EcologyEntry with arcanea-ecology-forge, then call validate_ecology_entry in publish mode before imagery.",
  };
}

/**
 * Registers the ecology contract tools on the main Arcanea MCP server.
 *
 * Species authorship remains an agent/skill responsibility. The server exposes
 * deterministic planning, validation, graph analysis, and visual-prompt
 * compilation rather than random adjective assembly.
 */
export function registerEcologyTools(server: McpServer): void {
  server.registerTool(
    "plan_ecology_entry",
    {
      description:
        "Create a canon-safe constraint brief for an Arcanean flora, fauna, fungus, symbiote, or colony entry. Returns a proposal contract, not random finished lore.",
      inputSchema: {
        kind: z.enum(ECOLOGY_KINDS),
        worldId: z.string().min(2),
        worldName: z.string().min(2),
        realmId: z.string().min(2).optional(),
        realmName: z.string().min(2).optional(),
        biome: z.string().min(3),
        gate: z.enum(ECOLOGY_GATES),
        elementAffinity: z.array(z.enum(ECOLOGY_ELEMENTS)).min(1).max(2),
        spark: z.string().min(10),
        scaleClass: z
          .enum(["microscopic", "minute", "small", "human-scale", "large", "colossal", "landscape"])
          .optional(),
        radianceMechanism: z
          .enum([
            "bioluminescence",
            "fluorescence",
            "phosphorescence",
            "structural-color",
            "reflected-light",
            "mechanoluminescence",
            "thermoluminescence",
            "vael-resonance",
          ])
          .optional(),
        canonAnchors: z.array(z.string().min(3)).min(1),
        relationshipTargets: z
          .array(z.object({ id: z.string().min(5), name: z.string().min(2).optional() }))
          .max(16)
          .optional(),
      },
    },
    async (args) => json({ ok: true, brief: forgeBrief(args) }),
  );

  server.registerTool(
    "validate_ecology_entry",
    {
      description:
        "Validate an Arcanea EcologyEntry for schema-adjacent structure, Covenant Ecology, provenance separation, canon authority, and publication readiness.",
      inputSchema: {
        entry: z.record(z.string(), z.unknown()),
        mode: z.enum(["draft", "publish"]).default("draft"),
      },
    },
    async ({ entry, mode }) => {
      const structural = structuralValidation(entry);
      const validation = validateEcologyEntry(entry, mode);
      const valid = structural.valid && validation.valid;
      return valid
        ? json({ ok: true, mode, structural, semantic: validation })
        : invalid("validate_ecology_entry", { mode, structural, semantic: validation });
    },
  );

  server.registerTool(
    "analyze_ecosystem",
    {
      description:
        "Analyze a set of EcologyEntry records as a graph and report dangling dependencies, isolated species, keystones, and missing ecosystem functions.",
      inputSchema: {
        entries: z.array(z.record(z.string(), z.unknown())).min(1).max(100),
      },
    },
    async ({ entries }) => {
      const validations = entries.map((entry, index) => ({
        index,
        id: typeof entry.id === "string" ? entry.id : null,
        structural: structuralValidation(entry),
        semantic: validateEcologyEntry(entry, "draft"),
      }));
      const invalidEntries = validations.filter(
        (validation) => !validation.structural.valid || !validation.semantic.valid,
      );
      if (invalidEntries.length > 0) {
        return invalid("analyze_ecosystem", { invalidEntries });
      }
      return json({ ok: true, graph: analyzeEcosystem(entries as unknown as EcologyEntry[]), validations });
    },
  );

  server.registerTool(
    "build_ecology_visual_prompt",
    {
      description:
        "Compile a validated EcologyEntry into an Arcanean Prompt Language image brief without changing the organism or promoting its canon state.",
      inputSchema: {
        entry: z.record(z.string(), z.unknown()),
        shot: z.enum(["habitat-hero", "specimen", "relationship", "macro", "lifecycle"]).default("habitat-hero"),
        aspectRatio: z.enum(["1:1", "4:3", "4:5", "16:9", "9:16"]).default("16:9"),
        relationshipTargetId: z.string().optional(),
      },
    },
    async ({ entry, shot, aspectRatio, relationshipTargetId }) => {
      const structural = structuralValidation(entry);
      const validation = validateEcologyEntry(entry, "publish");
      if (!structural.valid || !validation.valid) {
        return invalid("build_ecology_visual_prompt", {
          reason: "Entry is not publication-ready. Repair validation errors before generating imagery.",
          structural,
          semantic: validation,
        });
      }
      const prompt = buildEcologyVisualPrompt(entry as unknown as EcologyEntry, {
        shot,
        aspectRatio,
        relationshipTargetId,
      });
      return json({ ok: true, prompt, warnings: validation.warnings });
    },
  );
}
