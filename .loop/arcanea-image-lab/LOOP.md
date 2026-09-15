# Arcanea Image Lab Loop

## Verdict
MANUAL-FIRST

This loop is safe and valuable, but it should run manually for 2-3 clean cycles before any background scheduling. Image generation consumes rate limits, the built-in Codex image tool must be invoked in-session, and final approval depends on visual inspection plus the 30-point taste gate.

## Objective
Continuously produce, inspect, score, and document premium Arcanea lore images in bounded batches without approving unreviewed generated assets.

Observable done state for one cycle:
- New batch prompts are appended to `.arcanea/image-lab/night-run-2026-06-26/prompts.jsonl`.
- Generated images are copied from `C:\Users\frank\.codex\generated_images` into the run workspace.
- Every generated row in `ledger.csv` has a real image path, prompt reference, critique, next improvement, and 30-point gate verdict.
- `gallery.html`, `oversight.md`, throughput notes, and proof artifacts are updated.
- `Test-ArcaneaImageRun.ps1` passes.
- `Measure-ArcaneaImageRun.ps1` writes current burn-rate proof.

## Loop Type
Visual/product QA loop with maker/checker split.

## Non-Goals
- Do not claim a generated visual is final without opening the actual PNG.
- Do not use generated-image text-heavy diagrams as final exact documentation.
- Do not mutate billing, account settings, production deployments, or secrets.
- Do not delete original Codex generated images.
- Do not weaken design gates, safety limits, or canon rules to approve more images.
- Do not run unattended 10-hour generation without an installed automation tool and explicit human gate.

## Allowed Scope
- `.arcanea/image-lab/night-run-2026-06-26/**`
- `.loop/arcanea-image-lab/**`
- Additive prompt, ledger, gallery, proof, and QA tooling changes related to this loop.

## Forbidden Scope
- Credentials, billing, external sends, production mutation, destructive filesystem operations, force pushes, broad app refactors, dependency upgrades, and unrelated lore canon edits.

## Actor Model
- Worker: Codex image operator using `imagegen`, `premium-visual-design`, Arcanea canon, and this loop contract.
- Verifier: `Test-ArcaneaImageRun.ps1`, design evidence validator, actual image inspection, and independent 30-point gate review.
- Human gate: Frank decides when to schedule/background this after clean manual cycles, and when a subjective near-final image becomes canon.

## Cadence
Manual on-demand batches of 4 images.

After 2-3 clean cycles:
- consider Codex automation if `automation_update` becomes available;
- otherwise use a human-resumed Codex thread or external orchestrator that can call Codex with the same loop state.

## State
- Queue: `.arcanea/image-lab/night-run-2026-06-26/prompts.jsonl`
- Ledger: `.arcanea/image-lab/night-run-2026-06-26/ledger.csv`
- Gallery: `.arcanea/image-lab/night-run-2026-06-26/gallery.html`
- Oversight: `.arcanea/image-lab/night-run-2026-06-26/oversight.md`
- Prompt doctrine: `.arcanea/image-lab/night-run-2026-06-26/PROMPT_DOCTRINE_L99.md`
- Evidence: `.arcanea/image-lab/night-run-2026-06-26/design-loop-evidence.json`
- Loop proof: `.loop/arcanea-image-lab/proofs/latest-image-run-gate.json`
- Throughput proof: `.loop/arcanea-image-lab/proofs/latest-throughput.json`

## Verification
Primary gate:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Test-ArcaneaImageRun.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Measure-ArcaneaImageRun.ps1
```

Contract doctor:

```powershell
python C:\Users\frank\.codex\plugins\cache\plugins-cli\loop-system\0.1.0+codex.20260623105400\scripts\loop_cli.py doctor --loop-dir .loop/arcanea-image-lab
```

## Budgets
- Batch size: 4 generated images per manual cycle.
- Max correction iterations per batch: 3.
- Stop after same failure: 2 repeated failures.
- Approval threshold: 26/30+.
- Iterate threshold: 22-25/30.
- Restart threshold: 0-21/30.

## Escalation
Stop and ask Frank when:
- image generation tool availability or limits block progress;
- a batch would require billing/API fallback;
- a generated image contains unsafe, unusable, or canon-breaking content;
- exact text, logos, or diagrams are required and should be built in code/Figma/Canva instead;
- the same quality failure repeats twice.

## Cancel/Resume
Cancel by creating:

```text
.loop/arcanea-image-lab/ABORT
```

Resume by reading this contract, then:

```powershell
python C:\Users\frank\.codex\plugins\cache\plugins-cli\loop-system\0.1.0+codex.20260623105400\scripts\loop_cli.py status --loop-dir .loop/arcanea-image-lab
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Test-ArcaneaImageRun.ps1
```
