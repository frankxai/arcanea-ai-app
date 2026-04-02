# NFT / Agent Research Artifacts

These files are preserved as experimental research artifacts and are not part of
the production Arcanea runtime or deployment surface.

## Why they were moved here

- They are one-off generators or spreadsheet builders.
- They assume local Windows paths under `C:/Users/frank/Arcanea/output/...`.
- Some of them depend on ad hoc local config like `.nano-banana-config.json`.
- They are useful as reference material for NFT/agent exploration, but they are
  not verified, integrated, or safe to present as product code.

## Files

- `collection-v1-gen.js`
- `create-agent-strategy.py`
- `create-tracker.py`
- `model-comparison.js`
- `update-agent-strategy.py`

## Rules

1. Do not import these from app/runtime code.
2. Do not promote these to `main` production paths without a separate review.
3. If any idea here becomes real product work, rewrite it into a scoped tool or
   planning artifact with:
   - explicit inputs/outputs
   - no hardcoded personal paths
   - no hidden local credential assumptions
   - verification commands
