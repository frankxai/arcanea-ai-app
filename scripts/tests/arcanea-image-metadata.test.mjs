import assert from "node:assert/strict";
import test from "node:test";

import {
  inspectImageBytes,
  verifyStoredImageMatchesSource,
  verifyImageAspectRatio,
} from "../lib/arcanea-image-metadata.mjs";
import {
  SUPPORTED_OUTPUT_ASPECT_RATIOS,
  providerDimensionsForAspect,
} from "../lib/arcanea-image-output.mjs";
import {
  inspectExternalSourceBytes,
  verifyExternalSourceBytes,
} from "../lib/arcanea-external-source-evidence.mjs";

test("external proposal evidence is byte- and hash-bound", () => {
  const bytes = Buffer.from("creator proposal fixture", "utf8");
  const observed = inspectExternalSourceBytes(bytes);
  const evidence = { id: "fixture", ...observed };
  assert.deepEqual(verifyExternalSourceBytes(bytes, evidence), observed);
  assert.throws(
    () => verifyExternalSourceBytes(Buffer.from("changed fixture"), evidence),
    /byte count changed|SHA-256 changed/,
  );
});

test("reads PNG dimensions and hash", () => {
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
  png.writeUInt32BE(512, 16);
  png.writeUInt32BE(768, 20);
  const result = inspectImageBytes(png);
  assert.equal(result.format, "png");
  assert.equal(result.width, 512);
  assert.equal(result.height, 768);
  assert.match(result.sha256, /^[a-f0-9]{64}$/);
});

test("reads JPEG start-of-frame dimensions", () => {
  const jpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x01, 0x2c, 0x02, 0x58, 0x03,
    0x01, 0x11, 0x00,
  ]);
  const result = inspectImageBytes(jpeg);
  assert.equal(result.format, "jpeg");
  assert.equal(result.width, 600);
  assert.equal(result.height, 300);
});

test("reads VP8X WebP dimensions", () => {
  const webp = Buffer.alloc(30);
  webp.write("RIFF", 0, "ascii");
  webp.write("WEBP", 8, "ascii");
  webp.write("VP8X", 12, "ascii");
  webp.writeUIntLE(1023, 24, 3);
  webp.writeUIntLE(767, 27, 3);
  const result = inspectImageBytes(webp);
  assert.equal(result.format, "webp");
  assert.equal(result.width, 1024);
  assert.equal(result.height, 768);
});

test("rejects unknown and undersized inputs", () => {
  assert.throws(
    () => inspectImageBytes(Buffer.from("not an image")),
    /Only decoded PNG/,
  );
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
  png.writeUInt32BE(32, 16);
  png.writeUInt32BE(32, 20);
  assert.throws(() => inspectImageBytes(png), /too small/);
});

test("enforces the declared aspect ratio while allowing documented provider rounding", () => {
  const exact = verifyImageAspectRatio(1280, 1600, "4:5");
  assert.equal(exact.aspectRatioRelativeError, 0);
  assert.equal(exact.aspectRatioMatchesContract, true);

  const providerRounded = verifyImageAspectRatio(1856, 2304, "4:5");
  assert.ok(providerRounded.aspectRatioRelativeError > 0);
  assert.ok(providerRounded.aspectRatioRelativeError <= 0.015);

  assert.throws(
    () => verifyImageAspectRatio(1024, 1024, "4:5"),
    /does not match declared 4:5 aspect ratio/,
  );
});

test("provider pixel maps cover every campaign ratio within official size constraints", () => {
  const expectedRatios = {
    "1:1": 1,
    "4:5": 0.8,
    "3:2": 1.5,
    "2:3": 2 / 3,
    "4:3": 4 / 3,
    "3:4": 0.75,
    "16:9": 16 / 9,
    "9:16": 9 / 16,
    "21:9": 21 / 9,
  };
  assert.deepEqual(SUPPORTED_OUTPUT_ASPECT_RATIOS, Object.keys(expectedRatios));

  for (const [ratio, expected] of Object.entries(expectedRatios)) {
    const openai = providerDimensionsForAspect("openai-gpt-image", ratio);
    const openaiPixels = openai.width * openai.height;
    assert.equal(openai.width % 16, 0, `OpenAI ${ratio} width`);
    assert.equal(openai.height % 16, 0, `OpenAI ${ratio} height`);
    assert.ok(Math.max(openai.width, openai.height) <= 3840);
    assert.ok(
      Math.max(openai.width, openai.height) /
        Math.min(openai.width, openai.height) <=
        3,
    );
    assert.ok(openaiPixels >= 655_360 && openaiPixels <= 8_294_400);
    assert.ok(
      Math.abs(openai.width / openai.height - expected) / expected <= 0.015,
    );

    const flux = providerDimensionsForAspect("flux-2", ratio);
    assert.equal(flux.width % 16, 0, `FLUX ${ratio} width`);
    assert.equal(flux.height % 16, 0, `FLUX ${ratio} height`);
    assert.ok(flux.width * flux.height <= 2_000_000);
    assert.ok(
      Math.abs(flux.width / flux.height - expected) / expected <= 0.015,
    );
  }

  assert.deepEqual(providerDimensionsForAspect("openai-gpt-image", "4:5"), {
    width: 1536,
    height: 1920,
  });
  assert.deepEqual(providerDimensionsForAspect("flux-2", "4:5"), {
    width: 1216,
    height: 1520,
  });
  assert.throws(
    () => providerDimensionsForAspect("flux-2", "5:7"),
    /Unsupported output aspect ratio/,
  );
});

test("post-copy verification binds the stored bytes and geometry before receipt", () => {
  const source = {
    format: "png",
    width: 800,
    height: 1000,
    bytes: 2048,
    sha256: "a".repeat(64),
    decoded: true,
  };
  const verified = verifyStoredImageMatchesSource(source, { ...source }, "4:5");
  assert.equal(verified.storedBytesMatchSource, true);
  assert.equal(verified.aspectRatioMatchesContract, true);

  for (const drift of [
    { sha256: "b".repeat(64) },
    { bytes: 2049 },
    { width: 1000, height: 1000 },
    { decoded: false },
  ]) {
    assert.throws(
      () =>
        verifyStoredImageMatchesSource(source, { ...source, ...drift }, "4:5"),
      /Stored image does not match the fully decoded ingest source/,
    );
  }
});
