# VibeVoice Integration Path

Research status: April 2026. Sources linked at the bottom.

## What VibeVoice is

Microsoft's open-source (MIT) long-form multi-speaker TTS, announced
August 2025. Three checkpoints:

| Variant | Size | Purpose |
|---|---|---|
| **VibeVoice-1.5B (TTS)**             | 1.5 B | Current primary TTS path |
| **VibeVoice-0.5B-Streaming**         | 0.5 B | Realtime, ~300 ms first-audio |
| VibeVoice-7B-Large                   | 7 B   | Pulled — HF card now 401s, repurposed to ASR |

Architecture: Qwen2.5-1.5B LLM backbone + sigma-VAE acoustic tokenizer
(3200× downsample @ 24 kHz) + 123M-param DDPM diffusion head. Up to
4 speakers, 90 min, 64K context. EN + ZH only. Ships audible AI
disclosure + imperceptible watermark.

## Conclusion up top

**Do not integrate into the real-time `/api/converse` cascade.**
ElevenLabs Turbo v2.5 at ~100 ms TTFT crushes VibeVoice 1.5B's ~1.0× RTF
for conversation. VibeVoice wins only for long-form, offline/sovereign,
or cheap bulk narration — use it for **Author Studio chapter narration
or Showcase video voiceovers**, not the Presence Room.

That said, three paths exist; pick by use case.

## Option A — Hosted via fal.ai (recommended for long-form TTS)

Endpoint: `https://queue.fal.run/fal-ai/vibevoice`. Auth: `Authorization: Key $FAL_KEY`. Pricing: $0.04 per generated minute (billed 15 s). Supports voice cloning via `speakers[].audio_url`.

Stub to drop into `src/server.mjs`:

```js
async function synthesizeVibeVoice(text, persona) {
  const key = getKey('FAL_KEY');
  if (!key) return null;
  const ref = persona.vibevoiceRef;
  const r = await fetch('https://queue.fal.run/fal-ai/vibevoice', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Key ${key}` },
    body: JSON.stringify({
      script: `Speaker 1: ${text}`,
      speakers: [ ref ? { audio_url: ref } : { preset: 'Frank [EN]' } ],
      cfg_scale: 1.3,
    }),
  });
  if (!r.ok) return null;
  // fal returns a queue_url; poll until COMPLETED, then fetch the audio.url
  const { response_url } = await r.json();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const p = await fetch(response_url, { headers: { authorization: `Key ${key}` } });
    const j = await p.json().catch(() => null);
    if (j?.status === 'COMPLETED' && j.audio?.url) {
      const audio = await fetch(j.audio.url);
      const buf = Buffer.from(await audio.arrayBuffer());
      return { body: buf, mime: 'audio/mpeg' };
    }
    if (j?.status === 'ERROR') return null;
  }
  return null;
}
```

Slot in the cascade **only** if we have a "long-form" persona mode
flag — otherwise ElevenLabs stays king for conversation.

## Option B — Local Python microservice

For users with a 4080/4090-class GPU who want sovereign TTS.

```bash
git clone https://github.com/microsoft/VibeVoice
cd VibeVoice
pip install -e . transformers>=4.46 vllm fastapi uvicorn
# Community wrapper; ~80 LOC — copy from docs/vibevoice-vllm-asr.md
uvicorn serve.app:app --host 127.0.0.1 --port 7801
```

Expected: ~6 GB VRAM for 1.5B BF16, ~3 GB model download, ~8 s cold load.
Request: `{"text": "...", "reference_audio": "path"}` → WAV bytes.

Node-side stub identical to Option A, hitting `http://127.0.0.1:7801/tts`.

**Not worth it for conversation.** 1.0× RTF means a 10-second reply
takes 10 seconds to synthesize. ElevenLabs turbo does 10 seconds of
audio in ~300 ms.

## Option C — Skip (the honest verdict for voice chat)

ElevenLabs Turbo v2.5 dominates on conversational latency. Adding
VibeVoice to `/api/converse` would make Lumina feel worse, not better.

**When to revisit:**
- Long-form Author Studio narration (chapter-length, latency tolerant)
- Showcase videos (batched, post-production)
- Privacy-first sovereign mode (user explicitly wants zero cloud TTS)

Those use cases should live on a separate endpoint (e.g.
`/api/tts/longform`), not in the real-time cascade.

## Pattern worth stealing regardless

VibeVoice accepts a **scripted multi-speaker transcript** as one
generation pass — `"Speaker 1: ... Speaker 2: ..."`. The model
conditions prosody on the full conversation arc instead of resetting
pitch between speakers.

**Application to our stack:** when we ship Guardian-to-Guardian
dialogue (e.g. "Lumina and Shinkami, debate this faction design"), batch
both turns into one synthesize() call rather than sequential per-turn
synthesis. Ports cleanly to ElevenLabs Studio Dialogue API when that
lands, and eliminates unnatural pitch resets between speakers.

## Sources

- https://github.com/microsoft/VibeVoice
- https://huggingface.co/microsoft/VibeVoice-1.5B
- https://fal.ai/models/fal-ai/vibevoice
- https://replicate.com/microsoft/vibevoice
- https://artificialanalysis.ai/text-to-speech/providers/vibe-voice-7b
