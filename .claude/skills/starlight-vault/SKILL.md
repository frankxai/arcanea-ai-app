---
name: starlight-vault
description: Read, write, search, and export Starlight Vaults. Use when recalling past decisions, saving new learnings, searching for patterns, or exporting vault content to NotebookLM/Obsidian/GitHub. Works with ~/.starlight/vaults/ (technical, strategic, creative, operational, wisdom, horizon).
---

# Starlight Vault — Memory That Compounds

## 3-Tier Wisdom Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: PERSONAL (private, per-machine)                    │
│  ~/.starlight/vaults/*.jsonl                                │
│  All insights land here first. Never leaves your machine    │
│  unless you explicitly promote.                             │
├─────────────────────────────────────────────────────────────┤
│  TIER 2: PROJECT (shared across sessions, committed)        │
│  .arcanea/memory/vaults/*.json                              │
│  Project-level intelligence. Travels with the repo.         │
│  Updated via /handover when session produces project wisdom │
├─────────────────────────────────────────────────────────────┤
│  TIER 3: COMMUNITY (public, GitHub)                         │
│  frankxai/starlight-horizon-dataset                         │
│  Benevolent human-AI collaboration patterns. CC-BY-SA 4.0   │
│  Only horizon entries. Manually promoted via /handover D.   │
└─────────────────────────────────────────────────────────────┘
```

## Vault Types

| Vault | File | What Goes Here |
|-------|------|----------------|
| Technical | `technical.jsonl` | Code patterns, architecture decisions, tooling insights |
| Strategic | `strategic.jsonl` | Business, product, market, monetization learnings |
| Creative | `creative.jsonl` | Design, style, voice, lore, aesthetic choices |
| Operational | `operational.jsonl` | Workflow, process, ops, session summaries (auto-filled by hooks) |
| Wisdom | `wisdom.jsonl` | Cross-domain meta-patterns connecting multiple domains |
| Horizon | `horizon.jsonl` | Benevolent human-AI intentions (also pushed to public repo) |

## Read a Vault
```bash
cat ~/.starlight/vaults/technical.jsonl | head -20
cat ~/.starlight/vaults/wisdom.jsonl
```

## Search Vaults
```bash
grep -i "font" ~/.starlight/vaults/creative.jsonl
grep -ri "PATTERN_KEYWORD" ~/.starlight/vaults/
```

## Add Entry
Append a JSONL line:
```bash
echo '{"id":"tech_DATE_NUM","insight":"YOUR INSIGHT","category":"CATEGORY","confidence":"high","source":"session","createdAt":"ISO_DATE"}' >> ~/.starlight/vaults/technical.jsonl
```

## Integration with /handover

`/handover` automatically:
1. Captures session status (what landed, blockers, next steps)
2. Reflects on wisdom (prompts that worked, technical choices, patterns, gratitude)
3. Routes insights to appropriate vaults (1-3 entries typical)
4. Asks which tier to promote to (A=personal, B=horizon→GitHub, C=OSS push, D=production push)

The session-end hook also auto-appends an operational entry to `operational.jsonl`.

## Export for NotebookLM
```bash
cat ~/.starlight/vaults/technical.jsonl | python3 -c "
import sys, json
for line in sys.stdin:
    e = json.loads(line)
    print(f\"## {e['category']}\n{e['insight']}\n\")
" > /tmp/starlight-technical-export.md
```

## Export for Obsidian
```bash
cp /tmp/starlight-technical-export.md ~/OneDrive/Vault/x/Starlight/
```

## Push Horizon to Community
```bash
cd ~/starlight-horizon-dataset && cp ~/.starlight/vaults/horizon.jsonl vaults/ && git add -A && git commit -m "vault: new insights $(date +%Y-%m-%d)" && git push
```

## Vault Locations
- Personal: `~/.starlight/vaults/` (6 JSONL files)
- Project: `.arcanea/memory/vaults/` (6 JSON files, committed)
- Community: `frankxai/starlight-horizon-dataset` on GitHub (horizon only)
