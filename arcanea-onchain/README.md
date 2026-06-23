# arcanea-onchain

The chain layer for the Arcanea Web3 Agent-Swarm Marketplace. Smart contracts and
chain integrations that turn a `@arcanea/swarm-protocol` **Swarm Package Manifest**
into an on-chain product: a **Swarm License NFT** (own it = right to run the swarm)
and **per-invocation metered settlement** (queen-pays-queen), each split to
creator / platform / treasury via a `RoyaltyRouter`.

> ⚠️ **UNAUDITED. TESTNET ONLY.** No mainnet deploys, no real funds, no production
> keys until an external audit passes **and** Frank explicitly approves. See *Gates*.

## Layout

```
arcanea-onchain/
├── contracts/evm/        Foundry project — Base + Polygon share one Solidity deploy
│   ├── src/
│   │   ├── SwarmRegistry.sol   swarmId → {manifestURI, creator, prices, active}
│   │   ├── SwarmLicense.sol    ERC-721 + EIP-2981 license; mint routes proceeds
│   │   └── RoyaltyRouter.sol   bps revenue split (native + USDC), used by both models
│   ├── test/             Foundry tests (split correctness, mint, royaltyInfo, tokenURI)
│   └── script/Deploy.s.sol     testnet deploy (Base Sepolia + Polygon Amoy)
├── programs/solana/      Anchor program (Wave 4 — license mint + SPL royalty split)
└── deployments/          recorded testnet addresses (one JSON per network)
```

## Chains (Phase 1)

| Chain | Network (testnet) | License standard | Settlement |
|---|---|---|---|
| Base | base-sepolia | ERC-721 + EIP-2981 | USDC via x402, or native |
| Polygon | polygon-amoy | ERC-721 + EIP-2981 | USDC, or native |
| Solana | solana-devnet | Metaplex NFT (Wave 4) | SPL USDC |

## EVM — build, test, deploy (testnet)

Requires [Foundry](https://book.getfoundry.sh/). Not installed in CI sandboxes — run locally.

```bash
cd contracts/evm
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts   # one-time
forge build
forge test -vvv                                                          # all invariants

# Deploy to a testnet (throwaway TESTNET key only):
export PRIVATE_KEY=0x...            # testnet deployer, never a real key
export OWNER=0x...                  # admin address
export SETTLEMENT_TOKEN=0x...       # testnet USDC (or omit for native-only)
export BASE_SEPOLIA_RPC_URL=...
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast
```

Record the printed addresses in `deployments/base-sepolia.json` and back into each
manifest's `chains[]` binding, then re-pin the manifest.

## How the money models map to the contracts

- **NFT license:** `SwarmLicense.mintERC20 / mintNative` mints the license and forwards
  the registry `licensePrice` to `RoyaltyRouter`, which splits it by the swarm's bps.
  Secondary-sale royalties follow EIP-2981 (`royaltyInfo`).
- **Per-call metering:** the off-chain x402 endpoint (`apps/web`, Wave 2) verifies the
  AP2 mandate + spend cap via the **payment-intelligence MCP** (fail-closed), then calls
  `RoyaltyRouter.routeERC20(swarmId, USDC, perCallPrice)` so each invocation splits too.

## Gates (human-only — never autonomous)

Per `payment-intelligence-system` + `arcanea-ai-app` doctrine — agents draft and verify,
humans deploy capital:

- Mainnet contract deploy
- Real-fund / treasury movement
- Deployer-key creation or rotation
- Setting live (real-money) prices
- Audit sign-off

Everything here runs on testnet with faucet funds until those gates are cleared by a human.

Built on SIP.
