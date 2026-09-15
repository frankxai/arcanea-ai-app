# Arcanea Image Auto Loop Policy

Date: 2026-06-26

## Default Trigger

If a user asks for image creation, image editing, visual assets, hero art, social images, posters, book art, character plates, or Arcanea visual exploration, Codex should automatically use the `imagegen` skill. The user does not need to explicitly type `$imagegen` every time.

Explicit skill names are still useful when the user wants a specific workflow. If a named skill such as Image Jam is not installed or not exposed in the current session, say that directly and use the best available fallback.

## Pre-Generation Hook

Before any Arcanea image batch:

1. Read `QUALITY_RECALIBRATION.md`.
2. Read `PROMPT_DOCTRINE_L99.md`.
3. Load the Arcanea brand pack from `starlight-design-intelligence/brand-packs/arcanea`.
4. Choose one clear use case and one visual idea per image.
5. Write prompts with camera, material, composition, bending mechanics, and artifact bans.
6. Prefer 4 images per batch unless the visible usage state suggests backing off.

Hard stop before generation if the prompt relies on:

- Generated small text for exact diagrams.
- Generic "ultra high quality" without material/camera/inspection constraints.
- More than one primary magic effect.
- A final logo/crest without vector-first follow-up.

## Generation Loop

Batch pattern:

1. Generate 4 images.
2. Ingest with `tools/Update-ArcaneaImageRun.ps1`.
3. Inspect actual PNGs.
4. Score with the 30 point gate.
5. Update `ledger.csv`, `gallery.html`, and `oversight.md`.
6. Decide next batch:
   - 26-30: crop/surface variants.
   - 22-25: one targeted iteration.
   - 0-21: restart from a simpler brief.

Do not keep generating volume if the previous batch has not been inspected. That creates more average images, not better canon.

## Durable Loop Contract

The file-backed loop is installed at:

`C:\Users\frank\starlight\repos\arcanea-ai-app\.loop\arcanea-image-lab`

Use it as the source of truth for future agents:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Test-ArcaneaImageRun.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Measure-ArcaneaImageRun.ps1
python C:\Users\frank\.codex\plugins\cache\plugins-cli\loop-system\0.1.0+codex.20260623105400\scripts\loop_cli.py doctor --loop-dir .loop/arcanea-image-lab
```

Current verdict: `MANUAL-FIRST`. This is intentional. The loop is allowed to create and ingest batches in an active Codex session, but scheduled all-night generation should wait until the app exposes a real automation tool or Frank confirms an external orchestrator.

## Post-Generation Hook

After each batch, record:

- Prompt reference.
- Source path and workspace path.
- 30 point score.
- Ship status.
- Failure modes.
- One next improvement.
- Local throughput estimate.
- `THROUGHPUT.md` and `.loop/arcanea-image-lab/proofs/latest-throughput.json`.
- Any visible rate/usage warnings.

The gallery must show the score and verdict at a glance.

## Target 100 Plan

100 images equals 25 batches of 4.

Recommended split:

- 20 lore/world plates.
- 20 character/model plates.
- 16 site/social hero assets.
- 16 book/publishing/product assets.
- 12 material/magic system plates.
- 8 photoreal making-of assets.
- 8 deterministic diagram briefs, not generated text images.

Quality-gated cadence:

- Draft-heavy day: 4 images every 10-15 minutes.
- Art-direction day: 4 images every 20-30 minutes.
- Stop after every 12-16 images for a critic pass.

## Automation Boundary

This thread did not expose a callable `automation_update` tool. Until it is available, do not claim an all-night background image automation is installed.

The local operator loop can watch and ingest generated files, but it cannot invoke the built-in image tool from PowerShell. Actual generation still happens through Codex/imagegen calls in the active session or a future Codex app automation.
