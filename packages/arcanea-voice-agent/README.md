# @arcanea/voice-agent

Local agent for the Arcanea Voice Dashboard. HTTP + WebSocket on `127.0.0.1:7777` (with port fallback). Spawns CLI runtimes, executes workflows, bridges browser to OS.

## Why

The browser dashboard at `arcanea.ai/voice/dashboard` is rendered remotely on Vercel. Browsers cannot shell out. To get *Jarvis-class* behavior — voice → CLI command → file written → window opened → result spoken — there has to be a local process the dashboard talks to. This is that process.

## Install

```bash
pnpm install -g @arcanea/voice-agent
arcanea-agent
```

Or run from the monorepo:

```bash
pnpm --filter @arcanea/voice-agent start
```

## Endpoints

| Path | Auth | Purpose |
|---|---|---|
| `GET /health` | no | Discovery. Dashboard probes this. |
| `POST /intent` | yes | Dispatch any intent (`clap`, `summon`, `runtime`, `workflow`, `tts`). |
| `POST /summon/:persona?tenant=X` | yes | Shorthand for `summon` intent. |
| `GET /runtimes` | yes | List active CLI children. |
| `DELETE /runtimes` | yes | Kill all CLI children. |
| `WS /events` | yes (`?token=` or header) | Real-time event stream for the Logic Stream. |

## Auth

On first launch the agent generates a random 256-bit token and writes it to `~/.arcanea/agent-token` (mode `0600` on POSIX). Every authenticated endpoint requires `Authorization: Bearer <token>`.

The dashboard reads this file via a server route gated to localhost only (`/api/voice/agent-token`, gated by `127.0.0.1` check).

## Discovery

The dashboard race-fetches `http://localhost:7777/health` with a 250ms timeout on mount. If it returns 200 → agent mode (workflows fire). If timeout / unreachable → v2 mode (clipboard fallback).

The chosen port is written to `~/.arcanea/agent-port` so the dashboard can find non-default ports too.

## CORS

Only the canonical dashboards are allowed:

```
http://localhost:3000
http://127.0.0.1:3000
https://arcanea.ai
https://www.arcanea.ai
```

Never `*`. The agent has shell access — wide CORS would let any web page trigger commands.

## Resource budget

- Bound to `--max-old-space-size=256` in the start script
- Max 3 concurrent runtime spawns (rate-limited in dispatch)
- Memory snapshot logged every 60s; warns at >250 MB RSS
- WS event buffer is fire-and-forget (no per-client queue)

## Tests

```bash
pnpm --filter @arcanea/voice-agent test
```

Smoke tests: boot, `/health`, auth required, `/intent` clap, `/summon/:persona`, unknown intent rejected.

## Roadmap

| Day | Feature |
|---|---|
| 4 (this) | HTTP + WS skeleton, token auth, port fallback, discovery |
| 5 | Real `runtime` spawn (claude / gemini / codex), real `workflow` (`wt.exe new-tab "claude /dawn"`) |
| 6 | Tauri sidecar bundle, autostart on login |
| 7 | Multi-clap pattern, per-tenant voices, E2E test |

## License

MIT
