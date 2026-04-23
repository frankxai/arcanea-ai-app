---
description: Nea Protocol — onchain creation lifecycle. Mirror of /arc for the economic half of Arcanea. Manages .nea manifests for contracts, deployments, wallets, and OpenClaw crypto tasks.
---

# /nea — Nea Protocol

The economic half of Arcanea. `/arc` handles creative lifecycle (narrative, agents, lore); `/nea` handles onchain lifecycle (contracts, deployments, tokens, OpenClaw). Together = Arcanea.

## Mental model

| Arc (creation) | Nea (economy) |
|---|---|
| `.arc` manifest | `.nea` manifest |
| milestone | deployment |
| Guardian review | audit gate |
| Luminor executes | OpenClaw executes |
| publishes chapter | settles transaction |

## File format: `.nea`

Like `.arc`, a `.nea` file is markdown with YAML frontmatter:

```markdown
---
deployment: D001
title: Creator Marketplace v1
chain: base | ethereum | solana | optimism
network: mainnet | testnet | devnet
contract: packages/marketplace/contracts/Marketplace.sol
audit_status: pending | reviewed | approved | deployed
guardian: Shinkami
gate: Source
priority: P0
updated: YYYY-MM-DD
---

# D001: Creator Marketplace v1

## Status: {progress}

## Pre-Deploy Checklist
- [ ] Solidity tests pass
- [ ] Gas profile within budget
- [ ] Audit review signed off
- [ ] Testnet dry-run verified

## Parameters
- Address: (pending)
- Deployer: (pending)
- Initial config: ...

## Post-Deploy Verification
- [ ] Contract verified on Etherscan/Basescan
- [ ] Read functions return expected state
- [ ] First transaction dry-run succeeds

## Economic Model
- Fee split: ...
- Payout address: ...
- Revenue accrual: ...
```

`.nea` files live in `.nea/deployments/` (repo-local) and mirror the pattern `.arcanea/projects/milestones/` uses for `.arc`.

## Subcommands

Parse `$ARGUMENTS`, default `list`:

### `list`
Show all `.nea` manifests in the repo with status.
```bash
ls .nea/deployments/*.nea 2>/dev/null
find . -name "*.nea" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

### `new <title>`
Scaffold a new `.nea/deployments/D{NNN}-{slug}.nea` with the frontmatter template above. Assign next D-number by scanning existing files.

### `review <id>`
Read the `.nea` file, check audit_status, run Guardian review via the `herald` or `quality-standard` skill depending on scope. Flag open checklist items.

### `deploy <id>`
Pre-flight: check audit_status is `approved`. Then show the deploy plan (chain, network, contract, constructor args). **Require typed user confirmation** before any onchain call.

### `verify <id>`
Read chain state, compare to expected config, update `.nea` file with confirmed address + tx hash.

### `claw <id>`
Hand off `.nea` to OpenClaw runtime for autonomous execution (once built — see `wiki/meta/arc-nea-economic-architecture.md`).

## Safety rails

- **No mainnet writes without typed "deploy" or "sign" confirmation.**
- **No audit-skip.** `audit_status: pending` blocks deploy.
- **No key material in `.nea` files.** Deployer addresses yes, private keys never.

## Relationship

- `/arc` ↔ `/nea` — creation ↔ economy, parallel protocols
- `/arco` — onchain workspace entry (loads `arcanea-onchain/`)
- `/ao` — routes work to the right CLI regardless of Arc/Nea side
- `/dawn` — surfaces `.nea` deploy readiness in morning brief

## Files

- `.nea/deployments/*.nea` — deployment manifests
- `arcanea-onchain/contracts/{evm,solana}/` — actual contract source
- `arcanea-onchain/packages/{marketplace,nft-engine,ip-registry}/` — onchain packages
- `wiki/meta/arc-nea-economic-architecture.md` — full architecture + OpenClaw spec

Subcommand (default `list`): $ARGUMENTS
