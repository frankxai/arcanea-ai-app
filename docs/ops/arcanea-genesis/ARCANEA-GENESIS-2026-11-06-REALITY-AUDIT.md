# Arcanea Genesis — Reality Audit (Phase 0)

Date: 2026-11-06 (Europe/Amsterdam). Author: Perplexity Computer, first autonomous work cycle under the "Arcanea Genesis" master mission. Scope: evidence-based inventory of what exists, what is live, what is reusable, and where the mission prompt conflicts with standing estate rulings.

Evidence tags used throughout:

- **[MEASURED]** — observed directly this session (HTTP responses, DNS, git trees, file contents, API calls).
- **[RULED]** — a written decision by Frank or an accepted authority document (TRUTH.md, AGENTS.md, Linear projects, issue bodies).
- **[REPORTED]** — stated in a repo document or issue comment by another agent; not re-verified here.
- **[OPEN]** — unknown, contradictory, or needs Frank's ruling.

Nothing in this document is a claim of demand, customers, or revenue. No prices, DNS, deployments, contracts, or payments were changed.

---

## 1. Mission prompt vs. standing rulings

The master mission asks for an autonomous creator civilization with a registry, a rights engine, collector releases, a Guardian Fleet and eventually programmable-IP and on-chain layers. The estate already has rulings that constrain or override parts of that scope. Where they conflict, the ruling wins until Frank changes it.

| Mission element                                                                             | Standing ruling                                                                                                                                       | Status                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hosted creator platform with credits/subscriptions (`/pricing` Polar credits are live copy) | TRUTH.md §2: "No multi-tenant SaaS. … Infrastructure is Frank's own. Users bring their own keys." [RULED]                                             | **[OPEN]** conflict. The live `/pricing` page and `billing_kernel`/credits migrations describe a hosted credits product; TRUTH.md forbids it. Issue #276's 16 Oct mandate ("Creator €19 BYOK plus a separately bounded managed option") sits between the two. Frank must rule which is current. |
| Launch cadence, "first collector release"                                                   | TRUTH.md §2: "No waitlists, no pre-orders, no landing pages until the product-gate passes"; §1: "Every price is a guess." [RULED]                     | Aligned, if "simulated checkout" stays simulated. The shop catalog already encodes this: every edition is `priceState: 'proposed'`, `rightsApproved: false` [MEASURED].                                                                                                                         |
| Token/NFT layers, arcanea.nft                                                               | TRUTH.md §4 "Honest scarcity"; P-ARC-19: on-chain v1 only after the first paid licence [RULED]; mission: "Do not assume every product needs a token." | Aligned. No on-chain work is warranted this cycle.                                                                                                                                                                                                                                              |
| Storage: mission is agnostic; `arcanea-onchain` docs assume `ar://` and compressed NFTs     | AGENTS.md decided stack: Vercel Blob, not R2 [RULED]                                                                                                  | Aligned for product storage. On-chain metadata storage is undecided and premature.                                                                                                                                                                                                              |
| Chain choice (Base, Story, Solana appear across repos)                                      | No ruling. Story Protocol has since pivoted to AI training data and is retiring its chain (see Frontier Research).                                    | **[OPEN]**. Any chain assumption in older docs is stale.                                                                                                                                                                                                                                        |
| Legal entity                                                                                | AGENTS.md says "Arcanea BV"; Linear P-ARC-15 records a Dutch Eenmanszaak [RULED, more recent]                                                         | **[OPEN]** — AGENTS.md is stale on this point and should be corrected by Frank, not an agent.                                                                                                                                                                                                   |
| "Have qualified legal counsel review commercial agreements before production activation"    | #277 and #276: rights assertions, prices and publication are Frank-only decisions [RULED]                                                             | Aligned. Encoded in the rights manifest validator (RM001/RM009).                                                                                                                                                                                                                                |
| Strategy documents                                                                          | TRUTH.md: "Do not create another strategy document that duplicates this one." [RULED]                                                                 | This audit is an evidence inventory, and the companion plan is scoped to a bounded backlog. Neither restates TRUTH.md's doctrine.                                                                                                                                                               |

Mission-level principles that are already true in the estate and were kept: human approval receipts for side effects (#277), canon promotion only by signed human receipt (#283), AI disclosure as a standard (TRUTH.md §4, EU AI Act Art. 50), "a licence to sell AI output is not copyright in it. Price the curation, the world, and the context" (TRUTH.md §3).

---

## 2. Live surfaces and domains [MEASURED]

| Surface                                     | Observation                                                                                                                                                              | Notes                                                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| https://arcanea.ai → https://www.arcanea.ai | 200, Vercel. Sitemap lists 362 URLs. `/shop` renders the proposed editions; `/pricing` renders Polar credit packs; `/shop/guides/ai-disclosure-canon-provenance` exists. | Production is live and current enough to carry a rights layer. Prices shown are the catalog's proposed values, not approved ones.          |
| https://arcanean.org                        | 200, "The Arcanean Commons".                                                                                                                                             | Separate public property; relation to the shop is not documented in the monorepo.                                                          |
| https://akamoto.io                          | 200.                                                                                                                                                                     | Out of scope for this cycle.                                                                                                               |
| sanctum.arcanea.ai                          | No DNS record.                                                                                                                                                           | The mission names it as a surface. Creating it is a DNS change → requires Frank's approval.                                                |
| labs.arcanea.ai                             | 502.                                                                                                                                                                     | Something is bound but not serving. Cannot inspect without Vercel access.                                                                  |
| arcanea.nft                                 | Not resolvable in public DNS. It is an Unstoppable Domains Web3 name; UD cancelled its ICANN application for `.nft` in Aug 2026.                                         | Only resolves in wallets/browsers with a UD resolver. Not a public web surface. Any "arcanea.nft" product page must live under arcanea.ai. |
| Vercel API                                  | Token in the sandbox returns 403 (invalid/expired).                                                                                                                      | Blocker: could not list projects, aliases or the labs 502 cause. Needs reauthorization by Frank.                                           |

Issue #223's last comment (2026-10-02) [REPORTED] states that apex, www and `arcanea-ai-app.vercel.app` all resolve to the canonical project `prj_90OIWsAmfeswv8IG8WxqEAFefTOV`, and that `/records` and `/creations` carry `data-ai-generated` disclosure markup. Not re-verified at the deployment level this session (no Vercel access), but the public pages respond 200.

---

## 3. Repositories inventory

Twenty-four repositories across `frankxai`, `Arcanea-Labs` and related orgs were cloned blobless with sparse checkouts of documentation, schemas and package manifests. Full file lists are in `inventory/filelists/`.

### 3.1 Core product: `frankxai/arcanea-ai-app` (mirrored at `Arcanea-Labs/arcanea-ai-app`) [MEASURED]

- Next.js 16 / React 19 pnpm monorepo: `apps/web`, `apps/agenthub`, 65 workspace packages, 42 Supabase migrations (project `hcfhyssdzphudaqatxbk`).
- Commerce: `apps/web/lib/shop/catalog.ts` defines four editions — `worldbuilder-production-edition` €99 ("Individual creator license"), `worldbuilder-studio-license` €299, `living-cosmos-first-edition` €29 ("Personal display and reading"; six artworks + booklet), `first-collection-bundle` €119. All `priceState: 'proposed'`, all `rightsApproved: false`. The catalog gate is `priceState === 'approved' && rightsApproved === true`.
- Release pipeline: `schemas/release-manifest/arcanea.release_manifest.v1.schema.json` has a rights block limited to `{ commercialCleared: boolean, licenseType: string }`.
- Provenance: `packages/product-kernel` exports `ProvenanceEvent` (`outputHash`, `promptHash`, `sourceRefs`, `syntheticContentMark`) and `RunReceipt`; migration `20261013000001_creation_engine_assets.sql` stores `model_id`, `prompt`, `enhanced_prompt`, `seed`, `sha256` per generated asset — **no rights, licence or creator-share fields**.
- Billing: `billing_kernel`, credits, `generation_jobs`, world graph migrations exist. #511 and #529 [REPORTED] document that the credit spend path is not yet atomic/idempotent and that Polar/Stripe events are not reconciled into one ledger. TRUTH.md (Aug 2026) records Polar checkout "fail-closed pending token" and "commerce is dead" [RULED at the time; not re-measured — the live `/pricing` page renders, but no purchase was attempted].
- Governance: `AGENTS.md` — branch `agent/<harness>/<scope>`, draft PR, surgical scope; decided stack Cloudflare Agents, Vercel AI SDK, Vercel Blob (not R2), Supabase, Infisical, MCP; "technology with no registry record needs a registry PR"; Luminor assets CC-BY-NC [RULED].
- Programme issues (open): #276 programme, #277 approval receipts, #279 `release.arcanea.json`, #283 Realm Graph & canon boundary, #511 revenue readiness, #529 credits trust, #661 open-core licensing (unresolved — README says proprietary, TASTE.md/product text say permissive), #191/#223 domain binding, #534 canon questions blocking #331 (Frank/CCO decision needed).
- Agents already defined: `.claude/agents/` (@lumina-queen, creative/council, lorekeeper, publisher, nft-art-director) and packages `arcanea-security`, `guardian-memory`, `guardian-evolution`, `author-council`.

### 3.2 Adjacent repositories

| Repo                                          | What it is [MEASURED]                                                                                                                                                                                                                                                                                                                                                                                                                        | Reusable?                                                                                                                                                         |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Arcanea-Labs/arcanea-onchain`                | 131 tracked files; EVM (ArcaneaNFT, RoyaltyEngine, Marketplace, Governance, Bridge + Foundry tests) and Solana/Anchor programs (guardian-nft, guardian-vault, academy-badge, rewards); README badge "architecture-phase", "no production packages are published yet"; last commit 2026-10-02 "deploy blockers from review". Unaudited, no deployments. `docs/metadata-standard.md` is a trait list ("Full specification coming in Phase 1"). | Reference only. Do not deploy. Its metadata standard should be superseded by the rights manifest + a token metadata projection, if and when a token is justified. |
| `frankxai/arcanea-nft-forge`                  | Strategy documents, no runtime.                                                                                                                                                                                                                                                                                                                                                                                                              | Reference only.                                                                                                                                                   |
| `frankxai/arcanea-records`                    | Duplicate of the monorepo tree.                                                                                                                                                                                                                                                                                                                                                                                                              | No. Candidate for archive (Frank's call).                                                                                                                         |
| `frankxai/arcanea-marketplace`                | Near-empty.                                                                                                                                                                                                                                                                                                                                                                                                                                  | No.                                                                                                                                                               |
| `frankxai/frankx-starlight-command` (private) | Mission control for the estate.                                                                                                                                                                                                                                                                                                                                                                                                              | Process source, not product code.                                                                                                                                 |
| `frankxai/starlight-estate`                   | `TRUTH.md` doctrine and portfolio rulings.                                                                                                                                                                                                                                                                                                                                                                                                   | Authority document.                                                                                                                                               |
| `frankxai/Starlight-Intelligence-System`      | ~160 agent definition files, incl. starlight-sentinel, starlight-legal-ip, starlight-contracts, starlight-terms, starlight-trademarks, starlight-steward, starlight-evaluator, royalty-architect, music-sync-specialist, starlight-asset-quality, starlight-concierge, starlight-orchestrator.                                                                                                                                               | Yes — these are the Guardian Fleet roles already written down (see §6).                                                                                           |
| Linear (Arcanea team)                         | P-ARC-34 "Arcanea Studios Year One Proof" (two releases, Realm Graph, 60/30/10 split, no autonomous canon promotion/publishing/rights assertion/spend); P-ARC-19 "Creator Forge" (prompt-graph lineage, attribution cascade; on-chain v1 only after first paid licence); P-ARC-30; P-ARC-15 legal entity = Dutch Eenmanszaak. [RULED]                                                                                                        | Governs sequencing.                                                                                                                                               |

### 3.3 Measured corpus (from TRUTH.md, Aug 2026) [RULED/REPORTED]

428 curated images, 845 Suno tracks, Chronicles ~354k words; tools listed as Midjourney, Codex/gpt-image, Grok (paid tiers), Suno Premier, ElevenLabs. Per-asset provenance (which plan, which prompt, which seed) is only captured for assets that passed through `creation_engine_assets`; the historical corpus has no per-asset rights record. This is the registry gap Phase 1 must close before any collector release.

---

## 4. Most reusable existing infrastructure (ranked)

1. **Shop catalog gate + release manifest** (`catalog.ts`, `release-manifest` schema): already fail-closed; just needs a real rights source behind the booleans.
2. **`product-kernel` provenance/receipt events**: the right primitive for run-level provenance; roll up into asset-level manifests.
3. **`creation_engine_assets` migration**: hash + model + prompt + seed per asset; add a `rights_manifest_id`.
4. **SIS agent definitions**: legal-ip, contracts, terms, trademarks, evaluator, steward, sentinel, royalty-architect — the Fleet already exists as roles.
5. **AGENTS.md process**: branch convention, draft PRs, second-family review for money/auth/CI, Frank-only buttons.
6. **Canon machinery**: `.arcanea/lore/CANON_LOCKED.md`, MCP canon screening (PR #629) returning `canonApproval: false, humanReviewRequired: true` [REPORTED].
7. **AI-disclosure guide and `data-ai-generated` markup** on content surfaces.

Not reusable yet: `arcanea-onchain` contracts (unaudited, chain assumptions stale), `arcanea-marketplace`, `arcanea-records`.

---

## 5. What this cycle shipped against the gaps

`packages/rights-manifest` (draft PR, branch `agent/perplexity/rights-manifest`): a Zod v4 `arcanea.rights_manifest.v0` schema; nine licence templates, all `draft-requires-counsel-review`; a validator with rules RM000–RM015 that fails closed on exactly the mission's non-claims (no copyright claim on fully generated material; on-chain registration is never ownership; commercial grants need counsel + receipt; canon promotion needs a human receipt; AI tool terms must be verified for commercial grants); `isReleaseReady()` as the single question the shop should ask; a real draft manifest for Living Cosmos First Edition that honestly reports what is missing; generated JSON Schema; 22 tests passing on Node 22 with native type stripping; type-check clean; Prettier clean; `pnpm-lock.yaml` updated by pnpm 11.28.4 (six-line importer addition only). No prices, checkout, Polar, secrets, workflows, DNS or deployments touched.

---

## 6. Guardian Fleet → existing roles (logical mapping, no new agents deployed)

| Mission role                    | Existing definition(s)                                                                                     | Gap                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Aether (orchestration)          | starlight-orchestrator; @lumina-queen; SIS lifecycle rails (#276 says Queen is a profile, not a scheduler) | None for Phase 1.                                                              |
| Lyra (creative)                 | creative/council, author-council, nft-art-director                                                         | Must produce `review`-state manifests, never approve.                          |
| Atlas (registry/data)           | product-kernel, creation_engine_assets, world graph                                                        | Needs `rights_manifest_id` join and asset import for the historical corpus.    |
| Themis (rights/legal)           | starlight-legal-ip, starlight-contracts, starlight-terms, starlight-trademarks                             | Rights manifest validator is Themis's tool; counsel remains human.             |
| Aegis (security/safety)         | arcanea-security, starlight-sentinel, estate-guard CI                                                      | Threat model in the plan doc.                                                  |
| Solace (community/support)      | starlight-concierge                                                                                        | No community surface decided (Discourse Free plan is an option; see research). |
| Nova (commerce)                 | shop catalog, Polar/Stripe routes, #511/#529                                                               | Blocked by TRUTH §2 vs credits conflict.                                       |
| Meridian (distribution/markets) | publisher agent, `arcanea.marketplace-distribution.v0` template                                            | Marketplace terms research done; no integrations.                              |
| Forgekeeper (engineering)       | AGENTS.md process, CI, lockfile-drift                                                                      | Lockfile and Prettier gates respected in this PR.                              |
| Veritas (truth/evaluation)      | starlight-evaluator, starlight-asset-quality, TRUTH.md                                                     | This audit's evidence tags are Veritas's convention.                           |

---

## 7. Blockers and items needing Frank

1. **Vercel token invalid (403)** — cannot verify deployments, aliases or the `labs.arcanea.ai` 502. Reauthorize.
2. **TRUTH §2 (no SaaS/BYOK) vs live `/pricing` credits** — rule which is current before any Nova work.
3. **Counsel** — nine licence templates need review before any commercial grant can be `active`; the validator will refuse until a template is `counsel-reviewed`.
4. **sanctum.arcanea.ai DNS** — approval needed if it is to exist.
5. **arcanea.nft** — Web3-only name; decide whether it matters at all.
6. **Legal entity text in AGENTS.md** (BV vs Eenmanszaak) — correct by ruling.
7. **#661 open-core licensing** — the rights manifest covers creative assets, not code; #661 still needs its licence map.
8. **#534 canon questions** — still blocking #331; unchanged.

Sources for external claims are in `ARCANEA-GENESIS-2026-11-06-FRONTIER-RESEARCH.md`.
