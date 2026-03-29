#!/usr/bin/env node
/**
 * SIS Memory Layer v1 — Session End Hook (Stop event)
 * Saves key decisions, patterns, and modified files from the session.
 *
 * Reads the transcript (if available) and extracts:
 * - User messages (last 10)
 * - Tools used
 * - Files modified
 * - Creates a session summary file
 */

const fs = require('fs');
const path = require('path');

// Unified path: ~/.arcanea/sessions/ (matches bash hooks)
const ARCANEA_HOME = path.join(process.env.HOME || process.env.USERPROFILE || '', '.arcanea');
const SESSION_DIR = path.join(ARCANEA_HOME, 'sessions', 'archive');

function ensureDirs() {
  [MEMORY_DIR, SESSION_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function extractFromTranscript(input) {
  const result = {
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    branch: '',
    decisions: [],
    patterns: [],
    filesModified: [],
    toolsUsed: new Set(),
    notes: ''
  };

  try {
    const data = JSON.parse(input);

    // Try to read transcript if path provided
    if (data.transcript_path && fs.existsSync(data.transcript_path)) {
      const transcript = fs.readFileSync(data.transcript_path, 'utf8');
      const lines = transcript.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const entry = JSON.parse(line);

          // Track tools used
          if (entry.tool_name) {
            result.toolsUsed.add(entry.tool_name);
          }

          // Track files modified
          if (entry.tool_name === 'Write' || entry.tool_name === 'Edit') {
            const filePath = entry.tool_input?.file_path;
            if (filePath && !result.filesModified.includes(filePath)) {
              result.filesModified.push(filePath);
            }
          }
        } catch {
          // Skip unparseable lines
        }
      }
    }
  } catch {
    // If stdin isn't JSON, that's fine
  }

  // Get current git branch
  try {
    const { execSync } = require('child_process');
    result.branch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch {
    result.branch = 'unknown';
  }

  // Convert Set to Array for JSON serialization
  result.toolsUsed = [...result.toolsUsed];

  return result;
}

function saveSession(session) {
  ensureDirs();

  const sessionId = `${session.date}-${Date.now().toString(36)}`;
  const filepath = path.join(SESSION_DIR, `${sessionId}-session.json`);

  fs.writeFileSync(filepath, JSON.stringify(session, null, 2));

  // Prune old sessions (keep last 30)
  const sessions = fs.readdirSync(SESSION_DIR)
    .filter(f => f.endsWith('-session.json'))
    .sort()
    .reverse();

  sessions.slice(30).forEach(f => {
    try {
      fs.unlinkSync(path.join(SESSION_DIR, f));
    } catch {
      // Ignore cleanup errors
    }
  });
}

function main() {
  const input = readStdin();
  const session = extractFromTranscript(input);

  // Only save if there was actual work done
  if (session.filesModified.length > 0 || session.toolsUsed.length > 0) {
    saveSession(session);
    console.log(`[SIS] Session saved: ${session.filesModified.length} files, ${session.toolsUsed.length} tools`);
  }

  // Pass through stdin for hook chain
  if (input) {
    process.stdout.write(input);
  }
}

main();
