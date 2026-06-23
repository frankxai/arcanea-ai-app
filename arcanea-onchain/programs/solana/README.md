# Solana program — swarm license + royalty router (Wave 4)

Solana side of the marketplace. Mirrors the EVM contracts:

- **swarm_license** — mints a Metaplex NFT as the license; binds it to a `swarm_id`.
- **royalty_router** — splits SPL-token (USDC) payments by basis points to
  creator / platform / treasury, matching the EVM `RoyaltyRouter` semantics.

Status: **scaffold.** The EVM path (Base + Polygon) is the Phase-1 reference; Solana
lands in Wave 4 once the EVM flow is proven on testnet. Build with Anchor; deploy to
`solana-devnet` only. Same human gates as the EVM workspace apply (no mainnet, no real
funds, no real keys without explicit human approval).

```bash
# Wave 4 (devnet only):
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

`lib.rs` holds the instruction skeleton (account contexts + the bps-split invariant).
The royalty split must sum to exactly 10000 bps, identical to the protocol validator
and the EVM router.

Built on SIP.
