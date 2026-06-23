# deployments

Recorded **testnet** contract addresses, one JSON per network. Written after each
`forge script ... --broadcast` (EVM) or `anchor deploy` (Solana). Example shape:

```json
{
  "network": "base-sepolia",
  "chainId": 84532,
  "deployedAt": "2026-06-23T00:00:00Z",
  "contracts": {
    "SwarmRegistry": "0x...",
    "RoyaltyRouter": "0x...",
    "SwarmLicense": "0x..."
  },
  "settlementToken": "0x... (testnet USDC)",
  "owner": "0x..."
}
```

After recording, write the addresses back into each swarm manifest's `chains[]`
binding and re-pin the manifest. **No mainnet entries** until the human gate clears.
