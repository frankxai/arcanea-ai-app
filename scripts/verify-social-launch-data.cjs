const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const repoRoot = join(__dirname, "..");
const runRoot = join(repoRoot, ".arcanea", "image-lab", "run-2026-07-06-god-mode", "social-overlays");
const appRoot = join(repoRoot, "apps", "web", "app", "visual-world-engine", "social", "data");

const files = [
  "publishing-approval-queue.json",
  "social-overlay-spec.json",
  "social-overlay-manifest.json",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const mismatches = [];

for (const file of files) {
  const sourcePath = join(runRoot, file);
  const snapshotPath = join(appRoot, file);
  const sourceHash = sha256(sourcePath);
  const snapshotHash = sha256(snapshotPath);

  if (sourceHash !== snapshotHash) {
    mismatches.push(`${file}: source ${sourceHash} != bundled ${snapshotHash}`);
  }
}

const queue = readJson(join(appRoot, "publishing-approval-queue.json"));
const spec = readJson(join(appRoot, "social-overlay-spec.json"));
const manifest = readJson(join(appRoot, "social-overlay-manifest.json"));

const p0Count = queue.campaigns.filter((campaign) => campaign.priority === "P0").length;
const allReviewGated = queue.campaigns.every((campaign) => campaign.approval_status === "needs_human_review");
const campaignIds = new Set(queue.campaigns.map((campaign) => campaign.campaign_id));
const specIds = new Set(spec.campaigns.map((campaign) => campaign.id));
const manifestIds = new Set(manifest.campaigns.map((campaign) => campaign.id));
const exportsWithMissingCampaign = manifest.exports.filter((item) => !campaignIds.has(item.campaignId));

const shapeChecks = [
  ["queue campaign count", queue.campaigns.length === 9],
  ["P0 campaign count", p0Count === 3],
  ["all campaigns review gated", allReviewGated],
  ["spec campaign count", spec.campaigns.length === 9],
  ["manifest campaign count", manifest.campaigns.length === 9],
  ["manifest export count", manifest.totalExports === 36 && manifest.exports.length === 36],
  ["manifest contact sheet count", manifest.totalContactSheets === 5 && manifest.contactSheets.length === 5],
  ["spec ids match queue ids", [...campaignIds].every((id) => specIds.has(id))],
  ["manifest ids match queue ids", [...campaignIds].every((id) => manifestIds.has(id))],
  ["manifest exports map to campaigns", exportsWithMissingCampaign.length === 0],
  ["rights remain gated", queue.rights_status === "unknown_until_vis_rights_ingestion"],
];

for (const [label, ok] of shapeChecks) {
  if (!ok) mismatches.push(label);
}

const routeSource = readFileSync(join(repoRoot, "apps", "web", "app", "visual-world-engine", "social", "page.tsx"), "utf8");
if (routeSource.includes("node:fs") || routeSource.includes("readFileSync(")) {
  mismatches.push("route still reads files at render time");
}
if (!routeSource.includes("./data/publishing-approval-queue.json")) {
  mismatches.push("route does not import bundled approval queue snapshot");
}

if (mismatches.length > 0) {
  console.error("[FAIL] Social launch data snapshot verification failed");
  for (const mismatch of mismatches) console.error(`- ${mismatch}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      files: files.length,
      campaigns: queue.campaigns.length,
      p0Campaigns: p0Count,
      exports: manifest.exports.length,
      contactSheets: manifest.contactSheets.length,
      rightsStatus: queue.rights_status,
    },
    null,
    2,
  ),
);
