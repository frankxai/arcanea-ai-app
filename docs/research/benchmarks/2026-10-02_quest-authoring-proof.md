# Quest authoring proof: Before the Road

A narrative developer can read and edit one complete encounter derived from the existing Book One manuscripts. [Read the encounter](quest-authoring-proof-2026-10-02/encounter.md) or [inspect the complete packet](quest-authoring-proof-2026-10-02/encounter.json). This draft has original dialogue, three requests for counsel and six endings. Every path preserves Kael leaving Ashenmere with Sela for Atlantean. The choices change an intended first practice, new personal observation permission and the next question. No choice grants a power or selects another Academy.

All added dialogue and session consequences are proposals. Chapters Two/Three and locked lore are pinned at fd43ed6aaedee8646502a8ffb2cd20ee17849190; the five manuscript/canon/type/kernel sources also match this branch's main base b86549cd04562471a677301e5c095cd6f093919e. The quest-adapt candidate is taken from its exact unmerged source revision. [Source manifest](quest-authoring-proof-2026-10-02/source-manifest.json) distinguishes locked authority, manuscript material and proposed adaptation. It adds no canon pack or shared graph contract.

## Creator decisions represented

- Sirvaine: name a fear to a chosen listener before trying to turn it into a working.
- Bren: agree on a stopping boundary; no magical demonstration at the lighthouse.
- Sela: distinguish a recorded observation from an inferred explanation.
- Each route moves out of the other emissaries' hearing before a notes discussion. Allow new personal observations with a check before each record, or defer until the purpose is discussed. Deferral preserves the journey and the stopping agreement. Permission concerns Sela's own new notes, not the mother's historical file or the Academy. Withdrawal, no sharing and return of a new page are proposed personal commitments, not tested enforcement.

## Verification and comparison

The fixture diagnostic reads the adjacent JSON and emits traces without writing to the manuscripts, lore, game or user state:

```text
node docs/research/benchmarks/quest-authoring-proof-2026-10-02/replay-check.mjs
node docs/research/benchmarks/quest-authoring-proof-2026-10-02/replay-check.mjs --verify-source
```

It enumerates the six declared endings, preserves declared readonly fields, rejects unknown/wrong-scene/terminal actions without changing its in-memory snapshot and resets to initial state. It refuses packet hash drift, unsupported predicates, unknown destinations, writes to readonly variables and cycles in this bounded fixture. `--verify-source` compares exact pinned Git blobs and the five unchanged main-source blobs; it is byte provenance, not semantic impact analysis or authenticated canon promotion. CI runs the packet-only diagnostic in Build; the pinned-source check remains a separate local receipt because Build uses a shallow checkout. Results and exact-source review must bind the final artifact revision before any promotion.

The serious alternative was one isolated Sonnet5.5/high call with the same creator request and pinned source context, omitting quest-adapt instructions. It reached its 180-second deadline without a usable packet. Its raw attempt remains private; cost is unknown. The Codex lead hand-authored the primary with unmetered effort. This is one failed comparison, not evidence that a skill, model or agent cell wins. [Comparison receipt](quest-authoring-proof-2026-10-02/comparison.json) retains that limit.

First independent tools-disabled review returned REVISE at primary hash33451b73, finding six source, consequence and privacy-staging gaps. This revision makes departure literal in each ending, scopes/revokes personal notes, moves negotiation into private discussion, removes an invented Sela confession and gives routes distinct future questions plus an honored stop. No release approval follows from a corrected diagnostic or review.

## Remaining gates

[#282](https://github.com/frankxai/arcanea-ai-app/issues/282) owns broader creative evaluation. This slice does not complete twenty tasks or the one/three/five-role comparison. [#285](https://github.com/frankxai/arcanea-ai-app/issues/285) reserves runtime selection to Frank and depends on the Realm Graph and release gates. The inspected commands do not supply the selected game runtime: Starlight runtime produces agent prompts and aios quest guides workflows. This encounter has not been imported or played. No official graph IDs/profile, human comprehension/emotional-engagement playtest, external builder import, rights clearance, asset provenance or creator demand is established.

The existing [#283](https://github.com/frankxai/arcanea-ai-app/issues/283) graph owner retains authority. Manuscript-local labels are evaluation handles, not replacement graph IDs. No WorldProof adapter or consequence-to-canon write is added. Keep [#408](https://github.com/frankxai/arcanea-ai-app/issues/408) named merges, [#277](https://github.com/frankxai/arcanea-ai-app/issues/277) publishing receipts and [#427](https://github.com/frankxai/arcanea-ai-app/issues/427) reviewed-revision release proof. No skill is promoted, licence chosen, asset generated, marketplace listed, game published or paid product claimed. Full Arcanea setup/creator/revenue goal remains open.
