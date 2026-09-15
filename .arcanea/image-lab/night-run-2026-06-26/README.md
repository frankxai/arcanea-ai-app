# Arcanea Image Night Run - 2026-06-26

Ten-hour visual production control room for Arcanea lore, sites, socials, books, and strategy images.

Quality correction added 2026-06-26: first-pass generated images are concept plates until they pass the 30 point gate. See `QUALITY_RECALIBRATION.md`, `PROMPT_DOCTRINE_L99.md`, `AUTO_LOOP_POLICY.md`, `OPENAI_CODEX_IMAGE_LIMITS.md`, and `design-loop-evidence.json`.

## Task Contract

Scope: generate and track high-quality Arcanea image batches using the `imagegen` skill, with four images per batch when limits allow.

Owner: Codex acting as image director, canon guard, and run operator.

Files:
- `prompts.jsonl` - prompt queue and batch metadata.
- `ledger.csv` - Excel-compatible asset ledger.
- `oversight.md` - batch recaps, quality notes, and next-run improvements.
- `gallery.html` - visual at-a-glance gallery rebuilt from the ledger.
- `tools/Update-ArcaneaImageRun.ps1` - ingests Codex-generated images and refreshes tracking.
- `tools/Apply-QualityRecalibration.ps1` - rescored the existing set with the stricter 30 point gate.

Non-goals:
- Do not bypass or evade image-generation limits.
- Do not modify locked canon.
- Do not run CLI/API fallback without explicit confirmation and a local `OPENAI_API_KEY`.
- Do not touch unrelated dirty repo files.

Acceptance criteria:
- Every generated image has a prompt reference, batch id, lane, intended use, recap, and next improvement.
- Final assets copied from `C:\Users\frank\.codex\generated_images` into this run folder.
- CSV opens cleanly in Excel.
- HTML gallery shows generated images at a glance.
- Markdown oversight explains what improved and what to try next.

Verification:
- Run `.\tools\Update-ArcaneaImageRun.ps1 -BatchId <batch-id> -CopyLatest 4` after each generated batch.
- Open `gallery.html` and confirm images render.
- Check `ledger.csv` has rows for the current batch.

Rollback:
- Delete this run folder only if the run is rejected. It is additive and does not affect app code.

## Operating Reality

The built-in Codex `image_gen` tool is the preferred quality path from the `imagegen` skill. It cannot be invoked by a background PowerShell script in this session. The exposed automation tools also did not include a Codex-native recurrence/wakeup runner.

So this run uses a two-part loop:

1. Codex generates a batch of four images with the built-in `image_gen` tool.
2. The local update script copies the newest generated PNG files into this workspace, updates the ledger, and rebuilds the gallery.

For a truly unattended 10-hour generator, use the skill's CLI fallback only after explicit confirmation and a locally configured `OPENAI_API_KEY`.

## Cadence

Target: four images per batch.

Throttle: 6-12 minutes between high-quality batches, with exponential backoff on rate limits or quality drift. A two-minute loop is too aggressive for premium image quality and risks hitting limits; the run should preserve credits, quality, and account health.

10-hour envelope:
- Conservative: 30 batches, 120 images.
- Normal: 45 batches, 180 images.
- Aggressive: 60 batches, 240 images.

## Batch Rotation

1. Canon foundation and Arcanean Avatar.
2. Site hero assets and product visuals.
3. Social campaign visuals.
4. Character plates and crew posters.
5. Lore infographics.
6. Books, covers, and publishing campaign assets.
7. Realms, Sister-Worlds, and Mirror Realm art.
8. Materials, crystals, metal, biotech, and code-bending.
9. Academy, Houses, Gates, and dragon riders.
10. Retrospective improvements and remixes of the strongest images.

## After Each Batch

From this folder:

```powershell
.\tools\Update-ArcaneaImageRun.ps1 -BatchId batch-001 -CopyLatest 4
```

Then review:
- `gallery.html`
- `ledger.csv`
- `oversight.md`

## Optional Watch Loop

To keep the control room refreshing while image batches are generated in Codex, run:

```powershell
.\tools\Start-ArcaneaImageOperatorLoop.ps1 -RunHours 10 -IntervalMinutes 2
```

This loop watches for new PNGs under `C:\Users\frank\.codex\generated_images`, ingests the next queued batch when four new images appear, rebuilds `gallery.html`, updates `ledger.csv`, and writes `operator-current-batch.md` with the next four prompts.

It does not invoke the built-in `image_gen` tool by itself. That boundary is intentional: built-in image generation is a Codex tool call, not a local shell API.
