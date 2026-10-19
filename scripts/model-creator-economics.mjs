import { pathToFileURL } from "node:url";

// Illustrative USD model, not an account report or a published price catalog.
// Polar Starter: 5% + $0.50, plus assumed 1.5% international-card surcharge.
// Source checked 2026-09-12: https://polar.sh/resources/pricing
export function modelEconomics(input) {
  const p = {
    members: 100,
    taxRate: 0.21,
    refundRate: 0.03,
    feeRate: 0.065,
    feeFixed: 0.5,
    infra: 1.2,
    support: 2,
    inference: 0,
    payoutRate: 0.005,
    fixedMonthly: 102.25,
    ...input,
  };
  for (const [name, value] of Object.entries(p)) {
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`${name} must be a finite nonnegative number`);
  }
  if (!Number.isFinite(p.price) || p.price <= 0)
    throw new Error("price must be positive");
  if (!Number.isInteger(p.members) || p.members <= 0)
    throw new Error("members must be a positive integer");
  for (const name of ["taxRate", "refundRate", "feeRate", "payoutRate"]) {
    if (p[name] > 1) throw new Error(`${name} must be between 0 and 1`);
  }
  const revenueExTax = p.price / (1 + p.taxRate);
  const refundReserve = revenueExTax * p.refundRate;
  const transactionFee = p.price * p.feeRate + p.feeFixed;
  const payoutEstimate =
    Math.max(0, revenueExTax - refundReserve - transactionFee) * p.payoutRate;
  const contribution =
    revenueExTax -
    refundReserve -
    transactionFee -
    payoutEstimate -
    p.infra -
    p.support -
    p.inference;
  const money = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  return {
    assumptions: p,
    revenueExTax: money(revenueExTax),
    refundReserve: money(refundReserve),
    transactionFee: money(transactionFee),
    payoutEstimate: money(payoutEstimate),
    contributionPerMember: money(contribution),
    contributionMargin: Math.round((contribution / revenueExTax) * 10000) / 100,
    monthlyAfterFixed: money(contribution * p.members - p.fixedMonthly),
    breakEvenMembers:
      contribution > 0 ? Math.ceil(p.fixedMonthly / contribution) : null,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const allowed = new Set([
      "price",
      "members",
      "taxRate",
      "refundRate",
      "feeRate",
      "feeFixed",
      "infra",
      "support",
      "inference",
      "payoutRate",
      "fixedMonthly",
    ]);
    const overrides = {};
    for (const arg of process.argv.slice(2)) {
      const match = /^--([A-Za-z]+)=(.+)$/.exec(arg);
      if (!match || !allowed.has(match[1]))
        throw new Error(`Unknown argument: ${arg}`);
      overrides[match[1]] = Number(match[2]);
    }
    const tiers =
      "price" in overrides
        ? [{ name: "custom", ...overrides }]
        : [
            { name: "Creator hypothesis", price: 19, infra: 1.2, support: 2 },
            { name: "Author hypothesis", price: 49, infra: 2, support: 4 },
            { name: "Studio hypothesis", price: 129, infra: 5, support: 10 },
          ];
    console.log(
      JSON.stringify(
        {
          status:
            "Illustrative scenarios; all prices tax-inclusive USD; no observed revenue data.",
          exclusions:
            "Acquisition, salaries, development, legal, disputes, income tax, and actual provider/payout variations. Support is an economic reserve, not a 1:1 service promise.",
          scenarios: tiers.map(({ name, ...p }) => ({
            name,
            ...modelEconomics({ ...p, ...overrides }),
          })),
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
