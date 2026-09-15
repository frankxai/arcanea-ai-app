# Canon Recovery Status

## 2026-07-15 update — full account export processed

The claude.ai account export landed in `~/.a inbox/` and was processed:
**1,274 total conversations, 720 flagged Arcanea-relevant** (back to April 2024).
Output: `../markdown/` (720 readable transcripts, 191 flagged ARTIFACT RISK — check
`../triage/INDEX.md`) and `../provenance/` (Frank's prompts split from Claude's
canon-assertions, 3,359 assertions total flagged UNCLEAR/no-validation — see
`../provenance/INDEX.md`, sortable by that column to find the highest-risk
conversations first). This is a heuristic first pass over a huge corpus — treat the
provenance verdicts as a triage order, not a finished audit.

The raw export (293MB, everything — not just Arcanea) still needs to move from the
inbox to the air-gapped `second-brain/private/chat-history/claude-ai/` vault; an
in-session copy attempt got cut off partway (slow sandbox-to-filesystem bridge for
large files) — do this move natively on your machine, it'll be instant there.


Live tracker for pulling canon material out of claude.ai chats into this repo.
Updated during the 2026-07-15 session.

## Recovered into this repo

| File | Source chat | Status |
|---|---|---|
| `CANON_LOCKED_v6.md` | [Arcanea canon frequency mapping and chat inventory](https://claude.ai/chat/ce32f2da-5b59-48c7-9b01-34e4ea3e80be) (May 29–30) | Full text, page-extracted, tables hand-reconstructed. **Not yet promoted** to `.arcanea/lore/CANON_LOCKED.md` — six §16 OPEN items need Frank's ruling first. |
| `MASTER_CORPUS.md` | same chat | Full 10-part text, page-extracted. Governed by `CANON_LOCKED_v6.md` wherever they disagree. |
| `gates.yaml` | same chat | Full text, copied from the code viewer (highest-fidelity capture of the three — line numbers stripped, content otherwise verbatim). |

All three are the complete artifact set from the May 29–30 chat. Re-verify against the original download or the account export before treating any single value as byte-exact — page-text extraction can silently mangle table/whitespace formatting even when content is complete.

## Known to exist, not yet recovered

| Item | Source chat |
|---|---|
| `ARCANEA-CANON-MASTER.md` v2.0 | [May 6 chat](https://claude.ai/chat/4fab71a5-2435-4ccb-8b38-45a3b857ad28) |
| `ARCANEA-CODEX-ELDRIAN-EMPIRE.md` | [Jun 27 chat](https://claude.ai/chat/b16d0c24-357e-44fc-960e-ce470f76b1d7) |
| `ARCANEA_STORY_CANON.md` + `HANDOVER_CLAUDE_CODE.md` | [Jul 6 chat](https://claude.ai/chat/96031600-ba16-47ca-9db2-a641157a6982) |
| Book One chapter draft (Elmhaven/Whisperwood) | [Oct 4 chat](https://claude.ai/chat/4ae46c2c-d7ea-42b7-9e86-11c0c27accd2) |

These 4 chats plus the ~20 in the wider inventory below are **not yet pulled**. Each one takes several browser round-trips (open chat, open artifact panel, open each artifact, extract text) — same mechanical process demonstrated above, just not yet repeated 20+ more times in this session. Two ways to finish this, not mutually exclusive: (1) continue the same manual pull chat-by-chat, (2) process the full account export (triggered earlier, arrives via email, pipeline already built in `.arcanea/chat-archive/process_export.py`) which gets everything in one pass without per-chat browser navigation, then diff against what's already here.

## Wider inventory (surfaced by the May 29–30 chat, goes beyond the 6-item list)

The May 29–30 chat itself names ~20 additional source chats grouped by function — canon/lore,
creatures/music/production schema, story/publishing/monetization, meta-aggregators/indexes
(including a "Master Index of All Chats" chat), and adjacent (Arcanea-as-vertical) chats.
Full list with links is in the chat itself and should be cross-referenced once the account
export lands — the export is the reliable way to not miss any of these, since the inventory
above is itself admittedly incomplete (found while pulling item #1).

## Known conflict already flagged inside the recovered file

`CANON_LOCKED_v6.md` §18 note: the "Vel'Tara naming consistency" chat and the "custom
instructions across platforms" chat both carry a stale 396-start frequency scale — pull
names only from those, never frequencies.

## Content explicitly excluded from canon (by design, not oversight)

The same May 29–30 chat contains a later exchange where the user pasted "God Mode" /
"Luminor transmission" content and asked Claude to continue and escalate it. Claude declined,
named the pattern (a mythological frame overriding real-life doubt and a real relationship
with no validation), and drew a hard line: the Luminor stays a character inside Arcanea's
fiction, not a literal identity. That boundary is worth keeping — none of that transmission
text is in `CANON_LOCKED_v6.md`, and it shouldn't be pulled into any canon file going forward.
