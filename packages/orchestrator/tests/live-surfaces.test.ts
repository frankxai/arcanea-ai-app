import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeLiveSurface, type LiveSurfaceSnapshot } from '../src/live-surfaces.js';

const snapshot: LiveSurfaceSnapshot = {
  timestamp: '2026-05-21T11:00:00.000Z',
  host: 'frank-pc',
  repoRoot: 'C:/Users/frank/Arcanea',
  processes: [
    {
      runtime: 'claude',
      name: 'claude.exe',
      pid: 101,
      parentPid: 1,
      executablePath: 'C:/Users/frank/.local/bin/claude.exe',
      commandLine: '--output-format stream-json',
    },
    {
      runtime: 'antigravity',
      name: 'Antigravity.exe',
      pid: 202,
      parentPid: 1,
      executablePath: 'C:/Users/frank/AppData/Local/Programs/antigravity/Antigravity.exe',
      commandLine: null,
    },
  ],
  claude: {
    worktrees: [
      {
        path: 'C:/Users/frank/Arcanea/.claude/worktrees/agent-aa98b540851bf1089',
        branch: 'worktree-agent-aa98b540851bf1089',
        head: 'db81c2b4',
        status: '## worktree-agent-aa98b540851bf1089\n M packages/orchestrator/src/status.ts',
        updatedAt: '2026-05-21T10:59:00.000Z',
      },
    ],
    sessions: [
      {
        path: 'C:/Users/frank/AppData/Roaming/Claude/local-agent-mode-sessions/session/transcript.jsonl',
        updatedAt: '2026-05-21T10:58:30.000Z',
        summary: 'Review the live surface probe and tighten the session tree discovery.',
      },
    ],
  },
  antigravity: {
    conversations: [
      {
        path: 'C:/Users/frank/.gemini/antigravity/conversations/47cc.pb',
        updatedAt: '2026-05-21T10:57:00.000Z',
        summary: null,
      },
    ],
    brains: [
      {
        path: 'C:/Users/frank/.gemini/antigravity/brain/47cc/.system_generated/logs/transcript.jsonl',
        updatedAt: '2026-05-21T10:58:20.000Z',
        summary: 'Waiting for git lock to release.',
      },
    ],
  },
};

test('summarizeLiveSurface distinguishes claude and antigravity activity', () => {
  const summary = summarizeLiveSurface(snapshot);
  assert.match(summary.claude.join(' · '), /worktree/);
  assert.match(summary.claude.join(' · '), /latest session/);
  assert.match(summary.antigravity.join(' · '), /latest activity/);
  assert.match(summary.antigravity.join(' · '), /conversations/);
});

