"use strict";

// Private editable composition proof. Never writes a release manifest or public asset.
const { readFile, writeFile, mkdir } = require("node:fs/promises");
const { createHash } = require("node:crypto");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "../../../../..");
const EDITION = path.resolve(__dirname, "..");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function validate(layout, edition, image) {
  if (layout.version !== 1 || layout.status !== "private-concept")
    throw new Error("Only private concept proofs are supported.");
  if (
    layout.title !== edition.title ||
    layout.series !== edition.series ||
    layout.byline !== null
  )
    throw new Error(
      "Preserve edition title/series and the unapproved byline boundary.",
    );
  for (const key of ["path", "sha256", "width", "height"]) {
    if (layout.source[key] !== edition.cover[key])
      throw new Error(
        `Cover source ${key} differs from the edition specification.`,
      );
  }
  if (hash(image) !== layout.source.sha256)
    throw new Error("Cover source hash mismatch.");
  if (
    image.length < 24 ||
    image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    image.readUInt32BE(16) !== layout.source.width ||
    image.readUInt32BE(20) !== layout.source.height
  )
    throw new Error("Cover PNG dimensions/signature mismatch.");
  if (!Array.isArray(layout.variants) || layout.variants.length !== 3)
    throw new Error("Compare exactly three layout variants.");
  const ids = new Set();
  for (const variant of layout.variants) {
    if (!/^[a-z][a-z0-9-]+$/.test(variant.id) || ids.has(variant.id))
      throw new Error("Invalid or duplicate layout id.");
    ids.add(variant.id);
    if (typeof variant.label !== "string" || !variant.label.trim())
      throw new Error("Layout label missing.");
    for (const [key, min, max] of [
      ["size", 80, 180],
      ["weight", 200, 800],
      ["top", 60, 140],
      ["leading", 0.8, 1.2],
      ["offset", 0, 15],
    ]) {
      if (
        !Number.isFinite(variant[key]) ||
        variant[key] < min ||
        variant[key] > max
      )
        throw new Error(`Invalid layout ${key}.`);
    }
  }
  if (!ids.has(layout.selected)) throw new Error("Selected layout missing.");
  if (
    Object.keys(layout.palette).sort().join() !== "gold,ink,muted,paper" ||
    Object.values(layout.palette).some(
      (value) => !/^#[0-9a-f]{6}$/i.test(value),
    )
  )
    throw new Error("Invalid proof palette.");
}

function render(layout, assets, single = false) {
  const variants = single
    ? layout.variants.filter((variant) => variant.id === layout.selected)
    : layout.variants;
  const words = layout.title.split(" ");
  const cqw = (value) => `${(100 * value) / layout.source.width}cqw`;
  const cover = (
    variant,
    width,
  ) => `<figure class="sample" style="--proof-width:${width}px">
    <div class="cover" role="img" aria-label="${escape(layout.title)}. Private cover concept: three adult makers beside a narrow stone path, a water boundary and an open masonry door." data-variant="${variant.id}" data-width="${width}">
      <p class="series">${escape(layout.series)}</p>
      <div class="title" aria-hidden="true" style="top:${(100 * variant.top) / layout.source.height}%;font-size:${cqw(variant.size)};font-weight:${variant.weight};line-height:${variant.leading}"><span>${escape(words.slice(0, 2).join(" "))}</span><span>${escape(words.slice(2, -1).join(" "))} <span class="path" style="transform:translateY(${cqw(variant.offset)})">${escape(words.at(-1))}</span></span></div>
      <p class="volume">Book one</p>
      <p class="proof-mark">Private cover proof · Byline pending</p>
    </div><figcaption>${width}px ${single ? "composed concept" : "display width"}</figcaption>
  </figure>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
  <title>${escape(layout.title)} — private cover proof</title><style>
  @font-face {font-family:Cover Newsreader;src:url(data:font/woff2;base64,${assets.font.toString("base64")}) format('woff2');font-weight:200 800;font-style:normal;font-display:block}
  :root {--ink:${layout.palette.ink};--paper:${layout.palette.paper};--muted:${layout.palette.muted};--gold:${layout.palette.gold};--art:url(data:image/png;base64,${assets.image.toString("base64")});color-scheme:dark}
  *{box-sizing:border-box} body{margin:0;padding:32px;background:var(--ink);color:var(--paper);font:16px/1.5 system-ui,sans-serif} main{max-width:1160px;margin:auto} h1{font:400 38px/1.1 'Cover Newsreader',serif;margin:0 0 16px} h2{font-size:18px;font-weight:500;margin:28px 0 16px} .intro{max-width:70ch;color:var(--muted)} .samples{display:flex;flex-wrap:wrap;align-items:flex-start;gap:24px}.sample{margin:0;width:var(--proof-width);max-width:100%}.cover{container-type:inline-size;position:relative;width:100%;aspect-ratio:${layout.source.width}/${layout.source.height};background-image:var(--art);background-size:100% 100%;overflow:hidden}.series,.volume,.proof-mark,.title{position:absolute;z-index:1;margin:0;text-align:center}.series{top:2.5%;left:6%;right:6%;color:var(--gold);font:400 ${cqw(28)}/1.2 system-ui,sans-serif;letter-spacing:.055em}.title{left:5%;right:5%;color:var(--paper);font-family:'Cover Newsreader',serif;letter-spacing:-.035em;font-kerning:normal}.title>span{display:block;white-space:nowrap}.path{display:inline-block}.volume{left:6%;right:6%;bottom:6%;color:var(--paper);font:400 ${cqw(32)}/1.2 'Cover Newsreader',serif}.proof-mark{bottom:1.4%;left:4%;right:4%;padding:.35em;background:var(--ink);color:var(--muted);font:400 ${cqw(22)}/1.2 system-ui,sans-serif} figcaption{font-size:13px;margin:10px 0;color:var(--muted)} details{margin-top:36px;font-size:13px;color:var(--muted)}pre{white-space:pre-wrap;overflow-wrap:anywhere} a{color:inherit}
  @media(max-width:600px){body{padding:20px}h1{font-size:30px}.samples{gap:20px}}
  @media print{body{padding:0}.intro,h1,h2,figcaption,details{display:none}.sample{break-after:page}.samples{display:block}}
  </style></head><body><main><h1>Cover composition proof</h1><p class="intro">${escape(layout.title)}. Private review only. Title, byline, casting and rights remain unapproved. Original artwork is unchanged; text stays editable. This is not a print-ready cover or a release export.</p>
  ${variants.map((variant) => `<section aria-label="${escape(variant.label)}"><h2>${escape(variant.label)}</h2><div class="samples">${(single ? [620] : [120, 240, 420]).map((width) => cover(variant, width)).join("")}</div></section>`).join("")}
  <details><summary>Source and font licence</summary><p>Artwork SHA-256: ${escape(layout.source.sha256)}. Newsreader from the installed Fontsource package. No remote requests, new artwork generation or assumed byline.</p><pre>${escape(assets.license)}</pre></details></main></body></html>`;
}

async function main(args) {
  if (args.length !== 2 || args[0] !== "--out")
    throw new Error(
      "Usage: node build-cover-proof.cjs --out <new private output directory>",
    );
  const out = path.resolve(args[1]);
  const relative = path.relative(ROOT, out);
  if (
    !relative ||
    (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  )
    throw new Error("Keep generated proof outputs outside the repository.");
  const layoutBytes = await readFile(
    path.join(__dirname, "cover-proof-layout.json"),
  );
  const layout = JSON.parse(layoutBytes);
  const edition = JSON.parse(
    await readFile(path.join(EDITION, "edition-spec.json")),
  );
  // Use the established edition source, never an arbitrary path supplied by a layout file.
  const image = await readFile(path.join(ROOT, edition.cover.path));
  const fontRoot = path.join(
    ROOT,
    "apps/web/node_modules/@fontsource-variable/newsreader",
  );
  const font = await readFile(
    path.join(fontRoot, "files/newsreader-latin-wght-normal.woff2"),
  );
  const license = await readFile(path.join(fontRoot, "LICENSE"), "utf8");
  validate(layout, edition, image);
  await mkdir(out); // Exclusive directory creation preserves every previous proof.
  const outputs = [
    ["cover-comparison.html", render(layout, { image, font, license })],
    ["cover-selected.html", render(layout, { image, font, license }, true)],
  ];
  const files = [];
  for (const [filename, html] of outputs) {
    await writeFile(path.join(out, filename), html, { flag: "wx" });
    files.push({
      filename,
      bytes: Buffer.byteLength(html),
      sha256: hash(html),
    });
  }
  const receipt = {
    status: "private-concept",
    selected: layout.selected,
    artwork: layout.source,
    layoutSha256: hash(layoutBytes),
    fontSha256: hash(font),
    fontLicenseSha256: hash(license),
    files,
    visualReview: "pending",
    productionExport: false,
  };
  await writeFile(
    path.join(out, "cover-proof-receipt.json"),
    `${JSON.stringify(receipt, null, 2)}\n`,
    { flag: "wx" },
  );
  process.stdout.write(
    `${JSON.stringify({ output: out, ...receipt }, null, 2)}\n`,
  );
}

if (require.main === module)
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
module.exports = { validate, render };
