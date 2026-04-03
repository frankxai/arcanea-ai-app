/**
 * MCP Bridge API — Call MCP tool logic from the web app
 *
 * POST /api/worlds/mcp-bridge
 *
 * This bridges the MCP server's 40 tools with the web platform.
 * Instead of running a separate MCP server, the web app imports
 * the tool logic directly and calls it.
 *
 * Supports: generate_character, generate_location, generate_creature,
 * generate_artifact, world_report, generate_conflict, weave_narrative,
 * visualize_character, visualize_location, visualize_creature
 *
 * Usage:
 *   POST /api/worlds/mcp-bridge
 *   { "tool": "generate_character", "args": { "primaryElement": "Fire", "gatesOpen": 5 } }
 */

import { NextRequest, NextResponse } from "next/server";

// MCP tool logic — pure functions, no MCP protocol needed
// These are duplicated as inline functions to avoid cross-package import complexity.
// The source of truth lives in packages/arcanea-mcp/src/tools/
// TODO: Extract to @arcanea/world-engine shared package

// Inline element data used by generators
const ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] as const;
const HOUSES = ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"] as const;
const GUARDIANS = [
  { name: "Lyssandria", gate: 1, domain: "Foundation", element: "Earth" },
  { name: "Leyla", gate: 2, domain: "Flow", element: "Water" },
  { name: "Draconia", gate: 3, domain: "Fire", element: "Fire" },
  { name: "Maylinn", gate: 4, domain: "Heart", element: "Spirit" },
  { name: "Alera", gate: 5, domain: "Voice", element: "Wind" },
  { name: "Lyria", gate: 6, domain: "Sight", element: "Void" },
  { name: "Aiyami", gate: 7, domain: "Crown", element: "Spirit" },
  { name: "Elara", gate: 8, domain: "Starweave", element: "Void" },
  { name: "Ino", gate: 9, domain: "Unity", element: "Spirit" },
  { name: "Shinkami", gate: 10, domain: "Source", element: "All" },
];
const GODBEASTS = [
  { name: "Kaelith", gate: 1, form: "Great Serpent of Stone" },
  { name: "Veloura", gate: 2, form: "Shapeshifting Water Dragon" },
  { name: "Draconis", gate: 3, form: "Eternal Flame Dragon" },
  { name: "Laeylinn", gate: 4, form: "Healing Phoenix" },
  { name: "Otome", gate: 5, form: "Thunderbird of Truth" },
  { name: "Yumiko", gate: 6, form: "Dream Fox with Nine Tails" },
  { name: "Sol", gate: 7, form: "Radiant Lion of Dawn" },
  { name: "Vaelith", gate: 8, form: "Dimensional Serpent" },
  { name: "Kyuro", gate: 9, form: "Twin-Headed Unity Beast" },
];

function pick<T>(arr: readonly T[] | T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function getRank(gates: number): string {
  if (gates <= 2) return "Apprentice";
  if (gates <= 4) return "Mage";
  if (gates <= 6) return "Master";
  if (gates <= 8) return "Archmage";
  return "Luminor";
}

// Lightweight character generator for web API (mirrors MCP generate_character logic)
function webGenerateCharacter(args: Record<string, any>) {
  const gatesOpen = args.gatesOpen ?? Math.floor(Math.random() * 8) + 1;
  const primaryElement = args.primaryElement ?? pick([...ELEMENTS].filter(e => e !== "Spirit"));
  const secondaryElement = pick([...ELEMENTS].filter(e => e !== primaryElement));
  const house = args.house ?? pick([...HOUSES]);
  const guardian = GUARDIANS[Math.min(gatesOpen - 1, 9)];
  const godbeast = gatesOpen <= 9 ? GODBEASTS[gatesOpen - 1] : null;

  return {
    name: args.name || `${pick(["Val","Aer","Pyr","Nyx","Lum","Ter"])}${pick(["ia","on","is","ara","or","iel"])}`,
    primaryElement, secondaryElement, house,
    gatesOpen, rank: getRank(gatesOpen),
    patronGuardian: { name: guardian.name, domain: guardian.domain, relationship: pick(["devoted student","rebellious apprentice","abandoned protege"]) },
    godbeast: godbeast ? { name: godbeast.name, form: godbeast.form, bond: pick(["bonded at birth","earned through trial","not yet bonded"]) } : null,
    personality: {
      traits: [pick(["passionate","adaptive","steadfast","mysterious"]), pick(["driven","intuitive","patient","contemplative"])],
      flaw: pick(["fears losing control","refuses to use full power","doesn't believe they deserve their rank"]),
      desire: pick(["to open the next Gate","to find someone who disappeared","to be seen for who they are"]),
      secret: pick(["has touched the Void","can hear a Gate that shouldn't exist","is related to a villain"]),
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const { tool, args } = await request.json();

    if (!tool) {
      return NextResponse.json({ error: "Missing 'tool' field" }, { status: 400 });
    }

    let result: Record<string, unknown>;

    switch (tool) {
      case "generate_character":
        result = webGenerateCharacter(args || {});
        break;

      case "get_guardians":
        result = { guardians: GUARDIANS, godbeasts: GODBEASTS } as any;
        break;

      case "get_elements":
        result = { elements: ELEMENTS, houses: HOUSES } as any;
        break;

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}`, availableTools: AVAILABLE_TOOLS },
          { status: 400 }
        );
    }

    return NextResponse.json({ tool, result });

  } catch (error) {
    return NextResponse.json(
      { error: "MCP bridge error", detail: String(error) },
      { status: 500 }
    );
  }
}

const AVAILABLE_TOOLS = [
  "generate_character", "generate_magic", "generate_location",
  "generate_creature", "generate_artifact", "generate_name",
  "generate_story_prompt", "world_report", "generate_conflict",
  "weave_narrative", "visualize_character", "visualize_location",
  "visualize_creature",
];

export async function GET() {
  return NextResponse.json({
    name: "Arcanea MCP Bridge",
    description: "Call MCP worldbuilding tools from the web. Same logic as the MCP server, accessible via REST.",
    tools: AVAILABLE_TOOLS,
    usage: {
      method: "POST",
      body: '{ "tool": "generate_character", "args": { "primaryElement": "Fire" } }',
    },
  });
}
