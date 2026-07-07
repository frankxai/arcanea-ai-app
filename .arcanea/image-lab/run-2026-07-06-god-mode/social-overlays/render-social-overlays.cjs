const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { createRequire } = require("node:module");

const requireFromWeb = createRequire(
  "C:/Users/frank/starlight/repos/arcanea-ai-app/apps/web/package.json",
);
const { chromium } = requireFromWeb("@playwright/test");

const root = __dirname;
const runRoot = path.resolve(root, "..");
const specPath = path.join(root, "social-overlay-spec.json");
const exportsRoot = path.join(root, "exports");
const sheetsRoot = path.join(root, "contact-sheets");
const manifestPath = path.join(root, "social-overlay-manifest.json");
const ledgerPath = path.join(root, "social-overlay-ledger.csv");
const jsonlPath = path.join(root, "social-overlay-metadata.jsonl");
const htmlPreviewPath = path.join(root, "social-overlay-preview.html");
const geistRoot =
  "C:/Users/frank/starlight/repos/arcanea-ai-app/node_modules/.pnpm/geist@1.7.0_next@16.2.6/node_modules/geist/dist/fonts";
const geistSans = path.join(geistRoot, "geist-sans", "Geist-Variable.woff2");
const geistMono = path.join(geistRoot, "geist-mono", "GeistMono-Variable.woff2");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

function cssUrl(filePath) {
  return pathToFileURL(filePath).href;
}

function imageDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`Not a PNG: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    sizeBytes: buffer.length,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function csv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function localIsoWithOffset(date = new Date()) {
  const pad = (n) => String(Math.trunc(Math.abs(n))).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}${sign}${pad(offsetMin / 60)}:${pad(offsetMin % 60)}`;
}

function layoutClass(channel) {
  if (channel.ratio === "9:16") return "layout-vertical";
  if (channel.ratio === "16:9") return "layout-wide";
  if (channel.ratio === "1:1") return "layout-square";
  return "layout-feed";
}

function buildFrameHtml({ spec, campaign, channel, sourcePath }) {
  const position =
    campaign.backgroundPosition?.[channel.key] ||
    campaign.backgroundPosition?.default ||
    "50% 50%";
  const accent = campaign.accent || "#39d7d2";
  const sourceUrl = imageDataUrl(sourcePath);
  const fontCss = fs.existsSync(geistSans)
    ? `
@font-face {
  font-family: "GeistSocial";
  src: url("${cssUrl(geistSans)}") format("woff2");
  font-weight: 100 900;
}
@font-face {
  font-family: "GeistMonoSocial";
  src: url("${cssUrl(geistMono)}") format("woff2");
  font-weight: 100 900;
}`
    : "";

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
${fontCss}
* { box-sizing: border-box; }
html, body {
  width: ${channel.width}px;
  height: ${channel.height}px;
  margin: 0;
  overflow: hidden;
  background: #05070f;
  font-family: "GeistSocial", "Segoe UI", sans-serif;
}
.frame {
  position: relative;
  width: ${channel.width}px;
  height: ${channel.height}px;
  overflow: hidden;
  color: white;
  background-image: url("${sourceUrl}");
  background-size: cover;
  background-position: ${position};
  background-repeat: no-repeat;
}
.frame::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 12%, color-mix(in srgb, ${accent} 32%, transparent), transparent 28%),
    linear-gradient(90deg, rgba(2, 5, 11, 0.86), rgba(2, 5, 11, 0.44) 42%, rgba(2, 5, 11, 0.08)),
    linear-gradient(0deg, rgba(2, 5, 11, 0.88), rgba(2, 5, 11, 0.08) 46%, rgba(2, 5, 11, 0.32));
}
.frame::after {
  content: "";
  position: absolute;
  inset: 0;
  border: max(3px, calc(${channel.width}px * 0.004)) solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}
.brand {
  position: absolute;
  left: 6.2%;
  top: 5.2%;
  display: flex;
  gap: 18px;
  align-items: center;
  z-index: 2;
  letter-spacing: 0;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
}
.mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), ${accent}),
    #ffffff;
  clip-path: polygon(50% 5%, 94% 93%, 68% 93%, 58% 70%, 40% 70%, 30% 93%, 6% 93%);
  box-shadow: 0 0 30px color-mix(in srgb, ${accent} 38%, transparent);
}
.brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.brand-name {
  font-size: 18px;
  font-weight: 760;
}
.brand-label {
  font-family: "GeistMonoSocial", "Consolas", monospace;
  font-size: 11px;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.58);
}
.copy {
  position: absolute;
  z-index: 2;
  left: 6.2%;
  bottom: 8%;
  width: min(78%, 820px);
}
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(5, 7, 15, 0.52);
  color: rgba(255, 255, 255, 0.86);
  font-family: "GeistMonoSocial", "Consolas", monospace;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 99px;
  background: ${accent};
  box-shadow: 0 0 22px ${accent};
}
h1 {
  margin: 0;
  max-width: 940px;
  color: #ffffff;
  font-size: clamp(48px, 7.1vw, 88px);
  line-height: 0.92;
  font-weight: 790;
  letter-spacing: 0;
  text-wrap: balance;
  text-shadow: 0 4px 34px rgba(0, 0, 0, 0.7);
}
.subhead {
  margin-top: 24px;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.08;
  font-weight: 560;
  letter-spacing: 0;
  text-shadow: 0 3px 24px rgba(0, 0, 0, 0.78);
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}
.pill {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 11px 16px;
  border-radius: 999px;
  background: rgba(5, 7, 15, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  font-weight: 620;
  backdrop-filter: blur(18px);
}
.pill.accent {
  color: #05070f;
  background: ${accent};
  border-color: color-mix(in srgb, ${accent} 80%, white);
}
.footer {
  position: absolute;
  z-index: 2;
  right: 6.2%;
  bottom: 5.2%;
  color: rgba(255, 255, 255, 0.74);
  font-family: "GeistMonoSocial", "Consolas", monospace;
  font-size: 14px;
  font-weight: 640;
  letter-spacing: 0;
}
.layout-vertical .brand { top: 6.3%; left: 7.4%; }
.layout-vertical .copy {
  left: 7.4%;
  top: 14.5%;
  bottom: auto;
  width: 76%;
}
.layout-vertical h1 {
  font-size: clamp(66px, 8.1vw, 92px);
  max-width: 790px;
}
.layout-vertical .subhead {
  font-size: 35px;
  max-width: 780px;
}
.layout-vertical .footer {
  left: 7.4%;
  right: auto;
  bottom: 9.4%;
}
.layout-square .copy {
  width: 78%;
  bottom: 8.4%;
}
.layout-square h1 {
  font-size: clamp(54px, 7.4vw, 82px);
}
.layout-wide .brand { top: 7.2%; }
.layout-wide .copy {
  width: 55%;
  bottom: 9%;
}
.layout-wide h1 {
  font-size: clamp(44px, 5.6vw, 72px);
}
.layout-wide .subhead {
  font-size: clamp(22px, 2.6vw, 30px);
}
.preload {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
</head>
<body>
<div class="frame ${layoutClass(channel)}" data-export-frame>
  <img class="preload" src="${sourceUrl}" alt="" onload="window.__bgReady = true" onerror="window.__bgReady = true" />
  <div class="brand">
    <div class="mark" aria-hidden="true"></div>
    <div class="brand-text">
      <div class="brand-name">${esc(spec.brand.name)}</div>
      <div class="brand-label">${esc(spec.brand.label)}</div>
    </div>
  </div>
  <main class="copy">
    <div class="kicker"><span class="dot"></span>${esc(campaign.gate)} Gate / ${esc(campaign.guardian)}</div>
    <h1>${esc(campaign.headline)}</h1>
    <div class="subhead">${esc(campaign.subhead)}</div>
    <div class="meta-row">
      <div class="pill accent">${esc(campaign.cta)}</div>
      <div class="pill">${esc(campaign.proof)}</div>
    </div>
  </main>
  <div class="footer">${esc(spec.brand.url)}</div>
</div>
<script>
  if (document.querySelector(".preload").complete) window.__bgReady = true;
</script>
</body>
</html>`;
}

function buildContactSheetHtml({ title, items, width, height, columns }) {
  const gap = 28;
  const labelH = 72;
  const padding = 48;
  const rows = Math.ceil(items.length / columns);
  const cardW = Math.floor((width - padding * 2 - gap * (columns - 1)) / columns);
  const cardH = Math.floor((height - padding * 2 - labelH - gap * (rows - 1)) / rows);
  const imgH = Math.max(120, cardH - 50);
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
* { box-sizing: border-box; }
html, body {
  width: ${width}px;
  height: ${height}px;
  margin: 0;
  overflow: hidden;
  background: #05070f;
  color: white;
  font-family: "Segoe UI", sans-serif;
}
.sheet {
  width: ${width}px;
  height: ${height}px;
  padding: ${padding}px;
}
.title {
  height: ${labelH}px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1;
  font-weight: 760;
  letter-spacing: 0;
}
.meta {
  font-family: Consolas, monospace;
  color: rgba(255, 255, 255, 0.62);
  font-size: 16px;
  text-align: right;
}
.grid {
  display: grid;
  grid-template-columns: repeat(${columns}, ${cardW}px);
  grid-auto-rows: ${cardH}px;
  gap: ${gap}px;
}
.card {
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.card img {
  width: 100%;
  height: ${imgH}px;
  object-fit: cover;
  display: block;
}
.caption {
  height: 50px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
}
.caption span:last-child {
  color: rgba(255, 255, 255, 0.5);
  font-family: Consolas, monospace;
}
</style>
</head>
<body>
<div class="sheet">
  <div class="title">
    <h1>${esc(title)}</h1>
    <div class="meta">Arcanea Visual World Engine<br />${items.length} exports</div>
  </div>
  <div class="grid">
    ${items
      .map(
        (item) => `<div class="card">
      <img src="${imageDataUrl(item.path || item.outputPath)}" alt="" />
      <div class="caption"><span>${esc(item.headline)}</span><span>${esc(item.channelKey)}</span></div>
    </div>`,
      )
      .join("")}
  </div>
</div>
</body>
</html>`;
}

async function screenshotHtml(browser, html, outPath, width, height) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(250);
  await page.screenshot({ path: outPath, fullPage: false });
  await page.close();
}

async function main() {
  ensureDir(exportsRoot);
  ensureDir(sheetsRoot);
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const createdAt = localIsoWithOffset();
  const browser = await chromium.launch({ headless: true });
  const records = [];

  for (const campaign of spec.campaigns) {
    const sourcePath = path.resolve(root, campaign.sourceImage);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing source image for ${campaign.id}: ${sourcePath}`);
    }
    for (const channel of spec.channels) {
      const outDir = path.join(exportsRoot, channel.key);
      ensureDir(outDir);
      const outPath = path.join(outDir, `${campaign.id}-${channel.key}.png`);
      const html = buildFrameHtml({ spec, campaign, channel, sourcePath });
      await screenshotHtml(browser, html, outPath, channel.width, channel.height);
      const dims = pngDimensions(outPath);
      const record = {
        id: `${campaign.id}-${channel.key}`,
        campaignId: campaign.id,
        sourceAssetId: campaign.sourceAssetId,
        channelKey: channel.key,
        platforms: channel.platforms,
        ratio: channel.ratio,
        width: dims.width,
        height: dims.height,
        sizeBytes: dims.sizeBytes,
        sha256: dims.sha256,
        headline: campaign.headline,
        subhead: campaign.subhead,
        cta: campaign.cta,
        proof: campaign.proof,
        gate: campaign.gate,
        guardian: campaign.guardian,
        score30: campaign.score30,
        sourceImage: sourcePath,
        outputPath: outPath,
        sourceMethod: spec.sourceMethod,
        rightsStatus: "generated-owned-derived",
        approvalGate: spec.approvalGate,
        createdAt,
      };
      records.push(record);
      const sidecarPath = outPath.replace(/\.png$/i, ".social.provenance.json");
      fs.writeFileSync(sidecarPath, JSON.stringify(record, null, 2) + "\n");
    }
  }

  const byChannel = new Map();
  for (const record of records) {
    if (!byChannel.has(record.channelKey)) byChannel.set(record.channelKey, []);
    byChannel.get(record.channelKey).push(record);
  }

  const sheetRecords = [];
  for (const [channelKey, items] of byChannel) {
    const sheetPath = path.join(sheetsRoot, `${channelKey}-contact-sheet.png`);
    const html = buildContactSheetHtml({
      title: `${channelKey} contact sheet`,
      items,
      width: 1800,
      height: 2400,
      columns: 2,
    });
    await screenshotHtml(browser, html, sheetPath, 1800, 2400);
    sheetRecords.push({
      id: `${channelKey}-contact-sheet`,
      channelKey,
      path: sheetPath,
      ...pngDimensions(sheetPath),
    });
  }

  const overviewPath = path.join(sheetsRoot, "all-social-overlays-contact-sheet.png");
  await screenshotHtml(
    browser,
    buildContactSheetHtml({
      title: "all social overlays",
      items: records,
      width: 3840,
      height: 2160,
      columns: 6,
    }),
    overviewPath,
    3840,
    2160,
  );
  sheetRecords.push({
    id: "all-social-overlays-contact-sheet",
    channelKey: "all",
    path: overviewPath,
    ...pngDimensions(overviewPath),
  });

  await browser.close();

  const manifest = {
    version: spec.version,
    run: spec.run,
    createdAt,
    sourceMethod: spec.sourceMethod,
    assetTier: spec.assetTier,
    totalExports: records.length,
    totalContactSheets: sheetRecords.length,
    channels: spec.channels,
    campaigns: spec.campaigns.map((campaign) => ({
      id: campaign.id,
      sourceAssetId: campaign.sourceAssetId,
      sourceImage: path.resolve(root, campaign.sourceImage),
      score30: campaign.score30,
      headline: campaign.headline,
      gate: campaign.gate,
      guardian: campaign.guardian,
    })),
    exports: records,
    contactSheets: sheetRecords,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(jsonlPath, records.map((record) => JSON.stringify(record)).join("\n") + "\n");
  const header = [
    "id",
    "campaign_id",
    "source_asset_id",
    "channel_key",
    "platforms",
    "ratio",
    "width",
    "height",
    "sha256",
    "headline",
    "gate",
    "guardian",
    "score30",
    "output_path",
    "source_method",
    "rights_status",
    "approval_gate",
    "created_at",
  ];
  const rows = records.map((record) =>
    [
      record.id,
      record.campaignId,
      record.sourceAssetId,
      record.channelKey,
      record.platforms.join("|"),
      record.ratio,
      record.width,
      record.height,
      record.sha256,
      record.headline,
      record.gate,
      record.guardian,
      record.score30,
      record.outputPath,
      record.sourceMethod,
      record.rightsStatus,
      record.approvalGate,
      record.createdAt,
    ]
      .map(csv)
      .join(","),
  );
  fs.writeFileSync(ledgerPath, [header.join(","), ...rows].join("\n") + "\n");

  const previewHtml = buildContactSheetHtml({
    title: "Arcanea social overlay exports",
    items: records,
    width: 1920,
    height: 2880,
    columns: 4,
  });
  fs.writeFileSync(htmlPreviewPath, previewHtml);

  console.log(
    JSON.stringify(
      {
        exports: records.length,
        contactSheets: sheetRecords.length,
        manifestPath,
        ledgerPath,
        jsonlPath,
        overviewPath,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
