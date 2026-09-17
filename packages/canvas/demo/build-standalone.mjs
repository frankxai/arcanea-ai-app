/**
 * Folds demo/index.html + demo/lib/*.js + the three latin webfonts into one
 * file, so the canvas can be opened anywhere with no server and no network.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const FONTS = [
  { family: 'Geist', weight: '400 600', style: 'normal', url: 'https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2' },
  { family: 'Geist Mono', weight: '400 500', style: 'normal', url: 'https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2' },
  { family: 'Instrument Serif', weight: '400', style: 'normal', url: 'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2' },
];

const MODULES = [
  'lib/protocol/paths.js',
  'lib/protocol/types.js',
  'lib/protocol/reducer.js',
  'lib/protocol/doc.js',
  'lib/transport/local.js',
  'lib/run/slice.js',
];

const stripModuleSyntax = (source) =>
  source
    .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, '')
    .replace(/^export\s+/gm, '');

async function inlineFonts() {
  const faces = [];
  for (const font of FONTS) {
    const response = await fetch(font.url);
    if (!response.ok) throw new Error(`font fetch failed: ${font.url} ${response.status}`);
    const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
    faces.push(
      `@font-face{font-family:'${font.family}';font-style:${font.style};font-weight:${font.weight};font-display:swap;` +
        `src:url(data:font/woff2;base64,${base64}) format('woff2');}`,
    );
  }
  return faces.join('\n');
}

const html = await readFile(join(here, 'index.html'), 'utf8');
const bodies = await Promise.all(
  MODULES.map(async (path) => stripModuleSyntax(await readFile(join(here, path), 'utf8'))),
);

const standalone = html
  .replace(/<link rel="preconnect"[\s\S]*?<link href="https:\/\/fonts\.googleapis[^>]*>/, `<style>\n${await inlineFonts()}\n</style>`)
  .replace(/<script type="module">[\s\S]*?import[\s\S]*?from '\.\/lib\/run\/slice\.js';/, `<script>\n${bodies.join('\n')}\n`);

await writeFile(join(here, 'arcanea-canvas.html'), standalone);
console.log(`arcanea-canvas.html · ${(standalone.length / 1024).toFixed(0)} KB`);
