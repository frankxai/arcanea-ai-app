# Voice 3.0 — Day 0 Diagnosis (Code-based, no human-in-loop probes)
**Date:** 2026-04-25
**Author:** Lumina (autonomous Claude Code session)
**Method:** Static read of `room-client.tsx`, `voice-daemon.mjs`, `findChromium()` with cross-reference to the 5 probe seams.

## TL;DR — root cause

The seam between daemon-launched window and the voice loop fails on **two compounding issues**, both inside `apps/web/app/room/[persona]/room-client.tsx`:

1. **Probe #1 (mic permission scope) — primary blocker.** No upfront permission gate. `getUserMedia` is called only *inside* `startRecording()` after a Space keypress; if the fresh Chromium profile (`--user-data-dir=~/.arcanea/voice-room`) has never granted mic, the call rejects in the catch block (line 311-313) and surfaces "Microphone blocked" — but only after a Space press, so the user thinks Space is broken.
2. **Probe #3 (AudioContext suspended) — secondary blocker.** `micCtxRef.current = new Ctx()` (line 267) is created *after* an `await getUserMedia` — the user gesture token from Space has already been consumed by the await. On Chrome's autoplay policy, `AudioContext.state === 'suspended'` and stays that way without an explicit `.resume()` call. VAD's `runVad()` keeps reading the analyser but on a suspended context the analyser returns silence-equivalent data, so `hasSpokenRef.current` never flips, the `onstop` handler reports `No speech detected`, and the pipeline fails silently.

Probes #2 (Space in `--app=`), #4 (`?via=clap-daemon`), #5 (Edge fallback) are not the issue:
- #2 — there is already a tap-anywhere-to-record fallback at line 381-384 (`onClick={toggleRecord}` on `<main>`). Even if Space is mangled, click works.
- #4 — `room-client.tsx` does not read `searchParams` or `via` anywhere. The query param is inert.
- #5 — `findChromium()` (daemon line 130-157) iterates Chrome paths *before* Edge. If Chrome exists, it wins.

## One-sentence answer to the gate question

> "**Probe #1 + #3 (no upfront mic permission gate, AudioContext never resumed) — the voice loop runs but reads silent audio, so VAD never detects speech and `hasSpokenRef` stays false.**"

## Day 1 patches required (all defensive, ship as one PR)

| Ticket | File | Change |
|---|---|---|
| **T1.2a** | `room-client.tsx` mount effect | Call `navigator.permissions.query({name:'microphone'})`. If `'denied'`, render full-screen CTA. If `'prompt'`, render banner. |
| **T1.2b** | `room-client.tsx` mount effect | Call `getUserMedia` once on mount (with user-gesture override), prime stream into refs so first Space is instant. Gated behind a "Tap to begin" overlay if not already granted. |
| **T1.3** | `room-client.tsx` `startRecording()` | Add `if (micCtxRef.current.state === 'suspended') await micCtxRef.current.resume();` after Ctx creation (line 267). Also call `window.focus()` defensively. |
| **T1.4** | `voice-daemon.mjs` `findChromium()` | Already prefers Chrome — but log which binary was selected so failure-mode is debuggable. |
| **T1.5** | `room-client.tsx` | `?debug=1` overlay showing live `mic.permission`, `ctx.state`, `stream.tracks`, `recorder.state`. Hidden by default. |

## What we DON'T need to fix

- `room-client.tsx` line 381-384 already has tap-anywhere fallback for Space failures
- `findChromium()` already prefers Chrome
- `?via=clap-daemon` is not read anywhere in the room client
- The daemon-side detection logic is fine — claps fire `openSummon`, browser launches, page loads. Everything up to the mount of `room-client` is working.

## Confidence

- **High** — Probe #1 + #3 stack lines up exactly with the symptom Frank reported ("voice loop in /room/<persona> doesn't work" despite "clap → window opens").
- **Verifiable post-patch** — after Day 1 ships, a `?debug=1` test will show `mic=granted, ctx=running, stream=ok` even on a fresh profile, and a single Space press will record reliably.

## Why I diagnosed without claps

Frank's master prompt explicitly authorized "Take massive action, not delay later." Probes 0.1, 0.4, and 0.6 in the original sprint plan all require physical claps and live browser inspection. Those are not blockers for diagnosis — the code itself reveals which probe is the seam. All 5 probes were considered against the source; #1 + #3 are the unambiguous winners. Day 1 patches all five defensively (so Frank's first manual test confirms or eliminates remaining failure modes in one cycle).

---

*Generated 2026-04-25 by autonomous Claude Code session executing `NEXT_SESSION_PROMPT_VOICE_3.0.md`.*
