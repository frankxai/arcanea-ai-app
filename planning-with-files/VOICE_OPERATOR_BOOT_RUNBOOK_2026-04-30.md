# Voice Operator Boot Runbook — Phase B (Frank's hand)

> Companion to `ULTIMATE_JARVIS_PLAN_2026-04-30.md`. This doc is the exact
> PowerShell sequence to bring up Starlight Voice Operator on :7373.
>
> **Time budget:** ~30 minutes including Whisper download (TextMode skips it).
> **Prereq:** Windows 11, Python available via winget, Frank's machine.

---

## Decision tree — which mode

| You have... | Use mode | What you get |
|---|---|---|
| Just `OPENROUTER_API_KEY` | `-TextMode` | Cognition router live (LLM routing across CLIs); no wake-word, no STT, no TTS |
| OPENROUTER + ELEVENLABS | full | Cognition + premium voice output. Still no wake-word until Picovoice |
| OPENROUTER + ELEVENLABS + PICOVOICE + Porcupine `.ppn` | full | Wake-word "Starlight" → STT → cognition → TTS. The Iron Man loop. |

**Recommendation tonight:** start with `-TextMode`. Validates the brain. Voice mode is a 30-min upgrade later when ElevenLabs/Picovoice keys are in hand.

---

## Step 1 — Fill `.env`

```powershell
cd C:\Users\frank\Starlight-Intelligence-System\private\voice-operator
Copy-Item .env.template .env
notepad .env
```

In `notepad`, paste at minimum:

```
OPENROUTER_API_KEY=sk-or-v1-...                   # Frank already has this
VOICE_OPERATOR_AUTH_TOKEN=                        # leave empty for loopback-only
```

Optional (for full mode):

```
ANTHROPIC_API_KEY=sk-ant-...                      # if available
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=pFZP5JQG7iQjIQuC4Bku          # Lumina default
PICOVOICE_ACCESS_KEY=...
```

Save, close notepad.

---

## Step 2 — Install (TextMode)

```powershell
cd C:\Users\frank\Starlight-Intelligence-System\private\voice-operator
.\install.ps1 -TextMode
```

What this does:
1. Verifies Python 3.11+ (installs via winget if missing)
2. Installs `uv` if missing
3. Creates `.venv\` and runs `uv pip install -e .` for the dep tree
4. Validates `.env` cognition keys present (OPENROUTER or ANTHROPIC)
5. **Skips:** Picovoice download, Whisper model fetch (~3GB), TTS smoke test

Expected output ends with:

```
==> All checks passed. Run .\run.ps1 to start.
```

If install fails, it prints the failure and exits non-zero. Re-run after fixing.

---

## Step 3 — Boot the service

```powershell
.\run.ps1
```

What this does:
- Starts uvicorn on `127.0.0.1:7373`
- Lifespan loads config + builds TextSession (cognition router only in TextMode)
- Logs `Server lifespan started`
- Stays running in this terminal

Open a new PowerShell window for Step 4.

---

## Step 4 — Verify the brain is alive

In a **new** PowerShell window:

```powershell
# 4a. Health probe (loopback, no auth)
curl http://127.0.0.1:7373/healthz
# expected: {"status":"ok"}

# 4b. Synthetic utterance — cognition round-trip
curl -X POST http://127.0.0.1:7373/api/utterance `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"What is the system status?\",\"source\":\"runbook\"}'
# expected: {"ok":true,"spoken_update":"...","packet":{...},"routing":{...}}

# 4c. Today's packets log
curl http://127.0.0.1:7373/api/today
# expected: {"packets":[{...}],"count":1}  (count=1 because of 4b)
```

If 4a fails — service didn't bind. Check the run.ps1 terminal for traceback.

If 4b fails with auth error — `VOICE_OPERATOR_AUTH_TOKEN` is set in .env but you're hitting non-loopback. Hit `127.0.0.1` not `localhost`.

If 4b fails with cognition error — model API key is wrong or out of credits. Check the run.ps1 terminal for the upstream error.

---

## Step 5 — Wire arcanea.ai/room locally

The cognition bridge endpoint already exists on prod (commit lands tonight). To activate it for **your own browser** without exposing the bridge publicly:

```powershell
# In Arcanea repo
cd C:\Users\frank\Arcanea
notepad apps\web\.env.local
```

Add:

```
COGNITION_BRIDGE_URL=http://127.0.0.1:7373/api/utterance
# VOICE_OPERATOR_AUTH_TOKEN=  # only if you set one in voice-operator's .env
```

Save. Then:

```powershell
pnpm --dir apps/web dev
```

Visit `http://localhost:3000/api/voice/cognition` (GET) — should return:

```json
{ "bridge_configured": true, "hint": "POST { text, source?, persona? }..." }
```

POST a test utterance:

```powershell
curl -X POST http://localhost:3000/api/voice/cognition `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"Status check from the room.\"}'
```

Expected: `{"text": "...", "ok": true, "provider": "voice-operator", "packet_id": "..."}`.

That's the loop. Local /room → /api/voice/cognition → :7373 → packet routed → reply back.

---

## Step 6 — Stop / restart

```powershell
# Stop
.\stop.ps1

# Restart after .env change
.\run.ps1
```

---

## Troubleshooting

### Symptom: `install.ps1` says "Python 3.11+ not found"
Open a new PowerShell after winget installs Python. PATH may not refresh in the current shell.

### Symptom: `.\run.ps1` exits immediately
Check `.env` is filled (Step 1). The validator in `install.ps1` ran at install but `run.ps1` re-reads on boot.

### Symptom: cognition returns gibberish
Wrong model in `OPENROUTER_API_KEY`'s default route. Set `OPENROUTER_DEFAULT_MODEL=anthropic/claude-sonnet-4-20250514` in .env.

### Symptom: port :7373 already in use
```powershell
Get-NetTCPConnection -LocalPort 7373 | Select-Object OwningProcess
Stop-Process -Id <pid> -Force
```

### Symptom: `arcanea.ai/room` (cloud) doesn't use the bridge
By design. `COGNITION_BRIDGE_URL` is local-only. Cloud /room continues using AI Gateway via `/api/ai/chat`. The bridge is for **your machine** running the local dev server.

If you want production cloud /room to use voice-operator, you need a public tunnel:

```powershell
# Install Cloudflare tunnel
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://127.0.0.1:7373
# returns a https://<random>.trycloudflare.com URL
# set that in Vercel env COGNITION_BRIDGE_URL
# also set VOICE_OPERATOR_AUTH_TOKEN in BOTH local .env and Vercel
```

This is Phase D territory, not Phase B. Skip unless demoing remote.

---

## Upgrading TextMode → Full Voice

Later, when ElevenLabs and Picovoice keys are ready:

```powershell
cd C:\Users\frank\Starlight-Intelligence-System\private\voice-operator
notepad .env  # add ELEVENLABS_API_KEY, PICOVOICE_ACCESS_KEY
# place Starlight_en_windows_<id>.ppn at models\porcupine\Starlight.ppn
.\install.ps1  # full mode this time, no -TextMode
.\run.ps1
```

Voice loop now active: clap or say "Starlight" → STT → cognition → TTS.

---

## Acceptance criteria — Phase B passes when

- [ ] `curl http://127.0.0.1:7373/healthz` returns `{"status":"ok"}`
- [ ] `curl -X POST :7373/api/utterance` with a test utterance returns `{"ok": true, ...}` with a non-empty `spoken_update`
- [ ] `apps/web/.env.local` contains `COGNITION_BRIDGE_URL`
- [ ] `pnpm --dir apps/web dev` is running and `localhost:3000/api/voice/cognition` GET returns `{"bridge_configured": true}`
- [ ] POST test utterance via apps/web bridge returns voice-operator's packet response

When all five tick, Phase C (Brain Atlas + persona orchestra) unlocks.

---

*Authored 2026-04-30 by Claude (autonomous Phase A4).*
