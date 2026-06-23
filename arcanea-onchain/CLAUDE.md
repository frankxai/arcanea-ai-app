# arcanea-onchain — Claude Code context

The chain workspace for the swarm marketplace. Read `README.md` first, then this.

## What lives here

- `contracts/evm/` — Foundry. Three contracts: `SwarmRegistry`, `SwarmLicense`
  (ERC-721 + EIP-2981), `RoyaltyRouter` (bps split, native + USDC). Base + Polygon
  share this Solidity deploy.
- `programs/solana/` — Anchor program (Wave 4).
- `deployments/` — recorded testnet addresses.

## Non-negotiable safety (inherited doctrine)

**No autonomous money movement, ever.** This is the load-bearing rule from
`payment-intelligence-system`. In this workspace it means:

- **Testnet only.** Never point a deploy script or RPC at mainnet.
- **No real keys.** `PRIVATE_KEY` is always a throwaway testnet key. Never commit `.env`.
- **Human gates** (do NOT do autonomously): mainnet deploy, real-fund/treasury movement,
  key creation/rotation, live pricing, audit sign-off. Surface these to Frank.
- Contracts hold no idle funds: `RoyaltyRouter` splits funds-in to funds-out atomically.

## Conventions

- Solidity 0.8.24, OpenZeppelin, `forge fmt` style. Custom errors over revert strings.
- The manifest (`@arcanea/swarm-protocol`) is the source of truth; on-chain stores only
  the minimal coordinates (manifest URI + hash + prices + creator + split).
- `swarmId = keccak256(manifest.id)` — stable across all chains.
- Every shipped artifact carries "Built on SIP".

## When editing contracts

- Keep the royalty split summing to exactly 10000 bps (enforced in `RoyaltyRouter` and in
  the protocol validator). Mirror any change in `packages/swarm-protocol/src/licensing.ts`.
- Add/extend Foundry tests for any behavior change. `forge test` must pass before any deploy.
- Re-pin manifests and update `deployments/*.json` after every testnet deploy.

## MCP

`.mcp.json` lists the crypto MCPs this workspace may use (read-only chain data + the
fail-closed Payments MCP). Verify-only — no settlement tool exists here by design.

Built on SIP.
