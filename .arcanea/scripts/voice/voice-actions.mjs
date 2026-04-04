#!/usr/bin/env node
/**
 * Arcanea Voice Actions — Route voice transcripts to Linear, Notion, Git
 *
 * Called by voice.ps1 after transcription with:
 *   node voice-actions.mjs <action> <transcript> [title]
 *
 * Actions:
 *   issue <transcript> [title]   → Create Linear issue
 *   task <transcript> [title]    → Create Linear backlog task
 *   commit <transcript>          → Format as commit message on clipboard
 *   idea <transcript> [title]    → Save to ideas log
 *   standup <transcript>         → Daily standup log
 *   extract-actions <transcript> → Pull out action items
 */

import { spawnSync } from 'child_process';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'C:\\Users\\frank\\Arcanea';
const CONTENT = join(BASE, 'content', 'voice');
const PLANNING = join(BASE, 'planning-with-files');

const action = process.argv[2];
const transcript = process.argv[3] || '';
const title = process.argv[4] || '';

if (!action || !transcript) {
  console.log('Usage: voice-actions.mjs <action> <transcript> [title]');
  process.exit(1);
}

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

switch (action) {
  case 'issue': {
    // Extract title from first sentence if not provided
    const issueTitle = title || transcript.split(/[.!?]/)[0].trim().slice(0, 80);
    const body = `## Voice-Created Issue\n\n${transcript}\n\n---\n*Created via Arcanea Voice at ${ts}*`;

    console.log(`  Creating Linear issue: "${issueTitle}"`);

    // Use gh CLI as fallback (Linear MCP may not be available from Node)
    const result = spawnSync('gh', [
      'issue', 'create',
      '--repo', 'frankxai/arcanea',
      '--title', issueTitle,
      '--body', body,
      '--label', 'voice-created'
    ], { encoding: 'utf-8', timeout: 15000 });

    if (result.status === 0) {
      console.log(`  Issue created: ${result.stdout.trim()}`);
    } else {
      // Save locally if GitHub fails
      const file = join(CONTENT, 'issues', `issue_${ts}.md`);
      mkdirSync(join(CONTENT, 'issues'), { recursive: true });
      writeFileSync(file, `# ${issueTitle}\n\n${transcript}\n`);
      console.log(`  Saved locally: ${file} (create in Linear manually)`);
    }
    break;
  }

  case 'task': {
    const taskTitle = title || transcript.split(/[.!?]/)[0].trim().slice(0, 80);
    const file = join(CONTENT, 'tasks', `task_${ts}.md`);
    mkdirSync(join(CONTENT, 'tasks'), { recursive: true });
    writeFileSync(file, `# ${taskTitle}\n\nPriority: Normal\nStatus: Backlog\n\n${transcript}\n\n---\n*Voice-created at ${ts}*\n`);
    console.log(`  Task saved: ${taskTitle}`);
    console.log(`  File: ${file}`);
    console.log(`  Paste transcript into Linear to create issue.`);
    break;
  }

  case 'commit': {
    // Format transcript as a proper commit message
    const firstLine = transcript.split(/[.!?]/)[0].trim();
    const type = guessCommitType(firstLine);
    const commitMsg = `${type}: ${firstLine.toLowerCase()}\n\n${transcript}`;

    // Copy to clipboard
    spawnSync('powershell', ['-Command', `Set-Clipboard '${commitMsg.replace(/'/g, "''")}'`], { timeout: 3000 });
    console.log(`  Commit message on clipboard:`);
    console.log(`  ${commitMsg.split('\n')[0]}`);
    break;
  }

  case 'idea': {
    const ideaTitle = title || transcript.split(/[.!?]/)[0].trim().slice(0, 60);
    const ideasFile = join(CONTENT, 'ideas.md');
    if (!existsSync(ideasFile)) {
      writeFileSync(ideasFile, '# Voice Ideas\n\n---\n\n');
    }
    const entry = `## ${ideaTitle}\n*${ts}*\n\n${transcript}\n\n---\n\n`;
    appendFileSync(ideasFile, entry);
    console.log(`  Idea saved: ${ideaTitle}`);
    break;
  }

  case 'standup': {
    const standupFile = join(PLANNING, `standup_${ts.slice(0, 10)}.md`);
    const entry = existsSync(standupFile)
      ? `\n## Update ${ts.slice(11)}\n\n${transcript}\n`
      : `# Daily Standup - ${ts.slice(0, 10)}\n\n## ${ts.slice(11)}\n\n${transcript}\n`;
    appendFileSync(standupFile, entry);
    console.log(`  Standup logged: ${standupFile}`);
    break;
  }

  case 'extract-actions': {
    // Simple action extraction from transcript
    const sentences = transcript.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const actions = sentences.filter(s =>
      /^(need|should|must|will|going to|want to|let's|we need|i need|fix|build|create|add|remove|update|deploy|test)/i.test(s)
    );

    if (actions.length > 0) {
      console.log(`  Extracted ${actions.length} action items:`);
      actions.forEach((a, i) => console.log(`  ${i + 1}. ${a}`));
    } else {
      console.log(`  No clear action items detected.`);
    }
    break;
  }

  default:
    console.log(`  Unknown action: ${action}`);
}

function guessCommitType(text) {
  const t = text.toLowerCase();
  if (/fix|bug|error|broken|crash/.test(t)) return 'fix';
  if (/add|new|create|implement|build/.test(t)) return 'feat';
  if (/refactor|clean|simplify|reorganize/.test(t)) return 'refactor';
  if (/doc|readme|comment|explain/.test(t)) return 'docs';
  if (/test|spec|coverage/.test(t)) return 'test';
  if (/style|format|lint/.test(t)) return 'style';
  return 'feat';
}
