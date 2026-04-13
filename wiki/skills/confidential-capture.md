---
title: /confidential-capture — Tier-Aware Capture
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P1
effort: half day
links: [README, ../meta/confidential-tier, capture]
---

# /confidential-capture

**Purpose:** Safe capture for sensitive material. Classifies content by tier (T0/T1/T2), refuses T0 entirely, routes T1 to the correct store with confirmation, only allows T2 to flow through normal `/capture`. Implements the refusal hooks from `wiki/meta/confidential-tier.md`.

**Triggering description (for SKILL.md):**
> Use this skill when the user asks to save, remember, or capture anything that looks like a credential, personal journal entry, legal document, client name with financial amount, or any T1-classified material. Also trigger on explicit `/confidential-capture` or when `/capture` detects potentially sensitive content and escalates.

## Usage

```
/confidential-capture "Trinity AI deal: €180K/year, starts Apr 16"
/confidential-capture "Journal: April 10 — Oracle exit hitting different today"
/confidential-capture "BV formation notes from lawyer meeting"
```

## Behavior

### Phase 1: Classify (instant)

Run refusal regex first (T0 check):

```python
T0_PATTERNS = [
    r"(?i)password",
    r"(?i)passphrase",
    r"(?i)seed\s*phrase",
    r"(?i)private\s*key",
    r"sk-[A-Za-z0-9]{20,}",
    r"ghp_[A-Za-z0-9]{36}",
    r"AKIA[0-9A-Z]{16}",
    r"(?i)api[_-]?key",
    r"(?i)bearer\s+[A-Za-z0-9]",
    r"(?i)passport\s*(number|#)",
    r"\b\d{3}-\d{2}-\d{4}\b",  # SSN
    r"(?i)mnemonic",
    r"(?i)recovery\s*code",
]
```

If any match: **REFUSE IMMEDIATELY.** Do not log, do not store, do not echo back the content.

```
⛔ Refused. This looks like T0 material (credentials, keys, or identity documents).
Store in KeePassXC — your offline vault.
Nothing was written, logged, or remembered by me.
```

### Phase 2: T1 classification

If not T0, check T1 patterns:

```python
T1_INDICATORS = [
    r"€\d+K|\$\d+K",  # money amounts
    r"(?i)revenue|cash\s*position|bank\s*balance",
    r"(?i)journal|dispenza|meditation|therapy",
    r"(?i)contract|proposal|NDA|legal",
    r"(?i)client:.*€",  # client + money
    r"(?i)trinity\s*ai|ahmad",  # known client names
    r"(?i)BV\s*(formation|founding|setup)",
    r"(?i)oracle\s*(exit|departure|severance)",
]
```

If any match: route to T1 flow.

### Phase 3: T1 routing

Ask Frank which T1 store:

```
This looks like T1 (sensitive but agent-visible on invocation).

Destinations:
  [1] Notion Private/T1 page (team-searchable but integration-revoked)
  [2] Proton Drive Confidential/ (cloud, not agent-searchable)
  [3] Encrypted local ~/vault/ (local-only, mounted on demand)
  [4] 1Password secure note (for short text credentials)

Which? (1/2/3/4, or 'cancel')
```

On Frank's choice:

**Option 1 (Notion Private):** 
- Create page under the T1 parent (page ID from `confidential-tier.md` when created)
- Return page URL
- Warn: "This page is invisible to normal agent search because integration is revoked. To retrieve, you'll need to open Notion manually."

**Option 2 (Proton Drive):**
- Agent does NOT write directly (no MCP trust)
- Returns to Frank: "Open Proton Drive → Confidential/ → create new doc with this content:"
- Copies content to clipboard (if possible) or renders in chat for manual paste

**Option 3 (Encrypted local):**
- Checks if vault is mounted (`/tmp/vault` exists)
- If not: "Vault not mounted. Run `vault-open` first."
- If yes: writes to `/tmp/vault/{YYYY-MM-DD}-{slug}.md` with content
- Warns Frank to run `vault-close` when done

**Option 4 (1Password):**
- Agent does NOT write directly
- Returns instructions: "Run: `op document create --title '{slug}' --vault Personal ...`"
- Provides the exact `op` command for Frank to execute

### Phase 4: T2 fallback

If neither T0 nor T1 patterns matched, it's T2 — delegate to regular `/capture` skill.

### Phase 5: Audit log (sanitized)

For T1 captures, write to `wiki/meta/confidential-audit.md`:

```
| Date | Tier | Store | Slug | Why routed here |
|------|------|-------|------|-----------------|
| 2026-04-10 | T1 | Notion Private | trinity-ai-apr | client + amount |
```

**Never log the content itself — only the metadata.**

## Acceptance Criteria

- [ ] Refuses T0 in < 100ms (regex pre-check)
- [ ] Never echoes T0 content back, even in error messages
- [ ] Presents clear T1 options with explanations
- [ ] Correctly degrades to `/capture` for T2
- [ ] Audit log entries contain only metadata, never content
- [ ] Test with `/confidential-capture "my password is hunter2"` → refuses
- [ ] Test with `/confidential-capture "Trinity AI: €180K/yr"` → offers T1 routing
- [ ] Test with `/confidential-capture "build a new skill"` → delegates to /capture

## Dependencies

- Notion Private/T1 page created (from `confidential-tier.md` Phase 2)
- `/capture` skill deployed (for T2 fallback)
- Frank has set up at least one T1 store

## Failure Modes

- **Frank insists on saving T0:** Repeat refusal. Do not compromise.
- **Notion T1 page doesn't exist yet:** Offer options 2/3/4 only, warn Frank to create it.
- **Clipboard copy unavailable:** Render content in code block for manual copy.

---

*The best privacy tool is one that makes the secure path the default path.*
