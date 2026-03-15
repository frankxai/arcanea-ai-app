import * as vscode from 'vscode';
import { AiService, AiMessage, GATEWAY_MODELS } from './ai-service';
import { FileService } from './file-service';
import { WorldService } from './world-service';
import { TerminalService } from './terminal-service';
import { GUARDIANS, GUARDIAN_ORDER, routeToGuardian, Guardian } from './guardians';

type ToWebview =
  | { type: 'chunk'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string }
  | { type: 'guardian'; id: string; name: string; domain: string; element: string }
  | { type: 'fileCtx'; name: string; lang: string; lines: number }
  | { type: 'provider'; name: string; model: string }
  | { type: 'needsKey' }
  | { type: 'gates'; active: string[]; domains: string[] }
  | { type: 'history'; messages: { role: string; content: string }[] };

type FromWebview =
  | { type: 'send'; text: string }
  | { type: 'guardian'; id: string }
  | { type: 'worldBuild'; kind: string; params: Record<string, string> }
  | { type: 'imagePrompt'; subject: string }
  | { type: 'followUp'; text: string }
  | { type: 'ready' }
  | { type: 'setkey' };

export class ChatProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private guardianId = 'shinkami';
  private messages: AiMessage[] = [];
  private abortController?: AbortController;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly ai: AiService,
    private readonly files: FileService,
    private readonly world: WorldService,
    private readonly terminal: TerminalService = new TerminalService(),
  ) {}

  resolveWebviewView(wv: vscode.WebviewView): void {
    this.view = wv;
    wv.webview.options = { enableScripts: true, localResourceRoots: [this.extensionUri] };
    wv.webview.html = this.getHtml();

    wv.webview.onDidReceiveMessage(async (msg: FromWebview) => {
      switch (msg.type) {
        case 'ready':
          this.initWebview();
          break;
        case 'send':
          await this.handleSend(msg.text);
          break;
        case 'guardian':
          this.guardianId = msg.id;
          vscode.commands.executeCommand('arcanea.updateStatusBar', msg.id);
          this.sendGuardianInfo();
          break;
        case 'worldBuild':
          await this.handleWorldBuild(msg.kind, msg.params);
          break;
        case 'imagePrompt':
          this.handleImagePrompt(msg.subject);
          break;
        case 'followUp':
          await this.handleSend(msg.text);
          break;
        case 'setkey':
          vscode.commands.executeCommand('arcanea.setApiKey');
          break;
      }
    });
  }

  setGuardian(id: string): void {
    this.guardianId = id;
    this.sendGuardianInfo();
  }

  refresh(): void {
    this.initWebview();
  }

  async sendMessage(text: string): Promise<void> {
    await this.handleSend(text);
  }

  private initWebview(): void {
    this.sendGuardianInfo();
    this.sendFileCtx();
    this.sendProviderInfo();
  }

  private sendGuardianInfo(): void {
    const g = GUARDIANS[this.guardianId];
    if (g) {
      this.post({ type: 'guardian', id: this.guardianId, name: g.name, domain: g.domain, element: g.element });
    }
  }

  private sendFileCtx(): void {
    const ctx = this.files.getActiveFileContext();
    if (ctx) {
      this.post({ type: 'fileCtx', name: ctx.fileName, lang: ctx.languageId, lines: ctx.lineCount });
    }
  }

  private async sendProviderInfo(): Promise<void> {
    const hasKey = await this.ai.hasApiKey();
    if (!hasKey) {
      this.post({ type: 'needsKey' });
      return;
    }
    this.post({ type: 'provider', name: this.ai.getLabel(), model: this.ai.getSelectedModelId() });
  }

  private async handleSend(text: string): Promise<void> {
    // /route command — manual Guardian selection
    if (text.startsWith('/route ')) {
      const query = text.slice(7);
      const result = routeToGuardian(query);
      this.guardianId = result.guardian;
      this.sendGuardianInfo();
      vscode.commands.executeCommand('arcanea.updateStatusBar', result.guardian);
      const g = GUARDIANS[result.guardian];
      this.post({ type: 'chunk', text: `Routed to **${g.name}** (${Math.round(result.confidence * 100)}% confidence) — ${g.domain}\n\n` });
      this.post({ type: 'done' });
      return;
    }

    // /run command — terminal execution
    if (text.startsWith('/run ')) {
      const cmd = text.slice(5);
      this.post({ type: 'chunk', text: `Running: \`${cmd}\`\n\n` });
      const result = await this.terminal.executeForContext(cmd);
      this.post({ type: 'chunk', text: '```\n' + result + '\n```\n' });
      this.post({ type: 'done' });
      return;
    }

    // /diagnostics command — show workspace errors
    if (text === '/diagnostics' || text === '/diag') {
      const diag = this.terminal.getDiagnostics();
      this.post({ type: 'chunk', text: '**Workspace Diagnostics:**\n\n```\n' + diag + '\n```\n' });
      this.post({ type: 'done' });
      return;
    }

    const hasKey = await this.ai.hasApiKey();
    if (!hasKey) {
      this.post({ type: 'needsKey' });
      return;
    }

    this.messages.push({ role: 'user', content: text });
    this.abortController?.abort();
    this.abortController = new AbortController();

    // Build file context
    const fileCtx = this.files.getActiveFileContext();
    const fileContextStr = fileCtx
      ? `File: ${fileCtx.fileName} (${fileCtx.languageId}, ${fileCtx.lineCount} lines)\n${fileCtx.selection ? `Selection:\n${fileCtx.selection.slice(0, 2000)}` : fileCtx.content.slice(0, 4000)}`
      : undefined;

    try {
      // Use MoE intelligence routing
      const result = await this.ai.streamWithIntelligence(this.messages, fileContextStr, this.abortController.signal);

      // Send active gates to webview
      this.post({ type: 'gates', active: result.router.activeGates, domains: result.router.matchedDomains });

      let full = '';
      for await (const chunk of result.stream) {
        if (chunk.text) {
          full += chunk.text;
          this.post({ type: 'chunk', text: chunk.text });
        }
      }
      this.messages.push({ role: 'assistant', content: full });
      this.post({ type: 'done' });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        this.post({ type: 'error', message: err.message || 'Stream failed' });
      }
    }
  }

  private async handleWorldBuild(kind: string, params: Record<string, string>): Promise<void> {
    let prompt = '';
    switch (kind) {
      case 'character': prompt = this.world.buildCharacterPrompt(params); break;
      case 'realm': prompt = this.world.buildRealmPrompt(params); break;
      case 'artifact': prompt = this.world.buildArtifactPrompt(params); break;
      case 'scene': prompt = this.world.buildScenePrompt(params); break;
      default: return;
    }
    await this.handleSend(prompt);
  }

  private handleImagePrompt(subject: string): void {
    const g = GUARDIANS[this.guardianId];
    const prompt = this.world.buildImagePrompt(g, subject);
    this.post({ type: 'chunk', text: `**Image Prompt:**\n\n\`\`\`\n${prompt}\n\`\`\`\n\nCopy this prompt into your image generator.` });
    this.post({ type: 'done' });
  }

  private post(msg: ToWebview): void {
    this.view?.webview.postMessage(msg);
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#09090b;color:#e5e5e5;font-family:'Inter',system-ui,sans-serif;font-size:13px;display:flex;flex-direction:column;height:100vh;overflow:hidden}
.header{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;flex-shrink:0}
.header select{background:#1a1a1e;color:#e5e5e5;border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:4px 8px;font-size:11px;outline:none}
.badge{font-size:10px;padding:2px 6px;border-radius:3px;background:rgba(0,188,212,0.15);color:#00bcd4}
.badge.file{background:rgba(255,215,0,0.12);color:#ffd700}
.toolbar{padding:4px 12px;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:4px;flex-shrink:0;flex-wrap:wrap}
.toolbar button{background:rgba(255,255,255,0.05);color:#a3a3a3;border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:3px 8px;font-size:10px;cursor:pointer;transition:all 0.15s}
.toolbar button:hover{background:rgba(0,188,212,0.12);color:#00bcd4;border-color:rgba(0,188,212,0.3)}
.messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.msg{padding:8px 10px;border-radius:8px;max-width:95%;line-height:1.5;white-space:pre-wrap;word-break:break-word}
.msg.user{background:rgba(0,188,212,0.1);border:1px solid rgba(0,188,212,0.2);align-self:flex-end}
.msg.assistant{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);align-self:flex-start}
.msg.error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#ef4444;align-self:flex-start}
.msg code{background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:12px}
.msg pre{background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;overflow-x:auto;margin:4px 0}
.msg pre code{background:none;padding:0}
.input-area{padding:8px 12px;border-top:1px solid rgba(255,255,255,0.06);flex-shrink:0;display:flex;gap:6px}
.input-area textarea{flex:1;background:#1a1a1e;color:#e5e5e5;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px;font-family:inherit;font-size:13px;resize:none;outline:none;min-height:36px;max-height:120px}
.input-area textarea:focus{border-color:rgba(0,188,212,0.4)}
.input-area button{background:#00bcd4;color:#09090b;border:none;border-radius:6px;padding:8px 12px;font-weight:600;cursor:pointer;font-size:12px;align-self:flex-end}
.input-area button:hover{background:#00a5bb}
.input-area button:disabled{opacity:0.4;cursor:default}
.setup{padding:24px;text-align:center}
.setup h2{color:#00bcd4;font-size:16px;margin-bottom:8px}
.setup p{color:#a3a3a3;font-size:12px;margin-bottom:16px}
.setup button{background:#00bcd4;color:#09090b;border:none;border-radius:6px;padding:8px 16px;font-weight:600;cursor:pointer}
.streaming .send-btn{opacity:0.4}
.gates{padding:2px 12px;display:flex;gap:4px;flex-shrink:0;flex-wrap:wrap}
.gate-chip{font-size:9px;padding:2px 6px;border-radius:10px;background:rgba(0,188,212,0.1);color:#00bcd4;border:1px solid rgba(0,188,212,0.2);text-transform:capitalize}
.follow-ups{padding:4px 12px;display:flex;gap:4px;flex-wrap:wrap}
.follow-up{font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(255,255,255,0.05);color:#a3a3a3;border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:all 0.15s}
.follow-up:hover{background:rgba(0,188,212,0.1);color:#00bcd4;border-color:rgba(0,188,212,0.3)}
</style>
</head>
<body>
<div class="header">
  <select id="guardian-select">
    ${GUARDIAN_ORDER.map(id => {
      const g = GUARDIANS[id];
      return `<option value="${id}">${g.name} — ${g.domain}</option>`;
    }).join('\n    ')}
  </select>
  <span class="badge" id="provider-badge"></span>
  <span class="badge file" id="file-badge" style="display:none"></span>
</div>
<div class="toolbar">
  <button onclick="wb('character')">Character</button>
  <button onclick="wb('realm')">Realm</button>
  <button onclick="wb('artifact')">Artifact</button>
  <button onclick="wb('scene')">Scene</button>
  <button onclick="imgPrompt()">Image</button>
</div>
<div class="gates" id="gates"></div>
<div class="messages" id="messages"></div>
<div class="follow-ups" id="follow-ups"></div>
<div class="input-area">
  <textarea id="input" placeholder="Chat with your Guardian..." rows="1"></textarea>
  <button class="send-btn" id="send-btn" onclick="send()">Send</button>
</div>
<div class="setup" id="setup" style="display:none">
  <h2>Set Your API Key</h2>
  <p>Arcanea needs an AI provider key to power the chat.<br>Your key is stored securely in VS Code's SecretStorage.</p>
  <button onclick="vscode.postMessage({type:'setkey'})">Set API Key</button>
</div>
<script>
const vscode = acquireVsCodeApi();
const msgsEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');
const setupEl = document.getElementById('setup');
const guardianSel = document.getElementById('guardian-select');
const providerBadge = document.getElementById('provider-badge');
const fileBadge = document.getElementById('file-badge');
const gatesEl = document.getElementById('gates');
const followUpsEl = document.getElementById('follow-ups');
let streaming = false;
let currentAssistant = null;

guardianSel.addEventListener('change', () => {
  vscode.postMessage({ type: 'guardian', id: guardianSel.value });
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
});

inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
});

function send() {
  const text = inputEl.value.trim();
  if (!text || streaming) return;
  addMsg('user', text);
  vscode.postMessage({ type: 'send', text });
  inputEl.value = '';
  inputEl.style.height = 'auto';
  streaming = true;
  sendBtn.disabled = true;
}

function wb(kind) {
  const params = {};
  let prompt = '';
  switch (kind) {
    case 'character':
      prompt = 'Create a detailed character for my world';
      break;
    case 'realm':
      prompt = 'Design a realm or location for my world';
      break;
    case 'artifact':
      prompt = 'Create a magical artifact for my world';
      break;
    case 'scene':
      prompt = 'Write a scene set in my world';
      break;
  }
  vscode.postMessage({ type: 'worldBuild', kind, params });
}

function sendFollowUp(text) {
  if (streaming) return;
  followUpsEl.innerHTML = '';
  addMsg('user', text);
  vscode.postMessage({ type: 'followUp', text });
  streaming = true;
  sendBtn.disabled = true;
}

function imgPrompt() {
  const subject = inputEl.value.trim() || 'a mystical landscape';
  vscode.postMessage({ type: 'imagePrompt', subject });
  inputEl.value = '';
}

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = text;
  msgsEl.appendChild(div);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return div;
}

window.addEventListener('message', (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'chunk':
      if (!currentAssistant) {
        currentAssistant = addMsg('assistant', '');
      }
      currentAssistant.textContent += msg.text;
      msgsEl.scrollTop = msgsEl.scrollHeight;
      break;
    case 'done':
      // Extract [FOLLOW_UP] chips from the response
      if (currentAssistant) {
        const text = currentAssistant.textContent || '';
        const followUps = [];
        const lines = text.split('\\n');
        const cleanLines = [];
        for (const line of lines) {
          if (line.startsWith('[FOLLOW_UP]')) {
            followUps.push(line.replace('[FOLLOW_UP]', '').trim());
          } else {
            cleanLines.push(line);
          }
        }
        if (followUps.length > 0) {
          currentAssistant.textContent = cleanLines.join('\\n');
          followUpsEl.innerHTML = followUps.map(f =>
            '<button class="follow-up" onclick="sendFollowUp(\\''+f.replace(/'/g,"\\\\'")+'\\')">'+f+'</button>'
          ).join('');
        }
      }
      currentAssistant = null;
      streaming = false;
      sendBtn.disabled = false;
      break;
    case 'error':
      addMsg('error', msg.message);
      currentAssistant = null;
      streaming = false;
      sendBtn.disabled = false;
      break;
    case 'guardian':
      guardianSel.value = msg.id;
      break;
    case 'fileCtx':
      fileBadge.textContent = msg.name;
      fileBadge.style.display = '';
      break;
    case 'provider':
      providerBadge.textContent = msg.name + ' / ' + msg.model;
      setupEl.style.display = 'none';
      break;
    case 'gates':
      gatesEl.innerHTML = msg.active.map(g => '<span class="gate-chip">' + g + '</span>').join('') +
        msg.domains.map(d => '<span class="gate-chip" style="opacity:0.5">' + d + '</span>').join('');
      break;
    case 'needsKey':
      setupEl.style.display = '';
      break;
  }
});

vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`;
  }
}
