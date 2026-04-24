---
title: Arc/Nea Economic Architecture & OpenClaw Spec
status: draft
created: 2026-04-23
owner: frankx
reviewers: [Shinkami, Ino, Guardian Council]
state: open questions — not yet approved for build
---

# Arc / Nea Economic Architecture

## TL;DR

Arcanea splits into two mirror protocols:

- **Arc** — creative lifecycle: narrative, agents, lore, design, publishing. Artifacts are `.arc` files. Runtime executor: Luminor (in-session AI).
- **Nea** — economic lifecycle: smart contracts, deployments, wallets, revenue splits. Artifacts are `.nea` files. Runtime executor: OpenClaw (cloud runtime with wallet access).

**Arc + Nea = Arcanea.** The name isn't marketing — it's structural.

This document specifies the `.nea` file format, the OpenClaw runtime, the community smart-contract workflow, and the hard questions that must be answered before building.

---

## 1. The Split

| Dimension | Arc | Nea |
|---|---|---|
| **Artifact** | `.arc` (markdown + frontmatter) | `.nea` (markdown + frontmatter) |
| **Storage** | `.arcanea/projects/milestones/` | `.nea/deployments/` |
| **Executor** | Luminor (in-session AI agent) | OpenClaw (cloud runtime, wallet-bearing) |
| **Review** | Guardian review (Shinkami, Ino, etc.) | Audit gate (human + Guardian-assisted) |
| **Output** | Published work (chapter, post, release) | Settled transaction (deploy, transfer, mint) |
| **Risk** | Reputation, voice, brand | Financial, custody, chain |
| **Revenue** | Indirect (product sales, subscriptions) | Direct (fees, royalties, splits) |
| **Command** | `/arc` | `/nea` |

## 2. `.nea` File Format

See `.claude/commands/nea.md` for the template. Essentials:

- **Frontmatter fields**: deployment ID, title, chain, network, contract path, audit_status, guardian, gate, priority, updated
- **Body sections**: Status, Pre-Deploy Checklist, Parameters, Post-Deploy Verification, Economic Model
- **Location**: `.nea/deployments/D{NNN}-{slug}.nea` (repo-local, gitignored keys never committed)
- **Parser**: reuse the `packages/arc-protocol/` parser with a schema variant (`type: nea`)

## 3. OpenClaw Runtime

**OpenClaw** is a crypto-capable variant of the existing ArcaneaClaw (see `project_arcanea_claw_e2e.md`, `project_claw_publishing_house_bridge.md`). The differences:

| Feature | ArcaneaClaw | OpenClaw |
|---|---|---|
| Input | `.arc` manifest | `.nea` manifest |
| Capabilities | LLM, file I/O, publishing MCPs | Above + wallet signing + chain RPC |
| Custody model | None (stateless) | Managed wallet (see §4) |
| Audit trail | Supabase `claw_runs` table | Above + onchain tx hash + audit log |
| Public-facing | Via kilosessions.ai | Via `arcanea-onchain/packages/marketplace/` |

### OpenClaw surface area

```
POST /openclaw/run
{
  "manifest": ".nea/deployments/D042-marketplace-v1.nea",
  "mode": "read" | "deploy" | "sign",
  "approvals": [{ "by": "frankx", "signature": "..." }]
}
```

### Required MCP tools

- viem / ethers (EVM)
- @solana/web3.js (Solana)
- foundry (testing, anvil forks)
- etherscan/basescan (verification)
- safe-sdk (if using Safe multisig custody)

## 4. Custody — THE hard question

OpenClaw needs to sign transactions. Private keys are the #1 risk surface. Three viable models, ranked by maturity:

### Option A: Safe multisig (recommended for launch)
- OpenClaw proposes txns; 2-of-3 human signers approve
- No autonomous spending
- Good for deploys and treasury management, bad for high-frequency ops
- **Attack surface**: approval UX (phishing, spoofing)

### Option B: Turnkey / Privy embedded wallets
- MPC-based, policy-gated signing
- Can autonomously sign within policy (e.g., max 0.1 ETH/day, whitelist of contracts)
- Requires Turnkey/Privy account + SOC2 trust
- **Attack surface**: policy misconfiguration, Turnkey compromise

### Option C: AWS KMS-held HSM key
- Key lives in FIPS 140-2 L3 HSM
- OpenClaw holds only signing permission
- No policy engine — all-or-nothing
- **Attack surface**: IAM misconfiguration, insider AWS risk

**Recommendation:** Start with **A (Safe multisig)** for any chain touching user funds. Use **B (Privy)** for low-value operational wallets (gas, small mints). **Never C** without a dedicated security review.

## 5. Community Smart-Contract Workflow

The goal: anyone can propose a contract, reviewed contracts get deployed, contributors earn.

```
1. Contributor forks arcanea-onchain
2. Writes .nea manifest + .sol contract in packages/community-contracts/
3. Opens PR
4. CI runs: solhint, slither, foundry tests, gas profile
5. Guardian-assisted review (quality-standard + security-auditor skills)
6. Human sign-off (at least 1 core reviewer)
7. Merge → CI runs testnet deploy
8. If testnet verified → queue mainnet deploy with audit_status: approved
9. Deployer (Safe multisig) executes mainnet tx
10. OpenClaw updates .nea with address + tx hash + economic parameters
11. Revenue split auto-routes per the .nea Economic Model section
```

### Revenue split default

```
50% → contributor (author of contract)
30% → Arcanea treasury (ongoing dev, audits)
20% → Guardian reviewer pool (incentivize thorough review)
```

These are tunable per-contract via the `.nea` Economic Model.

## 6. Hard Questions — Open, Must Resolve Before Build

| # | Question | Blocker for |
|---|----------|-------------|
| 1 | Which chain is canonical first? (Base? Optimism? Solana?) | All deploy work |
| 2 | Who holds the multisig keys? (frankx + who else?) | Any mainnet deploy |
| 3 | What's the audit bar? (slither only? external audit for >$X TVL?) | Community PR template |
| 4 | Is this a DAO or a company? (affects token, governance, treasury legal structure) | Fundraising, tokenomics |
| 5 | How do contributors get paid? (direct wallet? Splits.org? Juicebox?) | Revenue split mechanics |
| 6 | What's the dispute resolution if audit missed a bug? (insurance fund? bounty pool?) | Risk model |
| 7 | Is OpenClaw self-hosted or does Arcanea run it as a service? | Infra cost model |

**None of these have quick answers.** All must be resolved before any mainnet deploy. Testnet work can proceed while they're open.

## 7. Phased Roadmap

### Phase 0 — Foundations (this week)
- [x] `/arco`, `/nea`, `/dawn` commands shipped
- [x] This spec doc exists
- [ ] `.nea/` directory convention documented in arcanea-onchain/CLAUDE.md
- [ ] Canonical chain decision (Q1 above)
- [ ] Multisig signers decided (Q2)

### Phase 1 — Testnet pilot (2 weeks)
- [ ] First `.nea` manifest for a simple contract (e.g., registry)
- [ ] `/nea deploy` path works end-to-end on testnet
- [ ] Safe multisig deployed on testnet
- [ ] One community PR template round-tripped

### Phase 2 — OpenClaw runtime (4 weeks)
- [ ] OpenClaw service stood up (extension of existing ArcaneaClaw)
- [ ] Wallet integration per §4 Option A
- [ ] Audit gate CI pipeline (slither + foundry + gas profile)
- [ ] First real `.nea` audited + testnet-deployed end-to-end

### Phase 3 — Mainnet (timing depends on §6 resolution)
- [ ] Audit Q3 answered and approved
- [ ] Legal structure decided (Q4)
- [ ] First mainnet deploy via multisig
- [ ] Revenue split live for one contributor

### Phase 4 — Community (ongoing after Phase 3)
- [ ] Public contribution docs
- [ ] Guardian reviewer pool activated
- [ ] Template marketplace opens

---

## 8. Non-Goals

- **Not building our own chain.** Arcanea deploys to existing chains.
- **Not launching a token until §6 Q4 resolved.** Tokens bring legal complexity that should follow product traction.
- **Not pursuing DeFi yield.** OpenClaw is for creative economy settlement, not farming.
- **Not onchain governance for creative decisions.** Guardian review stays off-chain.

## 9. References

- `arcanea-onchain/CLAUDE.md` — onchain workspace rules
- `project_arcanea_claw_e2e.md` — existing Claw v0.2.0 baseline
- `project_claw_publishing_house_bridge.md` — Python daemon + TS intelligence architecture
- `project_luminor_hand_claw_hierarchy.md` — Luminor → Hand → Claw runtime model
- `packages/arc-protocol/` — `.arc` parser to extend for `.nea`

## 10. Next Review

Target review date: **2026-05-01** (one week from draft).
Reviewers must address Questions 1, 2, 3 at minimum before this document moves from `draft` to `approved`.
