import assert from "node:assert/strict";
import { test } from "node:test";
import { modelEconomics } from "../model-creator-economics.mjs";

test("tax collected is excluded from revenue and fees use the full transaction", () => {
  const r = modelEconomics({
    price: 121,
    taxRate: 0.21,
    members: 100,
    refundRate: 0,
    feeRate: 0.05,
    feeFixed: 0.5,
    infra: 0,
    support: 0,
    inference: 0,
    payoutRate: 0,
    fixedMonthly: 0,
  });
  assert.equal(r.revenueExTax, 100);
  assert.equal(r.transactionFee, 6.55);
  assert.equal(r.contributionPerMember, 93.45);
});
test("inference and fixed costs reduce contribution instead of disappearing behind BYOK", () => {
  const a = modelEconomics({ price: 49 });
  const b = modelEconomics({ price: 49, inference: 10 });
  assert.equal(
    Math.round((a.contributionPerMember - b.contributionPerMember) * 100),
    1000,
  );
  assert.ok(a.monthlyAfterFixed < a.contributionPerMember * 100);
});
test("negative contribution has no finite break-even", () => {
  assert.equal(
    modelEconomics({ price: 1, inference: 10 }).breakEvenMembers,
    null,
  );
});
test("invalid monetary, count, or percentage inputs fail explicitly", () => {
  for (const input of [
    { price: -1 },
    { price: 10, members: 0 },
    { price: 10, members: 1.5 },
    { price: 10, refundRate: 2 },
    { price: 10, inference: NaN },
    { price: Infinity },
  ]) {
    assert.throws(() => modelEconomics(input));
  }
});
