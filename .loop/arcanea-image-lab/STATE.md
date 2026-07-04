# Loop State

## Current Status
MANUAL-FIRST loop installed for the Arcanea image lab.

Current generated count after latest verification: 34 images.

Latest completed batch:
- `batch-008-01`: Malachar witness POV Source Gate rejection.
- `batch-008-02`: Arion clean Confluence model plate.
- `batch-008-03`: Emilia prism instrument macro product shot.
- `batch-008-04`: Thal'Maris vertical social hero crop.

## Queue
- [x] Apply batch-006 scoring to the ledger.
- [x] Run `Test-ArcaneaImageRun.ps1`.
- [x] Run `Measure-ArcaneaImageRun.ps1`.
- [x] Run loop contract doctor.
- [ ] Append RUNS.md outcome.
- [ ] Plan batch-009 from remaining iterate gaps and surface-specific needs.

## Decisions
- Loop verdict is `MANUAL-FIRST`, not fully autonomous, until 2-3 cycles pass cleanly.
- Batch size remains four images because each asset requires a distinct built-in `image_gen` call and actual inspection.
- Generated exact-text infographics are concept direction only; exact text belongs in code/Figma/Canva.
- Approval threshold is 26/30+.

## Blockers
- No installed `automation_update` tool was exposed earlier, so true scheduled background wakeups are not active from this contract alone.
- Built-in image generation must be invoked by the active Codex session.

## Next Action
Append RUNS.md outcome, then queue batch-009 when continuing.

## Last Evidence
- Workspace gallery: `.arcanea/image-lab/night-run-2026-06-26/gallery.html`
- Latest proof target: `.loop/arcanea-image-lab/proofs/latest-image-run-gate.json`
- Latest throughput proof: `.loop/arcanea-image-lab/proofs/latest-throughput.json`
