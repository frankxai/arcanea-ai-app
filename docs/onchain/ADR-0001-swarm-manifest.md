# ADR-0001 — The Swarm Package Manifest format

- **Status:** Accepted (Wave 0, 2026-06-23)
- **Context:** We need a single, portable unit that describes a licensable Arcanea swarm
  well enough to (a) tokenize as an NFT, (b) meter per-invocation, (c) split revenue, and
  (d) stay forkable per SIP — across Base, Polygon, and Solana.

## Decision

Define a chain-agnostic **Swarm Package Manifest** (`@arcanea/swarm-protocol`), a versioned
JSON document validated by a dependency-free validator. On-chain contracts store only the
minimal coordinates (manifest URI + hash + prices + creator + bps split); the manifest is
the source of truth for topology, agents, and licensing.

### Why these choices

- **One manifest, all chains.** `swarmId = keccak256(manifest.id)` is stable everywhere, so
  the same SKU lists on EVM and Solana without divergence. Chain specifics live in `chains[]`.
- **Dependency-free validator (no zod).** The package must compile with plain `tsc` and test
  with `node --test` in any environment, and be runnable by on-chain-adjacent services
  without a schema library. The validator accumulates all errors, not just the first.
- **bps split summing to 10000, enforced in three places** (protocol validator, EVM
  `RoyaltyRouter`, Solana program) so the invariant can't drift between layers.
- **Compose existing shapes, don't re-invent.** Agents mirror `LuminorSpec`; topology mirrors
  `starlight-swarm`. The manifest is the composition, not a competing model.
- **SIP boundary is explicit.** `license.nonLicensable` lists encoded-self artifacts; agents
  may omit `systemPrompt` and use `specUri` so non-transferable IP never lands in a public
  manifest. `attestation` declines own canon and composes `arcanea`.
- **Deterministic canonicalization.** `canonicalize()` emits stable, key-sorted JSON so the
  same logical manifest yields the same bytes (and the same IPFS CID / `tokenURI`). Array
  order is preserved because it is semantic (e.g. the queen's loop steps).

## Alternatives considered

- **zod schema** — better DX, but adds a runtime dep and failed to install in the target
  sandbox; rejected in favor of a hand-rolled validator. Can be layered on later without
  changing the manifest shape.
- **On-chain-first (store the full spec on-chain)** — too expensive and rigid; rejected.
  Pin off-chain, anchor by hash.
- **Per-chain manifests** — would let SKUs diverge; rejected in favor of one manifest with
  `chains[]` bindings.

## Consequences

- Adding a field is a manifest-version bump + a validator update + (if on-chain-relevant) a
  contract change. The three reference manifests are the regression fixtures.
- The OSS repo (`arcanea`) mirrors the open spec + manifests so swarms are publicly forkable.
