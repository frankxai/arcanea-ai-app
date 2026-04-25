# Research Brief — Voice 3.0 Forks + Architecture
**Compiled:** 2026-04-25 | **Author:** Researcher agent | **For:** Frank's overnight Voice Dashboard 3.0 sprint

---

## Executive findings up front

1. **Yume is NOT forkable.** Closed-source freeware ("All rights reserved... prohibitions on modification, distribution, and derivative works"). Despite being the closest behavioral match (Tauri + Claude Code subprocess + multi-window + voice dictation), license blocks it.
2. **There is no perfect voice-assistant base to fork.** Every candidate is either dormant, wrong primitive, or scoped tighter than your need.
3. **Recommended path: compose, don't fork.** Whispering's Tauri 2 + Svelte 5 substrate as a *reference* (MIT), ElevenLabs `ui` Orb component (MIT) for the visual moment, Picovoice Porcupine (Apache-2.0) for wake words. The local agent (port 7777) you write yourself — there's no equivalent worth forking, and your spec is already 80% of the implementation.
4. **For multi-tenant pattern reference:** **LobeChat** (75.6k stars, Apache-2.0). Workspace + persona + theme system is the closest match to your "Arcanea / SIS / FrankX" model.
5. **Wake-word debate settled:** **Picovoice Porcupine.** Free tier, 2026 active development. Node.js + WebAssembly + Rust bindings. "Type the phrase, get a model in seconds" custom training. openWakeWord is dormant (last release Feb 2024) and Python-only.

---

## 1. Tauri voice-assistant base candidates

| Repo | Stars | Last commit | License | Take | Risk |
|---|---|---|---|---|---|
| **EpicenterHQ/epicenter** (Whispering) | 4.5k | Dec 2025 v7.11.0 | MIT | Closest forkable Tauri 2 substrate. Svelte 5 + Bun. Press-shortcut→speak→text-out, multi-OS installers, BYOK Whisper.cpp/Groq/OpenAI/ElevenLabs | Built for dictation. Adding ~70% net-new code. |
| **aofp/yume** | 125 | Apr 2026 v0.27.0 | **PROPRIETARY freeware** | Closest *behavioral* match — Tauri 2.9 + React 19 + Node sidecar via Socket.io + 99 windows + voice dictation + crash recovery + plugin system | License blocks fork. Read for ideas only. |
| **Priler/jarvis** | 2.8k | "outdated" | CC BY-NC-SA 4.0 | Literal "Tauri Jarvis." Rust + Svelte + Vosk STT + Rustpotter wake-word | Dormant + non-commercial. Russian-only. |
| **pickle-com/glass** | 7.5k | Jul 2025 v0.2.4 | GPL-3.0 | Premium "invisible desktop AI" with Cmd+\ activation. 80% of the *vibe* | Electron not Tauri. GPL-3 forces fork open. Hotkey not voice. Stalled. |
| **jamiepine/voicebox** | 23.2k | Apr 2026 v0.4.5 | MIT | Active. Tauri + React + FastAPI + Rust. Whisper STT, 7 TTS engines, waveform UI | Voice *studio* not assistant. Copy components. |
| **openinterpreter/01** | 5.1k | "rapid dev" | AGPL-3.0 | LiveKit + Open Interpreter. Desktop+mobile+ESP32 | AGPL viral. No wake-word. |

**Field read:** No single Tauri voice assistant is fork-cleanly maintained AND matches scope AND has permissive license. **Whispering wins on "closest forkable base" by elimination — but only as reference, not full fork.**

---

## 2. Wake-word / clap libraries

| Lib | License | Browser/Native | Recommended? |
|---|---|---|---|
| **Picovoice Porcupine** | Apache-2.0 | Both — `@picovoice/porcupine-node`, WASM+Web Audio, Rust bindings v2.0+, iOS/Android/RPi/STM32. v4.0 Dec 2025. Free AccessKey. | **YES — primary.** 97%+ accuracy, <1 false alarm/10hr. Custom phrases ("Hey Lumina") trivial. |
| **dscripka/openWakeWord** | Apache-2.0 (code) + CC-BY-NC-SA (models) | Python only | **No.** Last release Feb 2024 — dormant. Models non-commercial. |
| **k2-fsa/sherpa-onnx** | Apache-2.0 | Native multi-platform via ONNX. 12 language bindings inc Node + WASM | Backup if Porcupine bites. Excellent for offline/embedded later. |
| **Rustpotter** | MIT | Rust-native, WASM | Decent third-place if going full Tauri-Rust. |
| **Custom amplitude (current v2)** | n/a | Browser-only | **Replace.** Cannot disambiguate clap from cough/door/keyboard. |

**Decision:** Porcupine + custom keywords "Hey Lumina"/"Hey Jarvis"/"Hey Starlight" + clap as fallback. Run in BOTH layers — daemon for always-on, dashboard's mic for in-session re-summon.

---

## 3. Local-agent / native-bridge architectures

### Pattern A — Tauri commands + sidecar (Sprint 3 target)
- **Reference:** Tauri v2 sidecar docs + Yume's 3-process architecture
- **Mechanism:** Tauri spawns Node sidecar at boot, exposes Rust commands to React frontend, frontend talks to Node sidecar for CLI/fs/MCP
- **Plugins:** `tauri-plugin-global-shortcut`, `tauri-plugin-autostart`, `tauri-plugin-tray` (built-in), `tauri-plugin-stt` + `tauri-plugin-tts` by brenogonzaga

### Pattern B — pure Node localhost daemon + browser dashboard (Sprint 2 target)
- **Reference:** Open Interpreter [01](https://github.com/openinterpreter/01) — browser connects to home-machine server. AGPL-3.
- **Mechanism:** Node HTTP+WS on `localhost:7777`, browser fetches with session token
- **Why fits:** Zero native build complexity. Ships in a weekend.

### Pattern C — Electron with IPC + preload bridge
- **Reference:** Pickle Glass (GPL-3), Cherry Studio (44.3k stars, AGPL-3, Electron Vite + TypeScript)
- **Skip if RAM matters** — Electron baseline ~150MB vs Tauri ~30MB. Wrong call for 16GB Windows.

**Recommendation:** **Pattern B for Sprint 2 (this week), Pattern A for Sprint 3 (Tauri rewrap when ready).**

---

## 4. Multi-tenant / multi-workspace personal-AI dashboards

### LobeChat (75.6k stars, Apache-2.0, Next.js + React + Postgres)
- **Pattern:** Workspace + Project + Pages + Schedule. Multi-user via Better Auth. 505-agent marketplace. Per-agent theme overrides.
- **Take:** Tenant-routing pattern (`/workspace/[id]`), agent submission flow, theme customization API.
- **Closest match to your spec.** Their workspace = your tenant. Their agent = your persona.

### Cherry Studio (44.3k stars, AGPL-3, Electron + TypeScript)
- **Pattern:** 300+ pre-configured assistants, multi-model simultaneous chat, theme gallery
- **Avoid fork — AGPL.** Take: theme registry pattern.

### Big-AGI (enricoros/big-AGI, Apache-2.0)
- **Pattern:** AI Personas + Beam multi-model + on-prem/cloud
- **Take:** Persona system architecture. Beam (multi-model parallel) is unique — could power "ask Lumina + Jarvis + Starlight simultaneously."

**Tenant config schema across all three:**
```yaml
tenant:
  id: arcanea | sis | frankx
  name, color, accent, font-family
  personas: [{id, name, voice_id, system_prompt, color}]
  workflows: [{id, type, command, prompt}]
  runtimes: [{id, command, env}]
  greeting: { text, voice_id, audio_url }
  permissions: [shell, fs, network, mcp]
```

Mirror **LobeChat's workspace router** (`apps/web/[workspaceId]/...`) as the cleanest reference.

---

## 5. Premium activation references

| Reference | Gold | Tech | Fork-ability |
|---|---|---|---|
| **ElevenLabs UI Orb** ([github.com/elevenlabs/ui](https://github.com/elevenlabs/ui)) | 3D animated orb, audio-reactive, custom colors, agent-state. Industry standard. | shadcn/ui registry + Three.js + React. MIT. 2.2k stars. v1.0.0 (Oct 2025). | **Drop-in.** `npx shadcn@latest add https://ui.elevenlabs.io/r/orb.json`. Works with any audio source. |
| **alexanderqchen/orb-ui** | "Simplest voice AI component library for React." Vapi + ElevenLabs ready. | React + Three.js wrapper. | Drop-in alternative. |
| **Sesame Maya/Miles** | Conversation realism — contextual pauses, interruptions, emphasis. Uncanny-valley killer. | 1B Llama-based CSM. Proprietary. Vapi integration. | Cannot fork. Use via Vapi for Sesame voice. |
| **Hume EVI** | Real-time emotional voice, 150ms latency, 2¢/min via Vapi | Hume Octave TTS + emotion model | API only. Best for "Lumina sounds like she cares." |
| **moshehbenavraham/Elevenlabs-Voice-Agent** | "Glassmorphism + ElevenLabs Conv AI + audio viz" — closest matching BR2049 × Liquid Glass aesthetic | React + TS + ElevenLabs SDK | Read-and-borrow scope. |

**For your "neural net visualization":** previous attempt looked bad because force-directed graphs always look Web 2.0. **Replace with audio-reactive shader orb (ElevenLabs UI pattern).** That's the gold standard and matches your aesthetic. Reserve "neural net" frame for Logic Stream backend viz, not activation.

**For TTS greeting:** ElevenLabs (in env) — voice IDs per persona via `packages/arcanea-voice/src/persona.mjs`. Route premium personas through Hume EVI later.

---

## 6. Closest-analog products

| Product | Tech | Nailed | To learn |
|---|---|---|---|
| **friend.com (Avi Schiffmann)** | $99 wearable, always-on mic, app text replies. Companion-emotional. **No open source.** | Branding, simplicity, "always there" | Single domain, single product, single emotional promise. "Sir, the SIS is activating" lives in this lineage. |
| **Limitless Pendant** | Always-listening, server-side transcription, web companion. **Closed.** | Passive listening → structured output | Pattern: voice → daemon archive → Logic Stream → SIS vault. |
| **Rabbit R1** | LAM custom OS, app-orchestration via teach-mode. **Closed**, FantasyFish/AI-Rabbit-R1 attempts open recreation. | Model-as-OS framing | Validates your local-agent design. Voice → intent → tool orchestration IS the product. |
| **Humane Ai Pin** | Cosmos OS, projection display. Failed commercially (HP acquired 2024). | — | Cautionary tale. Hardware-first without ecosystem dies. |
| **Open Interpreter 01** | LiveKit + Open Interpreter + ESP32. AGPL-3. 5.1k stars. | Real client-server architecture | Read LiveKit integration if you want production audio streaming. AGPL means don't fork. |

**The honest pattern:** None of these have "won" — friend is companionship not assistant, Limitless is meeting-notes not action, Rabbit/Humane stalled. **The "JARVIS-class personal AI desktop assistant" is genuinely an open category in April 2026.** Your Voice 3.0, if shipped, is competitive with anyone here.

---

## 7. Concrete fork recommendation

### **Don't fork. Compose.**

**Stack for Sprint 2 (this week, Pattern B):**
- **Local agent (`@arcanea/voice-agent`)**: Write from scratch per spec. 2-3 days. Pure Node + `ws` + `child_process`. ~400 LOC.
- **Wake-word**: Picovoice Porcupine — `@picovoice/porcupine-node`, Apache-2.0, free, Node-native. Replace amplitude detector.
- **Daemon**: Keep current, add Porcupine, route to `localhost:7777` instead of spawning Chromium directly.
- **Orb visualization**: ElevenLabs UI Orb — drop in via `npx shadcn add`. MIT. Replaces "neural net viz that looked bad."
- **TTS**: ElevenLabs (already wired) for greeting + responses.
- **Multi-tenant**: Mirror LobeChat's workspace router pattern. ~1 day.

**Stack for Sprint 3 (next week, Pattern A — premium native):**
- **Tauri shell**: Use Whispering's Tauri 2 + Svelte 5 substrate as *reference* (MIT — read, don't fork). Build own Tauri app from Tauri 2 starter + their patterns.
- **Tauri plugins**: `tauri-plugin-global-shortcut`, `tauri-plugin-autostart`, `tauri-plugin-tray`, brenogonzaga's `tauri-plugin-stt` + `tauri-plugin-tts`.
- **Native sidecar**: Bundle `@arcanea/voice-agent` Node binary as Tauri sidecar.
- **Liquid glass on macOS 26+**: `tauri-plugin-liquid-glass` by hkandala — your aesthetic spec calls for this.

### Migration v2 → v3 (concrete)

1. **Day 1:** Drop in ElevenLabs Orb → replace bad neural-net viz. Wire `/api/voice/greeting` → autoplay on `/room/<persona>` mount. Multi-tenant config skeleton (`apps/web/lib/tenants.ts`). All in browser, no agent yet. **Ship.**
2. **Day 2-3:** Build `@arcanea/voice-agent` Node package. HTTP+WS on 7777. `/health`, `/intent`, `/runtime/:id`, `/workflow/:id`. Token auth via `~/.arcanea/agent-token`.
3. **Day 4:** Replace clap-daemon's amplitude with Porcupine. "Hey Lumina"/"Hey Jarvis"/"Hey Starlight." Daemon POSTs to agent.
4. **Day 5:** Dashboard probes `localhost:7777/health`; conditionally enables agent mode (workflows fire vs copy). Logic Stream subscribes to `WS /events`.
5. **Day 6-7:** Multi-tenant routes `/voice/sis`, `/voice/frankx` with own greetings + personas. Daemon `--tenant` flag.
6. **Sprint 3:** Tauri rewrap with sidecar bundling.

### Risks

- **Porcupine free-tier scope:** Verify "Forever Free" extends to embedded redistribution (you'll embed in customers' machines if you sell). Founder + Founding Circle is fine; check before public launch.
- **ElevenLabs Orb bundle size:** Three.js adds ~600KB. Lazy-load it.
- **Tauri sidecar binary bundling:** Cross-platform Node binary bundling has gotchas (Yume uses `@yao-pkg/pkg` — works but adds CI complexity). Plan 1-2 days tooling debt.

---

## 8. One-paragraph executive summary

There's no single repo to fork — Yume is closed-source, Priler/jarvis is dormant, Glass is GPL-Electron-not-Tauri, openWakeWord is dead. **Compose instead:** Picovoice Porcupine (Apache-2.0, Node + WASM + Rust, free, "type the phrase" custom wake-words) replaces the flaky amplitude detector. ElevenLabs UI Orb component (MIT, drop-in shadcn registry, Three.js audio-reactive) replaces the bad neural-net viz. LobeChat's workspace router (Apache-2.0, 75.6k stars) is the multi-tenant reference. Build `@arcanea/voice-agent` localhost:7777 from scratch — your spec is already 80% of implementation, ~400 LOC of Node. Ship Pattern B (browser dashboard + Node daemon + agent) this week, rewrap as Tauri (using Whispering's MIT Tauri 2 + Svelte 5 patterns as reference, plus official tauri plugins) next week. Sprint 2 ETA: 5-7 days. Confidence: high.

---

## Source files

- [Picovoice Porcupine GitHub](https://github.com/Picovoice/porcupine)
- [openWakeWord (dscripka)](https://github.com/dscripka/openWakeWord)
- [k2-fsa/sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx)
- [Priler/jarvis](https://github.com/Priler/jarvis)
- [pickle-com/glass](https://github.com/pickle-com/glass)
- [aofp/yume](https://github.com/aofp/yume) — closed
- [jamiepine/voicebox](https://github.com/jamiepine/voicebox)
- [EpicenterHQ/epicenter (Whispering)](https://github.com/EpicenterHQ/epicenter)
- [openinterpreter/01](https://github.com/openinterpreter/01)
- [tauri-apps/awesome-tauri](https://github.com/tauri-apps/awesome-tauri)
- [tauri-plugin-liquid-glass](https://github.com/hkandala/tauri-plugin-liquid-glass)
- [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio)
- [lobehub/lobe-chat](https://github.com/lobehub/lobe-chat)
- [enricoros/big-AGI](https://github.com/enricoros/big-AGI)
- [ElevenLabs UI components](https://github.com/elevenlabs/ui)
- [moshehbenavraham/Elevenlabs-Voice-Agent](https://github.com/moshehbenavraham/Elevenlabs-Voice-Agent)
- [Hume EVI docs](https://dev.hume.ai/docs/empathic-voice-interface-evi/overview)
- [Vapi × Sesame](https://vapi.ai/blog/vapi-x-sesame-building-the-future-of-voice-ai-with-sesame)
