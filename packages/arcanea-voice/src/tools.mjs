/**
 * @arcanea/voice — Function-calling tools
 *
 * Five safe tools: shell_run (allowlist), file_write (home/cwd sandbox),
 * claude_prompt (disk + clipboard bridge), open_url, linear_issue.
 * OpenAI-compatible schemas. Zero deps — Node 18+ built-ins only.
 */

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { homedir, platform } from 'os';
import { dirname, resolve, join } from 'path';

import { getKey } from './transcribe.mjs';

const IS_WIN = platform() === 'win32';
const IS_MAC = platform() === 'darwin';

const SHELL_ALLOW = new Set([
  'git', 'ls', 'dir', 'pwd', 'echo', 'cat', 'type', 'grep', 'find',
  'mkdir', 'node', 'pnpm', 'npm', 'npx', 'code', 'gh', 'where', 'which', 'curl',
]);

const CURL_UNSAFE = new Set([
  '-X', '-d', '--data', '--data-raw', '--data-binary', '-F', '--form',
  '-T', '--upload-file',
]);

const fn = (name, description, properties, required) => ({
  type: 'function',
  function: { name, description, parameters: { type: 'object', properties, required } },
});

export const TOOLS = [
  fn(
    'shell_run',
    'Execute a safe shell command. Allowed first tokens: git, ls, dir, pwd, echo, cat, type, grep, find, mkdir, node, pnpm, npm, npx, code, gh, where, which, curl (GET only). Anything else is rejected. Returns stdout/stderr/exit code. 10s timeout.',
    { command: { type: 'string', description: 'The command to execute. First token must be in the allow list.' } },
    ['command'],
  ),
  fn(
    'file_write',
    'Write a text file to disk. Path must resolve inside the user home directory or the current working directory. Parent dirs are created automatically.',
    {
      path: { type: 'string', description: 'File path, absolute or relative to cwd.' },
      content: { type: 'string', description: 'UTF-8 text to write.' },
    },
    ['path', 'content'],
  ),
  fn(
    'claude_prompt',
    'Bridge a spoken request into Claude Code. Writes the prompt to ~/.arcanea/voice-inbox/ and copies it to the system clipboard for instant paste (Ctrl+V) into a Claude Code session. Use this whenever the user is describing a coding task they want actually built.',
    { prompt: { type: 'string', description: 'The full prompt to hand off to Claude Code.' } },
    ['prompt'],
  ),
  fn(
    'open_url',
    'Open a URL in the default browser. URL must start with http:// or https://.',
    { url: { type: 'string', description: 'Absolute http(s) URL.' } },
    ['url'],
  ),
  fn(
    'linear_issue',
    'Create a Linear issue via GraphQL. Requires LINEAR_API_KEY. Returns the new issue identifier and URL.',
    {
      title: { type: 'string', description: 'Issue title (one line).' },
      body: { type: 'string', description: 'Optional markdown body.' },
    },
    ['title'],
  ),
  fn(
    'claude_code_launch',
    'Hands-free handoff to Claude Code. Writes the prompt to the voice-inbox, copies it to the clipboard, AND spawns a new terminal window running `claude --dangerously-skip-permissions "<prompt>"` so Claude Code starts executing immediately. Use this instead of claude_prompt when the user wants the work to begin now, not just copied for later.',
    { prompt: { type: 'string', description: 'The full prompt Claude Code should execute.' } },
    ['prompt'],
  ),
];

// ---------------------------------------------------------------------------

const logTool = (name, summary) => process.stderr.write(`[TOOL] ${name}: ${summary}\n`);

function splitArgs(cmd) {
  const out = [];
  let cur = '', q = null;
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (q) { if (c === q) q = null; else cur += c; }
    else if (c === '"' || c === "'") q = c;
    else if (/\s/.test(c)) { if (cur) { out.push(cur); cur = ''; } }
    else cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

async function toolShellRun(command) {
  if (!command || typeof command !== 'string') return { error: 'command required' };
  const trimmed = command.trim();
  const tokens = splitArgs(trimmed);
  if (!tokens.length) return { error: 'empty command' };
  const head = tokens[0].toLowerCase();
  if (!SHELL_ALLOW.has(head)) {
    return { error: `command not allowed: "${head}". Allowed: ${[...SHELL_ALLOW].join(', ')}` };
  }
  if (head === 'curl') {
    for (const t of tokens.slice(1)) {
      if (CURL_UNSAFE.has(t) || t.startsWith('-X')) return { error: `curl flag not allowed: ${t}` };
    }
  }

  logTool('shell_run', trimmed.slice(0, 120));
  const opts = { timeout: 10_000, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] };
  const r = IS_WIN
    ? spawnSync('cmd', ['/c', trimmed], opts)
    : spawnSync('/bin/sh', ['-c', trimmed], opts);

  return {
    command: trimmed,
    stdout: (r.stdout || '').toString().slice(0, 4000),
    stderr: (r.stderr || '').toString().slice(0, 2000),
    exitCode: typeof r.status === 'number' ? r.status : -1,
    timedOut: r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGTERM',
  };
}

function insideSandbox(abs) {
  const home = resolve(homedir());
  const cwd = resolve(process.cwd());
  return abs.startsWith(home) || abs.startsWith(cwd);
}

async function toolFileWrite(pathArg, content) {
  if (!pathArg || typeof pathArg !== 'string') return { error: 'path required' };
  if (typeof content !== 'string') return { error: 'content must be a string' };
  const abs = resolve(pathArg);
  if (!insideSandbox(abs)) return { error: `path outside sandbox (home or cwd): ${abs}` };
  logTool('file_write', `${abs} (${content.length} chars)`);
  try {
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, content, 'utf-8');
    return { path: abs, bytesWritten: Buffer.byteLength(content, 'utf-8') };
  } catch (e) {
    return { error: String(e?.message || e) };
  }
}

function copyToClipboard(text) {
  const opts = { input: text, encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] };
  try {
    if (IS_WIN) return spawnSync('powershell', ['-NoProfile', '-Command', 'Set-Clipboard'], opts).status === 0;
    if (IS_MAC) return spawnSync('pbcopy', [], opts).status === 0;
    if (spawnSync('xclip', ['-selection', 'clipboard'], opts).status === 0) return true;
    return spawnSync('wl-copy', [], opts).status === 0;
  } catch { return false; }
}

async function toolClaudePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return { error: 'prompt required' };
  const inbox = join(homedir(), '.arcanea', 'voice-inbox');
  try { if (!existsSync(inbox)) mkdirSync(inbox, { recursive: true }); }
  catch (e) { return { error: `failed to create inbox: ${e.message}` }; }
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = join(inbox, `prompt-${ts}.md`);
  try { writeFileSync(file, prompt, 'utf-8'); }
  catch (e) { return { error: `failed to write prompt: ${e.message}` }; }
  const copied = copyToClipboard(prompt);
  logTool('claude_prompt', `${file} (clipboard=${copied})`);
  return copied
    ? { path: file, copied: true, message: 'Prompt ready — paste into Claude Code with Ctrl+V.' }
    : { path: file, copied: false, message: `Saved to disk — copy manually from ${file}.` };
}

async function toolClaudeCodeLaunch(prompt) {
  if (!prompt || typeof prompt !== 'string') return { error: 'prompt required' };
  // Reuse claude_prompt side effects (inbox + clipboard) so this is a superset.
  const base = await toolClaudePrompt(prompt);
  if (base.error) return base;

  const claudeBin = process.env.ARCANEA_CLAUDE_BIN || 'claude';
  const flag = '--dangerously-skip-permissions';
  // Truncate the prompt embedded in the command line to keep shells happy.
  const preview = prompt.length > 1800 ? prompt.slice(0, 1800) + '…' : prompt;
  const shellSafe = preview.replace(/"/g, '\\"');

  let launched = false;
  try {
    if (IS_WIN) {
      // New cmd window, keep it open after claude exits so the user can read.
      spawnSync('cmd', ['/c', 'start', '""', 'cmd', '/k', `${claudeBin} ${flag} "${shellSafe}"`], { stdio: 'ignore' });
      launched = true;
    } else if (IS_MAC) {
      const script = `tell application "Terminal" to do script "${claudeBin} ${flag} \\"${shellSafe}\\""`;
      spawnSync('osascript', ['-e', script], { stdio: 'ignore' });
      launched = true;
    } else {
      const term = process.env.ARCANEA_TERMINAL || 'x-terminal-emulator';
      spawnSync(term, ['-e', 'bash', '-c', `${claudeBin} ${flag} "${shellSafe}"; exec bash`], { stdio: 'ignore' });
      launched = true;
    }
  } catch (e) {
    return { ...base, launched: false, launchError: String(e?.message || e) };
  }
  logTool('claude_code_launch', `spawned claude with ${prompt.length}-char prompt`);
  return {
    ...base,
    launched,
    message: launched
      ? 'New Claude Code window opened and running your request.'
      : base.message,
  };
}

async function toolOpenUrl(url) {
  if (!url || typeof url !== 'string') return { error: 'url required' };
  if (!/^https?:\/\//i.test(url)) return { error: 'url must start with http:// or https://' };
  logTool('open_url', url);
  try {
    const opts = { timeout: 5000, stdio: 'ignore' };
    if (IS_WIN) spawnSync('cmd', ['/c', 'start', '""', url], opts);
    else if (IS_MAC) spawnSync('open', [url], opts);
    else spawnSync('xdg-open', [url], opts);
    return { opened: true, url };
  } catch (e) { return { error: String(e?.message || e) }; }
}

async function toolLinearIssue(title, body) {
  if (!title || typeof title !== 'string') return { error: 'title required' };
  const key = getKey('LINEAR_API_KEY');
  if (!key) return { error: 'LINEAR_API_KEY not set' };
  logTool('linear_issue', title.slice(0, 80));
  try {
    const r = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: key },
      body: JSON.stringify({
        query: 'mutation($title:String!,$body:String){issueCreate(input:{title:$title,description:$body}){success,issue{id,identifier,url}}}',
        variables: { title, body: body ?? '' },
      }),
    });
    if (!r.ok) return { error: `linear http ${r.status}` };
    const j = await r.json().catch(() => null);
    const issue = j?.data?.issueCreate?.issue;
    if (!issue) return { error: 'linear rejected the issue' };
    return { identifier: issue.identifier, url: issue.url };
  } catch (e) { return { error: String(e?.message || e) }; }
}

// ---------------------------------------------------------------------------

export async function executeTool(name, args) {
  const a = args || {};
  try {
    switch (name) {
      case 'shell_run':     return await toolShellRun(a.command);
      case 'file_write':    return await toolFileWrite(a.path, a.content);
      case 'claude_prompt':       return await toolClaudePrompt(a.prompt);
      case 'claude_code_launch':  return await toolClaudeCodeLaunch(a.prompt);
      case 'open_url':            return await toolOpenUrl(a.url);
      case 'linear_issue':        return await toolLinearIssue(a.title, a.body);
      default:              return { error: `unknown tool: ${name}` };
    }
  } catch (e) { return { error: String(e?.message || e) }; }
}

export function formatToolResult(name, result) {
  if (!result) return `${name}: (no result)`;
  if (result.error) return `${name} failed: ${result.error}`;
  switch (name) {
    case 'shell_run': {
      const out = (result.stdout || '').trim();
      const err = (result.stderr || '').trim();
      const tail = out ? out.slice(0, 400) : err ? `stderr: ${err.slice(0, 200)}` : '(no output)';
      return `$ ${result.command}\n${tail}`;
    }
    case 'file_write':    return `wrote ${result.bytesWritten} bytes to ${result.path}`;
    case 'claude_prompt': return result.copied
      ? `prompt copied to clipboard (saved ${result.path})`
      : `prompt saved to ${result.path} (clipboard unavailable)`;
    case 'claude_code_launch': return result.launched
      ? `new Claude Code window launched (prompt also saved to ${result.path})`
      : `prompt saved to ${result.path}, but launch failed`;
    case 'open_url':      return `opened ${result.url}`;
    case 'linear_issue':  return `created ${result.identifier} — ${result.url}`;
    default:              return `${name}: ${JSON.stringify(result).slice(0, 300)}`;
  }
}
