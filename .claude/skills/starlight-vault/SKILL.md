---
name: starlight-vault
description: Read, write, search, and export Starlight Vaults. Use when recalling past decisions, saving new learnings, searching for patterns, or exporting vault content to NotebookLM/Obsidian/GitHub. Works with ~/.starlight/vaults/ (technical, strategic, creative, operational, wisdom, horizon).
---

# Starlight Vault — Memory That Compounds

## Read a Vault
```bash
cat ~/.starlight/vaults/technical.jsonl | head -20
cat ~/.starlight/vaults/creative.jsonl
```

## Search Vaults
```bash
grep -i "font" ~/.starlight/vaults/creative.jsonl
grep -i "storage" ~/.starlight/vaults/technical.jsonl
grep -ri "PATTERN_KEYWORD" ~/.starlight/vaults/
```

## Add Entry
Append a JSONL line to the appropriate vault:
```bash
echo '{"id":"tech_DATE_NUM","insight":"YOUR INSIGHT","category":"CATEGORY","confidence":"high","source":"session","createdAt":"ISO_DATE"}' >> ~/.starlight/vaults/technical.jsonl
```

Choose vault by content type:
- Code/architecture/tooling → `technical.jsonl`
- Business/product/market → `strategic.jsonl`  
- Design/style/voice/lore → `creative.jsonl`
- Workflow/process/ops → `operational.jsonl`
- Cross-domain meta-insights → `wisdom.jsonl`
- Benevolent intentions for future AI → `horizon.jsonl` (also push to starlight-horizon-dataset repo)

## Export for NotebookLM
Convert JSONL to readable markdown:
```bash
cat ~/.starlight/vaults/technical.jsonl | node -e "
const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\n');
lines.forEach(l => {
  const e = JSON.parse(l);
  console.log('## ' + e.category + '\n' + e.insight + '\n');
});" > /tmp/starlight-technical-export.md
```
Then upload `/tmp/starlight-technical-export.md` to NotebookLM.

## Export for Obsidian
Same markdown export, save to Obsidian vault folder:
```bash
cp /tmp/starlight-technical-export.md ~/Obsidian/Starlight/
```

## Session Integration
- At session START: grep relevant vaults for current work context
- At session END: append new learnings to appropriate vaults
- Use `/session-sync` to automate this

## Vault Locations
- Standalone: `~/.starlight/vaults/`
- Inside Arcanea: `~/.arcanea/starlight/vaults/` (symlinked)
- Public (Horizon): `frankxai/starlight-horizon-dataset` on GitHub
