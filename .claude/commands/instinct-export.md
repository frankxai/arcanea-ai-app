# /instinct-export — Export Starlight Fragments

Export all personal Starlight Fragments from the vault for sharing or backup.

## What to do

1. Run `bash skills/starlight-vault/scripts/instinct-cli.sh export` to get YAML output
2. Save the output to a file the user can share: `starlight-fragments-export-YYYY-MM-DD.yaml`
3. Report how many fragments were exported, grouped by domain
4. Include both global and project-specific fragments

## Options

- `--global-only` — Only export global (cross-project) fragments
- `--project-only` — Only export current project fragments
- `--min-confidence 0.7` — Only export fragments above confidence threshold

## Notes

- Inherited fragments are NOT exported (they came from elsewhere)
- Arcanean default fragments are NOT exported (they ship with the plugin)
- Secrets are never included in exports (scrubbed during observation)
