/**
 * Package the extension into a zip for Chrome Web Store upload.
 * Usage: node scripts/package.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const version = pkg.version;

const releaseDir = join(root, 'release');
if (!existsSync(releaseDir)) mkdirSync(releaseDir);

const zipName = `arcanea-grok-media-v${version}.zip`;
const zipPath = join(releaseDir, zipName);

// Files to include in the zip
const includes = [
  'manifest.json',
  'dist/',
  'src/sidepanel/index.html',
  'src/popup/popup.html',
  'assets/',
].join(' ');

// Files/dirs to exclude
const excludes = [
  'node_modules',
  '.git',
  'src/**/*.ts',
  'src/**/*.tsx',
  'tests',
  'release',
  '*.mjs',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
].map(e => `--exclude='${e}'`).join(' ');

try {
  execSync(`cd "${root}" && zip -r "${zipPath}" ${includes} ${excludes}`, { stdio: 'inherit' });
  console.log(`\nPackaged: ${zipPath}`);
} catch {
  // zip may not be available on Windows; try PowerShell
  const psCmd = `Compress-Archive -Path "${root}\\manifest.json","${root}\\dist","${root}\\src\\sidepanel\\index.html","${root}\\src\\popup\\popup.html","${root}\\assets" -DestinationPath "${zipPath}" -Force`;
  execSync(`powershell -Command "${psCmd}"`, { stdio: 'inherit' });
  console.log(`\nPackaged (PowerShell): ${zipPath}`);
}
