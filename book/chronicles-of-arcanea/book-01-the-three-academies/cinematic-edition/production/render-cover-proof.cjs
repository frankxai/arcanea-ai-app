"use strict";

// Offline native typesetting, not a browser/HTML renderer. Art pixels are not retouched.
const { readFile, writeFile, mkdir } = require("node:fs/promises");
const { createHash } = require("node:crypto");
const path = require("node:path");
const { validate } = require("./build-cover-proof.cjs");
const ROOT = path.resolve(__dirname, "../../../../..");
const FONT_SHA256 =
  "8a08d13f8a6c0d51be379a60af84f945f65369a67e509ee3c3bdcc421254d7c1";
const LICENSE_SHA256 =
  "fdfad38143ec470553cae82a1e45320bdd1b9ec70415d37bd0171051d8a4ded8";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (
      !["--out", "--sharp", "--font", "--license"].includes(key) ||
      !args[index + 1] ||
      options[key]
    )
      throw new Error(
        "Pass --out, --sharp, --font and --license exactly once.",
      );
    options[key] = path.resolve(args[index + 1]);
  }
  if (Object.keys(options).length !== 4)
    throw new Error("Four explicit paths required.");
  const relative = path.relative(ROOT, options["--out"]);
  if (
    !relative ||
    (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  )
    throw new Error("Native proof output must stay outside the repository.");
  return options;
}

async function main(args) {
  const options = parseArgs(args);
  const layoutBytes = await readFile(
    path.join(__dirname, "cover-proof-layout.json"),
  );
  const layout = JSON.parse(layoutBytes);
  const edition = JSON.parse(
    await readFile(path.resolve(__dirname, "../edition-spec.json")),
  );
  const image = await readFile(path.join(ROOT, edition.cover.path));
  validate(layout, edition, image);
  const font = await readFile(options["--font"]);
  const license = await readFile(options["--license"]);
  if (hash(font) !== FONT_SHA256 || hash(license) !== LICENSE_SHA256)
    throw new Error(
      "Use the reviewed Google Fonts Newsreader font and license bytes.",
    );
  const sharp = require(options["--sharp"]);
  sharp.concurrency(1);
  const out = options["--out"];
  await mkdir(out); // No overwriting prior source or render evidence.
  const metrics = [];
  const files = [];
  const board = [];
  const thumbBoard = [];
  const words = layout.title.split(" ");
  async function save(filename, bytes, extra = {}) {
    await writeFile(path.join(out, filename), bytes, { flag: "wx" });
    files.push({
      filename,
      bytes: bytes.length,
      sha256: hash(bytes),
      ...extra,
    });
  }
  async function typeset(text, size, weight, color, offset = 0) {
    const value = offset
      ? `${escape(words.slice(2, -1).join(" "))} <span rise="${-1024 * offset}">${escape(words.at(-1))}</span>`
      : escape(text);
    return sharp({
      text: {
        text: `<span foreground="${color}" weight="${weight}">${value}</span>`,
        font: `Newsreader ${size}`,
        fontfile: options["--font"],
        dpi: 72,
        rgba: true,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true });
  }
  const actualFont = await typeset("Free Path", 154, 500, layout.palette.paper);
  const fallback = await sharp({
    text: {
      text: "Free Path",
      font: "UnknownCoverFont 154",
      rgba: true,
      dpi: 72,
    },
  }).metadata();
  if (actualFont.info.width === fallback.width)
    throw new Error("Native font appears to have fallen back.");
  for (const [index, variant] of layout.variants.entries()) {
    const layers = [];
    async function centered(
      text,
      size,
      weight,
      color,
      top,
      offset = 0,
      role = "label",
    ) {
      const rendered = await typeset(text, size, weight, color, offset);
      const left = Math.round((layout.source.width - rendered.info.width) / 2);
      if (
        left < 45 ||
        top < 20 ||
        top + rendered.info.height > layout.source.height - 18
      )
        throw new Error(`${variant.id} ${role} exceeds its safe area.`);
      layers.push({ input: rendered.data, left, top });
      metrics.push({
        variant: variant.id,
        role,
        text,
        left,
        top,
        width: rendered.info.width,
        height: rendered.info.height,
        offset,
      });
    }
    await centered(
      layout.series,
      29,
      400,
      layout.palette.gold,
      30,
      0,
      "series",
    );
    await centered(
      words.slice(0, 2).join(" "),
      variant.size,
      variant.weight,
      layout.palette.paper,
      variant.top,
      0,
      "title-line-1",
    );
    await centered(
      words.slice(2).join(" "),
      variant.size,
      variant.weight,
      layout.palette.paper,
      Math.round(variant.top + variant.size * variant.leading),
      variant.offset,
      "title-line-2",
    );
    await centered(
      "Book one",
      32,
      400,
      layout.palette.paper,
      1470,
      0,
      "volume",
    );
    const notice = await typeset(
      "Private cover proof · Byline pending",
      24,
      400,
      layout.palette.muted,
    );
    const bar = await sharp({
      create: {
        width: 930,
        height: 44,
        channels: 4,
        background: layout.palette.ink,
      },
    })
      .png()
      .toBuffer();
    layers.push(
      { input: bar, left: 31, top: 1518 },
      {
        input: notice.data,
        left: Math.round((992 - notice.info.width) / 2),
        top: 1528,
      },
    );
    const master = await sharp(image).composite(layers).png().toBuffer();
    await save(`${variant.id}-992.png`, master, { width: 992, height: 1586 });
    for (const width of [120, 240, 420]) {
      const resized = await sharp(master)
        .resize({ width })
        .png()
        .toBuffer({ resolveWithObject: true });
      await save(`${variant.id}-${width}.png`, resized.data, {
        width: resized.info.width,
        height: resized.info.height,
      });
      if (width === 240)
        board.push({ input: resized.data, left: 24 + index * 288, top: 70 });
      if (width === 120)
        thumbBoard.push({
          input: resized.data,
          left: 20 + index * 144,
          top: 55,
        });
    }
    const label = await typeset(variant.label, 20, 500, layout.palette.paper);
    board.push({ input: label.data, left: 24 + index * 288, top: 26 });
    const shortLabel = await typeset(
      String(index + 1),
      20,
      500,
      layout.palette.paper,
    );
    thumbBoard.push({
      input: shortLabel.data,
      left: 70 + index * 144,
      top: 18,
    });
  }
  await save(
    "cover-comparison-240.png",
    await sharp({
      create: {
        width: 888,
        height: 480,
        channels: 4,
        background: layout.palette.ink,
      },
    })
      .composite(board)
      .png()
      .toBuffer(),
  );
  await save(
    "cover-comparison-120.png",
    await sharp({
      create: {
        width: 448,
        height: 270,
        channels: 4,
        background: layout.palette.ink,
      },
    })
      .composite(thumbBoard)
      .png()
      .toBuffer(),
  );
  await save("Newsreader-OFL.txt", license);
  const receipt = {
    status: "private-concept",
    method:
      "offline native Pango text composition; no browser or HTML rendering",
    layoutSha256: hash(layoutBytes),
    fontSha256: hash(font),
    fontLicenseSha256: hash(license),
    source: layout.source,
    fontProbe: {
      newsreaderWidth: actualFont.info.width,
      fallbackWidth: fallback.width,
    },
    renderer: sharp.versions,
    metrics,
    files,
    browserProof: false,
    visualReview: "pending",
    printReady: false,
  };
  await writeFile(
    path.join(out, "native-proof-receipt.json"),
    `${JSON.stringify(receipt, null, 2)}\n`,
    { flag: "wx" },
  );
  process.stdout.write(
    `${JSON.stringify({ output: out, files: files.length, fontProbe: receipt.fontProbe, metrics }, null, 2)}\n`,
  );
}
if (require.main === module)
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
module.exports = { parseArgs };
