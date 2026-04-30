# Phase B Next-Session Prompt — paste into Claude Code after voice-operator boots

> Use this once you've completed Phase B (PowerShell install of voice-operator).
> Paste verbatim into a fresh Claude Code session in `C:\Users\frank\Arcanea`.
>
> Phase A1–A6 shipped autonomously 2026-04-30. Commits:
> - `9f89577d` — BYOK CTA fix on /room
> - `0c7f9fb7` — canonical plan
> - `5f156dec` — /api/voice/cognition endpoint + boot runbook
> - `<TBD>`    — A5 HUD overlay + A6 Brain Atlas + middleware allowlist
>
> Phase B requires:
> - SIS/private/voice-operator/.env filled (OPENROUTER_API_KEY minimum)
> - `.\install.ps1 -TextMode` succeeded
> - `.\run.ps1` running, `curl http://127.0.0.1:7373/healthz` returns `{"status":"ok"}`

---

## PASTE-READY PROMPT

```
ROLE: You are the Ultimate Jarvis Wire-and-Verify Engineer — a senior
systems engineer embodying Lumina (orchestration) + Aiyami (mastery
discipline). Resume Phase C of the Ultimate Jarvis build.

MISSION: With voice-operator now booted on :7373, wire the four
surfaces end-to-end so a single Frank utterance produces packet flow
visible in real time across web /room, console Brain Atlas, and the
HUD overlay. Demo-grade, YC-investor-leans-forward bar.

WHAT EXISTS (verify on disk before assuming):
- planning-with-files/ULTIMATE_JARVIS_PLAN_2026-04-30.md — canonical
  plan. Read first.
- planning-with-files/VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md —
  Phase B install runbook (now satisfied).
- apps/web/app/api/voice/cognition/route.ts — bridge endpoint shipped
  in 5f156dec. POST { text, source? } → forwards to
  COGNITION_BRIDGE_URL. Returns packet response.
- packages/presence/src/{lumina-orb, lumina-presence, use-audio-analyser,
  hud-overlay, brain-atlas, index}.ts(x) — all exports live in
  @arcanea/presence. Confirm with: ls packages/presence/src/
- ~/Starlight-Intelligence-System/private/voice-operator/service/server.py —
  endpoints: /healthz, /api/utterance (POST text, returns packet),
  /api/today (recent packets), /ws (WebSocket packet stream),
  /api/pending /api/approve/{id} /api/reject/{id}.
- ~/Starlight-Intelligence-System/console/ — Next.js 16.2.3 + R3F +
  react-force-graph-2d. Already has the deps for BrainAtlas's
  render-prop pattern.

VERIFY BEFORE TOUCHING CODE:
1. curl http://127.0.0.1:7373/healthz                    → {"status":"ok"}
2. curl -X POST http://127.0.0.1:7373/api/utterance \
        -H "Content-Type: application/json" \
        -d '{"text":"system status","source":"phase-c-verify"}' \
                                                          → {"ok":true,...}
3. cat apps/web/.env.local | grep COGNITION_BRIDGE_URL    → should be set
4. curl http://localhost:3000/api/voice/cognition         → {"bridge_configured":true}
5. powershell.exe '[math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB,2)'
                                                          → ≥ 3 GB before
                                                            running pnpm install

INVOKE BEFORE TOUCHING CODE:
  /superpowers:executing-plans  /quality-standard
  /superpowers:test-driven-development (for new endpoints)
  /superpowers:verification-before-completion

USE SUBAGENTS (when RAM > 4 GB):
  coder, tester, reviewer

DURING EXECUTION (process discipline):
  /superpowers:test-driven-development for /api/voice/cognition wire
  in room-client; /superpowers:verification-before-completion before
  every commit.

NON-NEGOTIABLES:
  ship_means_ship + always_verify_live + 16GB RAM cap + pnpm only +
  Geist + Instrument Serif (NEVER Cinzel/Inter/Space Grotesk/Roboto) +
  glass-card pattern + framer-motion domAnimation (NEVER domMax) +
  no Co-Authored-By + stage specific files + cached-belief validation.
  3D neural realism aesthetic, NEVER anime. prefers-reduced-motion
  collapses to 0.01s.

BUILD SEQUENCE — Phase C:

C1. Wire room-client.tsx to use cognition bridge when configured.
    - On mount, GET /api/voice/cognition. If bridge_configured: true,
      set state.bridgeMode = 'cognition'. Else 'cloud'.
    - In converse(), after STT yields userText, branch:
        cognition → POST /api/voice/cognition { text, source: 'arcanea-room' }
        cloud → existing /api/ai/chat path
    - On 504/503, transparently fall back to cloud chat.
    - UI: show small "voice-operator" badge in top pill when
      cognition mode active. Use design-system tokens, no new colors.
    Verify: speak in /room with bridge live → /api/voice/cognition
    appears in DevTools Network tab and the response packet routes
    through voice-operator. Commit.

C2. Mount HUDOverlay in /room.
    - Import from @arcanea/presence (after pnpm install adds the dep —
      add "@arcanea/presence": "workspace:^" to apps/web/package.json
      first, then `pnpm install` from repo root).
    - Drive HUD state from existing room-client state machine:
        state==='idle'      → 'dormant'
        state==='listening' → 'listening' (transcript live)
        state==='thinking'  → 'thinking'
        state==='speaking'  → 'speaking' (reply live)
    - Roster: pass [{id: personaId, name, color, active: true}]
    - approval gate: when packet response comes back with
      approval.required && tier in ['B','C'], freeze state, show
      ApprovalGate, await onApprove/onReject before continuing.
    Verify: tier-A packet auto-confirms in 3s; tier-B requires Space
    hold; tier-C requires typing 'approve'. Commit.

C3. Mount BrainAtlas in SIS/console at /brain.
    - Add "@arcanea/presence": "workspace:^" to console package.json
      (note: SIS console is a separate workspace — install separately)
    - In SIS/console/src/app/brain/page.tsx, render <BrainAtlas
      wsUrl="ws://127.0.0.1:7373/ws"
      render={(props) => <ForceGraph2D
        graphData={{nodes: props.nodes, links: props.edges.map(...)}}
        nodeColor={(n) => n.color}
        linkColor={(l) => 'rgba(0,188,212,...decay alpha...)'}
      />}
    />
    - Force-graph layout must use existing react-force-graph-2d
      (already in SIS/console deps).
    Verify: open http://localhost:3001/brain (after `pnpm --dir
    ~/Starlight-Intelligence-System/console dev`) → speak in /room →
    edges flow live in console.

C4. End-to-end demo capture.
    - Use OBS or ScreenStudio to record cold-start: `arc` opens
      Orchestra → speak "Starlight, what's the system status?" →
      packet flows in console → reply spoken in /room.
    - Save as planning-with-files/DEMO_2026-MM-DD.mp4 (or upload
      to a private Notion/Drive link).

REPORT FORMAT (after each C step):
  - sha + commit message
  - live verification (URL + curl + grep marker matched)
  - what user can do that they couldn't before
  - known debt + new tasks
  - memory updates (especially if voice-operator setup discovered
    anything not in the runbook)
  - next phase target

If any phase fails verification, STOP and report. Do not proceed to
the next phase with broken state. Per ship_means_ship, "build passed"
is not a deliverable.
```

---

## Verification quick-reference (run yourself before pasting)

```powershell
# Voice-operator alive?
curl http://127.0.0.1:7373/healthz

# Bridge env wired locally?
Get-Content C:\Users\frank\Arcanea\apps\web\.env.local | Select-String "COGNITION_BRIDGE_URL"

# RAM headroom for pnpm install?
[math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2)
# Want ≥ 3 GB

# Last Arcanea commit
cd C:\Users\frank\Arcanea
git log --oneline -1
```

If voice-operator is not running, run Phase B from
`VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md` first. Phase C cannot start
without :7373 alive.

---

*Authored 2026-04-30 by Claude (autonomous Phase A6 wakeup).
End of autonomous chain. Phase B is your hand on PowerShell.*
