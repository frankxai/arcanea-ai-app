"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const test = require("node:test");

const astro = createRequire(fs.realpathSync(path.resolve(__dirname, "../../docs/atlas/node_modules/astro/package.json")));
const sharp = astro("sharp");

test("the loaded native SVG library includes patched librsvg", () => {
  // GHSA-wq5f-xc86-pv6w: sharp 0.35.5 packages librsvg 2.63.2.
  assert.match(sharp.versions.rsvg || "", /^\d+\.\d+\.\d+$/);
  const actual = sharp.versions.rsvg.split(".").map(Number);
  const minimum = [2, 63, 2];
  let comparison = 0;
  for (let index = 0; index < minimum.length; index++) {
    if (actual[index] !== minimum[index]) {
      comparison = Math.sign(actual[index] - minimum[index]);
      break;
    }
  }
  assert.ok(comparison >= 0, `loaded librsvg ${sharp.versions.rsvg} is below 2.63.2`);
});

test("the installed native pipeline decodes a benign SVG with correct pixels", async () => {
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="7"><rect width="12" height="7" fill="#123456"/></svg>');
  const { data, info } = await sharp(svg).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual({ width: info.width, height: info.height, channels: info.channels }, { width: 12, height: 7, channels: 4 });
  assert.equal(data.length, 12 * 7 * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    assert.deepEqual([...data.subarray(offset, offset + 4)], [0x12, 0x34, 0x56, 0xff]);
  }
});
