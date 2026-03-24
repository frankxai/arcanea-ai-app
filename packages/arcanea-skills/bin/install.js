#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PACKAGE_NAME = '@arcanea/skills';
const SRC_DIR = path.join(__dirname, '..', 'skills');
const HOME = process.env.HOME || process.env.USERPROFILE;
const DEST_DIR = path.join(HOME, '.claude', 'skills');

function printUsage() {
  console.log(`
  ${PACKAGE_NAME} — Install Arcanea skills to Claude Code

  Usage:
    arcanea-skills              Install all bundled skills
    arcanea-skills --list       List available skills
    arcanea-skills --category   List skill categories
    arcanea-skills --dry-run    Show what would be installed
    arcanea-skills --help       Show this help message

  Skills are installed to: ${DEST_DIR}
`);
}

function listSkills() {
  const meta = require('../index.js');
  console.log(`\n  ${PACKAGE_NAME} v${meta.version}`);
  console.log(`  ${meta.bundledCount} bundled skills (${meta.skillCount} total in ecosystem)\n`);

  for (const [key, cat] of Object.entries(meta.categories)) {
    console.log(`  ${cat.label}:`);
    for (const skill of cat.skills) {
      console.log(`    - ${skill}`);
    }
    console.log();
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return 0;

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function install(dryRun) {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('  Error: Skills source directory not found at', SRC_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SRC_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  if (skillDirs.length === 0) {
    console.log('  No skill directories found to install.');
    console.log('  Skills will be populated in a future release.');
    return;
  }

  console.log(`\n  Installing ${skillDirs.length} skills to ${DEST_DIR}\n`);

  if (dryRun) {
    for (const dir of skillDirs) {
      console.log(`  [dry-run] Would copy: ${dir}`);
    }
    console.log(`\n  Destination: ${DEST_DIR}`);
    return;
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });

  let totalFiles = 0;
  for (const dir of skillDirs) {
    const src = path.join(SRC_DIR, dir);
    const dest = path.join(DEST_DIR, dir);
    const count = copyDirRecursive(src, dest);
    totalFiles += count;
    console.log(`  Installed: ${dir} (${count} files)`);
  }

  console.log(`\n  Done. ${totalFiles} files installed to ${DEST_DIR}`);
  console.log('  Restart Claude Code to activate skills.\n');
}

// --- CLI ---
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printUsage();
} else if (args.includes('--list') || args.includes('-l')) {
  listSkills();
} else if (args.includes('--category') || args.includes('-c')) {
  const meta = require('../index.js');
  console.log('\n  Categories:', Object.keys(meta.categories).join(', '), '\n');
} else if (args.includes('--dry-run')) {
  install(true);
} else {
  install(false);
}
