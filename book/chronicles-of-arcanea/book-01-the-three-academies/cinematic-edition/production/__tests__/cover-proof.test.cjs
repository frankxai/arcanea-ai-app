"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { validate, render } = require("../build-cover-proof.cjs");
const { parseArgs } = require("../render-cover-proof.cjs");
const layout = require("../cover-proof-layout.json");
const edition = require("../../edition-spec.json");
const root = path.resolve(__dirname, "../../../../../..");
const image = readFileSync(path.join(root, edition.cover.path));
const clone = () => JSON.parse(JSON.stringify(layout));

test("proof validates against the real edition cover bytes and metadata", () =>
  validate(layout, edition, image));
test("unapproved bylines and alternate title copy fail closed", () => {
  for (const change of [
    { byline: "Invented author" },
    { title: "Wrong title" },
    { status: "approved" },
  ])
    assert.throws(() => validate({ ...clone(), ...change }, edition, image));
});
test("altered source hashes, paths, dimensions and bytes are rejected", () => {
  for (const key of ["sha256", "path", "width", "height"]) {
    const copy = clone();
    copy.source[key] = "wrong";
    assert.throws(() => validate(copy, edition, image));
  }
  assert.throws(() => validate(layout, edition, Buffer.from("not a PNG")));
});
test("layout ids, ranges, selection and colour injection are constrained", () => {
  for (const mutate of [
    (copy) => {
      copy.variants[1].id = copy.variants[0].id;
    },
    (copy) => {
      copy.variants[0].size = 999;
    },
    (copy) => {
      copy.variants[0].offset = NaN;
    },
    (copy) => {
      copy.selected = "missing";
    },
    (copy) => {
      copy.palette.ink = "red;}</style><script>";
    },
  ]) {
    const copy = clone();
    mutate(copy);
    assert.throws(() => validate(copy, edition, image));
  }
});
test("comparison contains nine native text compositions, three at 120px", () => {
  const html = render(layout, {
    image,
    font: Buffer.from("font"),
    license: "OFL <terms>",
  });
  assert.equal((html.match(/class="cover"/g) || []).length, 9);
  assert.equal((html.match(/data-width="120"/g) || []).length, 3);
  assert.ok(html.includes("OFL &lt;terms&gt;"));
  assert.ok(html.includes("default-src 'none'"));
  assert.ok(!html.includes("<script"));
  assert.ok(!html.includes("text-transform:uppercase"));
  assert.ok(html.includes("Byline pending"));
});
test("selected output contains only the selected concept and no release claim", () => {
  const html = render(
    layout,
    { image, font: Buffer.from("font"), license: "OFL" },
    true,
  );
  assert.equal((html.match(/class="cover"/g) || []).length, 1);
  assert.ok(html.includes(`data-variant="${layout.selected}"`));
  assert.ok(html.includes("not a print-ready cover"));
});
test("native renderer requires explicit inputs and refuses repository outputs", () => {
  assert.throws(() => parseArgs([]));
  assert.throws(() =>
    parseArgs([
      "--out",
      ".",
      "--out",
      ".",
      "--font",
      "font",
      "--sharp",
      "sharp",
      "--license",
      "license",
    ]),
  );
  assert.throws(() =>
    parseArgs([
      "--out",
      root,
      "--font",
      "font",
      "--sharp",
      "sharp",
      "--license",
      "license",
    ]),
  );
  const options = parseArgs([
    "--out",
    path.resolve(root, "../private-test-output"),
    "--font",
    "font",
    "--sharp",
    "sharp",
    "--license",
    "license",
  ]);
  assert.ok(path.isAbsolute(options["--out"]));
});
test("title text comes from the layout instead of a duplicated literal", () => {
  const html = render(
    { ...layout, title: "A Different Book Name" },
    { image, font: Buffer.from("font"), license: "OFL" },
    true,
  );
  assert.ok(html.includes("<span>A Different</span>"));
  assert.ok(html.includes(">Name</span>"));
  assert.ok(!html.includes("<span>The Last</span>"));
});
