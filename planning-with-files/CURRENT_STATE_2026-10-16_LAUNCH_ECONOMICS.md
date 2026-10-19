# Launch economics diagnostic — 16 October 2026

Status: local implementation candidate; not pushed, merged, deployed or verified at checkout. Base: `75fc7fc96fefa8d33c3092b93cbc81a1a4bffa82`. Owner: Codex economics lane, `agent/codex/launch-economics`. Owning programme: #276; commerce #511; credit safety #529. No price, grant, license, entitlement or rollout decision is made here.

## Task contract

- Scope: expose the downside of using every included managed credit and the maximum provider budget/whole-credit grant compatible with an explicit contribution target.
- Creator job: understand whether a retained creative workspace can fund promised managed usage before a paid launch is approved.
- Files: `scripts/model-launch-economics.mjs`, `scripts/tests/launch-economics.test.mjs`, this receipt.
- Non-goals: runtime prices, credits, ledger, catalog ownership, checkout, provider calls, measurement collection, production activation and a new pricing authority.
- Acceptance: deterministic JSON from explicit cost and usage assumptions; missing inputs fail; modeled and full-use contributions; target provider budget and full-use credit capacity; meaningful financial/invalid-input tests; existing CLI preserved.
- Verification: Node 24 syntax check and both standalone economics test files. No paid/provider calls or external services.
- Rollback: revert this bounded candidate; no data or runtime rollback.
- Relevant skills: none required for standalone arithmetic. Luminor Engineering Kernel and local repo instructions loaded. No delegation or spend budget.

## Evidence boundary

The local billing catalog at the base revision contains Creator €19/1,500 monthly credits and Studio €79/8,000. The 11 October creator backlog explicitly calls those unvalidated economics and requires low/typical/heavy simulations. Catalog comments equate one credit with about €0.01 provider cost, while another comment claims 2x headroom; neither is measurement. This diagnostic does not reconcile those comments by inventing observed cost or changing the catalog.

Every launch input is required, including explicit zero for a modeled exclusion. All inputs remain illustrative assumptions, even when copied from local catalog values. Missing provider cost produces an error and no report. There are no observed provider costs, utilization, retry distributions, fees or tax treatment in this receipt; current checkout was not verified. The older May execution protocol/master plan contain historical state and are not current deployment evidence. No private portfolio strategy or registry was accessed; its reviewed-source binding remains the root integration owner's gate.

The sibling imports the existing `modelEconomics` for contribution, tax, fee, refund and payout calculations. The legacy CLI and its USD hypotheses are unchanged. The new command uses EUR throughout; it does not convert currencies or silently import historical USD fee assumptions. All money is per member/month. Storage must include retained versions, backups and delivery; runtime excludes provider inference. Retry rate means extra billed attempts per delivered credit: 0.1 multiplies provider spend by 1.1. It is not a recursive failure probability.

Target margin uses revenue excluding tax. Fees use the tax-inclusive transaction. Capacity subtracts refund and payout reserves, fees, storage, runtime and support, and is solved from unrounded inputs. The maximum grant always assumes 100% use including retries, regardless of the requested usage fraction. If overhead already misses target, feasibility is false and grant capacity is zero. Explicit zero unit cost has no finite grant bound (`null`), never a claim that service is free. Monetary scenario summaries retain the existing model's cent rounding; capacity retains numeric precision. Target margin input is a fraction, while scenario margin output follows the existing model's percentage convention.

Independent review reproduced two decimal-boundary defects in the first candidate: €1 at 90% target and €0.01 per credit returned 9 instead of 10; €0.01 with €0.000005 per credit returned 1,999 instead of 2,000. Regression tests failed before the fix. Capacity, feasibility and target decisions now use exact BigInt rational arithmetic from each validated Number's decimal string, including scientific notation. Whole-credit division uses exact integer floor, with no rounding tolerance or epsilon that could permit an overgrant. JSON monetary summaries are approximate Numbers; decision comparisons remain rational. Boundary fixtures and decimal values immediately above/below them verify both acceptance and rejection. CLI tests use `fileURLToPath` for paths with spaces and platform-native filesystem paths.

Excluded: fixed company costs, acquisition, salaries, development, legal, disputes and income tax. This is contribution before those costs, not operating profit. Nonexpiring credit liabilities and cohorts spending prior-period balances are not modeled; full use covers the explicit grant in one period only. Actual workload mix, failure/retry charges and ongoing storage/support must be measured before ratifying an offer.

## Reproduce an illustrative sensitivity

```bash
node scripts/model-launch-economics.mjs \
  --price=19 --includedCredits=1500 --usageFraction=0.5 \
  --providerUnitCost=0.01 --retryRate=0.1 --targetMargin=0.5 \
  --storage=0.5 --runtime=0.7 --support=2 \
  --feeRate=0.065 --feeFixed=0.5 --taxRate=0.21 \
  --refundRate=0.03 --payoutRate=0.005
```

These assumptions are deliberately illustrative; the provider unit cost merely stress-tests the existing catalog comment. The fees and reserves are not current vendor quotes. Change the price/grant explicitly for the Studio sensitivity; the script contains no plan catalog.

| Local catalog sensitivity | 10% use contribution | 50% use contribution | 100% use contribution | Max provider spend at 50% target | Max whole credits at full use |
| ------------------------- | -------------------: | -------------------: | --------------------: | -------------------------------: | ----------------------------: |
| Creator €19 / 1,500       |                €8.58 |                €1.98 |                -€6.27 |                        €2.377683 |                           216 |
| Studio €79 / 8,000        |               €45.41 |               €10.21 |               -€33.79 |                       €21.562473 |                         1,960 |

Under these assumptions, low observed use could mask full-use losses. The affordable grants above are diagnostic results, not recommended or implemented quotas.

## Verification and promotion posture

- `node --version`: `v24.19.0`, matching `.nvmrc` major 24.
- `node --check scripts/model-launch-economics.mjs`: pass.
- `node --test scripts/tests/creator-economics.test.mjs scripts/tests/launch-economics.test.mjs`: 13/13 pass, zero failures. Covers tax/gross fees, refunds/payout, all overhead, retry allocation, low/full-use divergence, exact decimal grant/target boundaries and adjacent inputs, subcent/scientific notation, tiny overhead shortfalls, zero-use/grant and target-margin boundaries, infeasible overhead, explicit zero cost, every missing input, invalid percentages/numbers/overflow, deterministic CLI output, error exits and legacy CLI compatibility.
- Full monorepo build/typecheck/lint: not run; standalone dependency-free `.mjs` only, no app runtime change. These gates are not claimed as passed. No browser, customer, live billing, provider or deployment acceptance is claimed.
- Independent review: pending root review of the exact committed candidate. Next action: integrate with the roadmap, review financial semantics and run applicable promotion checks before any publication. Founder offer/price/credit-term decisions and launch authorization remain outstanding.
