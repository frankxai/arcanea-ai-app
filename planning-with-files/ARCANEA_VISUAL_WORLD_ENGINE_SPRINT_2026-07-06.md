# Arcanea Visual World Engine Sprint

Date: 2026-07-06
Owner: Codex lead operator with Arcanea design council lanes
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Branch: `codex/arcanea-homepage-world-engine`

## Task Contract

Scope:
- Run the next Arcanea visual-world loop on top of the 2026-07-05 God Mode product sprint.
- Produce canon-aware visual assets, prompts, metadata, QA evidence, and integration direction for arcanea.ai galleries, Atlas, Genesis, Studio, social, story, webtoon, book, and music portals.
- Preserve existing dirty package/lock/campaign/business-strategy work and prior untracked image-loop artifacts.

Files introduced in this slice:
- `planning-with-files/ARCANEA_VISUAL_WORLD_ENGINE_SPRINT_2026-07-06.md`
- `.arcanea/image-lab/run-2026-07-06-god-mode/prompt-bank.json`
- `.arcanea/image-lab/run-2026-07-06-god-mode/ledger.csv`
- `.visual-qa/arcanea-visual-world-engine-2026-07-06/design-loop-evidence.json`

Non-goals:
- No production deploy.
- No database migration or NFT/web3 minting.
- No canon changes to locked lore.
- No generated text inside image pixels. Use deterministic overlays later.
- No publishing or scheduling social posts without human approval.

Rollback:
- Remove the files above and any dated generated assets created under this run folder.

## Current Product Truth

Yesterday's God Mode sprint already moved Arcanea toward product truth: Genesis proof, status, method, activation telemetry, durable workflow readiness, release package planning, and Vercel remediation packets.

Current useful next move:
- Build the premium visual-world production layer that gives Arcanea assets worthy of social, gallery, Atlas, and future media portals.
- Upgrade the existing raw 25-image loop into a canon-safe, VIS-ready pipeline.

Existing local visual artifacts discovered:
- `data/arcanea-visual-log.csv` has 25 generated image entries.
- `data/arcanea-visual-gallery.html` previews the starter gallery.
- `data/batch1.json` through `data/batch5.json` hold initial prompt batches.
- `scripts/arcanea-mass-generation-runner.js` can batch-generate with Gemini when `GEMINI_API_KEY` is set.
- `assets/arcanea-universe/` contains the generated starter images.
- `.arcanea/image-lab/run-2026-07-05-test/ledger.csv` shows the more mature VIS-style ledger shape.

First critique of starter assets:
- Keep: scale, cosmic signal fields, energetic cinematic staging.
- Improve: canon precision, material specificity, Arcanea over generic sci-fi/fantasy/anime, metadata completeness, crop planning, social hook strategy, and 30-point QA scoring.

## Audience And User Flows

Primary audiences:
- AI-native creators who want a world and proof artifact, not another empty prompt box.
- Webtoon/anime/story creators who need characters, creatures, locations, and recurring visual canon.
- Music and video creators who need mood frames, cover art, and motion seed frames.
- Worldbuilders and game directors who need a canon-safe asset graph.
- Founders and creator-operators comparing Arcanea against chat, canvas, media generation, and worldbuilding tools.

Flow A - Discover and Create:
1. User sees a high-hook Arcanea visual on social or the homepage.
2. User opens a gallery/portal route.
3. User chooses a world frame, Guardian, creature, artifact, or story seed.
4. User starts Genesis with the associated prompt/canon packet.
5. User exports a proof artifact and saves it to project memory.

Flow B - Atlas and Lore:
1. User enters Atlas.
2. User filters by Gate, Guardian, Godbeast, Realm, material, origin class, or media format.
3. User opens an asset card with prompt, provenance, canon refs, crops, QA score, and next actions.
4. User copies a safe derivative prompt into Studio or a story portal.

Flow C - Social Growth:
1. Team selects an approved 9:16, 4:5, 1:1, or 16:9 visual seed.
2. Exact caption/title overlays are composed in code, Figma, Canva, or Remotion.
3. Human approval happens before publishing.
4. Metrics feed back into prompt-bank variants.

## Platform Strategy

Sources checked:
- Instagram original content and creator best practices: https://help.instagram.com/1800814370401535/ and https://creators.instagram.com/best-practices
- TikTok creative best practices: https://ads.tiktok.com/help/article/creative-best-practices
- YouTube three-minute Shorts and Shorts creation docs: https://support.google.com/youtube/answer/15424877 and https://support.google.com/youtube/answer/10059070
- X creative best practices and specs: https://business.x.com/en/advertising/creative-best-practices and https://business.x.com/en/help/campaign-setup/creative-ad-specifications
- Local channel matrix: `starlight-design-intelligence/brand-image-system/social-channel-matrix.csv`

Execution implications:
- TikTok/Reels/Shorts: vertical-first, readable first frame, visible subject in the first second, no tiny baked text.
- Instagram: original, save-worthy, cohesive semantic story across visual, caption, and audio.
- X: simple bold visuals, 50-100 character post copy target when used as ad creative, videos ideally 15 seconds or less, captions/sound-off strategy.
- YouTube Shorts: up to three minutes is supported, but Arcanea should start with 12-45 second proof loops unless the story earns longer.
- YouTube thumbnails and OG: 16:9 exports need one big first read and no generated microtext.

## Success Metrics

Asset production:
- 24 canon-safe prompt briefs ready in the prompt bank.
- 6-12 generated assets per focused batch.
- 100 percent of generated assets have slug, category, surface, aspect ratio, prompt path, canon refs, intended crops, rights status, and QA state.
- At least 60 percent of inspected first-batch assets score 22/30 or higher after first pass.
- Only assets scoring 26/30 or higher become ship candidates.

Quality:
- No canon violations: Luminor is rank, Guardians are roles of the Ten Gods, Godbeasts stay bonded companions, Nero is not evil, Shadow is corrupted Void.
- No generic purple fantasy UI, stock-like fantasy, superhero spandex, neon hacker grid, or unreadable ornament.
- Each image has one strong first read and one primary story job.
- Each social candidate has a 9:16 crop plan.

Product:
- Identify where each asset can feed arcanea.ai: Gallery, Atlas, Genesis, Studio, Store, Method, Status, social, or future media portal.
- Prepare metadata for later DB/web3 ingestion without minting or claiming worthiness.

Loop:
- Keep a running ledger with failure modes and next prompt improvement.
- Do visual inspection on actual exports, not just prompts.
- Use deterministic overlays for social text and product claims.

## Eight-Hour Operating Loop

Hour 0 - Frame:
- Load standards, canon, brand packs, social sources, current image logs.
- Establish the sprint contract and prompt bank.

Hour 1 - Audit:
- Inspect the current 25-image starter batch.
- Score representative assets.
- Extract keep/avoid lessons.

Hour 2 - Generate Batch 1:
- Generate 6 high-priority assets from the prompt bank.
- Copy final outputs into a dated workspace path.
- Record prompt, provenance, and first-pass inspection.

Hour 3 - Critique:
- Score Batch 1 with the 30-point gate.
- Mark ship, iterate, restart, or reference-only.
- Create targeted revision prompts.

Hour 4 - Generate Batch 2:
- Produce revised variants and missing categories.
- Prioritize social 9:16, website 16:9, and gallery 1:1/4:5 crops.

Hour 5 - Integrate:
- Build or update a local gallery manifest.
- Map assets to routes/components once the integration scout returns.
- Keep exact copy/labels outside generated pixels.

Hour 6 - Social Packs:
- Create channel-specific crop/caption/motion-source plans.
- Prepare approval packet, not scheduled posts.

Hour 7 - QA And Handoff:
- Validate evidence manifest.
- Run VIS scan/packet if practical.
- Update sprint plan with results, blockers, next batch.

## Design Council

Creative Director:
- Ownable idea: "Arcanea is where proof becomes myth and myth becomes usable creative infrastructure."
- Cut: generic anime keyword piles, vague chosen-one language, and spectacle without product path.

Product Designer:
- Every visual must lead to an action: start Genesis, open Atlas, remix in Studio, enter a story portal, or save to a project.

Visual Designer:
- Use luxury cosmic myth-tech: sacred obsidian, starlight metal, gold thread, living crystal, ancient paper, dark glass, portal light, and visible scale.

Motion Designer:
- Treat images as still frames first. Motion candidates need one job: portal reveal, glyph trace, artifact focus, or signal route.

Brand/Social Strategist:
- Win the first second with scale, character emotion, or artifact mystery. Let captions carry exact language later.

Frontend Engineer:
- Wire via manifest-driven asset cards, not hardcoded one-off image imports.

Visual QA:
- Score actual exports and crop tests before promotion.

## Prompt Improvement Rules

Use:
- Final surface, aspect ratio, scene job, canon refs, subject, scale anchor, material language, composition, lighting, crop notes, and avoid list.

Avoid:
- "masterpiece", "best quality", long keyword piles, fake UI/text, unapproved origin classes, generic anime labels, stock fantasy, overglow, and decorative node/orbit cliches.

Default negative constraints:
- No text, no logos, no watermark, no subtitles, no UI, no fake letters, no malformed hands or faces, no generic fantasy cosplay, no superhero spandex, no medieval mud-grit, no purple cliche, no neon hacker grid, no cluttered ornaments.

## Integration Backlog

P0:
- Generate Batch 1 from the new prompt bank.
- Save outputs under a dated run folder and update `ledger.csv`.
- Validate `.visual-qa/arcanea-visual-world-engine-2026-07-06/design-loop-evidence.json`.

P1:
- Convert the prompt bank into a gallery manifest.
- Add social crop plans and deterministic overlay briefs.
- Route best assets to Atlas, Genesis prompt seeds, and Studio starter packs.

P2:
- Add a public or private gallery route after route/component scouting.
- Add DB-ready and optional web3-ready metadata fields.
- Add VIS curation packets for approved assets.

