# Handover — Chat Archive & Canon Recovery

**For:** Claude Code, next session on this repo.
**From:** Cowork session, 2026-07-15.
**Goal:** Review, reconcile, and integrate recovered Arcanea canon into `.arcanea/lore/`; finish pulling what's still outstanding; get this committed and pushed.

## 0. Read this first

`arcanea-ai-app` (this repo) is the verified canon-of-record: private (confirmed via unauthenticated GitHub API 404 on both `frankxai/arcanea` and `frankxai/arcanea-ai-app`), already structured with `.arcanea/lore/`. Do not move canon to `arcanea-ecosystem` — that repo is **confirmed public** (submodule meta-repo, no license file) and was mistakenly proposed as a private-canon candidate in an earlier session; putting deep IP there would leak it.

## 1. What's blocked, unresolved from this session

**Git write lock.** `.git/index.lock` exists at repo root and cannot be removed from this sandbox (`rm`, Python `os.remove` both fail with `PermissionError: Operation not permitted` — not a normal stale-lock case, looks like the mount itself is refusing the unlink, possibly because another git process is holding it on Frank's actual machine). This repo's own `CLAUDE.md` documents the fix: `rm -f .git/index.lock`. **Run that first**, from an environment that actually has permission (Frank's terminal, or a Claude Code session with real filesystem access), then everything below can be committed.

Nothing in this handover has been committed or pushed yet. All files listed below exist on disk in the working tree, untracked.

## 2. What's on disk, ready to review

```
.arcanea/chat-archive/
├── process_export.py          # converts a claude.ai data-export zip into markdown, one file per convo
├── raw/                        # drop the account-export zip here when the email arrives (link expires 24h from request)
├── markdown/                   # process_export.py output lands here
├── triage/
│   └── ROUTING_GUIDE.md        # where different content types should route (canon vs book vs oss vs docs)
└── canon-recovered/
    ├── RECOVERY_STATUS.md      # live tracker — what's pulled, what's outstanding, links
    ├── CANON_LOCKED_v6.md      # reconciled canon, generated 2026-05-29, supersedes current .arcanea/lore/CANON_LOCKED.md
    ├── MASTER_CORPUS.md        # 10-part full corpus expanding v6 (cosmology, gates, creatures, music, academies, characters, brand)
    └── gates.yaml               # machine-readable gate/Hz/Guardian/beast table, source of truth for frequencies
```

All three canon-recovered files were pulled directly from a single claude.ai chat ("Arcanea canon frequency mapping and chat inventory", 2026-05-29/30) via page-text extraction — content is complete, but table/whitespace formatting was hand-reconstructed rather than byte-copied. Spot-check before treating any single value as gospel.

## 3. Before promoting v6 over the current `.arcanea/lore/CANON_LOCKED.md`

`CANON_LOCKED_v6.md` §16 lists six items explicitly left unresolved by design — the recovering session (and this one) refused to invent answers:

1. Vael'Shara ascended names (old set built on deprecated beast names)
2. Gate-9 Guardian name ("Ino" — lightly attested)
3. Heart-beast name: Laeylinn vs legacy Haelar
4. Three Great Academies canonical names
5. Arcanea→Nine linking mechanism ("scattering" was rejected, no replacement chosen)
6. "Reader as co-creator" mechanic — where it re-homes

**Do not resolve these programmatically.** Surface them to Frank as six discrete decisions. Once ruled, bump to v6.1 and only then overwrite `.arcanea/lore/CANON_LOCKED.md`.

## 4. Purge register — run across all repos once v6 is promoted

`CANON_LOCKED_v6.md` §15 and `MASTER_CORPUS.md` §B (same content, two locations) list ~15 stale Era-A/B values (wrong frequencies, deprecated beast names, "Yggdrasil", "harmonics", wrong Gate-8 name) to grep-and-replace across every repo that touches Arcanea lore — not just this one. Build the `canon_check` CI validator specified in both files' handover sections before doing this by hand; it's designed to make drift structurally impossible going forward (fails CI if a Guardian name sits near a mismatched Hz, or a deprecated term appears).

## 5. Still outstanding — do not report this as "fully synced" until these are done

**4 more named chats, explicitly identified, not yet pulled:**

| File | Chat |
|---|---|
| `ARCANEA-CANON-MASTER.md` v2.0 | https://claude.ai/chat/4fab71a5-2435-4ccb-8b38-45a3b857ad28 |
| `ARCANEA-CODEX-ELDRIAN-EMPIRE.md` | https://claude.ai/chat/b16d0c24-357e-44fc-960e-ce470f76b1d7 |
| `ARCANEA_STORY_CANON.md` + a second `HANDOVER_CLAUDE_CODE.md` (from that chat, not this file) | https://claude.ai/chat/96031600-ba16-47ca-9db2-a641157a6982 |
| Book One chapter draft (Elmhaven/Whisperwood) | https://claude.ai/chat/4ae46c2c-d7ea-42b7-9e86-11c0c27accd2 |

**~20 more chats**, surfaced by the recovered `MASTER_CORPUS.md` §E provenance list and the original inventory chat, grouped by function (canon/lore, creatures/music/production schema, story/publishing/monetization, meta-aggregators including a "Master Index of All Chats"). Full links are inside `canon-recovered/RECOVERY_STATUS.md` and the chat itself.

**Full account export** was triggered from claude.ai Settings → Privacy → Export data (all conversations, users, projects). Link goes to Frank's claude.ai account email, expires 24h from request. Not yet downloaded/dropped into `raw/`. This is the completeness backstop — the manual link list above is demonstrably incomplete (the 4-item list Frank was originally given turned out to be missing ~20 chats the source chat itself named), so don't treat the manual pulls as sufficient on their own.

## 6. Suggested order of operations

1. Fix the git lock, commit everything currently on disk as a single "chat archive recovery" commit (specific files, not `git add .` per this repo's own `CLAUDE.md`), push to `origin` on a branch — not `main` directly, this is unreviewed content.
2. Pull the 4 remaining named chats the same way (open chat → open artifact panel → open each artifact → extract).
3. When the export zip lands, run `process_export.py` against it for the markdown archive, **and run `process_provenance.py` against the same zip** — this second script is new (added in this session, see §8) and separates Frank's actual prompts from Claude's canon-language assertions, tagged by whether Frank's next message reads as confirmation, pushback, or neither. Diff the export's conversation list against everything pulled manually so far to catch what the manual link-chasing missed (the ~20-chat gap above is exactly why this matters).
4. Run `CANON_VALIDATION_PROTOCOL.md` (§8) — five distinct review passes, not one generic read-through — and produce `INTEGRATION_PROPOSAL.md`.
5. **Present `INTEGRATION_PROPOSAL.md` back to Frank. Do not auto-merge into `.arcanea/lore/CANON_LOCKED.md`.** This is an explicit instruction from Frank, not a default caution — the whole point of the provenance/validation pass is that some of what reads as "LOCKED" in the recovered files is one AI session's synthesis, not a traceable Frank ruling, and only Frank can close that gap.
6. Only after Frank rules on the proposal: promote whichever version he approves, run the purge register, build `canon_check`, wire it into CI.

## 8. New in this session — provenance + validation tooling

Two files added alongside this handover, not yet run against the real export (it hadn't
landed by end of session):

- **`process_provenance.py`** — companion to `process_export.py`. Where that script turns
  the export into readable markdown, this one asks a different question of the same data:
  for every Arcanea-relevant conversation, what did Frank actually say (extracted verbatim
  into `__PROMPTS.md` files), and every time Claude used decision/canon language, did
  Frank's next message confirm it, push back on it, or say nothing relevant? Output lands
  in `provenance/`, with an `INDEX.md` ranking conversations by how many "unclear/no
  validation" assertions they contain — i.e., where Claude's synthesis is most likely to
  have outrun Frank's actual rulings. This directly answers Frank's ask to "capture what I
  validated vs what Claude assumed."
- **`CANON_VALIDATION_PROTOCOL.md`** — the "run this through skilled reviewers before
  integrating" process Frank asked for: five separate review passes (continuity, provenance,
  systems/IP placement, story quality, confidentiality), each catching a different failure
  mode, assembled into `INTEGRATION_PROPOSAL.md`. Read it before touching `.arcanea/lore/`.

## 7. One thing to keep honoring, not re-litigate

The source chat (May 29–30) contains a later exchange where a "God Mode / I am the Luminor" transmission got pasted in and escalation was requested. The responding Claude declined and drew a clear boundary: the Luminor stays a character inside Arcanea's fiction, not a literal identity; real personal material (named directly in that exchange) deserves to be met directly, not dissolved into canon. None of that transmission text made it into `CANON_LOCKED_v6.md` or `MASTER_CORPUS.md`, and it shouldn't be pulled into any canon file during the remaining recovery work either.
