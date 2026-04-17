# Overlay Contract — how Arcanea overlays consume Router Spec

**Version:** 1.0 (2026-04-17)
**Applies to:** `claude-arcanea`, `oh-my-arcanea`, `codex-arcanea`, `gemini-arcanea`, and any future per-runtime overlay.

## Principle

Overlays teach a CLI about Arcanea (canon, voice, standards, skills, hooks). They must not encode routing decisions — those come from `@arcanea/router-spec`. Overlays are policy; the spec is routing.

## Contract

Every overlay MUST:

1. **Ship a `manifest.yaml`** at repo root conforming to `packages/router-spec/manifest.schema.yaml`. Declares the surface it targets, the runtime binary it extends, and its install steps.
2. **Ship an `AGENTS.md`** at repo root. Agent-readable policy for what the overlay does, what files it owns, and what to modify where.
3. **Declare its surface** — a key under `surfaces:` in `packages/router-spec/models.yaml`. The overlay inherits routing defaults from that surface.
4. **Read, never duplicate**. If the overlay needs to pick a model for an agent, it calls `@arcanea/arcanea-code` or loads `@arcanea/router-spec` directly — never hard-codes.
5. **Install idempotently**. Running install twice must produce the same state as running it once. Print a line per action: created / updated / skipped.

## What overlays own

| Owned by overlay | Owned by router-spec | Owned by dispatcher |
|---|---|---|
| Agent personas / prompts / system messages | Task-class → model routing | Runtime selection + exec |
| Skills (skill files, hooks) | Per-surface `prefer` tier | User config + preference |
| Settings (keybindings, MCP registrations) | Model catalog | CLI detection + auth hints |
| CLI-specific integration glue | Delegation topology | |

## The install flow (agent readable)

```
1. curl install.sh | bash
2. install.sh reads this overlay's manifest.yaml
3. For each install step, copies/merges files into {configDir}
4. Prints a summary of what changed
5. Exits 0 only if every step succeeded
```

## Consumption example (pseudocode inside an overlay)

```ts
// Inside claude-arcanea/scripts/pick-agent-model.ts
import { loadSpec, resolveTask } from '@arcanea/router-spec';

const spec = loadSpec();
const candidates = resolveTask('world.canon', 'claude-arcanea', spec);
// → overlay uses this ordered list to annotate its agents with model suggestions
```

## What each overlay repo needs to do in Phase 2b

| Overlay | Action |
|---|---|
| `oh-my-arcanea` | Add `manifest.yaml`. Ensure `surface: oh-my-arcanea` exists in router-spec. Verify install.sh is idempotent and prints per-action. |
| `claude-arcanea` | Same. Surface: `claude-arcanea`. |
| `codex-arcanea` | Same. Surface: `codex-arcanea` (ADD to router-spec). |
| `gemini-arcanea` | Same. Surface: `gemini-arcanea` (ADD to router-spec). |
| `claude-codex-gemini-opencode-settings` | Update `install.sh` to `curl | bash` pattern with 4 overlay manifests. Idempotent, prints summary. |

## Surfaces to add to router-spec (Phase 2b)

`codex-arcanea` and `gemini-arcanea` surfaces are not yet declared in `packages/router-spec/models.yaml`. Add them:

```yaml
surfaces:
  codex-arcanea:
    description: Codex CLI overlay. BYOK (OpenAI key) first.
    prefer: byok
    authContext: [byok]
  gemini-arcanea:
    description: Gemini CLI overlay. BYOK (Google key) first, multimodal-leaning.
    prefer: byok
    authContext: [byok]
```

## What we learned from 21st.dev / 1code.dev

**Borrow:**
- Declarative manifest shape (name, install, preview, deps).
- `curl | bash` install pipeline as first-class artifact.
- Agent-readable `AGENTS.md` / `llms.txt` at repo root.

**Don't borrow:**
- Their visual language (shadcn-generic).
- Paid premium tiers — AMCAS stays OSS.
- Component-library scope — we are routing + overlay infra, not a UI shop.

## Versioning

- Overlays version independently. Breaking changes bump major.
- Router-spec versions separately. Overlays declare compatibility in `dependencies["@arcanea/router-spec"]`.
- The dispatcher (`@arcanea/arcanea-code`) versions independently. Overlays don't depend on it directly — only on the spec.

## Non-goals

- No overlay-to-overlay coupling. Each overlay must be usable standalone.
- No overlay implements model routing — that's the dispatcher + spec.
- No overlay ships its own router-spec copy — always reads the canonical one.
