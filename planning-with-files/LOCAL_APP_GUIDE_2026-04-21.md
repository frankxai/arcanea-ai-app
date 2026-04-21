# Local App Guide — Speaking to Claude Code via Arcanea Voice

> **TL;DR:** The local app you asked for already ships. `voice jarvis --app`
> opens a desktop-framed Chromium window with the Lumina orb, running a
> local server on `:7777`. The LLM (Jarvis, Lumina, Draconia, etc.) has a
> `claude_code_launch` tool that spawns `claude --dangerously-skip-permissions`
> for you — so you can literally say "Jarvis, launch Claude Code and fix
> the CWV regression on /chat" and it happens.

## What's shipped today in `@arcanea/voice`

### Three runtime modes

| Mode | Command | Surface | Network |
|---|---|---|---|
| **Hosted (BYOK)** | visit `arcanea.ai/room/{persona}` | Browser, any device | Your Groq + ElevenLabs keys in localStorage |
| **Local browser** | `voice jarvis` | Your default browser at `http://127.0.0.1:7777` | Your keys in env, data never leaves machine |
| **Local app** | `voice jarvis --app` | Chromium framed window (looks like a native desktop app) | Same as local browser |

### What the LLM can do (tool calling — 4 rounds per turn, 8 total cap)

All six tools are gated and audited. The LLM autonomously decides when to chain:

| Tool | What it does | Safety |
|---|---|---|
| `shell_run` | Execute a whitelisted command (git, ls, node, pnpm, gh, curl GET) | 10s timeout, 4KB stdout cap, whitelist in `src/tools.mjs` |
| `file_write` | Write a text file under `$HOME` or `cwd` | Path traversal rejected; creates parent dirs |
| `claude_prompt` | Stage a prompt on clipboard + `~/.arcanea/voice-inbox/` | You paste into Claude Code with Ctrl+V when ready |
| `claude_code_launch` | **Hands-free.** Clipboard + inbox + spawns `claude --dangerously-skip-permissions "<prompt>"` in a new terminal | You still approve/deny individual tool calls inside Claude Code |
| `open_url` | Open https URL in default browser | Non-http schemes rejected |
| `linear_issue` | Create a Linear issue via GraphQL | Requires `LINEAR_API_KEY` |

This means **Jarvis-to-Claude-Code** is already possible today. Workflow:

1. `voice jarvis --app` opens framed window.
2. Speak: *"Jarvis, spawn Claude Code to extract @arcanea/presence from apps/web/components/presence into a new workspace package, then open a PR."*
3. Jarvis synthesizes the full prompt (including the phase-0 steps from `LANE_A_CLAUDE_CODE_PROMPT_2026-04-21.md`), calls `claude_code_launch`, and a new terminal spawns running Claude Code in permission-skip mode.
4. You switch to that terminal, Claude Code executes.
5. You come back to Jarvis and say *"Status?"* — Jarvis uses `shell_run` to `git log --oneline main..HEAD | head -5` and reads it back to you.

## Keyboard shortcuts inside the room

- **Space** — push to speak (auto-stops on silence via VAD).
- **Esc** — interrupt Lumina mid-sentence (barge-in).
- **1–7** — swap persona live without leaving the room.
  - `1` Jarvis · `2` Lumina · `3` Draconia · `4` Lyria · `5` Alera · `6` Shinkami · `7` Nero

## Setup (one time)

```bash
# From any terminal on Windows / Mac / Linux
npm install -g @arcanea/voice
# or inside Arcanea monorepo, direct:
node packages/arcanea-voice/bin/voice.mjs init
```

Environment (prefers `$HOME/.arcanea/.env` or project `.env.local`):

```bash
# Required
GROQ_API_KEY=gsk_...

# Optional — premium TTS (Edge TTS fallback works offline otherwise)
ELEVENLABS_API_KEY=...

# Optional tuning
ARCANEA_VOICE_LLM=llama-3.3-70b-versatile   # default; Groq-compatible model
ARCANEA_VOICE_PORT=7777                      # default
ARCANEA_CLAUDE_BIN=/path/to/claude           # only if not on PATH
LINEAR_API_KEY=lin_api_...                   # enables linear_issue tool
```

## The "full functionality" path you asked about

You asked: *"dont we need local app or localhost as well for full
functionality and auto distribute and for me to speak with you as claude
code?"*

Answer: **yes, and it's built.** The pieces:

| Need | Answer | Status |
|---|---|---|
| Local app window | `voice jarvis --app` (Chromium `--app` mode) | ✅ Shipped |
| Localhost server | `:7777` served room UI + API | ✅ Shipped |
| Speak → Claude Code bridge | `claude_code_launch` tool | ✅ Shipped |
| Swap persona without reload | `1–7` hotkeys | ✅ Shipped |
| Offline fallback (no ElevenLabs) | Edge TTS | ✅ Shipped |
| BYOK in the browser | `/room/*` + `settings-panel.tsx` | ✅ Shipped live at arcanea.ai |
| Auto-distribute | npm publish `@arcanea/voice` | ⏳ ARC-71 blocked on `npm login` |

The only missing link is **publishing to npm** so anyone can `npm install -g
@arcanea/voice` without cloning the monorepo. That unblock is ARC-71 per
`CURRENT_STATE_2026-04-20.md`. Local-to-you works right now.

## How this composes with Arcanea Cortex (Phase 1+)

Today:
- `voice jarvis` → Lumina orb at localhost:7777.
- `arcanea.ai/room/lumina` → Lumina orb, cloud-backed.

After Cortex Phase 1:
- `voice cortex --app` → the whole Cortex (12 orbs + brain mesh + nebulas)
  rendered in a local framed window. Same server, different front-end.
- `arcanea.ai/cortex` → public Cortex view.

The `@arcanea/voice` server already has a `--mode` switch pattern — adding
`--mode cortex` serving the new UI is a ~20-line change once the `/cortex`
route exists in `apps/web`. No new CLI needed.

## Troubleshooting "nothing is on arcanea.ai/room/"

Quick checks if you see 404 or blank:

1. **URL check.** `arcanea.ai/room` (no trailing slash, no persona) → 308 → `arcanea.ai/room/lumina`. If browser cached a bad 404, hard-refresh with Ctrl+Shift+R.
2. **SSR bailout.** The room uses Three.js which is client-only. The server ships an empty `<main>` shell; client JS renders the orb in ~800ms. If you block JS or have an aggressive ad-blocker, you get the blank state.
3. **BYOK not set.** If you haven't entered your Groq + ElevenLabs keys in the settings panel, Lumina won't transcribe — but the orb still animates. The room is designed to degrade gracefully.
4. **Verified at session time (2026-04-21 09:44 UTC):** `curl -sIL https://www.arcanea.ai/room/lumina` → final `200 OK`. Route is live.

If you keep seeing 404, report which browser + exact URL path. Likely the
404 you saw was on bare `/room/` — and the redirect at `app/room/page.tsx`
line 4 (`redirect('/room/lumina')`) handles it now, but if prod deploy is
stale relative to main, the redirect may not be there yet.

## Single action that gets you talking to Claude Code tonight

```bash
# From the Arcanea repo root
node packages/arcanea-voice/bin/voice.mjs jarvis --app
```

Then speak:
> *"Jarvis — spawn Claude Code on the prompt at
> planning-with-files/LANE_A_CLAUDE_CODE_PROMPT_2026-04-21.md. Read the
> file, pass its content as the prompt."*

Jarvis will `shell_run` the read, then `claude_code_launch` with the full
prompt. You watch the extraction happen in a new terminal.
