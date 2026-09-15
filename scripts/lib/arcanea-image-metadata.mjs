import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const requireFromWeb = createRequire(
  new URL("../../apps/web/package.json", import.meta.url),
);

const JPEG_SOF = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

export const ARCANEA_ASPECT_RATIO_TOLERANCE = 0.015;

export function verifyImageAspectRatio(
  width,
  height,
  declaredAspectRatio,
  tolerance = ARCANEA_ASPECT_RATIO_TOLERANCE,
) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error("Image dimensions must be positive integers.");
  }
  const match = /^(\d+):(\d+)$/.exec(declaredAspectRatio ?? "");
  if (!match || Number(match[1]) < 1 || Number(match[2]) < 1) {
    throw new Error(
      `Unsupported declared aspect ratio: ${declaredAspectRatio}.`,
    );
  }
  const expected = Number(match[1]) / Number(match[2]);
  const actual = width / height;
  const relativeError = Math.abs(actual - expected) / expected;
  if (relativeError > tolerance) {
    throw new Error(
      `Image ${width}x${height} does not match declared ${declaredAspectRatio} aspect ratio within ${(tolerance * 100).toFixed(1)}% tolerance.`,
    );
  }
  return {
    declaredAspectRatio,
    actualAspectRatio: Number(actual.toFixed(8)),
    aspectRatioRelativeError: Number(relativeError.toFixed(8)),
    aspectRatioTolerance: tolerance,
    aspectRatioMatchesContract: true,
  };
}

export function verifyStoredImageMatchesSource(
  sourceMetadata,
  storedMetadata,
  declaredAspectRatio,
) {
  if (
    sourceMetadata?.decoded !== true ||
    storedMetadata?.decoded !== true ||
    sourceMetadata.format !== storedMetadata.format ||
    sourceMetadata.width !== storedMetadata.width ||
    sourceMetadata.height !== storedMetadata.height ||
    sourceMetadata.bytes !== storedMetadata.bytes ||
    sourceMetadata.sha256 !== storedMetadata.sha256
  ) {
    throw new Error(
      "Stored image does not match the fully decoded ingest source.",
    );
  }
  return {
    ...verifyImageAspectRatio(
      storedMetadata.width,
      storedMetadata.height,
      declaredAspectRatio,
    ),
    storedCopyDecoded: true,
    storedBytesMatchSource: true,
    storedDimensionsMatchSource: true,
  };
}

function isPng(bytes) {
  return (
    bytes.length >= 24 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  );
}

function pngDimensions(bytes) {
  return {
    format: "png",
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

function isJpeg(bytes) {
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

function jpegDimensions(bytes) {
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) continue;
    if (offset + 2 > bytes.length) break;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) break;
    if (JPEG_SOF.has(marker)) {
      return {
        format: "jpeg",
        width: bytes.readUInt16BE(offset + 5),
        height: bytes.readUInt16BE(offset + 3),
      };
    }
    offset += length;
  }
  throw new Error("JPEG dimensions could not be decoded.");
}

function isWebp(bytes) {
  return (
    bytes.length >= 30 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  );
}

function webpDimensions(bytes) {
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      format: "webp",
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  }
  if (chunk === "VP8L" && bytes[20] === 0x2f) {
    const b1 = bytes[21];
    const b2 = bytes[22];
    const b3 = bytes[23];
    const b4 = bytes[24];
    return {
      format: "webp",
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
    };
  }
  if (
    chunk === "VP8 " &&
    bytes[23] === 0x9d &&
    bytes[24] === 0x01 &&
    bytes[25] === 0x2a
  ) {
    return {
      format: "webp",
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  throw new Error(`Unsupported WebP chunk: ${chunk || "unknown"}.`);
}

export function inspectImageBytes(bytes) {
  if (!Buffer.isBuffer(bytes)) throw new TypeError("Expected a Buffer.");
  const dimensions = isPng(bytes)
    ? pngDimensions(bytes)
    : isJpeg(bytes)
      ? jpegDimensions(bytes)
      : isWebp(bytes)
        ? webpDimensions(bytes)
        : null;
  if (!dimensions)
    throw new Error("Only decoded PNG, JPEG, and WebP images are accepted.");
  if (dimensions.width < 64 || dimensions.height < 64) {
    throw new Error(
      `Image is too small: ${dimensions.width}x${dimensions.height}.`,
    );
  }
  return {
    ...dimensions,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

export function inspectImageFile(path) {
  return inspectImageBytes(readFileSync(path));
}

export async function inspectImageFileDecoded(path) {
  const bytes = readFileSync(path);
  const header = inspectImageBytes(bytes);
  let sharp;
  try {
    sharp = requireFromWeb("sharp");
  } catch {
    throw new Error(
      "Full image decode requires the existing apps/web sharp dependency. Run from an installed Arcanea workspace.",
    );
  }
  const image = sharp(bytes, {
    failOn: "error",
    limitInputPixels: 100_000_000,
  });
  const decoded = await image.metadata();
  await image.clone().resize(1, 1, { fit: "fill" }).raw().toBuffer();
  if (decoded.width !== header.width || decoded.height !== header.height) {
    throw new Error(
      `Image header and decoder dimensions disagree: ${header.width}x${header.height} vs ${decoded.width}x${decoded.height}.`,
    );
  }
  return { ...header, decoded: true };
}
