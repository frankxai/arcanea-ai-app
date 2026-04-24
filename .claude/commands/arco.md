---
description: Arcanea Onchain workspace entry — loads arcanea-onchain/ context, checks chain state, routes onchain work (contracts, marketplace, NFT engine, IP registry, Guardian Agents).
---

# /arco — Arcanea Onchain

Context-switch into the onchain/economic half of Arcanea. Pair to `/ao` (route work across CLIs) and `/pulse` (life-domain dashboard). Manages `.nea` files, smart contracts, wallet state, marketplace, and OpenClaw crypto runtime.

## Execution

### 1. Load onchain context

```bash
cat arcanea-onchain/CLAUDE.md
ls arcanea-onchain/contracts/{evm,solana} 2>/dev/null
ls arcanea-onchain/packages 2>/dev/null
```

Announce which packages are present: `guardian-agents`, `ip-registry`, `marketplace`, `nft-engine`, `onboarding`.

### 2. Chain state snapshot

Check in parallel:
```bash
cd arcanea-onchain && git status -sb
ls -t .nea/ 2>/dev/null | head -5   # newest .nea manifests
find arcanea-onchain/contracts -name "*.sol" -newer arcanea-onchain/package.json 2>/dev/null | head -10
```

If the user has crypto MCP tools available (viem, foundry, solana-cli), list them; otherwise note "no chain MCP connected — commands will be read-only".

### 3. Route subcommand

Parse `$ARGUMENTS`:

- `status` (default) — show chain workspace state + recent deploys
- `deploy <contract>` — prepare deployment (don't execute without human confirmation)
- `verify <address>` — read chain state, confirm deployment
- `marketplace` — jump into `packages/marketplace/`
- `nft` — jump into `packages/nft-engine/`
- `ip` — jump into `packages/ip-registry/`
- `guardians` — jump into `packages/guardian-agents/`
- `claw` — manage OpenClaw crypto runtime (see `wiki/meta/arc-nea-economic-architecture.md`)

### 4. Safety rail

**Never** execute a transaction or push to mainnet without explicit user confirmation. Read-only chain calls are fine. Writes require typed confirmation: "deploy" or "sign".

## Relationship to other commands

- `/ao` = route any task to any CLI
- `/arco` = onchain workspace (this command)
- `/nea` = onchain creation lifecycle (parallel to `/arc`)
- `/arc` = creative lifecycle (narrative, lore, agents)
- Arc + Nea = Arcanea

## Files

- `arcanea-onchain/CLAUDE.md` — onchain workspace rules
- `.nea/` — onchain artifact manifests (mirrors `.arcanea/projects/` for Arc)
- `wiki/meta/arc-nea-economic-architecture.md` — OpenClaw + community contracts architecture

Subcommand: $ARGUMENTS
