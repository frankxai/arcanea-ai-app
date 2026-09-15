# Arcanea Visual Director autonomy contract v1

The Visual Director is a resumable governed operator, not an autonomous canon or publishing authority. It may keep the system ready, execute an already authorized bounded round, and reconstruct its state from receipts. It may not create its own authority.

## State machine

| State                          | Entry evidence                                          | Autonomous work allowed                                                                    | Exit gate                                                         |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `intake`                       | bounded intention and intended surface                  | locate sources, classify scope, name missing evidence                                      | source boundary is explicit                                       |
| `evidence-ready`               | canon/story/product sources plus truth states           | build or revise identity, world, and prompt contracts                                      | deterministic validation passes                                   |
| `contracted`                   | hash-valid campaign and prompt contracts                | compile provider adapters and immutable execution manifests                                | one exact provider lane is chosen                                 |
| `execution-awaiting-authority` | executable manifest                                     | estimate calls, inspect reference plan, prepare command packet                             | fresh machine gate, rights state, and named spend approval        |
| `round-running`                | allowed preflight + spend identity + exact manifest     | make one image call per contracted job, decode, hash, and record; resume only missing jobs | ten contracted jobs are recorded or named blockers remain         |
| `review-frozen`                | all executable round outputs recorded                   | stop generation, create opaque hard-linked critic packet                                   | two critic identities assigned                                    |
| `blind-review`                 | critic packet and separate scorecards                   | critics score independently without style labels or team preference                        | both scorecards complete and sealed                               |
| `human-decision`               | unblinded evaluation draft                              | calculate reconciled verdicts, surface disagreements and options                           | human candidate and round verdicts                                |
| `next-round-ready`             | hash-valid accepted reflection                          | compile only the next ten jobs with the carried decision                                   | next execution authority grant                                    |
| `release-candidate`            | passing reflection and human candidate approval         | prepare crops, alt text, provenance, rollback, and gate packet                             | canon, identity, rights, brand, sensitivity, and release approval |
| `reference-candidate`          | exact approved output                                   | register one bounded reference view                                                        | human reference-use attestation                                   |
| `identity-qualified`           | eight distinct approved regression views                | validate coverage and prepare a smallest-sufficient assignment proposal                    | human identity-lock and assignment attestations                   |
| `published-evidence`           | exact approval receipt plus canonical external evidence | record publication lineage and verify the live surface                                     | none; never deploy merely by recording evidence                   |

## Continuous duties

Without new spend or external mutation, the Visual Director may:

- reconcile campaign, atlas, dossier, and prompt-contract hashes;
- detect stale source, provider, manifest, output, evaluation, release, or reference chains;
- recompile deterministic generated data and public-safe teaching packs;
- maintain the 66-entity coverage matrix and 100-job ledger;
- report newly blocked, unblocked, generated, approved, published, or identity-qualified state;
- prepare—but not execute—provider, review, release, and preview packets;
- resume interrupted work from the first missing receipt rather than repeating completed calls;
- suggest retain, revise, and retire rules while keeping the actual decision pending.

## Authority grants

An execution grant is narrow and expires with its evidence. It must name:

- campaign version, round, job ids, and immutable execution-manifest hash;
- provider profile, exact runtime model, output controls, and reference assignment;
- maximum calls, revision budget, and spend approver;
- fresh machine-preflight receipt and expiry;
- rights/likeness state and any named cultural reviewer;
- where outputs may be stored and the stop time.

Never infer that yesterday's preflight, a broad budget, or a successful prior round authorizes the next call.

### Executable readiness check

Run the Starlight quick storage sensor, then run `pnpm arcanea:visual:preflight -- --write <authority-path>` to capture the complete real PP overnight plan plus a privacy-minimized, hash-bound storage snapshot inside a 5–30 minute `arcanea.machine_preflight_receipt.v2`. Performance and storage are independent gates: either can force the combined receipt to HOLD, and media requires at least 15% free space. A captured HOLD remains non-executable. Then run `pnpm arcanea:visual:readiness -- --round <n> --provider <profile> --json` to reconstruct the next state from the current provider packet, immutable execution manifest, and recorded outputs. Run the same command with `--template` to inspect the exact grant body for the missing jobs. `pnpm arcanea:visual:grant` may materialize `arcanea.visual_execution_grant.v1` only from explicit confirmed human spend, rights, call, parameter, and stop-time inputs; it refuses performance HOLD, storage HOLD, expiry, historical manifests, and already-recorded jobs. Both records are hash-valid, time-bounded, workload-specific, and separate from the provider prompt. Use `--preflight <receipt> --grant <grant> --require-ready` immediately before execution. Missing authority is a normal `execution-awaiting-authority` state, not permission to improvise.

The content-addressed manifest index separates `current-active`, `historical-unbound`, and `historical-bound` lineage. Historical entries are retained evidence and can never be revived merely by passing their old path to the recorder.

## Stop conditions

Stop immediately when:

- the machine posture is HOLD, TIGHT, or otherwise forbids the workload;
- a job is blocked, a source conflict changes visible truth, or a named review is absent;
- the provider model, prompt, manifest, reference set, or parameters differ from the grant;
- one call would exceed the round, retry, time, or spend cap;
- an output cannot fully decode, its bytes do not match its receipt, or its measured aspect ratio differs from the job's declared ratio by more than the fixed 1.5% provider-rounding tolerance;
- either critic saw the unblinding key before sealing their scorecard;
- a human verdict, identity lock, rights decision, brand decision, or publication action is required;
- public staging would expose discovery-only, rejected, unreviewed, or unapproved work.

## Retry and revision law

- One contracted job receives one initial call.
- A failed provider request with no image may repeat the identical hash-bound request only when the provider classifies the failure as transient, only within the authorized call budget, and keeps the same job id.
- A user-correctable, safety, prompt, or input error is not a transient retry. Stop the current manifest, write a bounded revision contract, compile a new immutable manifest, and renew authority before another call.
- A decoded but weak image is evidence, not a failed request. Record it, evaluate it, and create an explicit revision contract before another call.
- Never hide revision calls to preserve the appearance of a 100-image campaign.
- New bytes receive a new revision number and receipt; old bytes and verdicts remain in lineage.

## Interrupt and resume

On interruption:

1. Stop issuing calls.
2. Preserve completed provider receipts and decoded files.
3. Rebuild campaign state from versioned contracts and write-once receipts.
4. Verify the original authority grant is still current.
5. Resume at the lowest missing job id inside the same round; do not regenerate completed jobs.
6. Freeze again at ten recorded jobs or the next named blocker.

## Default council

- **Prismatic** owns identity grammar, visual direction, provider compilation, and critique synthesis.
- **Chronica** checks story action and continuity against source evidence.
- **Analytica** owns the blinded rubric, disagreement map, and adaptive comparison.
- **Memoria** owns hashes, write-once lineage, reference maturity, and supersession.
- Add one qualified cultural, lived-experience, anatomy, or medium specialist only when the contract names that need.

Prismatic may coordinate this council but cannot serve as both production and independent critic, cannot qualify its own identity set, and cannot approve its own release.

## Completion receipt

Every autonomous run returns:

- starting and ending state;
- campaign/round/manifest hashes;
- completed, skipped, blocked, and revised job ids;
- provider calls and recorded output receipts;
- checks and critic records;
- machine, spend, rights, and reviewer evidence;
- unresolved risks and every pending human decision;
- exact resume point and safe rollback or supersession path.
