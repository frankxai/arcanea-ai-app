#!/usr/bin/env node
/**
 * SIS Memory Layer v1 — Session Start Hook
 * Loads last session context from .arcanea/memory/
 *
 * Reads the most recent session file and injects key decisions,
 * patterns, and context into the new session.
 */

const fs = require('fs');
const path = require('path');

// Unified path: ~/.arcanea/sessions/ (matches bash hooks)
const ARCANEA_HOME = path.join(process.env.HOME || process.env.USERPROFILE || '', '.arcanea');
const SESSION_DIR = path.join(ARCANEA_HOME, 'sessions', 'archive');
const SUMMARY_FILE = path.join(ARCANEA_HOME, 'sessions', 'last-summary.md');
const MAX_AGE_DAYS = 7;

function findRecentSessions() {
  // First try the last-summary.md (fastest path)
  if (fs.existsSync(SUMMARY_FILE)) {
    try {
      const content = fs.readFileSync(SUMMARY_FILE, 'utf-8').trim();
      if (content) {
        return [{ file: 'last-summary.md', path: SUMMARY_FILE, mtime: fs.statSync(SUMMARY_FILE).mtimeMs, content }];
      }
    } catch {}
  }

  // Fallback: scan archive directories
  if (!fs.existsSync(SESSION_DIR)) return [];

  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  // Archive dirs are named like 20260321-204304
  const dirs = fs.readdirSync(SESSION_DIR)
    .filter(f => {
      try { return fs.statSync(path.join(SESSION_DIR, f)).isDirectory(); } catch { return false; }
    })
    .map(f => {
      const dirpath = path.join(SESSION_DIR, f);
      const stat = fs.statSync(dirpath);
      return { file: f, path: dirpath, mtime: stat.mtimeMs };
    })
    .filter(f => (now - f.mtime) < maxAge)
    .sort((a, b) => b.mtime - a.mtime);
}

function loadLastSession() {
  const sessions = findRecentSessions();
  if (sessions.length === 0) return null;

  const first = sessions[0];

  // If it's the summary markdown file, parse it directly
  if (first.content || first.file === 'last-summary.md') {
    const content = first.content || fs.readFileSync(first.path, 'utf-8');
    return { type: 'summary', raw: content };
  }

  // If it's an archive directory, look for start.log and tools.log
  if (fs.statSync(first.path).isDirectory()) {
    const result = { type: 'archive', dir: first.file };
    const startLog = path.join(first.path, 'start.log');
    const toolsLog = path.join(first.path, 'tools.log');
    if (fs.existsSync(startLog)) result.startLog = fs.readFileSync(startLog, 'utf-8').trim();
    if (fs.existsSync(toolsLog)) {
      const lines = fs.readFileSync(toolsLog, 'utf-8').trim().split('\n').filter(Boolean);
      result.toolCount = lines.length;
      result.lastTools = lines.slice(-5);
    }
    return result;
  }

  // JSON session file fallback
  try {
    return JSON.parse(fs.readFileSync(first.path, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const lastSession = loadLastSession();

  if (!lastSession) {
    console.log('[SIS] No recent session context found. Fresh start.');
    return;
  }

  const output = [];

  if (lastSession.type === 'summary') {
    // Parse the markdown summary
    const lines = lastSession.raw.split('\n').filter(l => l.startsWith('- **'));
    if (lines.length > 0) {
      output.push('[SIS] Previous session context loaded:');
      lines.forEach(l => output.push(`  ${l.replace(/^- /, '')}`));
    } else {
      output.push('[SIS] Previous session summary found.');
    }
  } else if (lastSession.type === 'archive') {
    output.push(`[SIS] Previous session: ${lastSession.dir}`);
    if (lastSession.toolCount) output.push(`  Tools used: ${lastSession.toolCount}`);
  } else {
    // Legacy JSON format
    output.push('[SIS] Loading previous session context...');
    if (lastSession.branch) output.push(`  Branch: ${lastSession.branch}`);
    if (lastSession.filesModified?.length > 0) {
      output.push(`  Files touched: ${lastSession.filesModified.length}`);
      lastSession.filesModified.slice(0, 5).forEach(f => output.push(`    - ${f}`));
    }
  }

  console.log(output.join('\n'));
}

main();
