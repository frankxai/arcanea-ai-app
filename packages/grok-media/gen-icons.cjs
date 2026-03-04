'use strict';

/**
 * Generates valid PNG icon files for the Arcanea Grok Media Chrome extension.
 * No external dependencies — uses only Node.js built-ins (zlib, fs, path).
 *
 * Design:
 *   Background : #0a0515  (deep dark violet)
 *   Diamond    : #7fffd4  (crystal teal)   — outer shape
 *   Inner glow : #8b5cf6  (violet)         — inner shape
 */

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CRC-32 (required by PNG spec for every chunk)
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ---------------------------------------------------------------------------
// PNG chunk builder
// ---------------------------------------------------------------------------
function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len       = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBytes = Buffer.alloc(4);
  crcBytes.writeUInt32BE(crc32(crcInput), 0);

  return Buffer.concat([len, typeBytes, data, crcBytes]);
}

// ---------------------------------------------------------------------------
// PNG generator
// ---------------------------------------------------------------------------
function generatePNG(size) {
  // ---- Signature ----
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // ---- IHDR ----
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData.writeUInt8(8, 8);        // bit depth = 8
  ihdrData.writeUInt8(2, 9);        // color type = 2 (RGB truecolor)
  ihdrData.writeUInt8(0, 10);       // compression = deflate
  ihdrData.writeUInt8(0, 11);       // filter method = 0
  ihdrData.writeUInt8(0, 12);       // interlace = none
  const ihdr = makeChunk('IHDR', ihdrData);

  // ---- Pixel data ----
  // Each row: 1 filter byte (0 = None) + 3 bytes per pixel (RGB)
  const raw = Buffer.alloc(size * (1 + size * 3));
  let offset = 0;

  const cx     = (size - 1) / 2;   // centre x (float for symmetry)
  const cy     = (size - 1) / 2;   // centre y
  // Diamond radii expressed as Manhattan-distance fractions of half-size
  const half   = size / 2;
  const rOuter = half * 0.70;      // teal diamond outer edge
  const rInner = half * 0.42;      // violet inner diamond

  // Background  : #0a0515
  const BG = [0x0a, 0x05, 0x15];
  // Teal ring   : #7fffd4
  const TEAL = [0x7f, 0xff, 0xd4];
  // Violet core : #8b5cf6
  const VIOLET = [0x8b, 0x5c, 0xf6];

  for (let y = 0; y < size; y++) {
    raw[offset++] = 0; // filter byte: None
    for (let x = 0; x < size; x++) {
      const manhattan = Math.abs(x - cx) + Math.abs(y - cy);
      let px;
      if (manhattan < rInner) {
        px = VIOLET;
      } else if (manhattan < rOuter) {
        px = TEAL;
      } else {
        px = BG;
      }
      raw[offset++] = px[0];
      raw[offset++] = px[1];
      raw[offset++] = px[2];
    }
  }

  // ---- IDAT (compressed) ----
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const idat = makeChunk('IDAT', compressed);

  // ---- IEND ----
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SIZES    = [16, 32, 48, 128];
const ICONS_DIR = path.join(__dirname, 'assets', 'icons');

fs.mkdirSync(ICONS_DIR, { recursive: true });

for (const size of SIZES) {
  const png      = generatePNG(size);
  const filePath = path.join(ICONS_DIR, `icon-${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Written: ${filePath}  (${png.length} bytes)`);
}

console.log('\nAll icons generated successfully.');
