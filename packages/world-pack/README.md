# @arcanea/world-pack

WorldPack.v1 — the typed contract for a creator-owned Arcanean world.

A world is not a chat log. It is a graph with owners, provenance, versions, branches,
rights, and a canon it can be checked against. This package is that graph, its checker,
and the deterministic half of generation. No model call, no network, no database.

## Why this exists

The scarce good is canon, not frontends. Anyone can wrap a model; almost nobody can tell
you whether the thing the model just wrote contradicts the world it claims to belong to.
That check is the product, and it has to be mechanical to be trustworthy.

## The 21 kinds

| Family                 | Kinds                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Entity nodes (14)      | Universe, World, Era, Location, Faction, Character, Creature, Object, Law, Power, Event, Scene, Artifact, Creator |
| Edge (1)               | Relationship                                                                                                      |
| Governance records (4) | Branch, Version, Source, AgentRole                                                                                |
| Enums (2)              | RightsState, CanonStatus                                                                                          |

Every entity node carries a governance envelope — `owner`, `sourceRef`, `versionRef`,
`branchRef`, `visibility`, `canonStatus`, `rights`, `evalRule` — and a `layer` that keeps
the five ownership spaces apart: `canon` (Arcanea's own), `user`, `licensed`, `generated`,
`contributed`. A user node can never claim `canonStatus: "locked"`, a licensed node can
never claim `creator-owned` rights, and a generated draft is never canon. Those are
matrices in `model.mjs`, checked on every pass.

## The pack is never a witness for itself

Every claim a pack makes about its own trustworthiness is checked against something
outside the file:

| The pack says                       | What is actually checked                                                                                                                                                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layer: "canon"`                    | `deriveLayer` resolves the node's name in the canon index and requires the canon owner. An unattested claim is a `canon.layer-claim` blocker and the node is judged at its real layer. The locked-name rule applies to every node whatever it declares. |
| `canon.sourceHash`                  | Recomputed from the canon document at every entry point that loads a pack — `check`, `export`, `verify`. Mismatch or all-zeros is blocking, and both hashes are printed.                                                                                |
| `digest`                            | Covers the whole pack minus the signature: nodes, edges, canon binding, **and** sources, branches, versions, head, agent roles and counts. Editing `createdBy` or a citation after export now fails verification.                                       |
| `agentRoles`                        | Checked against the Guardian definitions in `guardians.mjs`. An unknown role, a widened scope list, a rule claimed outside a charter or a raised waiver ceiling is a forgery — re-signing does not help.                                                |
| a merge that keeps `layer: "canon"` | Protection is decided from the **target** node, never from the incoming node's claim.                                                                                                                                                                   |

Every row above exists because the adversarial review broke the previous version of it
in under ten lines. `tests/adversarial.test.mjs` runs those exact attacks.

## Canon is read, never copied

`canon-index.mjs` parses `.arcanea/lore/CANON_LOCKED.md` into a machine-checkable index —
the ten Gates with their frequencies, gods and Godbeasts, the six elements, seven Houses,
seven Wisdoms, five ranks, the eight closed origin classes, the terminology ledger with
its LOCKED/STAGING status, and the locked truths. The index carries the source document's
sha256, so a pack records exactly which canon it was cleared against.

A second hardcoded canon table would drift. This one cannot.

## The Studio slice, end to end

```js
import {
  loadCanonIndex,
  createWorldSeed,
  addNode,
  commit,
  detectConflicts,
  branchPack,
  mergeBranch,
  exportPack,
  verifyExport,
  withGuardianRoles,
} from "@arcanea/world-pack";
import * as apl from "@arcanea/world-pack/apl";

const canon = await loadCanonIndex(".arcanea/lore/CANON_LOCKED.md");
let pack = createWorldSeed({
  name: "The Slow Chart",
  creator: { handle: "frankx" },
  canonSourceHash: canon.sourceHash,
});

const compiled = apl.compile(
  "character.constrained.v1",
  {
    role: "corridor cartographer",
    gate: 6,
    gatesOpen: 3,
    element: "Void",
    house: "Synthesis",
    originClass: "Arcans",
  },
  { canon, pack },
);
// compiled.prompt now states: Gate 6 is Sight, 639 Hz, kept by Lyria, bonded Godbeast Yumiko.
// Send it to whichever model you like. The compiler never does.

pack = addNode(
  pack,
  apl.materialize(compiled, modelAnswer, {
    id,
    layer: "generated",
    governance,
  }),
);
detectConflicts(pack, canon); // findings with rule, severity, node, expected vs actual
const exported = exportPack(
  withGuardianRoles(commit(pack, { message: "first cast", by })),
);
verifyExport(exported); // { valid: true }
```

`fixtures/slow-chart.worldpack.json` is that run, frozen as a golden file.

## What the detector catches

Lore: locked names taken by any node — including under a hat (`Lyria the Radiant`) or in
`attributes.aliases`, after normalizing case, punctuation and diacritics — self-declared
canon layers, Gate frequency and Guardian/Godbeast pairing mismatches, unknown gates,
frequencies, Godbeasts, gods and ranks, rank out of band for gates open, unknown elements,
Houses and origin classes, Luminor used as a species, staging canon cited as locked, and
any contradiction of a locked truth.

Locked truths are read out of the document, not hardcoded: `"X is NOT Y"` and `"X is Z,
not Y"` become triggers that fire when the subject and the forbidden phrase co-occur
unnegated in **any** free-text field the node carries — `description`, `attributes.backstory`,
`attributes.notes`, anything. A rule that only fires on the key you thought of is not a rule.

Structure and rights: rights unresolved, rights illegal for the derived layer, a licensed
node naming no licence, canon status illegal for the derived layer, dangling
source/version/branch references, forged agent roles, edges pointing outside the pack, and
a canon binding that does not match the document in front of it.

## Your canon, not only Arcanea's

```js
import { checkAgainst } from "@arcanea/world-pack";
const { canon, report } = checkAgainst(
  pack,
  await readFile("MY_CANON.md", "utf8"),
);
```

Same index builder, same rules, your document. Locked names, locked truths, and the
tables it can parse are yours; Arcanea's canon becomes one profile among many. On the CLI
that is `world-pack check <pack.json> --against MY_CANON.md`. See
`fixtures/custom-canon.md` for the shape a document needs (a title, pipe tables, and
`**LOCKED TRUTHS:**` bullets).

## Branching

`diffPacks` is field-level. `mergeBranch` is three-way against a common ancestor and
refuses rather than guesses: `merge.divergent-field` when both sides changed one field,
`merge.delete-vs-edit`, and `merge.canon-protected` when a non-canon branch tries to
rewrite a canon-layer node. Canon protection is structural, not a convention.

## Guardians

The ten Guardians are `AgentRole` records with scopes, a rule set they are answerable for,
a severity ceiling they may waive, and a deterministic `decide()` policy. Alera rejects a
contradiction of a locked truth; Aiyami rejects unresolved rights; Lyria reports and
adjudicates nothing; Shinkami escalates to the Creator rather than locking canon, because
**no Guardian can lock canon** — `canon:approve-locked` is not a scope that exists.
`runGuardianEvals()` is the regression net: fourteen cases, all green or the build is wrong.
`verifyAgentRoles()` is the other half — the roles a _file_ carries are checked against
these definitions, so authority is never something a pack can grant itself.

## CLI

```
world-pack canon [--json]                   index the canon document
world-pack seed <name> --handle <h> [-o f]  create a world seed
world-pack compile <template> --gate 6 ...  compile an APL prompt
world-pack check <pack.json> [--against c.md]  validate + conflict report (exit 1 if dirty)
world-pack export <pack.json> [-o f]        portable, verifiable export
world-pack verify <export.json>             re-check the digest, counts and authority model
world-pack guardians [--evals]              the authority model
```

## Relationship to the neighbours

- `@arcanea/world-sdk` owns `world.arcanea.json` — a world _repo_ standard: manifest,
  licence, royalty splits, scaffold, index. WorldPack is the _portable export_ of a world's
  graph. Every pack carries an `interop` block naming the world-sdk schema version, and
  reuses its id alphabet and `sha256:` hash format. Explicit, versioned, not forked.
- `@arcanea/world-engine` owns generation (name roots, character/location generators) and
  keeps its own canon constants for that job. WorldPack does not generate; it constrains
  and checks. Where the two disagree about canon, the document wins — world-pack reads it.

## Tests

```
node --test                       # 27 tests, no network, no model, no build step
```
