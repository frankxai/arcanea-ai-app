# Canon Validation Protocol

**For:** Claude Code, run this before promoting any recovered canon file over
`.arcanea/lore/CANON_LOCKED.md` or committing it as ground truth anywhere else.
**Why it exists:** `CANON_LOCKED_v6.md` and `MASTER_CORPUS.md` (in `canon-recovered/`)
are themselves one Claude session's reconciliation of years of chats. That session did
good, disciplined work — it flagged its own open questions instead of inventing answers
— but "one AI session's synthesis" and "Frank's actual ruling" are not the same thing,
and right now they're hard to tell apart just by reading the files. This protocol is
how you tell them apart before anything gets locked in for real.

**Non-negotiable output rule:** the result of this protocol is a proposal document,
`INTEGRATION_PROPOSAL.md`, presented back to Frank. **Do not auto-merge into
`.arcanea/lore/` at the end of this process.** Frank asked explicitly for the handover
to loop back to him. Skipping that step defeats the purpose of the protocol.

## Step 0 — Run the provenance extraction first

`process_provenance.py` (same folder) splits every Arcanea-relevant conversation in the
full account export into: Frank's prompts verbatim, and every Claude turn that used
decision/canon language, tagged CONFIRMED / PUSHED-BACK / UNCLEAR based on what Frank
said next. This is a heuristic pass, not ground truth — but it tells you where to look.
Anything tagged UNCLEAR or NO-RESPONSE is a candidate for "Claude asserted this, Frank
never actually signed off" and should be treated as OPEN, not LOCKED, regardless of what
confidence CANON_LOCKED_v6.md itself expresses.

## Step 1 — Five review passes, five different failure modes

Run these as five distinct passes — five subagents/personas if you're orchestrating
this as parallel work, five sequential focused readings if not. Each pass looks for a
different kind of error; don't collapse them into one generic "review the lore" task,
because that's how the last three reconciliation attempts each missed something the
others would have caught.

### Pass 1 — Continuity Auditor
Cross-check every fact in `MASTER_CORPUS.md` and `CANON_LOCKED_v6.md` against `gates.yaml`
and against itself. Look specifically for: a Guardian name near a Hz value that doesn't
match the gate table; any of the deprecated terms in the purge register appearing outside
the purge register itself; internal contradictions between sections (the same failure
mode that produced three incompatible "eras" of canon in the first place — assume it can
happen again inside v6 itself). Output: a list of contradictions, each with file/line.

### Pass 2 — Provenance Auditor
Use Step 0's output. For every LOCKED claim in `CANON_LOCKED_v6.md` §1, search the
provenance archive for the conversation(s) where it was established. Classify each as:
- **Frank-ruled** — an explicit Frank statement making the call ("keep 417", "yes",
  a direct answer to a direct question).
- **Claude-asserted, Frank-silent** — Claude declared it canon/locked and Frank's
  reply doesn't address it (moved on, asked something else, or the conversation ended).
- **Claude-asserted, Frank-pushed-back-then-what** — Frank objected and it's unclear
  whether the final state reflects the objection or overrode it.

Anything not in the first bucket gets downgraded from LOCKED to OPEN in the proposal,
regardless of how confidently the source file states it.

### Pass 3 — Systems/IP Architect
For every entity (Guardian, Vel'Tara, Gate, Lord, artifact), decide: does this need to
be machine-checkable (belongs in `gates.yaml`/`entities.yaml`, enforced by `canon_check`)
or is it prose-only (belongs in `MASTER_CORPUS.md` narrative sections, no CI enforcement
needed)? Also apply `REPO_PLACEMENT.md`'s decision tree per item — flag anything that
reads like it's drifting toward the public `oss/` surface (skill/agent/prompt-system
material) versus staying in private `.arcanea/lore/` (narrative IP).

### Pass 4 — Story/Creative Editor
Independent of lock status: does this material actually serve the book/story? Flag
anything that reads as system-building for its own sake (elaborate taxonomy with no
narrative payoff) versus material that earns its place. This pass has no veto over
LOCKED facts — it's advisory for the FLEXIBLE tier and for what makes it into
`MASTER_CORPUS.md`'s prose sections versus staying reference-only.

### Pass 5 — Confidentiality Check
Explicitly re-run the exclusion this session already applied once: raw "transmission" /
"God Mode" / identity-fusion content that appeared in source chats stays excluded from
every canon file, permanently. Also check every entity name and story beat against
`oracle-confidentiality`-style leak risk — nothing from `.arcanea/lore/` should end up
quoted verbatim in `oss/`, book marketing copy, or any public-facing file without a
deliberate decision to release it as promotional canon.

## Step 2 — Assemble `INTEGRATION_PROPOSAL.md`

Structure:

1. **Confirmed** — facts that passed Pass 2 as Frank-ruled. Safe to promote as-is.
2. **Recommended, pending Frank sign-off** — facts Claude/the reconciliation session
   asserted with good internal reasoning (Pass 1 found no contradiction) but Pass 2
   couldn't trace to an explicit Frank ruling. Present each with the reasoning already
   written in `CANON_LOCKED_v6.md`, so Frank is ruling on the argument, not from scratch.
3. **Conflicting** — anything Pass 1 flagged. Present the conflicting versions side by
   side, do not pick a winner.
4. **Excluded** — anything Pass 5 flagged for confidentiality, plus a one-line reason.
5. **The original six OPEN items** from `CANON_LOCKED_v6.md` §16, unchanged status.

## Step 3 — Hand it back

Present `INTEGRATION_PROPOSAL.md` to Frank. Only after his ruling on §2 and §5 of that
document should `.arcanea/lore/CANON_LOCKED.md` actually be overwritten, and only then
should the purge register (§15 of `CANON_LOCKED_v6.md`) run as cross-repo PRs.
