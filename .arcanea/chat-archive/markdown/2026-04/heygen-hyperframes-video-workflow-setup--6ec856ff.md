---
title: "HeyGen Hyperframes video workflow setup"
uuid: 6ec856ff-a45d-4ba7-9ad7-4d7d0ec7d4b1
created: 2026-04-23T02:26:32.671847Z
updated: 2026-04-23T02:27:59.848506Z
source: claude.ai export
---

# HeyGen Hyperframes video workflow setup

**Frank**:

npx skills add heygen-com/hyper frames
Claude design and code or cowork and this all we need for all my video workflows see all my brands all we need which systems and flows recommend and architect. https://github.com/heygen-com/hyperframes

**Claude**:

I need to look into what HeyGen hyperframes actually is by checking their GitHub repository so I can properly help architect video workflows for their brands.
```
This block is not supported on your current device yet.
```

 So Hyperframes is an HTML-native video composition framework that renders MP4s from HTML with data attributes, built with an agent-first approach that supports MCP and Claude Code skills. It uses Puppeteer and FFmpeg under the hood to create deterministic, reproducible video pipelines with GSAP animation adapters, and it's open source under Apache 2.0 with skills installable via command line.

The installation gives you the compose and captions modules, which pair with GSAP skills for animation control. Frank's asking how to architect video production around his existing stack—his multi-brand portfolio, the Suno catalog, his Next.js infrastructure, and the MCP server he's already running. Given his preference for peer-level architecture and first-principles thinking, this is about whether we design and code this together or if I'm architecting the approach for him to execute.

The core insight is that Hyperframes eliminates the traditional video editing bottleneck by letting agents write HTML directly to MP4—it composes natively with his Next.js/Vercel setup and content pipeline. His actual constraint isn't creative output; he's got 300+ tracks, 120+ articles, and multiple brand surfaces (Guardian Trials, the Arcanea cinematic saga, Trinity AI Brotherhood) all needing repeatable video formats. The real problem is manufacturing video at scale without manual editing workflows.

So the architecture treats Hyperframes as the render engine—HeyGen avatars feed in as clips, Suno provides audio, Claude Code orchestrates composition, and Notion acts as the intent layer. For implementation, I'd structure this as a monorepo where each of his four labels and three brands gets its own compositions package, all sharing a unified design token system (colors, fonts, motion language) so the visual identity stays consistent across everything he's producing.

The repo would organize tokens per brand, reusable scene components like cold opens and lyric-sync panels, and format-specific templates... 16:9, Teaser, Music visualizer, Guardian Trial episode, Anime Legends clip)
     - `compositions/` — actual video projects
     - `.claude/skills/` — vendored hyperframes + gsap skills + custom Arcanea skills

3. **The Vel'Tara renderer model:**
- Inputs: `{script, audio_track, brand, format, scene_list}` 
- Agent (Claude Code w/ hyperframes-compose skill) generates HTML composition
- Renders to MP4 via `hyperframes render`
- Outputs land in `dist/{brand}/{format}/{slug}.mp4`
- Postiz/Blotato distribution fanout already exists — just point at `dist/`

4. **Integration points:**
- Suno audio tracks feed in as synchronized elements with beat-matched captions through the hyperframes pipeline, powering the Frank's Vibes and Arcanea Records workflow
- The 120+ frankx.ai articles convert into scene lists that automatically generate video shorts
- HeyGen's talking head renders get layered with lower-thirds, B-roll, captions, and brand elements to create FrankX.ai personal brand content
- Cinematic Arcanea saga material—teasers, trailers, Guardian intros—flows through the same composition system

, all code-driven rather than manually edited

5. **Cowork vs. Claude Code:** Claude Code handles bulk generation and CI-driven renders across the monorepo, while Cowork provides interactive review and brand decision-making, and this chat covers architecture and skill customization.

6. **Custom skills beyond the vendored set:** `arcanea-brand` enforces palette and motion grammar per brand, `arcanea-guardian-card` renders Guardian profile cards in canonical format, `vel-tara-glyph` handles the bioluminescent glyph animation grammar, and `frank-vibes-audio` manages Suno track integration with beat-sync logic.

7. **Key decisions blocking progress:** I need to determine whether the render pipeline runs locally, through CI, or in a Vercel container when Guardian Trials launches with weekly episodes, decide which label gets v1 (Frank's Vibes as the simpler template or Arcanea as the brand anchor), and figure out where the review workflow lives once the first batch ships.

Now I'm structuring the response for a peer audience who wants decisions, not options — keeping it tight for mobile but substantive enough to justify the complexity. I'll lead with what hyperframes actually does in the stack, then move through the architecture as concrete decisions, show how the tools integrate, clarify what gets vendored versus authored, and close on the blocking questions.## Thesis

Hyperframes is not a video tool. It is a **deterministic HTML→MP4 substrate** that collapses the "Premiere/CapCut/Descript/After Effects" bottleneck into agent-writable code. In your stack this is the missing render primitive — the one layer you don't have yet. It sits exactly where ACOS outputs meet Postiz/Blotato distribution. Everything above it (Suno, HeyGen, frankx.ai articles, Claude Code, Arcanea canon) already exists. Everything below it (Vercel, DistroKid, social fanout) already exists. Hyperframes is the seam.

Adopt it as the **single render substrate for all four labels, three brands, and the Arcanea cinematic**. One monorepo. One skill stack. One brand-token registry. No per-project Premiere projects. No freelance editors.

## Architecture

One repo under `frankxai`: **`arcanea-hyperframes`** (monorepo, bun, Turbo).

- `packages/tokens/*` — brand tokens as CSS custom properties. Seven surfaces: `frankx`, `arcanea`, `starlight`, `frank-riemer`, `franks-vibes`, `arcanea-records`, `nona`. Labradorite / obsidian / iridescence lives here, not in prompts.
- `packages/scenes/*` — reusable scene primitives: `<ColdOpen>`, `<GuardianCard>`, `<VelTaraGlyph>`, `<LowerThird>`, `<LyricSync>`, `<LuminaCounter>`, `<ArcaneanGlyphReveal>`. These *are* your visual language, codified.
- `packages/templates/*` — format-locked compositions: `Reel9x16`, `YT16x9`, `MusicViz`, `GuardianTrialEpisode`, `AnimeLegendsCut`, `CinematicTeaser`.
- `compositions/*` — instance projects. One folder per video. `meta.json` → brand, format, audio, script. Claude Code fills HTML.
- `.claude/skills/*` — vendored `hyperframes-compose`, `hyperframes-captions`, full `greensock/gsap-skills`, plus custom Arcanea skills (below).

Rendering runs locally on your Mac for authoring and on a GitHub Actions self-hosted runner (or Fly.io machine) for batch. Not Vercel — wrong substrate, no FFmpeg.

## Integration map

**Suno → Hyperframes.** 300+ tracks are the audio inventory. `<audio data-track>` + `hyperframes-captions` = music visualizers for Frank's Vibes and Arcanea Records at zero marginal cost. This is the v1 pipeline because it's the simplest composition and the highest-volume catalog.

**HeyGen → Hyperframes.** HeyGen renders the avatar clip. Hyperframes composes it with brand chrome, captions, B-roll cutaways, and lower-thirds. HeyGen is no longer a "video tool" — it's a *clip source*. This is the FrankX.ai personal-brand pipeline.

**frankx.ai articles → Hyperframes.** Each of the 120+ articles → TL;DR → scene list → 45-second short. One script (Claude Code), 120 renders, one weekend. This is your Corporate Refugee ICP funnel at industrial volume.

**Arcanea cinematic → Hyperframes.** Teasers, Guardian intros, Vel'Tara glyph reveals, canon trailers. The 9-film saga gets its *marketing surface* rendered this way; the feature films remain separate. This is where the `VelTaraGlyph` and `GuardianCard` scene primitives pay compounding returns.

**Guardian Trials → Hyperframes.** Eight weekly episodes = eight instances of `GuardianTrialEpisode` template. Changes reduce to scoreboards, challenge cards, and winner reveals. The entire season becomes a render job, not a production calendar.

## Custom skill layer

Vendor the two HeyGen skills and all eight GSAP skills. Then author four Arcanea-native skills:

- `arcanea-brand-tokens` — enforces which palette/typography/motion grammar maps to which brand. Rejects cross-contamination at lint time.
- `arcanea-scene-library` — teaches the agent the scene primitives and when to use each.
- `suno-beat-sync` — caption and cut timing derived from Suno track beat maps.
- `arcanean-glyph-grammar` — codifies the bioluminescent reveal, sigil kinetics, and Liquid Glass Futurism motion laws so agents can't drift.

These are the skills that turn Arcanea visual language from a Notion document into executable code. Without them, brand drift is guaranteed at volume.

## Forced positioning

Three decisions to collapse before I write the first composition:

1. **Which label ships v1 — Frank's Vibes or Arcanea?** Frank's Vibes gives you 50 music videos by June 1 and validates the pipeline on low-stakes surface. Arcanea gives you the brand-defining asset but has the highest visual-grammar risk. Default recommendation: **Frank's Vibes first, Arcanea second, FrankX third.** Agree or override?
2. **Render plane — self-hosted Mac Studio, GitHub Actions self-hosted runner, or Fly.io GPU machine?** For <5min 1080p output you don't need GPU; a pinned Mac mini in your flat beats cloud economics by an order of magnitude and removes the egress-cost conversation forever. Default: **Mac mini as the render node, GitHub Actions triggers the job.**
3. **Composition authorship — Claude Code in the repo, or Cowork for interactive review?** Answer is both, but the *authority* must be one. Default: **Claude Code owns authorship; Cowork is used only for scene review on the Starlight Vault display**. Commits are the source of truth. No freehand edits in Cowork that don't land back as code.

Confirm the three, and I'll scaffold `arcanea-hyperframes` with the monorepo, token packages, first two scene primitives (`VelTaraGlyph`, `LyricSync`), and a working Frank's Vibes composition as the canary render.
