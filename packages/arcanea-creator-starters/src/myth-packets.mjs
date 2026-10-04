import { createHash } from "node:crypto";

const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const maxMoney = 1_000_000_000_000;
export const compilerVersion = "arcanea.myth-packet.v1";

function fail(label) {
  throw new Error(`Invalid ${label}`);
}
function shape(value, keys, label) {
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) fail(label);
  if (
    Object.keys(value).length !== keys.length ||
    keys.some((key) => !Object.hasOwn(value, key))
  )
    fail(`${label} fields`);
}
function text(value, label, max = 600) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== value.trim() ||
    value.length > max ||
    /[\u0000-\u001f\u007f]/u.test(value)
  )
    fail(label);
}
function id(value, label) {
  text(value, label, 80);
  if (!idPattern.test(value)) fail(label);
}
function choice(value, choices, label) {
  if (!choices.includes(value)) fail(label);
}
function integer(value, min, max, label) {
  if (!Number.isSafeInteger(value) || value < min || value > max) fail(label);
}
function list(value, min, max, label) {
  if (!Array.isArray(value) || value.length < min || value.length > max)
    fail(label);
}
function unique(values, label) {
  if (new Set(values).size !== values.length) fail(`duplicate ${label}`);
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])]),
    );
  }
  return value;
}
export function digest(value) {
  return createHash("sha256")
    .update(JSON.stringify(canonical(value)))
    .digest("hex");
}

// This v1 accepts research metadata only. It has no clearance/approval input.
export function validateAtlas(atlas) {
  shape(atlas, ["schema", "revision", "records"], "atlas");
  choice(atlas.schema, ["arcanea.myth-atlas.v1"], "atlas schema");
  text(atlas.revision, "atlas revision", 80);
  list(atlas.records, 1, 64, "atlas records");
  for (const row of atlas.records) {
    shape(
      row,
      [
        "id",
        "label",
        "tradition",
        "livingTradition",
        "geography",
        "source",
        "adaptationPrompt",
        "reviewQuestions",
      ],
      "record",
    );
    id(row.id, "record id");
    text(row.label, "record label", 120);
    text(row.tradition, "tradition", 120);
    if (typeof row.livingTradition !== "boolean") fail("living tradition");
    shape(row.geography, ["status", "place"], "geography");
    choice(
      row.geography.status,
      [
        "traditional-association",
        "identification-unresolved",
        "dataset-association",
      ],
      "geography status",
    );
    text(row.geography.place, "place");
    shape(
      row.source,
      [
        "work",
        "attribution",
        "anchor",
        "url",
        "evidenceStatus",
        "editionRights",
      ],
      "source",
    );
    for (const key of ["work", "attribution", "anchor"])
      text(row.source[key], `source ${key}`);
    text(row.source.url, "source URL", 2000);
    let url;
    try {
      url = new URL(row.source.url);
    } catch {
      fail("source URL");
    }
    if (url.protocol !== "https:" || url.username || url.password)
      fail("source URL");
    choice(
      row.source.evidenceStatus,
      ["reading-pending", "anchor-located"],
      "source evidence status",
    );
    choice(row.source.editionRights, ["unresolved"], "edition rights");
    text(row.adaptationPrompt, "adaptation prompt");
    list(row.reviewQuestions, 1, 8, "review questions");
    for (const question of row.reviewQuestions)
      text(question, "review question");
  }
  unique(
    atlas.records.map((row) => row.id),
    "record ids",
  );
  return atlas;
}

export function validateBrief(brief, atlas) {
  validateAtlas(atlas);
  shape(
    brief,
    [
      "schema",
      "projectId",
      "title",
      "audience",
      "setting",
      "selectedMyths",
      "currency",
      "reviewRateMicrosPerHour",
      "maxProductionCostMicros",
      "deliverables",
    ],
    "brief",
  );
  choice(brief.schema, ["arcanea.myth-brief.v1"], "brief schema");
  id(brief.projectId, "project id");
  text(brief.title, "title", 160);
  choice(
    brief.audience,
    ["ages-8-12", "teens", "adults", "family"],
    "audience",
  );
  text(brief.setting, "setting");
  list(brief.selectedMyths, 1, 8, "selected myths");
  unique(brief.selectedMyths, "selected myths");
  const ids = new Set(atlas.records.map((row) => row.id));
  for (const selected of brief.selectedMyths) {
    id(selected, "selected myth id");
    if (!ids.has(selected)) fail(`unknown myth: ${selected}`);
  }
  choice(brief.currency, ["USD", "EUR", "GBP"], "currency");
  integer(brief.reviewRateMicrosPerHour, 0, maxMoney, "review rate");
  integer(brief.maxProductionCostMicros, 0, maxMoney, "production budget");
  list(brief.deliverables, 1, 16, "deliverables");
  for (const item of brief.deliverables) {
    shape(
      item,
      [
        "id",
        "format",
        "acceptedUnits",
        "attemptsPerUnit",
        "unitCostMicros",
        "reviewMinutesPerAttempt",
      ],
      "deliverable",
    );
    id(item.id, "deliverable id");
    choice(item.format, ["text", "image", "audio", "video"], "format");
    integer(item.acceptedUnits, 1, 1000, "accepted units");
    integer(item.attemptsPerUnit, 1, 20, "attempts per unit");
    integer(item.unitCostMicros, 0, maxMoney, "unit cost");
    integer(item.reviewMinutesPerAttempt, 0, 1440, "review minutes");
  }
  unique(
    brief.deliverables.map((item) => item.id),
    "deliverable ids",
  );
  return brief;
}

function safeMoney(value) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) fail("computed cost overflow");
  return Number(value);
}
export function compilePacket(brief, atlas) {
  validateBrief(brief, atlas);
  const research = brief.selectedMyths.map((selected) => {
    const record = atlas.records.find((row) => row.id === selected);
    return { ...structuredClone(record), sourceDigest: digest(record) };
  });
  const estimates = brief.deliverables.map((item) => {
    const plannedAttempts = item.acceptedUnits * item.attemptsPerUnit;
    const reviewMinutes = plannedAttempts * item.reviewMinutesPerAttempt;
    const generationCost =
      BigInt(plannedAttempts) * BigInt(item.unitCostMicros);
    // Round up each line to a whole micro; review every planned attempt.
    const reviewCost =
      (BigInt(reviewMinutes) * BigInt(brief.reviewRateMicrosPerHour) + 59n) /
      60n;
    return {
      ...item,
      plannedAttempts,
      reviewMinutes,
      generationCostMicros: safeMoney(generationCost),
      reviewCostMicros: safeMoney(reviewCost),
      totalCostMicros: safeMoney(generationCost + reviewCost),
    };
  });
  const totalCostMicros = safeMoney(
    estimates.reduce((total, item) => total + BigInt(item.totalCostMicros), 0n),
  );
  const questions = research.flatMap((row) =>
    row.reviewQuestions.map((question) => ({ mythId: row.id, question })),
  );
  const body = {
    schema: compilerVersion,
    project: {
      id: brief.projectId,
      title: brief.title,
      audience: brief.audience,
      setting: brief.setting,
    },
    provenance: {
      atlasRevision: atlas.revision,
      atlasDigest: digest(atlas),
      briefDigest: digest(brief),
    },
    research,
    creativeProposals: research.map((row) => ({
      mythId: row.id,
      sourceDigest: row.sourceDigest,
      status: "proposal",
      prompt: row.adaptationPrompt,
      setting: brief.setting,
    })),
    budget: {
      currency: brief.currency,
      moneyUnit: "millionths-of-currency-unit",
      maxProductionCostMicros: brief.maxProductionCostMicros,
      totalCostMicros,
      remainingMicros: brief.maxProductionCostMicros - totalCostMicros,
      withinBudget: totalCostMicros <= brief.maxProductionCostMicros,
      estimates,
      assumptions: [
        "User-supplied planning rates; provider prices are not verified.",
        "All planned attempts incur generation and review cost; acceptance is not guaranteed.",
        "Taxes, checkout fees, hosting, authoring and distribution costs are excluded.",
      ],
    },
    review: {
      stage: "research",
      canonStatus: "unreviewed",
      commercialClearance: "unresolved",
      livingTraditionReviewRequired: research.some(
        (row) => row.livingTradition,
      ),
      releaseEligible: false,
      questions,
      requiredDecisions: [
        "Read and compare source witnesses; keep variant and geography uncertainty visible.",
        "Approve original creative direction and age suitability with a human editor.",
        "Review edition, asset, trademark and contributor rights for the intended territory.",
        "Record human authorship, asset provenance and the approved release manifest separately.",
      ],
    },
    executionBoundary:
      "Reference data for editorial planning. Compilation makes no model calls, spends no money and approves no release.",
  };
  return { ...body, packetId: `mp-${digest(body)}` };
}

// Packet text is data, including when opened in a Markdown renderer.
const markdown = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_{}\[\]()#+.!|]/g, "\\$&");

export function packetMarkdown(packet) {
  const p = packet;
  const lines = [
    `# ${markdown(p.project.title)}`,
    "",
    `Packet: ${p.packetId}`,
    "",
    `Audience: ${markdown(p.project.audience)}. Setting: ${markdown(p.project.setting)}`,
    "",
    "Research packet. Canon unreviewed. Commercial clearance unresolved. Release eligible: no.",
    "",
    "## Source evidence and proposed transformations",
    "",
  ];
  for (const row of p.research) {
    lines.push(
      `### ${markdown(row.label)}`,
      "",
      `Tradition: ${markdown(row.tradition)}. Living tradition: ${row.livingTradition ? "yes" : "no"}.`,
      "",
      `Source: ${markdown(row.source.work)}; ${markdown(row.source.attribution)}; ${markdown(row.source.anchor)}.`,
      "",
      `Source URL: ${markdown(row.source.url)}`,
      "",
      `Evidence: ${row.source.evidenceStatus}. Edition rights: unresolved.`,
      "",
      `Geography: ${row.geography.status}; ${markdown(row.geography.place)}.`,
      "",
      `Creative proposal: ${markdown(row.adaptationPrompt)}`,
      "",
      `Source digest: ${row.sourceDigest}`,
      "",
    );
  }
  lines.push(
    "## Production estimate",
    "",
    `Currency: ${p.budget.currency}. Money unit: millionths of currency unit. Total: ${p.budget.totalCostMicros}. Ceiling: ${p.budget.maxProductionCostMicros}. Within budget: ${p.budget.withinBudget ? "yes" : "no"}.`,
    "",
    "| Deliverable | Format | Accepted units target | Planned attempts | Review minutes | Cost in micros |",
    "| --- | --- | --- | --- | --- | --- |",
  );
  for (const item of p.budget.estimates)
    lines.push(
      `| ${markdown(item.id)} | ${item.format} | ${item.acceptedUnits} | ${item.plannedAttempts} | ${item.reviewMinutes} | ${item.totalCostMicros} |`,
    );
  lines.push(
    "",
    ...p.budget.assumptions.map((value) => `- ${markdown(value)}`),
    "",
    "## Unresolved editorial work",
    "",
  );
  for (const row of p.review.questions)
    lines.push(`- ${markdown(row.mythId)}: ${markdown(row.question)}`);
  lines.push(
    "",
    ...p.review.requiredDecisions.map((value) => `- ${markdown(value)}`),
    "",
    `Atlas digest: ${p.provenance.atlasDigest}. Brief digest: ${p.provenance.briefDigest}.`,
    "",
    p.executionBoundary,
    "",
  );
  return lines.join("\n");
}
