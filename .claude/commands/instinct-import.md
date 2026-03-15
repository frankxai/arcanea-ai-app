# /instinct-import — Import Starlight Fragments

Import Starlight Fragments from an external YAML file into the vault.

## What to do

1. Accept a file path argument: `/instinct-import <path-to-yaml>`
2. Validate the file exists and contains valid YAML with fragment frontmatter
3. Run `bash skills/starlight-vault/scripts/instinct-cli.sh import <file>`
4. Report how many fragments were imported and their domains
5. Imported fragments go to `inherited/` — they don't overwrite personal fragments

## Validation

Each fragment in the file must have:
- `id` — unique identifier
- `trigger` — when this fragment activates
- `confidence` — 0.0-1.0 range
- `domain` — one of the recognized domains

## Safety

- Fragments with confidence > 0.9 are capped at 0.8 on import (must earn full confidence locally)
- Duplicate IDs are skipped with a warning
- No executable code in fragments — only declarative patterns
