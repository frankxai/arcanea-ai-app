import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ACTION_COSTS,
  CREDIT_PACKS,
  PLANS,
  WELCOME_CREDITS,
  billingReadiness,
  costFor,
  formatEuro,
  isPaidSku,
  polarProductForSku,
  skuForPolarProduct,
} from "../catalog";

test("catalog has exactly one free plan and paid plans carry monthly credits", () => {
  const free = PLANS.filter((p) => p.priceCents === 0);
  assert.equal(free.length, 1);
  assert.equal(free[0].id, "spark");
  for (const plan of PLANS.filter((p) => p.priceCents > 0)) {
    assert.ok(plan.monthlyCredits > 0, `${plan.id} must grant credits`);
    assert.ok(plan.polarProductEnv, `${plan.id} needs a Polar product env`);
  }
});

test("credit packs get cheaper per credit as they grow", () => {
  const unit = CREDIT_PACKS.map((p) => p.priceCents / p.credits);
  for (let i = 1; i < unit.length; i += 1) {
    assert.ok(unit[i] < unit[i - 1], `pack ${CREDIT_PACKS[i].id} should be cheaper per credit`);
  }
  // 1 credit ≈ €0.01 at the entry pack.
  assert.equal(CREDIT_PACKS[0].priceCents / CREDIT_PACKS[0].credits, 1);
});

test("every action cost is a non-negative integer and exports are free", () => {
  for (const action of ACTION_COSTS) {
    assert.ok(Number.isInteger(action.credits) && action.credits >= 0, action.id);
  }
  assert.equal(costFor("world.export"), 0);
  assert.equal(costFor("image.standard", 4), 40);
  assert.throws(() => costFor("image.standard", 0));
  assert.throws(() => costFor("image.standard", 1.5));
});

test("welcome credits buy at least one standard image", () => {
  assert.ok(WELCOME_CREDITS >= costFor("image.standard", 1));
});

test("euro formatting", () => {
  assert.equal(formatEuro(0), "€0");
  assert.equal(formatEuro(1900), "€19");
  assert.equal(formatEuro(1950), "€19.50");
});

test("sku classification", () => {
  assert.equal(isPaidSku("spark"), false);
  assert.equal(isPaidSku("creator"), true);
  assert.equal(isPaidSku("pack-2500"), true);
  assert.equal(isPaidSku("enterprise"), false);
});

test("polar product mapping round-trips through env and ignores unknown ids", () => {
  const env = {
    POLAR_PRODUCT_CREATOR: "prod_creator",
    POLAR_PRODUCT_STUDIO: "prod_studio",
    POLAR_PRODUCT_PACK_500: "prod_500",
  };
  assert.equal(polarProductForSku("creator", env), "prod_creator");
  assert.equal(polarProductForSku("pack-500", env), "prod_500");
  assert.equal(polarProductForSku("pack-8000", env), null);
  assert.equal(polarProductForSku("spark", env), null);
  assert.equal(skuForPolarProduct("prod_studio", env), "studio");
  assert.equal(skuForPolarProduct("prod_500", env), "pack-500");
  assert.equal(skuForPolarProduct("prod_unknown", env), null);
  assert.equal(skuForPolarProduct(null, env), null);
});

test("billing is live only with token, webhook secret and both paid plans", () => {
  assert.equal(billingReadiness({}).live, false);
  const partial = billingReadiness({
    POLAR_ACCESS_TOKEN: "t",
    POLAR_WEBHOOK_SECRET: "s",
    POLAR_PRODUCT_CREATOR: "a",
  });
  assert.equal(partial.live, false);
  assert.equal(partial.plansReady, false);
  const ready = billingReadiness({
    POLAR_ACCESS_TOKEN: "t",
    POLAR_WEBHOOK_SECRET: "s",
    POLAR_PRODUCT_CREATOR: "a",
    POLAR_PRODUCT_STUDIO: "b",
    POLAR_PRODUCT_PACK_2500: "c",
    POLAR_SERVER: "sandbox",
  });
  assert.equal(ready.live, true);
  assert.deepEqual(ready.packsReady, ["pack-2500"]);
  assert.equal(ready.sandbox, true);
});
