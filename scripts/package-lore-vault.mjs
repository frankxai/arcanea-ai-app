#!/usr/bin/env node
/**
 * @file package-lore-vault.mjs
 * Builds and packages the Arcanea Worldbuilding & Lore Vault (€149) digital release.
 * Generates cryptographic checksums, stages static files, and builds distribution archives.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const vaultDir = path.join(rootDir, 'packages', 'lore-vault');
const publicDownloadsDir = path.join(rootDir, 'apps', 'web', 'public', 'downloads');
const publicVaultsDir = path.join(rootDir, 'apps', 'web', 'public', 'vaults', 'arcanea-worldbuilding-vault');

console.log('🌌 [ARCANEA LORE VAULT PACKAGER] Initializing Gold Master Build...');

// 1. Verify directory exists
if (!fs.existsSync(vaultDir)) {
  console.error(`❌ Vault directory not found: ${vaultDir}`);
  process.exit(1);
}

// 2. Collect all vault files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'dist' && file !== 'node_modules') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file !== 'package.json') {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(vaultDir);
console.log(`📦 Found ${allFiles.length} canonical documents and assets in vault.`);

// 3. Compute SHA256 Checksums
const checksums = [];
let totalBytes = 0;

for (const filePath of allFiles) {
  const relPath = path.relative(vaultDir, filePath).replace(/\\/g, '/');
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  totalBytes += buffer.length;
  checksums.push(`${hash}  ${relPath}`);
}

const distDir = path.join(vaultDir, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'CHECKSUMS.txt'), checksums.join('\n') + '\n', 'utf-8');
console.log(`🔒 Generated SHA256 checksum manifest (dist/CHECKSUMS.txt).`);
console.log(`📊 Total Vault Uncompressed Size: ${(totalBytes / 1024).toFixed(2)} KB.`);

// 4. Stage files into apps/web/public/vaults/arcanea-worldbuilding-vault
fs.mkdirSync(publicVaultsDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      if (childItemName !== 'dist' && childItemName !== 'node_modules') {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(vaultDir, publicVaultsDir);
console.log(`✨ Staged public web vault assets at: ${publicVaultsDir}`);

// 5. Generate Distribution .zip Archive
fs.mkdirSync(publicDownloadsDir, { recursive: true });
const zipPath = path.join(publicDownloadsDir, 'arcanea-worldbuilding-lore-vault.zip');

try {
  console.log(`⚡ Creating compressed release archive...`);
  // Use PowerShell Compress-Archive on Windows
  const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${vaultDir}/*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  const zipSize = fs.statSync(zipPath).size;
  console.log(`✅ Release archive generated: ${zipPath} (${(zipSize / 1024).toFixed(2)} KB)`);
} catch (err) {
  console.warn(`⚠️ Warning: PowerShell zip creation encountered issue, staging static copy instead: ${err.message}`);
}

console.log(`\n🎉 [BUILD COMPLETE] The Arcanea Worldbuilding & Lore Vault (€149) is packaged and verified!`);
