import { pathToFileURL } from "node:url";
import { modelEconomics } from "./model-creator-economics.mjs";

// No catalog or provider lookup: every monetary input is an illustrative EUR
// amount per member/month. A missing input is unknown, never an observed zero.
const required = [
  "price",
  "includedCredits",
  "usageFraction",
  "providerUnitCost",
  "retryRate",
  "targetMargin",
  "storage",
  "runtime",
  "support",
  "feeRate",
  "feeFixed",
  "taxRate",
  "refundRate",
  "payoutRate",
];

// Exact rational values from the validated Number's decimal representation.
// No epsilon: even the next representable decimal must not gain a credit.
function decimal(value) {
  const [mantissa, exponent = "0"] = String(value).split("e");
  const fractionDigits = mantissa.split(".")[1]?.length ?? 0;
  const scale = Number(exponent) - fractionDigits;
  const digits = BigInt(mantissa.replace(".", ""));
  return scale >= 0
    ? [digits * 10n ** BigInt(scale), 1n]
    : [digits, 10n ** BigInt(-scale)];
}
const add = ([a, b], [c, d]) => [a * d + c * b, b * d];
const subtract = ([a, b], [c, d]) => [a * d - c * b, b * d];
const multiply = ([a, b], [c, d]) => [a * c, b * d];
const divide = ([a, b], [c, d]) => [a * d, b * c];
const atMost = ([a, b], [c, d]) => a * d <= c * b;
const zero = [0n, 1n];
const one = [1n, 1n];

// JSON summaries use Numbers; authoritative capacity/comparisons stay rational.
// Scale before converting, so large intermediate BigInts never become Infinity.
function summaryNumber([numerator, denominator]) {
  if (numerator === 0n) return 0;
  const negative = numerator < 0n;
  const magnitude = negative ? -numerator : numerator;
  const exponent = magnitude.toString().length - denominator.toString().length;
  const scale = 18 - exponent;
  const coefficient =
    scale >= 0
      ? (magnitude * 10n ** BigInt(scale)) / denominator
      : magnitude / (denominator * 10n ** BigInt(-scale));
  return Number(`${negative ? "-" : ""}${coefficient}e${-scale}`);
}

export function modelLaunchEconomics(input = {}) {
  for (const name of required) {
    if (!Number.isFinite(input[name]) || input[name] < 0)
      throw new Error(`${name} is required as a finite nonnegative number`);
  }
  for (const name of Object.keys(input)) {
    if (!required.includes(name)) throw new Error(`Unknown input: ${name}`);
  }
  if (!Number.isSafeInteger(input.includedCredits))
    throw new Error("includedCredits must be a nonnegative safe integer");
  for (const name of ["usageFraction", "targetMargin"]) {
    if (input[name] > 1) throw new Error(`${name} must be between 0 and 1`);
  }
  const {
    includedCredits,
    usageFraction,
    providerUnitCost,
    retryRate,
    targetMargin,
    storage,
    runtime,
    ...commercial
  } = input;
  // retryRate is the expected extra billed attempts per delivered credit;
  // 0.2 means 1.2 paid attempts, not a recursive failure probability.
  const exactUnitCost = multiply(
    decimal(providerUnitCost),
    add(one, decimal(retryRate)),
  );
  const exactFullUse = multiply(decimal(includedCredits), exactUnitCost);
  const exactModeledUse = multiply(exactFullUse, decimal(usageFraction));
  const effectiveUnitCost = summaryNumber(exactUnitCost);
  const fullUseSpend = summaryNumber(exactFullUse);
  const modeledSpend = summaryNumber(exactModeledUse);
  const base = {
    ...commercial,
    infra: storage + runtime,
    members: 1,
    fixedMonthly: 0,
  };
  const modeledUsage = modelEconomics({ ...base, inference: modeledSpend });
  const fullUse = modelEconomics({ ...base, inference: fullUseSpend });
  // Solve against exact decimal inputs, rather than floating/cent-rounded reports.
  // Margin uses ex-tax revenue; payment fees use the tax-inclusive charge,
  // matching modelEconomics. This is a provider budget, not a credit price.
  const revenue = divide(
    decimal(input.price),
    add(one, decimal(input.taxRate)),
  );
  const refunds = multiply(revenue, decimal(input.refundRate));
  const fees = add(
    multiply(decimal(input.price), decimal(input.feeRate)),
    decimal(input.feeFixed),
  );
  const netForPayout = subtract(subtract(revenue, refunds), fees);
  const payout = multiply(
    atMost(netForPayout, zero) ? zero : netForPayout,
    decimal(input.payoutRate),
  );
  const exactAvailableSpend = [
    multiply(revenue, decimal(targetMargin)),
    refunds,
    fees,
    payout,
    decimal(storage),
    decimal(runtime),
    decimal(input.support),
  ].reduce(subtract, revenue);
  const feasible = atMost(zero, exactAvailableSpend);
  const exactAffordableSpend = feasible ? exactAvailableSpend : zero;
  const availableSpend = summaryNumber(exactAvailableSpend);
  const affordableSpend = summaryNumber(exactAffordableSpend);
  const grantRatio =
    exactUnitCost[0] > 0n ? divide(exactAffordableSpend, exactUnitCost) : null;
  const grant = !feasible
    ? 0
    : grantRatio
      ? Number(grantRatio[0] / grantRatio[1])
      : null;
  if (
    ![effectiveUnitCost, fullUseSpend, modeledSpend, availableSpend].every(
      Number.isFinite,
    ) ||
    [modeledUsage, fullUse].some((report) =>
      Object.values(report).some(
        (value) => typeof value === "number" && !Number.isFinite(value),
      ),
    ) ||
    (grant !== null && !Number.isSafeInteger(grant))
  )
    throw new Error("Inputs exceed the supported finite/safe numeric range");

  return {
    status:
      "Illustrative EUR assumptions only; no observed provider costs, usage, revenue or checkout verification. No runtime price or credit changes.",
    basis:
      "Per member/month; price includes tax. Retry rate is extra billed attempts per delivered credit. Contribution margin denominator is revenue excluding tax. Storage includes retained versions, backups and delivery; runtime excludes provider inference. Fixed company costs, acquisition, salaries, disputes and income tax are excluded.",
    assumptions: { ...input },
    effectiveProviderCostPerUsedCredit: effectiveUnitCost,
    modeledUsage: {
      usageFraction,
      providerSpend: modeledSpend,
      ...modeledUsage,
    },
    fullUse: { usageFraction: 1, providerSpend: fullUseSpend, ...fullUse },
    target: {
      contributionMarginFraction: targetMargin,
      feasibleBeforeProviderSpend: feasible,
      providerSpendHeadroom: availableSpend,
      maxAffordableProviderSpend: affordableSpend,
      // Always solve grant capacity at full use, even for a low-usage scenario.
      maxAffordableIncludedCredits: grant,
      fullUseMeetsTarget: atMost(exactFullUse, exactAvailableSpend),
      modeledUsageMeetsTarget: atMost(exactModeledUse, exactAvailableSpend),
      creditGrantBasis: !feasible
        ? "Target already infeasible before provider spend; even a zero-credit grant cannot meet it."
        : exactUnitCost[0] === 0n
          ? "No finite grant bound at explicitly assumed zero unit cost; not evidence of free service."
          : "Whole credits at 100% use including retries; zero when non-provider costs already miss target.",
    },
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const input = {};
    for (const arg of process.argv.slice(2)) {
      const match = /^--([A-Za-z]+)=([0-9.eE+-]+)$/.exec(arg);
      if (!match || !required.includes(match[1]))
        throw new Error(`Unknown or invalid argument: ${arg}`);
      if (Object.hasOwn(input, match[1]))
        throw new Error(`Duplicate argument: ${match[1]}`);
      input[match[1]] = Number(match[2]);
    }
    console.log(JSON.stringify(modelLaunchEconomics(input), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
