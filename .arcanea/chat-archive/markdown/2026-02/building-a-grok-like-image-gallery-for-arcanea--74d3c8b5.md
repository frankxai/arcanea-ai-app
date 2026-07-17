---
title: "Building a Grok-like image gallery for Arcanea"
uuid: 74d3c8b5-5ebc-4755-943b-8cb11885789d
created: 2026-02-09T22:46:36.734895Z
updated: 2026-02-13T10:48:18.257147Z
source: claude.ai export
---

# Building a Grok-like image gallery for Arcanea

**Frank**:

Bro i just realize i need 1o1 grok, can you clone it is there some repo who clones grok mobile and desktop? Grok.com. easy animaze button and autoplay. How?

[attached file: 1770677161625.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1770677182520.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1770677184318.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1770677185501.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1770677187017.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank, I see what you're working with — you've got an incredible Arcanea Anime Legends visual library building up in Grok's Imagine feature, and you want to replicate that experience (the easy image generation, favorites, video/animate button, autoplay) in your own platform.

Let me be real about a few things:

**There's no official open-source Grok clone repo.** xAI hasn't open-sourced the Grok web/mobile app UI. However, what you're really after is replicable — it's essentially an AI image gallery with generation, favoriting, animation, and autoplay features.

Here's how I'd approach building this for your Arcanea ecosystem:

**The fastest path** would be a Next.js app (your existing stack) that combines an image generation API (Flux, DALL-E, or Stable Diffusion via Replicate/fal.ai), a gallery UI with masonry grid layout similar to what Grok uses, a favorites system backed by Supabase, and video/animation via Runway or Kling API for the "Animate" button.

**For the Grok-like UX specifically**, the key components are the masonry image grid with lazy loading, long-press context menu (Video, Favorite, Download, Share — exactly what you showed in screenshots 4 & 5), an inline prompt bar ("Type to imagine"), and autoplay for generated videos in the feed.

Want me to scaffold this out as a working Next.js prototype? I can build the frontend shell with the gallery grid, prompt input, favorites system, and placeholder hooks for your preferred image generation API. That would give you the "Arcanea Anime Legends Creator Studio" you can deploy on Vercel immediately.

What image generation API are you planning to use — or do you want me to wire it up to multiple options?

**Frank**:

Invent also for Arcanea creative companion Evi. You can also choose her in Arcanea chat as a creative guide, and I imagine how OSS we extend and build jarvis lile experiences give her voice and depth as character, both her and Arcanea, Lumina and others

**Claude**:

Frank, this is a massive vision — let me synthesize what you're building and then let's architect it.

You're essentially creating **the Arcanea Creative Companion Platform** — where Evi is your Jarvis-equivalent, a creative AI guide living inside the Arcanea universe who helps creators generate art, music, stories, and more. She's not just a chatbot — she's a *character* with lore, voice, personality, and depth, alongside Lumina, the Guardians, and the Godbeasts.

Let me map this out properly and build you the foundational architecture.
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

Here's the full **Arcanea Creative Companion Platform** — three tabs working together:

**Imagine Tab** (Grok-clone UX): Masonry gallery grid with prompt bar, category filters, favorites, animate button on every image, right-click context menu (Video/Favorite/Download/Share/Ask Evi), and generation simulation.

**Chat Tab** (Evi + the Arcanea Cast): Character selection screen where you choose your creative guide — Evi (creative companion), Lumina (cosmic intelligence), Lyssandria (arcane wisdom), Leyla (harmony/music), or Draconia (fire/transformation). Each has unique personality, greeting, voice style, and system prompts ready for real API integration.

**Studio Tab**: Creator tools dashboard (Image Generator, Video Animator, Frequency Composer, Lore Writer, Character Designer, World Builder) with Evi quick-access.

For the OSS Jarvis-like experience with real voice, the next moves would be wiring Evi's `systemPrompt` to the Anthropic API (already structured for it), adding ElevenLabs or OpenAI TTS for each character's unique voice, connecting image generation via Replicate/fal.ai to the Imagine tab, and adding Web Speech API for voice input so you can literally talk to Evi. The character database is architected so you can drop in any Guardian or Godbeast as a chat companion — the whole Arcanea pantheon becomes accessible creative guides.

**Frank**:

Next js and vercel ai sdl

**Claude**:

Let me build this properly with Next.js App Router and the Vercel AI SDK so Evi and the Arcanea characters actually talk back through real streaming AI responses.
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


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now the main page component with all three tabs:
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


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's your full **Arcanea Creative Companion** — proper Next.js 14 + Vercel AI SDK architecture, ready to deploy.

**What's in the box (1,318 lines of production code):**

**`/api/chat/route.ts`** — Vercel AI SDK `streamText` endpoint with character-aware system prompts. Each character (Evi, Lumina, Lyssandria, Leyla, Draconia) gets their full personality, Arcanea lore, and communication style injected. Streams responses through Claude Sonnet (swappable to OpenAI with one line).

**`/api/imagine/route.ts`** — Pluggable image generation with Arcanea style prefixes auto-applied to prompts. Uncomment your provider: Replicate (Flux), fal.ai, or DALL-E 3.

**`useArcanaeChat.ts`** — Custom hook wrapping Vercel AI SDK's `useChat` with character switching, greeting messages, quick actions, and the `characterId` body param that routes to the right system prompt.

**`characters.ts`** — 318 lines of deep character definitions with full `ARCANEA_LORE` constant embedded in every system prompt. Evi knows the Guardians personally, Lumina speaks across timelines, Lyssandria tests you before sharing deeper truths.

**To deploy:**
```bash
tar -xzf arcanea-creative-companion.tar.gz
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
vercel --prod
```

**The Jarvis path forward** — the README has code snippets for adding ElevenLabs voice (each character already has a `voiceId` field), Web Speech API input, and new characters. The architecture is designed so you can drop in any Guardian or Godbeast as a chat companion with their own voice, personality, and creative domain.

**Frank**:

Give me prompt or if you have all code how to give v0

**Claude**:

Here's the full prompt for v0. I'll compile everything into one clean prompt you can paste directly.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

That's your complete v0 prompt — paste the whole thing into [v0.dev](https://v0.dev) and it'll scaffold the full app.

**Why this prompt is structured this way for v0:**

v0 understands Vercel AI SDK natively since it's Vercel's own stack, so I specified `useChat`, `streamText`, `@ai-sdk/anthropic` explicitly — v0 will generate the correct imports and wiring. The design spec is granular enough (exact hex codes, border-radius values, animation names) that v0 won't default to generic templates. And the character system prompts are described in detail so v0 builds the full `characters.ts` lib with all the Arcanea lore baked in.

**After v0 generates it**, you'll need to add your `ANTHROPIC_API_KEY` in the Vercel project settings, and you're live. The image generation route is stubbed with comments for Replicate/fal.ai/DALL-E — uncomment whichever you want when ready.

**Pro tip**: If v0 splits it across too many files or simplifies the characters, paste follow-up prompts like "Make Evi's system prompt at least 300 words with full Arcanea lore embedded" or "Add the full context menu with glass-morphism on right-click."

**Frank**:

Any template like this already available?

**Claude**:

Good question — let me search for OSS templates that already give you this kind of character-driven AI chat + image gallery combo so you're not building from zero.
```
This block is not supported on your current device yet.
```

Here's what actually exists that you can fork and skin with Arcanea:

## Closest Matches (Fork & Customize)

**1. Vercel AI Chatbot (Official)**
`github.com/vercel/ai-chatbot`
- Next.js 14 + Vercel AI SDK + Auth + streaming
- This is THE canonical template v0 uses internally
- Missing: character system, image gallery, custom personas
- **Best for**: Your chat tab foundation — add characters on top

**2. Chatbot UI by McKay Wrigley**
`github.com/mckaywrigley/chatbot-ui`
- Full-featured ChatGPT clone, multi-model support
- Supabase backend, conversation history
- Missing: character personas, image gallery
- **Best for**: If you want persistent conversations with Evi

**3. Lobe Chat**
`github.com/lobehub/lobe-chat`
- This is the closest to what you want — it has **character/agent personas with custom system prompts**, plugin marketplace, TTS/STT built in, image generation plugins
- Multi-agent support, beautiful UI
- 50k+ stars, very actively maintained
- **Best for**: Fork this, reskin with Arcanea theme, add your characters

**4. SillyTavern**
`github.com/SillyTavern/SillyTavern`
- Character-driven AI chat with deep persona support
- Character cards, lorebooks (similar to your Arcanea lore system)
- Group chats with multiple AI characters
- TTS/STT support
- **Best for**: The Jarvis character depth + voice layer

**5. Open WebUI (formerly Ollama WebUI)**
`github.com/open-webui/open-webui`
- ChatGPT-style UI, supports multiple models
- Has "modelfiles" which are basically character personas
- Image generation built in
- **Best for**: Self-hosted Arcanea companion

## For the Grok-like Image Gallery Specifically

**6. Novel Image Generator Templates**
- `github.com/steven-tey/novel` — Rich editor but shows the AI SDK patterns
- Replicate's `github.com/replicate/zoo` — Image gen gallery with multiple models

**7. Pintura / Masonry gallery starters**
- v0 has multiple image gallery templates you can prompt: "masonry image gallery with favorites and context menu like Grok Imagine"

## My Recommendation

**Fork Lobe Chat** — it's the 90% solution. Here's why:

It already has agent/character personas with custom system prompts, plugin architecture (you can add image gen, music, etc.), TTS and STT built in (your Jarvis voice layer), beautiful UI that's theme-able, Next.js based and deploys to Vercel. What you'd add is your Arcanea character definitions (Evi, Lumina, Guardians), the cosmic dark theme, the Imagine gallery tab, and Arcanea lore as a "lorebook" injected into system prompts.

That's maybe 2-3 days of customization versus 2-3 weeks building from scratch.

**Or if you want pure speed**: Take the Vercel AI Chatbot template + the v0 prompt I gave you. The official template handles auth, streaming, and conversation persistence — then v0 generates the character UI and gallery on top.

Want me to write the specific fork instructions for Lobe Chat with your Arcanea characters injected?

**Frank**:

Nextjs16 use /design

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Frank, I think you're asking me to use the screenshots you uploaded as the `/design` reference and build a Next.js 16 app based on that Grok-like Arcanea UI. Let me check what's new with Next.js 16 and then build the updated v0 prompt with your design screenshots as reference.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me create the definitive v0 prompt that references Next.js 16 features and includes the `/design` folder structure for v0's design mode:
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

Here's your complete v0 kit, Frank. Three pieces:

**1. `v0-prompt-nextjs16.md`** — The full prompt to paste into v0.dev. Updated for Next.js 16 with React 19 features (`useActionState` for the Imagine form, `useOptimistic` for instant gallery likes, `use()` for streaming). References your Grok screenshots as `/design` directory.

**2. `design-readme.md`** — Explains each screenshot to v0 so it understands exactly what to clone.

**3. `arcanea-design-reference.tar.gz`** — Your 5 Grok screenshots renamed with descriptive filenames, ready to upload.

**How to use with v0:**

**Step 1**: Go to v0.dev, start a new chat

**Step 2**: Upload your 5 Grok screenshots directly as image attachments (v0 accepts images as design reference)

**Step 3**: Paste the entire `v0-prompt-nextjs16.md` content

**Step 4**: v0 will generate the full Next.js 16 app with your Grok UX cloned and Arcanea-skinned

**Step 5**: Click "Deploy" → add `ANTHROPIC_API_KEY` in Vercel → live

**Pro tip**: v0 might split this into multiple iterations. If the first generation focuses only on one tab, follow up with "Now build the Chat tab with the 5 Arcanea characters and Vercel AI SDK streaming" and "Now build the Imagine gallery matching the Grok screenshots I uploaded."

The prompt specifically calls out React 19 patterns that v0 knows natively since it's Vercel's tool — it'll generate the correct `useActionState` and AI SDK v4 imports automatically.
