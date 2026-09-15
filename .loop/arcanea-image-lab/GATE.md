# Verification Gate

## Must Pass
- `prompts.jsonl` is valid JSONL with unique `asset_id` values.
- Every prompt has a matching `ledger.csv` row.
- Every generated ledger row has an existing workspace PNG and existing Codex source PNG.
- No generated row remains `pending-review`.
- Every generated row has `quality_score`, `gate_30_score`, `gate_verdict`, `ship_status`, `recap`, `critic_notes`, `next_improvement`, and `skill_mode`.
- Gate math is coherent: approved with notes is 26+, iterate is 22-25, restart is 0-21.
- `gallery.html` references every generated workspace image.
- `design-loop-evidence.json` exists, parses as JSON, and validates with the design evidence validator.
- `THROUGHPUT.md` and `.loop/arcanea-image-lab/proofs/latest-throughput.json` are refreshed after each generated batch.
- Latest batch outputs were visually inspected before scoring.

## Commands

Run from `C:\Users\frank\starlight\repos\arcanea-ai-app`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Test-ArcaneaImageRun.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Measure-ArcaneaImageRun.ps1
python C:\Users\frank\.codex\plugins\cache\plugins-cli\loop-system\0.1.0+codex.20260623105400\scripts\loop_cli.py doctor --loop-dir .loop/arcanea-image-lab
```

## Manual Checks
- Open the four newest copied PNGs with `view_image`.
- Judge first read, silhouette, artifacting, hand/face quality, material logic, canon fit, and usable crop.
- Compare against `PROMPT_DOCTRINE_L99.md`, `TASTE.md`, and the Arcanea brand/canon standards.
- Confirm generated text-heavy assets are marked iterate unless rebuilt deterministically.

## Verifier Verdicts
- `PASS`: objective proven with gate output and visual evidence.
- `ITERATE`: fixable gap remains and next prompt delta is clear.
- `FAIL`: wrong objective, unsafe output, broken evidence, or misleading score.
- `NEEDS-HUMAN`: taste/canon choice requires Frank, or tool limits/billing block work.

## Reject If
- The gate was skipped, weakened, or unrelated.
- A generated image is approved without actual PNG inspection.
- A gallery path points only to Codex's generated image cache instead of the workspace.
- A text-heavy infographic is treated as final exact documentation.
- The loop hides a blocker, resets history, or deletes original generated files.
