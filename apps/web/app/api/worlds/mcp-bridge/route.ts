/**
 * MCP Bridge API — Call worldbuilding tools from the web app
 *
 * POST /api/worlds/mcp-bridge
 * GET  /api/worlds/mcp-bridge (tool discovery)
 *
 * Uses @arcanea/world-engine — same logic as the MCP server.
 * Single source of truth for all worldbuilding.
 *
 * Usage:
 *   POST { "tool": "generate_character", "args": { "primaryElement": "Fire" } }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  generateCharacter,
  generateMagicAbility,
  generateLocation,
  generateCreature,
  generateArtifact,
  generateName,
  generateStoryPrompt,
  generateWorldReport,
  generateConflict,
  weaveNarrative,
  characterToImagePrompt,
  locationToImagePrompt,
  creatureToImagePrompt,
  ELEMENTS,
  HOUSES,
  GUARDIANS,
  GODBEASTS,
} from "@arcanea/world-engine";

const AVAILABLE_TOOLS = [
  "generate_character", "generate_magic", "generate_location",
  "generate_creature", "generate_artifact", "generate_name",
  "generate_story_prompt", "world_report", "generate_conflict",
  "weave_narrative", "visualize_character", "visualize_location",
  "visualize_creature", "get_canon",
] as const;

export async function POST(request: NextRequest) {
  try {
    const { tool, args } = await request.json();
    if (!tool) return NextResponse.json({ error: "Missing 'tool'" }, { status: 400 });

    let result: unknown;

    switch (tool) {
      case "generate_character":
        result = generateCharacter(args || {});
        break;
      case "generate_magic":
        result = generateMagicAbility(args || {});
        break;
      case "generate_location":
        result = generateLocation(args || {});
        break;
      case "generate_creature":
        result = generateCreature(args || {});
        break;
      case "generate_artifact":
        result = generateArtifact(args || {});
        break;
      case "generate_name":
        result = generateName(args || {});
        break;
      case "generate_story_prompt":
        result = generateStoryPrompt(args || {});
        break;
      case "world_report":
        result = generateWorldReport([], []);
        break;
      case "generate_conflict":
        result = generateConflict([], []);
        break;
      case "weave_narrative":
        result = weaveNarrative([], []);
        break;
      case "visualize_character":
        result = characterToImagePrompt(args);
        break;
      case "visualize_location":
        result = locationToImagePrompt(args);
        break;
      case "visualize_creature":
        result = creatureToImagePrompt(args);
        break;
      case "get_canon":
        result = { elements: ELEMENTS, houses: HOUSES, guardians: GUARDIANS, godbeasts: GODBEASTS };
        break;
      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}`, tools: AVAILABLE_TOOLS }, { status: 400 });
    }

    return NextResponse.json({ tool, result });
  } catch (error) {
    return NextResponse.json({ error: "MCP bridge error", detail: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Arcanea MCP Bridge",
    description: "Worldbuilding tools via REST. Powered by @arcanea/world-engine.",
    tools: AVAILABLE_TOOLS,
    version: "1.0.0",
    usage: { method: "POST", body: '{ "tool": "generate_character", "args": { "primaryElement": "Fire" } }' },
  });
}
