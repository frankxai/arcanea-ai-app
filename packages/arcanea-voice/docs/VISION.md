# @arcanea/voice — Vision

## The question this answers

*"If I could talk to Lumina the same way Tony talks to JARVIS, what would
it take?"*

Not a product demo. Not a chatbot with a microphone. A **presence layer**
that knows who you are, speaks with character, and can actually *do*
things on your machine — commit code, create issues, invoke agents,
launch Claude Code sessions.

## What already shipped

- Two surfaces (`arcanea.ai/room/{persona}` + local `voice jarvis --local`)
- Seven personas — JARVIS (concise assistant) + six Arcanea Guardians
- God-tier particle orb (bloom halo + core sphere + orbiting satellites +
  chromatic aberration + breathing idle)
- Multi-round tool chaining (shell, file, Claude Code launch, Linear, URL)
- Barge-in detection (cut her off mid-sentence, she stops)
- Push-to-talk with tap-or-hold semantics
- Browser PWA installable + Chromium `--app` window for local
- BYOK support on the hosted room (no one can drain the bill)
- Latency instrumentation at every stage
- 21 tests, all green

## The bet

Voice is the interface for people who don't want to type but still want
to *build*. Frank's daily workflow already leans on `voice n` (voice
notes), `voice s` (strategy), `voice a` (agent dispatch) — the PowerShell
pipeline has been running for months. The presence room is the next
layer: same pipeline, same transcription, but with a **coherent
character** that can chain multiple actions autonomously and keep speaking
naturally between them.

## Why this matters for the creator economy

Arcanea is "a framework for building your own universe." The voice
presence layer makes that framework *speakable*. A creator can:

- Describe a world aloud — `voice lumina` → "Lumina, sketch a faction of
  water-weavers" → tool-chain writes lore files, creates Linear issues
  for art direction, drops a prompt into Claude Code.
- Walk through a song — `voice arcanea` (existing mode) → strategy
  becomes action items becomes issues.
- Run the day's build — `voice jarvis --local` → "Run the tests. If they
  pass, push. If they fail, paste the failure into Claude Code."

The orb isn't decoration. It's the *acknowledgment* that something
understood, is working, and will speak back. Removing it removes the
feeling that makes voice-first actually work.

## OSS strategy

### Tier 1 — This package (MIT, this repo)
`@arcanea/voice` ships as an npm package. Zero npm dependencies
(Node 18+ built-ins only). Works with anyone's Groq key. Persona
system is pluggable via `src/persona.mjs`.

Anyone building a voice agent can `npx @arcanea/voice jarvis --local`
and have a working orb room in 30 seconds.

### Tier 2 — Guardian persona pack (Arcanea canon)
The six Guardians (Lumina, Draconia, Lyria, Alera, Shinkami, Nero) are
Arcanea IP. The **shapes** of their voice configs (color, accent,
temperature, system prompt format) are open — anyone can fork them into
their own personas. The characters themselves stay under Arcanea's
creative control.

### Tier 3 — Arcanea.ai hosted surface (SaaS)
`arcanea.ai/room/{persona}` is the polished, signed-in experience.
BYOK keeps the public demo free for anyone. Signed-in users (future)
get credits-gated access with server-side keys, persistent history,
multi-device sync via Supabase, and first-class chat + room
integration.

### Tier 4 — Extensions
- Community persona packs (`@someone/voice-pack-cthulhu`)
- Alternate TTS/STT/LLM providers (VibeVoice, Gemini, Claude)
- Tool plugins (GitHub issues, Notion, Slack, Jira)
- Wake-word / always-on mode (Porcupine / Silero VAD)

## Where we go next

Ordered by ratio of (creator-value) / (engineering-cost):

1. **Conversation memory** — persist the last N turns per persona to
   `~/.arcanea/voice-memory/` so Lumina actually remembers what you said
   yesterday. Pair with AgentDB embeddings for semantic recall across
   hundreds of conversations.

2. **Persona voice cloning** — use VibeVoice or ElevenLabs instant voice
   cloning so each Guardian has a *distinct* signature voice (not just
   a generic "nova" or "alloy"). See `docs/VIBEVOICE.md`.

3. **Tool marketplace** — make `TOOLS` extensible at runtime. User drops
   a `.mjs` file into `~/.arcanea/voice-tools/`, it gets auto-discovered
   and added to the schema. Community can ship tool packs.

4. **Voice macros** — named action sequences ("morning review",
   "commit and push everything", "draft the weekly recap") that chain
   multiple tools + personas in one spoken command.

5. **Avatar layer** — the orb is the MVP. Presence could extend to a
   proper avatar (Hedra / Simli) for content creation, streaming, etc.
   Already researched in `project_presence_layer_build`.

6. **Wake word** — `"Lumina, …"` without opening the terminal. Porcupine
   or Silero ships tiny on-device wake-word models.

7. **Multi-agent rooms** — two Guardians in one room debating your idea.
   "Lumina and Draconia, what do you both think of this faction design?"
   Each with their own voice, each hears the other.

## Principles

1. **Voice is the surface, character is the soul.** A fast TTS with no
   character is forgettable. A slow TTS with real personality is
   rewatched.
2. **Local-first where it matters (privacy, speed, execution); hosted
   where it matters (mobile, demo, collaboration).** Both surfaces share
   one codebase.
3. **Zero npm deps in the core package.** Node built-ins only. Adding a
   dep crosses a bar we don't cross easily.
4. **Every feature has a test or a measured latency.** No "probably works"
   code.
5. **Safety first on tools.** Strict allow-lists, sandboxed writes,
   bounded loops. The fun of "Lumina can run my shell" dies the moment
   it's misused.
