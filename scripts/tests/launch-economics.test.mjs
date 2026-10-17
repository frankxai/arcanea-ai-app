import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { modelLaunchEconomics } from "../model-launch-economics.mjs";

const script = fileURLToPath(
  new URL("../model-launch-economics.mjs", import.meta.url),
);
const scenario = {
  price: 100,
  includedCredits: 1000,
  usageFraction: 0.25,
  providerUnitCost: 0.02,
  retryRate: 0.25,
  targetMargin: 0.8,
  storage: 0,
  runtime: 0,
  support: 0,
  feeRate: 0,
  feeFixed: 0,
  taxRate: 0,
  refundRate: 0,
  payoutRate: 0,
};
const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const args = (input) =>
  Object.entries(input).map(([key, value]) => `--${key}=${value}`);

test("low usage cannot hide full-use downside or increase the safe grant", () => {
  const r = modelLaunchEconomics(scenario);
  close(r.effectiveProviderCostPerUsedCredit, 0.025);
  close(r.modeledUsage.providerSpend, 6.25);
  close(r.fullUse.providerSpend, 25);
  assert.equal(r.modeledUsage.contributionPerMember, 93.75);
  assert.equal(r.fullUse.contributionPerMember, 75);
  assert.equal(r.target.maxAffordableProviderSpend, 20);
  assert.equal(r.target.maxAffordableIncludedCredits, 800);
  assert.equal(r.target.fullUseMeetsTarget, false);
  assert.equal(r.target.modeledUsageMeetsTarget, true);
  assert.equal(
    modelLaunchEconomics({ ...scenario, usageFraction: 1 }).target
      .maxAffordableIncludedCredits,
    800,
  );
});

test("tax, gross payment fees, refunds, payout, storage, runtime and support reduce capacity", () => {
  const r = modelLaunchEconomics({
    ...scenario,
    price: 121,
    taxRate: 0.21,
    refundRate: 0.03,
    feeRate: 0.05,
    feeFixed: 0.5,
    payoutRate: 0.01,
    storage: 2,
    runtime: 3,
    support: 4,
    targetMargin: 0.5,
    includedCredits: 10000,
    providerUnitCost: 0.01,
    retryRate: 0.2,
  });
  assert.equal(r.fullUse.revenueExTax, 100);
  assert.equal(r.fullUse.transactionFee, 6.55);
  assert.equal(r.fullUse.contributionPerMember, -39.45);
  close(r.target.maxAffordableProviderSpend, 30.5455);
  assert.equal(r.target.maxAffordableIncludedCredits, 2545);
  assert.ok(2545 * 0.012 <= r.target.maxAffordableProviderSpend);
  assert.ok(2546 * 0.012 > r.target.maxAffordableProviderSpend);
});

test("zero usage/grant and margin boundary inputs are explicit valid scenarios", () => {
  const r = modelLaunchEconomics({
    ...scenario,
    includedCredits: 0,
    usageFraction: 0,
    targetMargin: 1,
  });
  assert.equal(r.modeledUsage.providerSpend, 0);
  assert.equal(r.fullUse.contributionPerMember, 100);
  assert.equal(r.target.contributionMarginFraction, 1);
  assert.equal(r.target.maxAffordableIncludedCredits, 0);
  assert.equal(r.target.fullUseMeetsTarget, true);
  assert.equal(
    modelLaunchEconomics({ ...scenario, targetMargin: 0 }).target
      .maxAffordableIncludedCredits,
    4000,
  );
});

test("infeasible overhead and explicit zero provider cost have distinct results", () => {
  const infeasible = modelLaunchEconomics({ ...scenario, storage: 101 });
  assert.equal(infeasible.target.feasibleBeforeProviderSpend, false);
  assert.equal(infeasible.target.providerSpendHeadroom, -81);
  assert.equal(infeasible.target.maxAffordableIncludedCredits, 0);
  assert.equal(infeasible.target.maxAffordableProviderSpend, 0);
  const zero = modelLaunchEconomics({ ...scenario, providerUnitCost: 0 });
  assert.equal(zero.target.maxAffordableIncludedCredits, null);
  assert.match(zero.target.creditGrantBasis, /not evidence of free service/);
  assert.match(zero.status, /no observed provider costs/);
  assert.equal(
    modelLaunchEconomics({ ...scenario, providerUnitCost: 0, storage: 101 })
      .target.maxAffordableIncludedCredits,
    0,
  );
});

test("exact decimal margin boundaries pass without allowing an adjacent overgrant", () => {
  const input = {
    ...scenario,
    price: 1,
    includedCredits: 10,
    providerUnitCost: 0.01,
    retryRate: 0,
    usageFraction: 1,
    targetMargin: 0.9,
  };
  for (const [overrides, grant, meets] of [
    [{}, 10, true],
    [{ targetMargin: 0.9000000000000001 }, 9, false],
    [{ targetMargin: 0.8999999999999999 }, 10, true],
    [{ providerUnitCost: 0.010000000000000002 }, 9, false],
    [{ providerUnitCost: 0.009999999999999998 }, 10, true],
  ]) {
    const r = modelLaunchEconomics({ ...input, ...overrides });
    assert.equal(r.target.maxAffordableIncludedCredits, grant);
    assert.equal(r.target.fullUseMeetsTarget, meets);
    assert.equal(r.target.modeledUsageMeetsTarget, meets);
  }
});

test("fractional-cent and scientific-notation costs retain exact grant bounds", () => {
  const input = {
    ...scenario,
    price: 0.01,
    includedCredits: 2000,
    providerUnitCost: 0.000005,
    retryRate: 0,
    usageFraction: 1,
    targetMargin: 0,
  };
  for (const [unitCost, grant, meets] of [
    [0.000005, 2000, true],
    [0.000005000000000001, 1999, false],
    [0.000004999999999999, 2000, true],
    [5e-8, 200000, true],
  ]) {
    const r = modelLaunchEconomics({ ...input, providerUnitCost: unitCost });
    assert.equal(r.target.maxAffordableIncludedCredits, grant);
    assert.equal(r.target.fullUseMeetsTarget, meets);
  }
});

test("a tiny decimal overhead shortfall cannot be waived by rounding tolerance", () => {
  const r = modelLaunchEconomics({
    ...scenario,
    price: 1,
    storage: 0.10000000000000002,
    providerUnitCost: 1e-20,
    includedCredits: 0,
    targetMargin: 0.9,
  });
  assert.equal(r.target.feasibleBeforeProviderSpend, false);
  assert.equal(r.target.fullUseMeetsTarget, false);
  assert.equal(r.target.maxAffordableIncludedCredits, 0);
  assert.equal(r.target.providerSpendHeadroom, -2e-17);
});

test("every cost and rate must be supplied; invalid numbers and unknown inputs fail", () => {
  for (const key of Object.keys(scenario)) {
    const missing = { ...scenario };
    delete missing[key];
    assert.throws(() => modelLaunchEconomics(missing), new RegExp(key));
    for (const value of [undefined, null, "0", NaN, Infinity, -1]) {
      assert.throws(() => modelLaunchEconomics({ ...scenario, [key]: value }));
    }
  }
  for (const input of [
    { price: 0 },
    { includedCredits: 1.5 },
    { includedCredits: Number.MAX_SAFE_INTEGER + 1 },
    { usageFraction: 1.01 },
    { targetMargin: 1.01 },
    { feeRate: 1.01 },
    { refundRate: 1.01 },
    { taxRate: 1.01 },
    { payoutRate: 1.01 },
    { providerUnitCost: 1e308, retryRate: 10 },
    { price: 1e308 },
    { providerUnitCost: Number.MIN_VALUE },
    { inference: 0 },
  ])
    assert.throws(() => modelLaunchEconomics({ ...scenario, ...input }));
  assert.throws(() => modelLaunchEconomics(), /price/);
});

test("CLI is deterministic, rejects missing and duplicate values and preserves the legacy CLI", () => {
  const a = execFileSync(process.execPath, [script, ...args(scenario)]);
  const b = execFileSync(process.execPath, [script, ...args(scenario)]);
  assert.deepEqual(a, b);
  assert.equal(JSON.parse(a).target.maxAffordableIncludedCredits, 800);
  for (const invalid of [[], [...args(scenario), "--price=100"], ["--foo=1"]]) {
    const r = spawnSync(process.execPath, [script, ...invalid]);
    assert.equal(r.status, 1);
    assert.equal(r.stdout.length, 0);
    assert.ok(r.stderr.length > 0);
  }
  const legacy = JSON.parse(
    execFileSync(process.execPath, [
      fileURLToPath(new URL("../model-creator-economics.mjs", import.meta.url)),
    ]),
  );
  assert.equal(legacy.scenarios.length, 3);
  assert.equal(legacy.scenarios[2].assumptions.price, 129);
  assert.match(legacy.status, /tax-inclusive USD/);
});
