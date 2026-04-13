---
title: /capture — Universal Inbox Writer
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P0
effort: 2 hours
links: [README, ../meta/inbox-architecture]
---

# /capture

**Purpose:** Write an idea, task, or reference into Linear `ARC-INBOX` in under 5 seconds, from any session, without leaving flow state.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "capture", "add to inbox", "note this", "remember this", or expresses an idea they want to preserve without leaving their current task. Also trigger on `/capture` explicit invocation.

## Usage

```
/capture "Build an AI DJ skill that generates transition playlists" --brand MUS --type idea
/capture "Fix the broken vercel payment on arcanea.ai" --brand ARC --type bug
/capture "Dispenza morning meditation insight: the quantum field responds to coherent emotion" --brand FX --type reference
```

Arguments:
- `"<description>"` — required, the idea/task/reference text
- `--brand` — ARC / FX / SIS / MUS / BIZ. If omitted, agent infers from context or asks once.
- `--type` — idea / task / bug / content / decision / reference. If omitted, agent infers.
- `--tier` — T1 / T2. Defaults to T2. T0 triggers refusal.

## Behavior

1. **Refuse T0.** If description contains password, API key pattern, seed phrase, or government ID → respond: "T0 material. Store in KeePassXC. Nothing written." Log nothing.

2. **Infer metadata.** If `--brand` or `--type` not provided:
   - Check current session context (which repo, which skill was last invoked)
   - Scan description for brand keywords (`arcanea`, `frankx`, `sis`, `music`, `bv`, `oracle`, etc.)
   - Default to ARC if ambiguous

3. **Title extraction.** First sentence or first 80 chars of description becomes the Linear issue title. Rest becomes description body.

4. **Create Linear issue via MCP.**
   - Project: `ARC-INBOX` (ID TBD once created in Phase 2)
   - Status: `Inbox`
   - Labels: `tier:T2`, `brand:{BRAND}`, `type:{TYPE}`, `source:chat`
   - Title: extracted
   - Description body: full input + `Captured: 2026-04-10 from Cowork session`

5. **Link enrichment.** Scan wiki for articles matching keywords in title → add `Related wiki:` lines to description with file paths.

6. **Return confirmation.**
   ```
   ✓ Captured → ARC-INBOX (ARC-123)
   Brand: MUS | Type: idea
   Related: wiki/music/overview.md
   ```

## Acceptance Criteria

- [ ] Runs in < 5 seconds
- [ ] Creates Linear issue with all required labels
- [ ] Refuses T0 material (test with "my password is hunter2")
- [ ] Auto-detects brand for obvious cases
- [ ] Returns Linear issue URL in confirmation

## Implementation Notes

- Use `mcp__89363126-...__save_issue` for Linear write
- `ARC-INBOX` project ID must be stored in skill config after Phase 2 creation
- Brand detection: keyword dictionary in `scripts/brand-detect.py`
- T0 refusal: regex check for `(?i)(password|api[_-]?key|sk-[a-z0-9]{20,}|bearer\s+|ssn|seed\s*phrase)`

## Dependencies

- Linear MCP connected ✓
- `ARC-INBOX` project created (Phase 2) ⬜
- Linear label taxonomy configured ⬜

---

*The first skill to build. Everything else depends on capture being effortless.*
