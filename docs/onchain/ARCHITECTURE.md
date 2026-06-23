# Arcanea Web3 Agent-Swarm Marketplace — Architecture

A marketplace where other agent queens / orchestrators **license Arcanea swarms** and
pay for them — settled on-chain, metered per-invocation, with revenue routed back to the
creators. Built across Base, Polygon, and Solana.

## The unit: a Swarm Package Manifest

`@arcanea/swarm-protocol` defines a chain-agnostic, versioned **manifest** — the thing
that gets tokenized. It composes:

- **topology** — queen + worker mesh + self-improving loop + MCP touchpoints
  (mirrors `starlight-swarm` `StreamSpec/QueenSpec/WorkerSpec`)
- **agents** — portable specs (mirrors `apps/web` `LuminorSpec`); the licensed IP is the
  system prompt, or a `specUri` for gated/encoded-self material
- **license terms** — what is forkable (the pattern) vs. non-licensable (founder voice
  clones, identity vectors) per the SIP sovereignty boundary
- **pricing** — license mint price + per-call price + EIP-2981 secondary bps
- **royalty split** — creator / platform / treasury in basis points (sums to 10000)
- **SIP attestation** — "Built on SIP", declines its own canon, composes `arcanea`
- **chain bindings** — per-chain contract addresses + metadata URI (Base/Polygon/Solana)

The canonical JSON is pinned to IPFS/Arweave; its content id is the `tokenURI`.

## Flow

```
Buyer's Queen ──discover──► Marketplace UI ──reads──► SwarmRegistry + Supabase mirror
      │                                                       │ manifestURI
      │ (A) license: mint NFT                                 ▼
      ▼                                              IPFS/Arweave manifest
  SwarmLicense (ERC-721 + EIP-2981) ──proceeds──► RoyaltyRouter ──split──► creator/platform/treasury
      │
      │ (B) run: pay-per-call
      ▼
  x402 endpoint (apps/web) ──verify──► payment-intelligence MCP (AP2 mandate, spend cap,
      │   fail-closed, audit-first, human gate over cap)        │
      ▼ verified + within cap                                   ▼
  run swarm + meter ───────────────► RoyaltyRouter.routeERC20(swarmId, USDC, perCallPrice)
```

Two money models, one split path. **(A)** holding the NFT grants run rights; **(B)** each
invocation meters via x402 USDC and splits the same way. Both feed `RoyaltyRouter`.

## Components

| Layer | Where | Status |
|---|---|---|
| Swarm Package Manifest spec + validator + CLI | `packages/swarm-protocol/` | shipped (Wave 0, tested) |
| Reference manifests (author council, catalog kit, guardian meta) | `packages/swarm-protocol/manifests/` | shipped (Wave 0) |
| EVM contracts (Registry / License / Router) | `arcanea-onchain/contracts/evm/` | written, testnet-deploy pending (Wave 1) |
| Solana program (license + router) | `arcanea-onchain/programs/solana/` | scaffold (Wave 4) |
| x402 settlement + MCP gate | `apps/web/app/api/x402/` | Wave 2 |
| Marketplace UI | `apps/web/app/marketplace/` | Wave 3 |
| Real wallet wiring (replaces mocks) | `apps/web/lib/web3/` | Wave 1–2 |

## Safety boundary (non-negotiable)

From `payment-intelligence-system` + `arcanea-ai-app` doctrine: **no autonomous money
movement.** Phases 0–4 are testnet + faucet funds. **Mainnet deploy, real-fund movement,
deployer-key handling/rotation, live pricing, and audit sign-off are human gates.**
`RoyaltyRouter` never holds idle funds — it splits funds-in to funds-out per call.

## DPI framing

Swarm royalties are a **Protocol-Attribution** income stream in the Starlight `/wealth-dpi`
taxonomy: income to the protocol/creators when their swarms are used at scale. Wave 4 reports
the royalty ledger into the DPI gate ladder (the agenticincome / agenticpassiveincome thesis).

## Reuse map

| Reused | From |
|---|---|
| `LuminorSpec` (agent IP shape) | `apps/web/lib/luminors/luminor-spec.ts` |
| `StreamSpec/QueenSpec/WorkerSpec` (topology) | `starlight-swarm/src/swarm/streams.ts` |
| Royalty-profile vocabulary | `packages/arcanea-multilingual-config/src/royalty.ts` |
| ERC-4337 wallet + Story Protocol PIL stubs | `apps/web/lib/web3/` (made real in Wave 1–2) |
| Fail-closed AP2/x402 gate | `payment-intelligence-system/mcp/` |
