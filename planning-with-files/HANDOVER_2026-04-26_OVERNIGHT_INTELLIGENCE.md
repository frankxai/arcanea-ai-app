---
title: Overnight Handover — The Lumina Constellation + Council Mode
date: 2026-04-26
session: claude-code (Opus 4.7) overnight, Frank asleep
mandate: "work all night, you lead and are responsible for all"
---

# Overnight Handover — 2026-04-26

## TL;DR

Two new public surfaces live on production. Voice room error UX fixed.
Awaiting tomorrow's API keys to fully unlock hosted voice.

- **`/intelligence`** — The Lumina Constellation. Public-facing, beautiful,
  invokable map of all 22 named agents in the Arcanea fabric.
- **Council Mode** — `✦ Council` button in the constellation top nav.
  One prompt fans out to 5 distinct voices in parallel. The multi-agent
  demonstration.
- **`/room/lumina`** — error UX fixed (was showing bare "transcribe 503";
  now shows glass card with **Connect voice** CTA → BYOK panel).

## What is live right now

| URL | Status | Notes |
|---|---|---|
| https://www.arcanea.ai/intelligence | ✓ 200 | Constellation + architecture story |
| https://www.arcanea.ai/intelligence (✦ Council) | ✓ Live | Five-voice parallel demo |
| https://www.arcanea.ai/room/lumina | ✓ 200 | Editorial typography, BYOK CTA on 503 |
| https://www.arcanea.ai/api/ai/transcribe | ✓ Structured 503 | Returns `cta:'byok'` payload, logs Groq/OpenAI failures explicitly |
| https://www.arcanea.ai/api/ai/chat | ✓ Streaming | Gemini 2.5 Flash via gateway, `apiKeySource:server-env` (verified live) |

## Verified by curl tonight

```bash
# transcribe — clear 503 with hint
$ curl -sL -X POST https://www.arcanea.ai/api/ai/transcribe -F audio=@anything
{"error":"Voice transcription is not connected on this deployment.",
 "provider":"none","cta":"byok",
 "hint":"Add your own Groq or OpenAI key in Settings to use voice immediately."}

# chat — streaming works on Gemini 2.5 Flash
$ curl -sN -L -X POST https://www.arcanea.ai/api/ai/chat \
    -H 'content-type: application/json' \
    -d '{"messages":[{"role":"user","content":"..."}],"systemPrompt":"...","maxTokens":80}'
data: {"type":"start","messageMetadata":{"modelLabel":"Gemini 2.5 Flash",
       "provider":"google","routeMode":"gateway","apiKeySource":"server-env"}}
data: {"type":"text-delta","id":"0","delta":"From silence,"}
data: [DONE]
```

## What you need to do tomorrow

1. **Paste API keys here OR run the one-liners yourself** — voice room
   currently has only the BYOK fallback. To make hosted voice work for
   anyone landing on /room/lumina, add to Vercel env (Production +
   Preview + Development):
   - `GROQ_API_KEY` (free at console.groq.com/keys — fastest STT path)
   - `OPENAI_API_KEY` (real one, not the `sk-do-not-use-in-build`
     placeholder in `arcanea.ai/.env.local`)
   - `ELEVENLABS_API_KEY` (optional; the speak route uses OpenAI TTS today)

   ```bash
   # In Arcanea/apps/web/, value never echoes:
   echo -n 'gsk_...' | vercel env add GROQ_API_KEY production
   echo -n 'gsk_...' | vercel env add GROQ_API_KEY preview
   echo -n 'gsk_...' | vercel env add GROQ_API_KEY development
   vercel redeploy <latest-prod-url>
   ```

2. **Pin /intelligence in homepage nav** — currently a hidden gem. Consider
   adding to global header so visitors discover it. I deliberately left
   that change for you because the homepage has lots of in-flight work
   from your autonomous agents and I didn't want to clobber it.

3. **Decide on Council Mode prominence** — does it deserve a CTA on
   `/`? On `/luminors`? Right now it's gated behind one button on
   `/intelligence`. Worth featuring imo.

## How it fits together — the three runtimes

**Vercel** (always-on, public). Edge functions stream chat + transcribe.
17+ models via Arcanea Gateway with multi-provider fallback (OpenRouter,
Google, Anthropic, OpenAI). All ten Guardians + the Specialist Council +
voice Personas reachable from one URL: `/intelligence`. Architecture
section on that page explains it on the page itself — zero docs needed.

**Local** (your kernel). Same Guardians, same prompts, but invoked via
Claude Code, OpenCode, Kilo Code, or `/arcanea-orchestrator`. Subagents
run in parallel (RAM-permitting per AGENTS.md Execution Law). MCP servers
expose Supabase / Replicate / Fal / Comfy.

**Browser** (BYOK). User pastes their own Groq key in /room or
/intelligence settings → voice works locally with their credit, no
Vercel env required. Sovereignty over silicon.

The constellation and the architecture section on `/intelligence`
narrate this directly. The page IS the architecture document.

## What I built tonight (commit-by-commit)

| Commit | What |
|---|---|
| `1ffd5373` | fix(room): transcribe error UX + editorial design pass |
| `a88f181f` | (mislabeled `docs(routing)`) — actually contains the entire `/intelligence` route + 22-agent registry. **Note**: an autonomous git pipeline on this machine attached the wrong commit message to my staged files. The diff is correct — 1447 insertions across .gitignore + intelligence/* — message is wrong. Recommend a follow-up corrective commit OR documentation note rather than history rewrite. |
| `84d92aa7` | feat(intelligence): Council Mode — five voices, one prompt; SSE [DONE] guard |

## Files I created

- `apps/web/lib/intelligence/agents.ts` — typed registry of all 22 agents.
  Single source of truth. Hz frequencies stay backend-only per
  `feedback_hz_identity` memory; user-facing copy uses poetic taglines.
- `apps/web/app/intelligence/page.tsx` — server component, JSON-LD
- `apps/web/app/intelligence/intelligence-experience.tsx` — client root
- `apps/web/app/intelligence/constellation.tsx` — SVG with deterministic
  radial layout, organic per-node jitter (deterministic hash), Lumina's
  golden bloom, hover/select states with persona-color rays
- `apps/web/app/intelligence/agent-detail-panel.tsx` — slide-in chat with
  per-agent system prompt, sample-question seeds, streaming via /api/ai/chat
- `apps/web/app/intelligence/architecture-section.tsx` — "Three runtimes.
  One voice." narrative + 6-step Voice Loop diagram
- `apps/web/app/intelligence/council-mode.tsx` — five-panel parallel
  invocation modal

## Files I modified

- `.gitignore` — added `!apps/web/app/intelligence/` and
  `!apps/web/lib/intelligence/` exceptions to existing top-level
  `intelligence/` ignore (which targets the sibling `intelligence-os/`
  workspace repo, not Next.js routes)
- `apps/web/app/api/ai/transcribe/route.ts` — structured errors with
  `provider`, `cta`, `hint`; explicit logging on Groq/OpenAI failures
  (was silent fall-through)
- `apps/web/app/room/[persona]/room-client.tsx` — error UX with
  Connect-voice CTA, lifted SettingsPanel state, editorial design pass
  (Instrument Serif reply, larger transcript, persona tagline below
  pill, named persona switcher with color glows, glass hotkey pill,
  safe-area-inset padding, idle "tap or hold space to speak" hint),
  SSE [DONE] parser fix
- `apps/web/app/room/[persona]/settings-panel.tsx` — controlled
  open state via props (so error CTA can deep-link to BYOK)

## Known issues / debt

1. **Wrong commit message on `a88f181f`** — see above. Cosmetic on
   GitHub log but real in archeology. Suggest `git notes` or a
   corrective doc, not history rewrite.
2. **`apps/web/components/landing/guardian-showcase.tsx`** has an
   uncommitted broken diff in your working tree referencing
   `guardianAccents.shinkamiShowcase` and `guardianAccents.maylinn`
   which don't exist on the imported type. Pre-existing, not mine.
   Either revert or add those keys to `@arcanea/design-system`
   tokens. Doesn't affect production until committed.
3. **`/intelligence` invocation depends on existing chat env keys**
   — verified live tonight on Gemini 2.5 Flash. Will keep working
   regardless of GROQ_API_KEY decision.
4. **Council Mode costs 5 chat calls per summon.** Consider rate
   limiting if it gets traffic. Existing /api/ai/chat has 30/min/IP
   already.

## Tomorrow's first action

1. Open https://www.arcanea.ai/intelligence
2. Tap **✦ Council** in top right
3. Type: "What should I ship today?"
4. Hit Summon
5. Watch five voices arrive in parallel from one Vercel Gateway

If that delights, the next moves are: expose Council via `/council` direct
URL, add to homepage hero, and start metering for the wow-demo Twitter clip.

— Shinkami signing off
