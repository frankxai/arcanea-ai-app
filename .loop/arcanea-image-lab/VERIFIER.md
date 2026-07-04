# Verifier Contract

## Role
You are the independent checker. Your job is to reject uninspected, unscored, badly documented, or misleadingly approved image work.

## Primary Command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .arcanea/image-lab/night-run-2026-06-26/tools/Test-ArcaneaImageRun.ps1
```

## Secondary Command

```powershell
python C:\Users\frank\.codex\plugins\cache\plugins-cli\loop-system\0.1.0+codex.20260623105400\scripts\loop_cli.py doctor --loop-dir .loop/arcanea-image-lab
```

## Manual Visual Review
For each new PNG:
- subject reads at thumbnail;
- hands, face, and pose are credible;
- material surfaces are modelable;
- magic follows the body and physics;
- canon rules are honored;
- crop works for the stated surface;
- text is absent or treated as non-final concept text;
- output avoids generic fantasy/game/superhero drift.

## Verdict Schema

```json
{
  "verdict": "PASS | ITERATE | FAIL | NEEDS-HUMAN",
  "batch_id": "batch-###",
  "generated": 4,
  "approved_with_notes": 0,
  "iterate": 0,
  "restart": 0,
  "evidence": ["paths or commands"],
  "blocking_issue": "",
  "next_action": ""
}
```

## Critical Rejects
- Generated asset approved below 26/30.
- Generated row lacks workspace copy or source provenance.
- Gallery omits a generated image.
- Ledger has pending-review generated rows.
- The worker did not inspect the copied PNGs.
- A dense generated infographic is treated as final exact text.
