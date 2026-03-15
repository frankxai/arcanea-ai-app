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

const MEMORY_DIR = path.join(process.env.HOME || '', '.arcanea', 'memory');
const SESSION_DIR = path.join(MEMORY_DIR, 'sessions');
const MAX_AGE_DAYS = 7;

function findRecentSessions() {
  if (!fs.existsSync(SESSION_DIR)) return [];

  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  return fs.readdirSync(SESSION_DIR)
    .filter(f => f.endsWith('-session.json'))
    .map(f => {
      const filepath = path.join(SESSION_DIR, f);
      const stat = fs.statSync(filepath);
      return { file: f, path: filepath, mtime: stat.mtimeMs };
    })
    .filter(f => (now - f.mtime) < maxAge)
    .sort((a, b) => b.mtime - a.mtime);
}

function loadLastSession() {
  const sessions = findRecentSessions();
  if (sessions.length === 0) return null;

  try {
    const content = fs.readFileSync(sessions[0].path, 'utf8');
    return JSON.parse(content);
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
  output.push('[SIS] Loading previous session context...');

  if (lastSession.branch) {
    output.push(`Branch: ${lastSession.branch}`);
  }

  if (lastSession.decisions && lastSession.decisions.length > 0) {
    output.push('Key decisions:');
    lastSession.decisions.forEach(d => output.push(`  - ${d}`));
  }

  if (lastSession.patterns && lastSession.patterns.length > 0) {
    output.push('Patterns observed:');
    lastSession.patterns.forEach(p => output.push(`  - ${p}`));
  }

  if (lastSession.filesModified && lastSession.filesModified.length > 0) {
    output.push(`Files touched: ${lastSession.filesModified.length}`);
    lastSession.filesModified.slice(0, 10).forEach(f => output.push(`  - ${f}`));
    if (lastSession.filesModified.length > 10) {
      output.push(`  ... and ${lastSession.filesModified.length - 10} more`);
    }
  }

  if (lastSession.notes) {
    output.push(`Notes: ${lastSession.notes}`);
  }

  console.log(output.join('\n'));
}

main();
