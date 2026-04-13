---
title: /inbox-triage — Daily 9am Batch Review
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P0
effort: 1 day
links: [README, capture, ../meta/inbox-architecture]
---

# /inbox-triage

**Purpose:** Process all items in Linear `ARC-INBOX` with status=`Inbox` in one batch operation. Target: 15 minutes daily, 3 minutes with pre-analysis.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "triage inbox", "review inbox", "process inbox", "daily triage", or explicitly invokes `/inbox-triage`. Also trigger during scheduled daily 9am reminder.

## Usage

```
/inbox-triage
/inbox-triage --dry-run    # preview decisions without executing
/inbox-triage --since 2d   # triage items created in last 2 days only
```

## Behavior

### Phase 1: Fetch (1-2s)

1. Query Linear for all `ARC-INBOX` issues with status=`Inbox`, sorted by created ASC
2. If count > 100: warn Frank about bankruptcy protocol, offer bulk-drop option
3. Load wiki index (READMEs of all domains) for link enrichment

### Phase 2: Analyze (5-10s)

For each inbox item, propose one of three decisions:

**A. Drop** proposal when:
- Duplicate of an existing Linear issue (title similarity > 0.85)
- Already resolved in last 30 days (matches a recent `Done` issue)
- Trivial/transient ("check twitter", "feeling tired today")

**B. Route** proposal when:
- Clearly maps to an existing project (brand label + content analysis)
- Has a clear owner (only Frank for now, but future-proof for agents)
- Is actionable within the current sprint cycle

**C. Park** proposal when:
- Brand unclear
- Requires more thought
- Is a decision-in-progress
- Is an idea that needs research

Scoring heuristic:
```python
def classify(item):
    if is_duplicate(item): return ("drop", "duplicate")
    if is_trivial(item): return ("drop", "trivial")
    if has_clear_project(item): return ("route", project_id)
    if is_decision_candidate(item): 
        return ("park", "decision-draft-needed")
    return ("park", "needs-analysis")
```

### Phase 3: Present (instant)

Render a single batch review to Frank:

```
Inbox Triage — 2026-04-10 09:00
14 items in ARC-INBOX

PROPOSED:
  Drop (3):
    - ARC-247  "check twitter" (trivial)
    - ARC-241  "fix vercel billing" (duplicate of ARC-189)
    - ARC-235  "think about logo" (trivial)

  Route (7):
    - ARC-248 → FrankX.ai    "newsletter section on creator OS"
    - ARC-246 → Arcanea       "mcp-server: add sequence diagram view"
    - ARC-245 → SIS          "Trinity AI follow-up email draft"
    - ARC-244 → Music         "remix workflow w/ Suno v5"
    - ARC-243 → Arcanea       "Luminor kernel v2 spec"
    - ARC-242 → Business Ops  "april cash flow forecast"
    - ARC-240 → Arcanea       "fix glass card backdrop blur"

  Park (4):
    - ARC-239  "houseboat financing options?" (decision)
    - ARC-238  "workshop format v3 ideas" (needs-analysis)
    - ARC-237  "collab with @marbella_creators?" (unclear brand)
    - ARC-236  "AI architecture whitepaper?" (decision)

Confirm (y/n), override with edits, or abort?
```

### Phase 4: Execute (5-10s)

On Frank's confirmation:
1. Run all Drop operations in parallel
2. Run all Route operations in parallel (project change + status change + cycle assignment)
3. Run all Park operations in parallel (status change to `Triaged`, move to `Parked` cycle)
4. For each Parked item that was classified as `decision-draft-needed`, create a stub at `wiki/decisions/2026-04-10-{slug}.md` with the item description as seed content
5. Report summary with count, time elapsed, and links

### Phase 5: Post-triage (optional)

- Update `wiki/meta/triage-log.md` with date, count, decisions
- If any Routed items had `ship-it` label, queue them for `/ship-it`
- If inbox is clean (count=0), log green status

## Acceptance Criteria

- [ ] Processes 20 items in < 15 seconds
- [ ] Never auto-executes without Frank confirmation
- [ ] Dry-run mode works
- [ ] Handles bankruptcy scenario gracefully
- [ ] Creates decision drafts for Parked decisions
- [ ] Logs triage history to `wiki/meta/triage-log.md`

## Implementation Notes

- Use Linear `list_issues` with project filter + status filter
- Use Linear `save_issue` for updates (project, status, labels, cycle)
- Duplicate detection: simple token-set similarity on titles (no embeddings for v1)
- Brand inference: keyword dict + project tag history
- Decision draft creation: use existing wiki template at `wiki/decisions/_template.md` (create this template)

## Dependencies

- `/capture` deployed and in use (for inbox to have items)
- `ARC-INBOX` project created with all labels configured
- Wiki decisions template exists
- Linear cycles configured for each brand project

---

*Triage is the keystone ritual. Without it, the inbox becomes a graveyard and the second brain dies.*
