# @arcanea/mcp-server

An MCP server that **audits a world instead of storing it**. Hand it a world, and it
tells you, rule by rule, where the world contradicts its canon, who owns what, and
whether anyone edited it after export. Every finding is mechanical, so you can check it
yourself. Plus Arcanea's worldbuilding, planning and coaching tools.

```bash
claude mcp add arcanea -- npx -y @arcanea/mcp-server@1
```

```json
{
  "mcpServers": {
    "arcanea": { "command": "npx", "args": ["-y", "@arcanea/mcp-server@1"] }
  }
}
```

Node 20.18.1+ or 22+. stdio by default; `--transport http --port 3100` for Streamable HTTP.
No account, no API key, no network calls for the WorldPack tools.

## Why an audit, not a story bible

Story bibles and wiki tools store what you wrote and hand it back to the model as context.
Nothing checks whether the next chapter contradicts it, and anything in the bible counts
as true because it is in the bible. WorldPack flips that:

| The pack claims                     | What `worldpack_check` / `worldpack_verify` actually do                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layer: "canon"` on a node          | Re-derive the layer from the canon document. A name that is not LOCKED canon, or an owner that is not the canon owner, is a `canon.layer-claim` **blocker**.               |
| `canon.sourceHash`                  | Recompute the sha256 of the canon document and compare. The pack's own value is never evidence.                                                                            |
| a locked truth ("Nero is NOT evil") | Scan **every** free-text field for the forbidden assertion, skipping negated phrasing.                                                                                     |
| a locked name                       | Match it through case, punctuation, diacritics, "Lyria the Radiant" hats and alias fields.                                                                                 |
| rights and canon status             | Check both against the layer the node really has, not the one it declares.                                                                                                 |
| `digest`, counts, agent roles       | Recompute the digest over nodes, edges, the provenance ledger and agent roles, and check roles against Guardian definitions in code. Re-signing a forged role still fails. |

Arcanea's canon is bundled and used by default. Pass `canonDocument` (your own markdown,
with pipe tables and `**LOCKED TRUTHS:**` bullets) and the same rules enforce **your** world.

### Example

```text
worldpack_check { "path": "./my-world.worldpack.json" }

{
  "verdict": "blocked",
  "headline": "BLOCKED: 'The Slow Chart' against Arcanea canon — 0 structural, 3 blocker, 0 error, 0 warning, 0 info",
  "findings": [
    {
      "ruleId": "canon.layer-claim",
      "severity": "blocker",
      "node": { "id": "chr_forged", "name": "Veyra Coldwater" },
      "message": "node declares layer 'canon' but is not canon: 'Veyra Coldwater' does not resolve in the canon index for Arcanea",
      "evidence": { "declaredLayer": "canon", "derivedLayer": "user", "canonOwner": "arcanea", "owner": "arcanea" },
      "fix": "Set layer to what the node is (user, generated, licensed or contributed). Canon layer is granted by the canon document, never by the pack."
    }
  ]
}
```

`path` works over stdio only; HTTP clients pass the pack inline as `pack`. Run
`worldpack_rules` for all 32 rule ids with severity, what each checks and how to clear it.

## Tools

<!-- tools:start -->

**59 tools**, 5 resources and 6 prompts, as reported by `tools/list` from the `arcanea-mcp` bin.
`tests/worldpack-tools.test.mjs` fails if this table and `tools/list` disagree.

### WorldPack audit (3)

| Tool               | What it does                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `worldpack_check`  | Audit a WorldPack.v1 world against a canon document: verdict, structural errors, and canon, rights and provenance findings with rule id, severity, evidence and fix. |
| `worldpack_verify` | Verify an exported pack's seal: digest, node counts, agent roles and canon binding. Returns sealed, tampered, canon-mismatch or unsealed.                            |
| `worldpack_rules`  | Every rule `worldpack_check` enforces, with severity, what it checks and how to clear it.                                                                            |

### Production planning (9)

| Tool                     | What it does                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `plan_world`             | World production packet: canon, factions, locations, visuals, audio palette, next actions.           |
| `plan_book`              | Book packet: reader promise, bible, chapter spine, sample direction, cover brief, publish checklist. |
| `plan_game`              | Game design packet: player promise, core loop, mechanics, levels, asset kit, prototype handoff.      |
| `plan_music_project`     | Music packet: lore, sonic motifs, cover brief, visualizer plan, release copy.                        |
| `plan_cinematic_scene`   | Cinematic packet: hook, shot list, camera language, references, audio, render prompts.               |
| `generate_asset_brief`   | Portable image, video or music asset brief with style, references and aspect ratio.                  |
| `export_project_context` | Package a project as a Claude, Codex, Cursor or generic agent handoff.                               |
| `list_arcanea_studios`   | Arcanea studio surfaces, routes, outcomes and recommended tools.                                     |
| `get_workflow_recipe`    | Reusable recipes for books, games, artist releases, trailers and campaign packs.                     |

### Worldbuilding generators (7)

| Tool                    | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `generate_character`    | Character with Gates, Element, House and backstory. |
| `generate_magic`        | Magical ability within the Arcanea magic system.    |
| `generate_location`     | Location with elemental alignment.                  |
| `generate_creature`     | Magical creature.                                   |
| `generate_artifact`     | Artifact with history and powers.                   |
| `generate_name`         | Names following the Arcanean language system.       |
| `generate_story_prompt` | Story prompt set in Arcanea.                        |

### World intelligence and persistence (7)

| Tool                | What it does                                                                |
| ------------------- | --------------------------------------------------------------------------- |
| `world_report`      | Health, gaps and next steps for the session's world.                        |
| `generate_conflict` | Morally complex conflict from your characters, with stakes and resolutions. |
| `weave_narrative`   | Multi-act story arc from the existing world state.                          |
| `generate_quest`    | Quest hooks, objectives, complications and rewards from the world state.    |
| `analyze_factions`  | Faction groups, power balance and tensions.                                 |
| `save_world`        | Save the session's world graph to disk.                                     |
| `load_world`        | Load a saved world, or list saved worlds.                                   |

### Creation graph (6)

| Tool                  | What it does                            |
| --------------------- | --------------------------------------- |
| `link_creations`      | Relate two creations.                   |
| `get_related`         | Creations related to one creation.      |
| `suggest_connections` | Suggested relationships for a creation. |
| `get_world_graph`     | Summary of the world network.           |
| `find_path`           | Connection path between two creations.  |
| `export_world`        | Export the graph for visualization.     |

### Agents (6)

| Tool              | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `orchestrate`     | Creative session with multi-agent coordination.           |
| `list_agents`     | Available creative agents.                                |
| `agent_info`      | One agent's details, Guardian hierarchy and Luminor team. |
| `assess_world`    | World maturity and strategic suggestions.                 |
| `match_skill`     | Best agent for a request.                                 |
| `active_sessions` | Running creative sessions.                                |

### Creative coaching and journey (7)

| Tool               | What it does                              |
| ------------------ | ----------------------------------------- |
| `diagnose_block`   | Quick identification of a creative block. |
| `deep_diagnosis`   | Multi-step analysis of a complex block.   |
| `invoke_luminor`   | Guidance from one Luminor companion.      |
| `convene_council`  | Guidance from several Luminors.           |
| `luminor_debate`   | Two Luminors argue a question.            |
| `get_journey`      | Creative progress and milestones.         |
| `check_milestones` | Milestones achieved.                      |

### Canon reference and prompt quality (5)

| Tool             | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `validate_canon` | Check free text for Arcanea canon compliance.          |
| `identify_gate`  | A Gate with its Guardian and Godbeast.                 |
| `apl_enhance`    | Score a prompt with SPARK.SHAPE.SHARPEN and flag slop. |
| `apl_anti_slop`  | Scan text for AI slop patterns with fixes.             |
| `apl_format`     | Restructure a prompt as SPARK.SHAPE.SHARPEN.           |

### Visual prompts (3)

| Tool                  | What it does                             |
| --------------------- | ---------------------------------------- |
| `visualize_character` | Image prompt from a character blueprint. |
| `visualize_location`  | Image prompt for a location.             |
| `visualize_creature`  | Image prompt for a creature.             |

### Arcanea Studio vault (4)

Requires `ARCANEA_WEB_URL` and `ARCANEA_SESSION_TOKEN`.

| Tool                        | What it does                                        |
| --------------------------- | --------------------------------------------------- |
| `get_arcanea_bridge_status` | Whether the web bridge is configured and reachable. |
| `search_arcanea_vault`      | Semantic search over your Studio vault.             |
| `save_to_arcanea_vault`     | Save content to your Studio vault.                  |
| `list_arcanea_worlds`       | Your Arcanea Worlds, for scoping vault saves.       |

### Lore archives (2)

| Tool                       | What it does                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `search_sovereign_depths`  | Sovereign Depths bosses, dungeons and encounters (staging and experimental proposals, opt-in). |
| `search_weight_of_wonders` | Weight of Wonders concepts (experimental, opt-in).                                             |

<!-- tools:end -->

## Development

```bash
pnpm --dir packages/arcanea-mcp build          # tsc, then vendors world-pack + canon into dist/vendor
pnpm --dir packages/arcanea-mcp test:worldpack # WorldPack tools over a real stdio handshake
node packages/arcanea-mcp/scripts/consumer-smoke.mjs  # pack, npm install into an empty dir, talk MCP to the bin
```

`@arcanea/world-pack` is bundled into `dist/vendor`, so the published package depends
only on the MCP SDK, zod and canonicalize.

## License

MIT
