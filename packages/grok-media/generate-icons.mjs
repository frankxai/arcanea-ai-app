/**
 * Generate placeholder extension icons.
 * Creates simple colored PNGs with the Arcanea crystal teal accent.
 * Replace with proper designed icons before Chrome Web Store submission.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'assets', 'icons');
if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

const sizes = [16, 32, 48, 128];

/**
 * Generate a minimal valid PNG file with a solid color + simple "A" indicator.
 * Uses raw PNG construction (no dependencies required).
 */
function generatePNG(size) {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData.writeUInt8(8, 8);        // bit depth
  ihdrData.writeUInt8(2, 9);        // color type (RGB)
  ihdrData.writeUInt8(0, 10);       // compression
  ihdrData.writeUInt8(0, 11);       // filter
  ihdrData.writeUInt8(0, 12);       // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk — raw pixel data
  // Crystal teal (#7fffd4) background with violet (#8b5cf6) center diamond
  const rawData = [];
  const center = Math.floor(size / 2);
  const radius = Math.floor(size * 0.35);

  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte (none)
    for (let x = 0; x < size; x++) {
      const dist = Math.abs(x - center) + Math.abs(y - center); // Manhattan distance
      if (dist < radius) {
        // Violet diamond center
        rawData.push(139, 92, 246); // #8b5cf6
      } else if (dist < radius + 2) {
        // Crystal teal border
        rawData.push(127, 255, 212); // #7fffd4
      } else {
        // Dark background
        rawData.push(10, 5, 21); // #0a0515
      }
    }
  }

  // Compress with zlib (deflate)
  const { deflateSync } = await import('zlib');
  const compressed = deflateSync(Buffer.from(rawData));
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate all sizes
for (const size of sizes) {
  try {
    const png = await generatePNG(size);
    const path = join(iconsDir, `icon-${size}.png`);
    writeFileSync(path, png);
    console.log(`Generated: icon-${size}.png (${png.length} bytes)`);
  } catch (err) {
    console.error(`Failed to generate icon-${size}.png:`, err.message);
  }
}

console.log('\nPlaceholder icons generated. Replace with designed icons before store submission.');
