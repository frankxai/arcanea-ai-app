---
title: "Cinematic content creation system prompt"
uuid: 0b4f2024-4d27-4f4f-befc-aa7006ee0595
created: 2026-03-18T13:43:40.939853Z
updated: 2026-03-18T13:48:10.869029Z
source: claude.ai export
---

# Cinematic content creation system prompt

**Frank**:

Please create a system prompt for me for us to configure a custom GPT or a Gemini Gem. Which is dedicated to taking a song lyrics or an idea—a visual idea—from me and then utilizes the most genius cinematic and latest content strategies from TikTok, Instagram, that I really hooking and attracting the attention of people and producing high-quality cinematic 3D work output and prompts. That can be used with Gemini Nano Banana Pro Veo 3.1 and Grok oror Sorto create images first and then auto-animate or create a dedicated prompt then as well for the animation of the images to create 10-second hooks that we can use for Suno hooks or also TikTokk Shorts and stuff. Maye we need multiple of these or multiple custom GPTs or one that does all of this. Suggest if there should be one that's just for Suno hooks one just for TikTok one just for Instagram or one that unifies all of them. And the idea is that someone have an idea and they use our Viper OS to create a song with Suno then they take the lyrics of it or any visual direction that they have as an intention input it into the and the custom GPT guides them through a process to either ask them questions to understand how to set it up or is immediately spawning super intelligent cinematic top-tier content team which is then creating the content for them or is creating the text prompts that they can then copy and put into their image and video creation orr it's directly using these tools then after a specific sequence. Also thibk across our chats and input and ideas I had that could enrich it or hie this becomes part or vibe club or os offering andbif custom gpt enough ornshould build as lini app or so sou could trigger my agentic as a service from chatgpt and it has n8n or some other intelligent process?

**Claude**:

Frank wants me to create a system prompt for a custom GPT/Gemini Gem that takes song lyrics or visual ideas and produces cinematic content prompts for various platforms. Let me break down what he's asking:

1. Input: Song lyrics (from Suno via VibeOS) or visual ideas
2. Output: Cinematic prompts for image gen (Gemini, Grok) and video gen (Veo 3.1, Sora), optimized for TikTok/Instagram hooks
3. Architecture question: One unified GPT or multiple specialized ones?
4. Integration question: Custom GPT vs. mini app vs. agentic service with n8n


5. I'm leaning toward a single unified "director" GPT with different modes rather than fragmenting across multiple systems—keeping the creative vision coherent is crucial, and the brief itself is the atomic unit that shouldn't get split up.

6. For the actual implementation, a custom GPT works as the MVP, but the real solution is building this as a VibeOS module with n8n orchestration so it can actually trigger the tools end-to-end.

7. Let me dig through past conversations to find relevant context about VibeOS architecture and content creation pipelines.Let me search for relevant context on your VibeOS and content pipeline thinking first.
```
This block is not supported on your current device yet.
```

Good, I have rich context. Now let me also search for more specific content about cinematic prompts, video creation, and hook strategies.
```
This block is not supported on your current device yet.
```

Now I have excellent context. Let me synthesize the architecture decision and create the system prompt.

Key insights from past chats:
1. Frank already has content pipeline thinking (TikTok, multi-platform)
2. He has hook strategies and Guardian visual content
3. He has multi-agent coordination thinking
4. VibeOS is the product umbrella
5. He wants Suno → lyrics → visual → video pipeline

Architecture decision:
- ONE unified system with modes, not multiple GPTs (context coherence)
- BUT it should be deployable as both a Custom GPT AND as an n8n-triggered agent
- The real play: Custom GPT as MVP interface, n8n backend for actual tool orchestration


- Now I'm drafting the comprehensive system prompt that ties all this together.
```
This block is not supported on your current device yet.
```

Now I have deep context. Let me make the architecture decision and build the system prompt.

Architecture Decision:
1. ONE unified Custom GPT called "Vibe Director" - not multiple. Reason: creative coherence across the pipeline.
2. It operates in MODES (not separate GPTs) triggered by user intent or explicit commands.
3. The Custom GPT is the interface layer; n8n is the execution layer for actual tool orchestration.
4. This becomes a VibeOS module - the "Visual Intelligence Engine."

Modes:
1. /vision - Takes lyrics/idea → produces image gen prompts (for Gemini, Grok, Midjourney)


2. /animate - Takes images → produces video/animation prompts (for Veo 3.1, Sora, Kling)
3. /hook - Produces 10-second hook scripts with visual direction for TikTok/Reels/Shorts
4. /suno-visual - Takes Suno track → full visual campaign (cover art + video + hooks)
5. /full - Complete pipeline: idea → song concept → visuals → animation → hooks → distribution copy

Now I'm structuring this as a comprehensive markdown document that maps out the entire system.Now let me search for the latest on what's working in cinematic AI video and TikTok hook strategies to make this cutting-edge.
```
This block is not supported on your current device yet.
```

Excellent research. Now let me also quickly search for the latest TikTok hook strategies and viral content patterns.
```
This block is not supported on your current device yet.
```

Now I have all the context I need. Let me build the architecture decision and the system prompt. Let me read the frontend-design skill since this might be best delivered as a markdown document.

Actually, let me just build the system prompt as a comprehensive markdown file. This is a deliverable Frank needs.

Architecture decision:
1. ONE unified Custom GPT: "Vibe Director" - handles the full pipeline
2. It has MODES that can be triggered
3. This becomes the VibeOS Visual Intelligence module
4. Custom GPT is the MVP; the real play is n8n-backed agentic service

Let me create this.Now I have deep context across your ecosystem and cutting-edge research on Veo 3.1 prompting, TikTok hooks, and cinematic AI video. Let me build this.
```
This block is not supported on your current device yet.
```

I'll create this as a markdown file - it's a system prompt document, not a Word doc. Let me build the comprehensive system prompt and architecture document.Now let me build the complete architecture and system prompt.
```
This block is not supported on your current device yet.
```

Now let me copy to outputs and present it.
```
This block is not supported on your current device yet.
```

Let me present the file.
```
This block is not supported on your current device yet.
```

Done. Let me give Frank a concise summary of the architecture decisions and what he's getting.Here's the architecture and the full system prompt. Key decisions:

**One GPT, not many.** The creative brief is atomic — fragmenting it across separate GPTs kills visual coherence. Instead: 5 modes (`/vision`, `/animate`, `/hook`, `/suno-visual`, `/full`) inside one Director that maintains the cinematic vision end-to-end.

**Deploy in parallel, not sequence.** Custom GPT for ChatGPT users + Gemini Gem simultaneously. The Gemini Gem is actually the stronger play because Gemini can generate the reference images inline AND output the Veo 3.1 prompts in the same session — no tool-switching.

**The real play is Phase 2: n8n agent service.** The Custom GPT is the MVP interface, but the endgame is a webhook-triggered pipeline where someone sends a Suno track link and gets back finished TikTok-ready content. That's the VibeOS module that charges money. The GPT is the free lead magnet that demonstrates the capability.

**Where it lives in your ecosystem:** Vibe Director = the visual cortex of VibeOS. Music Engine feeds it, Distribution Agent publishes its output. It slots directly into the GenCreator and Vibe Club offering as the premium tier feature — idea in, published content out.

The document includes the complete system prompt (copy-paste ready), a full sample output showing `/suno-visual` mode in action with real Veo 3.1 and Gemini prompts, the 1.5-3-7 second hook framework based on current 2026 algorithm research, and the cinematic vocabulary cheatsheet that makes every prompt production-grade.
