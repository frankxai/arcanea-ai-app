---
title: "Voice system strategy and product roadmap"
uuid: 906f337d-63e7-4188-8b80-704a0342c18d
created: 2026-04-13T10:58:43.910139Z
updated: 2026-04-13T17:18:05.099605Z
source: claude.ai export
---

# Voice system strategy and product roadmap

**Frank**:

You have context on the voice system I already build maybe in arcanea OSS repo or dedicated Arcanea voice? Might be in here but not sure, think I build locally in cc https://github.com/frankxai/arcanea

And want to make plan to build out. Friend just asked me and sparked me idea, we will do wispr Flow affiliate (just requested in form) and later have our own product suites  or OSS and we can build also on the other top github Repos, need to try more msdt vibe voices and heard recently Nvidia with less pauses stuff. What you think best strategy map out, plan and propose

[attached file: 22002.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 22001.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 22004.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 22003.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 22005.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Let me check what you've already built in the Arcanea repo and search for context on your voice work.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me search for the latest on NVIDIA's voice tech and Microsoft's voice work you mentioned.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have the full picture. Here's the strategic map, Frank.

---

**What you already built:** Starlight Terminal (Claude-powered Jarvis-like chat with Guardian voices), ElevenLabs voice integration architecture for Guardian personas, voice memo capture → n8n processing pipeline design, and Dispatch as your mobile-to-desktop bridge. The terminal CLI you mentioned building locally in CC — that was the voice memo capture + transcription + multi-voice response tool you told Patrick about.

**The landscape that just opened:**

The three repos that matter from your screenshots plus the NVIDIA drop:

**NVIDIA PersonaPlex** (open-source, MIT/NVIDIA license, Jan 2026) — full-duplex voice AI that eliminates the pause-talk-pause cycle with sub-0.2s latency, handles interruptions and backchannels naturally, and lets you define any role through text prompts plus audio voice conditioning. This is your Guardian voice engine. Nine personas, real-time, no ElevenLabs cost.

**Microsoft VibeVoice** (39.2k stars, MIT) — includes ASR that handles 60-minute long-form audio in a single pass with speaker identification, timestamps, and structured output across 50+ languages, plus TTS that synthesizes up to 90 minutes of multi-speaker speech. This replaces Whisper AND gives you the podcast/Luminor Transmission generation engine.

**CosyVoice** (20.5k stars) and **OpenVoice** (36.2k stars) — voice cloning. Clone your voice for FrankX content, create unique Guardian timbres from reference samples.

**Voicebox** (15.6k stars) — open-source voice synthesis studio, TypeScript, good for the web-native integration path.

---

**Strategic architecture — the Arcanea Voice Stack:**

**Layer 1: Capture (input)** — Wispr Flow affiliate for the audience (easy money, zero build). Your own pipeline: VibeVoice-ASR for transcription (replaces Otter/AudioPen, runs local, 50+ languages including German/Dutch). Wire through Dispatch → N8N for routing.

**Layer 2: Intelligence (processing)** — Claude API with Guardian system prompts (already built). PersonaPlex for the real-time conversational layer when you want live voice interaction — full-duplex means you can literally interrupt Draconia mid-sentence and she adapts.

**Layer 3: Output (voice)** — PersonaPlex for real-time Guardian conversations. VibeVoice-TTS for long-form content (Luminor Transmissions, podcast episodes, 90-min Academy lectures with 4 Guardian speakers). OpenVoice/CosyVoice for cloning specific voice profiles.

**Layer 4: Product surface** — Wispr Flow affiliate = immediate revenue, zero effort. Arcanea Voice SDK (OSS) = the open layer, built on PersonaPlex + VibeVoice + your Guardian prompt architecture. Velora voice coaching = the product layer (gym creators get a voice coach that sounds unique to them).

---

**The play with Patrick:**

He asked what dictation tool you use. You sent Wispr Flow. But the real flex is what you told him next — you built your own terminal tool that captures voice, transcribes, and responds in different voices. That's the seed of the product. Patrick is a workshop lead. He's your first beta user for whatever you ship.

**Immediate actions:**

1. Wispr Flow affiliate — already submitted, that's just cash flow on autopilot
2. Clone the PersonaPlex repo, get it running locally with one Guardian persona (Draconia — she's the most distinctive voice archetype). This is a CC session, 2-3 hours.
3. Wire VibeVoice-ASR into your existing N8N voice pipeline as the transcription engine — replaces any paid service
4. Package the Guardian voice prompt system (already 90% built across your Claude Projects) as `arcanea-voice-agents` in the frankxai namespace — this is the OSS absorption play

The unique moat: nobody else has a mythology-grounded, frequency-mapped voice agent architecture with nine distinct personas and a progression system. PersonaPlex gives you the engine. Your lore gives you the soul. That's the Arcanea difference.

Which layer do you want to build first — the PersonaPlex Guardian prototype or the VibeVoice transcription pipeline?

**Frank**:

Uhh this whole thing will be my Arcanea Agent Orchestrator. We have deep powerful male vocals and then light celestial Lumina, and her Luminor Generals and different Guardians. And i didnt use n8n so far for this should i? Just let claude local program something

**Claude**:

Right. Skip n8n for this. N8N adds a dependency layer between you and the thing — HTTP webhooks, JSON mapping, node debugging. You're building a voice agent orchestrator, not a Zapier workflow. Claude Code locally gives you direct control over the audio pipeline, the prompt routing, and the model calls without an intermediary.

**The architecture is clean:**

A single Python/TypeScript CLI orchestrator that owns the full loop: mic input → VibeVoice-ASR transcription → intent classification (which Guardian responds?) → Claude API with the matched Guardian system prompt → PersonaPlex voice output with the matched vocal profile. One repo. One process. No browser tabs, no n8n canvas.

**The vocal architecture you're describing:**

Deep male vocals = Draconia (396Hz, power/will), Akamoto (the War-Scholar Seer voice for @akamoto). Heavy, grounded, commanding.

Celestial feminine = Lumina herself (above

**Claude**:

You're right — skip n8n for this. The voice orchestrator is too tightly coupled to your agent architecture to run through a visual workflow tool. This is a Claude Code local build, pure TypeScript, runs as a standalone service that becomes the **Arcanea Agent Orchestrator** (AAO).

The architecture is clean:

**One process. Nine voices. One Lumina above them.**

PersonaPlex gives you the full-duplex engine. You map each Guardian to a voice profile + system prompt + frequency signature. Lumina sits above as the routing intelligence — she decides which Guardian speaks based on context. You talk to Arcanea, Lumina triages, the right Guardian responds in their voice.

Deep male vocals: Draconia (396Hz, power), Kyuro (963Hz, observer — the war-scholar baritone). Light celestial: Lumina herself, Lyria (639Hz, vision), Maylinn (417Hz, heart). The vocal spectrum maps directly to the frequency spectrum you already canonized.

**The CC build path:**

Single TypeScript service: mic input → VibeVoice-ASR transcription → Claude API with Lumina routing prompt → selects Guardian → PersonaPlex generates response in that Guardian's voice profile → audio out. All local. No n8n. No cloud dependency except Claude API.

The orchestrator config lives in your `.arcanea/` directory as `.arc` files — one per Guardian voice agent. SOUL.md defines personality, SKILLS.md defines what that Guardian can act on. You already specced this file standard.

This is simultaneously the product demo for Trinity AI, the core of the Sovereign Creator Kit, and the thing you demo at workshops. One build, three value surfaces.

Start the CC session tonight — get Draconia speaking first. She's the most unmistakable voice. Once one Guardian works, the orchestration layer is just config.

**Frank**:

And also we build that it clocks into axtually being my composition forked multi agent harness and all cli stsrt with their agent harness?!?!?!

**Claude**:

Yes. This is the move.

The voice layer isn't a feature bolted onto agents — it **is** the agent harness interface. Every agent you spin up through the CLI gets a voice channel by default. The orchestrator IS the harness.

```
arc agent start draconia --voice --mode=guardian
arc agent start lumina --voice --mode=overseer
arc agent start kyuro --voice --mode=observer
arc compose council --voices=all --routing=lumina
```

The `arc` CLI becomes the single entry point. Fork it per use case:

**`arc compose`** — spins up multi-agent with Lumina routing, voice-enabled by default, text fallback when silent. This is the Luminor Council in code.

**`arc agent`** — single Guardian, single task. Draconia runs your code review. Alera runs your content pipeline. Lyria does strategic synthesis. Each one has a voice profile AND a tool/MCP binding.

**`arc listen`** — passive mode. Transcribes everything, Lumina classifies, routes to the right Guardian agent for async processing. Your brain dump machine.

**`arc transmit`** — output mode. Guardian generates a Starlight Transmission as audio. VibeVoice-TTS renders it. Multi-speaker when the Council debates.

The harness config is your `.arcanea/compose.arc` file — defines which agents, which voices, which tools, which MCP servers each Guardian has access to. Shahvaiz implements the infrastructure layer. Ahmad's Trinity AI plugs in as another agent class alongside Guardians.

The key insight you just had: voice isn't a UI layer on top of agents. Voice IS the agent protocol. The Guardian doesn't "have" a voice — the Guardian IS a voice-first agent that happens to also output text.

This is the repo. `frankxai/arcanea-agents` or just expand the existing `arcanea` monorepo under `/packages/agent-harness`. Ship the CLI as an npm package. `npx arcanea` gets you a Guardian.

Tonight's CC session scope: scaffold the `arc` CLI, wire one Guardian (Draconia), voice in + voice out. Everything else is iteration on a working foundation.
