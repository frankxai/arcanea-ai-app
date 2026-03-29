#!/usr/bin/env node
/**
 * SIS Memory Layer v1 — Pre-Compact Hook
 * Preserves critical context before Claude Code compacts the conversation.
 *
 * Saves a snapshot of:
 * - Current working files
 * - Active decisions
 * - Compaction timestamp (so future sessions know context was lost)
 */

const fs = require('fs');
const path = require('path');

// Unified path: ~/.arcanea/ (matches bash hooks)
const ARCANEA_HOME = path.join(process.env.HOME || process.env.USERPROFILE || '', '.arcanea');
const COMPACT_LOG = path.join(ARCANEA_HOME, 'memory', 'compaction-log.jsonl');
const SESSION_DIR = path.join(ARCANEA_HOME, 'sessions', 'archive');

function ensureDirs() {
  [MEMORY_DIR, SESSION_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function main() {
  ensureDirs();

  const timestamp = new Date().toISOString();
  const entry = {
    event: 'compaction',
    timestamp,
    cwd: process.cwd()
  };

  // Get current branch
  try {
    const { execSync } = require('child_process');
    entry.branch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
    entry.lastCommit = execSync('git log -1 --format="%h %s" 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch {
    // Not in a git repo
  }

  // Append to compaction log
  fs.appendFileSync(COMPACT_LOG, JSON.stringify(entry) + '\n');

  // Mark the most recent session file
  if (fs.existsSync(SESSION_DIR)) {
    const sessions = fs.readdirSync(SESSION_DIR)
      .filter(f => f.endsWith('-session.json'))
      .sort()
      .reverse();

    if (sessions.length > 0) {
      const latestPath = path.join(SESSION_DIR, sessions[0]);
      try {
        const session = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
        if (!session.compactions) session.compactions = [];
        session.compactions.push(timestamp);
        fs.writeFileSync(latestPath, JSON.stringify(session, null, 2));
      } catch {
        // Session file corrupt, skip
      }
    }
  }

  console.log(`[SIS] Context preserved before compaction at ${timestamp}`);
}

main();
