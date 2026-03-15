import * as vscode from 'vscode';
import { GuardianStatusBar } from './status-bar';
import { ChatProvider } from './chat-provider';
import { AiService } from './ai-service';
import { FileService } from './file-service';
import { WorldService } from './world-service';
import { TerminalService } from './terminal-service';
import { GateProgressProvider } from './gate-progress';
import { LoreExplorerProvider } from './lore-explorer';
import { GUARDIANS, GUARDIAN_ORDER, routeToGuardian } from './guardians';

let statusBar: GuardianStatusBar;
let chatProvider: ChatProvider;
let gateProgress: GateProgressProvider;

export function activate(context: vscode.ExtensionContext): void {
  // ── Status Bar ──────────────────────────────────────────────────────────
  statusBar = new GuardianStatusBar();
  context.subscriptions.push(statusBar);

  // ── Services ────────────────────────────────────────────────────────────
  const aiService = new AiService(context);
  const fileService = new FileService();
  const worldService = new WorldService();
  const terminalService = new TerminalService();

  // ── Sidebar Providers ───────────────────────────────────────────────────
  chatProvider = new ChatProvider(context.extensionUri, aiService, fileService, worldService, terminalService);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('arcanea.guardianPanel', chatProvider)
  );

  gateProgress = new GateProgressProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('arcanea.gateProgress', gateProgress)
  );

  const loreExplorer = new LoreExplorerProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('arcanea.loreExplorer', loreExplorer)
  );

  // ── Commands ─────────────────────────────────────────────────────────────
  context.subscriptions.push(

    // Internal: status bar update (called from webview message handler)
    vscode.commands.registerCommand('arcanea.updateStatusBar', (guardianId: string) => {
      statusBar.update(guardianId);
      chatProvider.setGuardian(guardianId);
    }),

    // Route to Guardian — auto-detect or pick
    vscode.commands.registerCommand('arcanea.routeGuardian', async () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.selection;
      const text = selection && !selection.isEmpty
        ? editor.document.getText(selection)
        : undefined;

      if (text) {
        const result = routeToGuardian(text);
        const g = GUARDIANS[result.guardian];
        statusBar.update(result.guardian);
        chatProvider.setGuardian(result.guardian);
        vscode.window.showInformationMessage(
          `Routed to ${g.name} (${Math.round(result.confidence * 100)}% confidence) — ${g.domain}`
        );
      } else {
        const items = GUARDIAN_ORDER.map(id => {
          const g = GUARDIANS[id];
          return { label: g.name, description: g.domain, detail: `${g.element} · ${g.frequency}`, id };
        });
        const pick = await vscode.window.showQuickPick(items, { placeHolder: 'Choose a Guardian' });
        if (pick) {
          statusBar.update(pick.id);
          chatProvider.setGuardian(pick.id);
          vscode.window.showInformationMessage(`Switched to ${pick.label}`);
        }
      }
    }),

    // Cycle Guardian
    vscode.commands.registerCommand('arcanea.cycleGuardian', () => {
      const config = vscode.workspace.getConfiguration('arcanea');
      const current = config.get<string>('activeGuardian') || 'shinkami';
      const idx = GUARDIAN_ORDER.indexOf(current);
      const next = GUARDIAN_ORDER[(idx + 1) % GUARDIAN_ORDER.length];
      config.update('activeGuardian', next, vscode.ConfigurationTarget.Global);
      statusBar.update(next);
      chatProvider.setGuardian(next);
      const g = GUARDIANS[next];
      vscode.window.showInformationMessage(`Guardian: ${g.name} — ${g.domain}`);
    }),

    // Convene Council
    vscode.commands.registerCommand('arcanea.conveneCouncil', async () => {
      const editor = vscode.window.activeTextEditor;
      const text = editor?.selection && !editor.selection.isEmpty
        ? editor.document.getText(editor.selection)
        : await vscode.window.showInputBox({ prompt: 'Describe the challenge for the Council' });

      if (!text) { return; }

      const panel = vscode.window.createWebviewPanel(
        'arcanea.council', 'Guardian Council', vscode.ViewColumn.Beside,
        { enableScripts: true }
      );

      const perspectives = GUARDIAN_ORDER.map(id => {
        const g = GUARDIANS[id];
        const result = routeToGuardian(text);
        const isMatch = result.guardian === id;
        return { name: g.name, domain: g.domain, element: g.element, relevance: isMatch ? result.confidence : result.confidence * 0.3 };
      }).sort((a, b) => b.relevance - a.relevance).slice(0, 5);

      panel.webview.html = `<!DOCTYPE html>
<html><head><style>
  body { background: #09090b; color: #e5e5e5; font-family: 'Inter', system-ui, sans-serif; padding: 20px; }
  h1 { color: #00bcd4; font-size: 18px; }
  .guardian { background: rgba(0,188,212,0.08); border: 1px solid rgba(0,188,212,0.2); border-radius: 8px; padding: 12px; margin: 8px 0; }
  .guardian h3 { color: #00bcd4; margin: 0 0 4px; font-size: 14px; }
  .guardian p { margin: 0; font-size: 12px; color: #a3a3a3; }
  .relevance { float: right; color: #ffd700; font-size: 12px; }
</style></head><body>
<h1>Guardian Council</h1>
<p style="color:#a3a3a3;font-size:13px;margin-bottom:16px;">"${text.slice(0, 200)}"</p>
${perspectives.map(p => `
<div class="guardian">
  <h3>${p.name} <span class="relevance">${Math.round(p.relevance * 100)}%</span></h3>
  <p>${p.domain} · ${p.element}</p>
</div>`).join('')}
</body></html>`;
    }),

    // Check Voice (Voice Bible v2.0)
    vscode.commands.registerCommand('arcanea.checkVoice', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.selection.isEmpty) {
        vscode.window.showWarningMessage('Select text to check voice alignment.');
        return;
      }
      const text = editor.document.getText(editor.selection);

      const rules = [
        { pattern: /\bjust\b/gi, msg: 'Avoid "just" — it diminishes' },
        { pattern: /\bsimply\b/gi, msg: 'Avoid "simply" — it oversimplifies' },
        { pattern: /\bobviously\b/gi, msg: 'Avoid "obviously" — it alienates' },
        { pattern: /\bbasically\b/gi, msg: 'Avoid "basically" — it reduces' },
        { pattern: /\breally\b/gi, msg: 'Avoid "really" — be precise instead' },
        { pattern: /\bvery\b/gi, msg: 'Avoid "very" — use stronger words' },
        { pattern: /!{2,}/g, msg: 'Multiple exclamation marks — one is enough' },
        { pattern: /\b(amazing|awesome|incredible)\b/gi, msg: 'Generic superlatives — be specific' },
        { pattern: /\bsynergy\b/gi, msg: 'Corporate jargon — use natural language' },
        { pattern: /\bleverage\b/gi, msg: 'Corporate jargon — say "use" or "build on"' },
        { pattern: /\bparadigm\b/gi, msg: 'Academic jargon — be concrete' },
        { pattern: /\bpivot\b/gi, msg: 'Startup jargon — say "shift" or "change"' },
        { pattern: /\bdisrupt\b/gi, msg: 'Buzzword — describe the actual change' },
        { pattern: /\b(utilize|utilization)\b/gi, msg: 'Say "use" instead' },
        { pattern: /\b(in order to)\b/gi, msg: 'Say "to" instead' },
        { pattern: /\b(at the end of the day)\b/gi, msg: 'Cliche — be direct' },
        { pattern: /\b(game.?changer)\b/gi, msg: 'Overused — describe the specific impact' },
        { pattern: /\b(best.?in.?class)\b/gi, msg: 'Marketing speak — show, don\'t tell' },
        { pattern: /\b(empower)\b/gi, msg: 'Vague — describe the specific capability' },
        { pattern: /\b(deep dive)\b/gi, msg: 'Say "examine" or "explore"' },
        { pattern: /\b(low.?hanging fruit)\b/gi, msg: 'Cliche — name the specific opportunity' },
        { pattern: /\b(move the needle)\b/gi, msg: 'Vague — describe the specific metric' },
        { pattern: /\b(cutting.?edge)\b/gi, msg: 'Overused — describe what makes it new' },
      ];

      const findings: string[] = [];
      for (const rule of rules) {
        const matches = text.match(rule.pattern);
        if (matches) {
          findings.push(`${rule.msg} (${matches.length}x)`);
        }
      }

      const wordCount = text.split(/\s+/).length;
      const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
      const avgSentenceLen = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;
      if (avgSentenceLen > 25) {
        findings.push(`Average sentence length: ${avgSentenceLen} words — aim for 15-20`);
      }

      if (findings.length === 0) {
        vscode.window.showInformationMessage('Voice check passed — text aligns with Arcanea voice.');
      } else {
        const panel = vscode.window.createWebviewPanel(
          'arcanea.voiceCheck', 'Voice Check', vscode.ViewColumn.Beside,
          { enableScripts: false }
        );
        panel.webview.html = `<!DOCTYPE html>
<html><head><style>
  body { background: #09090b; color: #e5e5e5; font-family: 'Inter', system-ui, sans-serif; padding: 20px; }
  h1 { color: #00bcd4; font-size: 18px; }
  .finding { background: rgba(255,215,0,0.08); border-left: 3px solid #ffd700; padding: 8px 12px; margin: 8px 0; font-size: 13px; }
  .stats { color: #a3a3a3; font-size: 12px; margin-top: 16px; }
</style></head><body>
<h1>Voice Bible v2.0 — Check Results</h1>
<p class="stats">${wordCount} words · ${sentenceCount} sentences · avg ${avgSentenceLen} words/sentence</p>
${findings.map(f => `<div class="finding">${f}</div>`).join('')}
</body></html>`;
      }
    }),

    // Query Lore
    vscode.commands.registerCommand('arcanea.queryLore', async () => {
      const query = await vscode.window.showInputBox({ prompt: 'Search Arcanea lore...' });
      if (!query) { return; }

      const loreIndex = [
        { term: 'lumina', text: 'Lumina — The First Light, Form-Giver, Creator. Source of all illumination and creative potential.' },
        { term: 'nero', text: 'Nero — The Primordial Darkness, Father of Potential. NOT evil — the fertile unknown from which all emerges.' },
        { term: 'fire', text: 'Fire Element — Energy, transformation, will. Colors: red, orange, gold. Guardian: Draconia.' },
        { term: 'water', text: 'Water Element — Flow, healing, memory. Colors: blue, silver, crystal. Guardian: Leyla.' },
        { term: 'earth', text: 'Earth Element — Stability, growth, structure. Colors: green, brown, stone. Guardian: Lyssandria.' },
        { term: 'wind', text: 'Wind Element — Freedom, speed, change. Colors: white, silver. Guardian: Maylinn.' },
        { term: 'void', text: 'Void Element — Nero\'s aspect: potential, mystery, the unformed. The Fifth Element duality with Spirit.' },
        { term: 'spirit', text: 'Spirit Element — Lumina\'s aspect: transcendence, consciousness, soul. The Fifth Element duality with Void.' },
        { term: 'malachar', text: 'Malachar — The Dark Lord. Formerly Malachar Lumenbright, First Eldrian Luminor. Rejected by Shinkami, fell into Hungry Void. Sealed in the Shadowfen.' },
        { term: 'foundation', text: 'Foundation Gate — 174 Hz. Guardian: Lyssandria / Kaelith. Domain: Earth, survival, infrastructure.' },
        { term: 'flow', text: 'Flow Gate — 285 Hz. Guardian: Leyla / Veloura. Domain: Creativity, emotion, design.' },
        { term: 'fire gate', text: 'Fire Gate — 396 Hz. Guardian: Draconia / Draconis. Domain: Power, will, execution.' },
        { term: 'heart', text: 'Heart Gate — 417 Hz. Guardian: Maylinn / Laeylinn. Domain: Love, healing, documentation.' },
        { term: 'voice', text: 'Voice Gate — 528 Hz. Guardian: Alera / Otome. Domain: Truth, expression, brand.' },
        { term: 'sight', text: 'Sight Gate — 639 Hz. Guardian: Lyria / Yumiko. Domain: Intuition, vision, strategy.' },
        { term: 'crown', text: 'Crown Gate — 741 Hz. Guardian: Aiyami / Sol. Domain: Enlightenment, wisdom.' },
        { term: 'starweave', text: 'Starweave Gate — 852 Hz. Guardian: Elara / Vaelith. Domain: Perspective, transformation, innovation.' },
        { term: 'unity', text: 'Unity Gate — 963 Hz. Guardian: Ino / Kyuro. Domain: Partnership, integration, APIs.' },
        { term: 'source', text: 'Source Gate — 1111 Hz. Guardian: Shinkami / Source. Domain: Meta-consciousness, orchestration.' },
        { term: 'apprentice', text: 'Apprentice rank — 0-2 Gates opened.' },
        { term: 'mage', text: 'Mage rank — 3-4 Gates opened.' },
        { term: 'master', text: 'Master rank — 5-6 Gates opened.' },
        { term: 'archmage', text: 'Archmage rank — 7-8 Gates opened.' },
        { term: 'luminor', text: 'Luminor rank — 9-10 Gates opened. The highest rank of creative mastery.' },
        { term: 'academy', text: 'The Seven Academy Houses: Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis.' },
        { term: 'arc', text: 'The Arc — The great cycle: Potential → Manifestation → Experience → Dissolution → Evolved Potential.' },
        { term: 'lyssandria', text: 'Lyssandria — Earth Guardian, Foundation Gate 174 Hz. Infrastructure, database, security. Godbeast: Kaelith.' },
        { term: 'leyla', text: 'Leyla — Water Guardian, Flow Gate 285 Hz. Design, UI/UX, animations. Godbeast: Veloura.' },
        { term: 'draconia', text: 'Draconia — Fire Guardian, Fire Gate 396 Hz. Execution, performance, shipping. Godbeast: Draconis.' },
        { term: 'maylinn', text: 'Maylinn — Air Guardian, Heart Gate 417 Hz. Documentation, community, empathy. Godbeast: Laeylinn.' },
        { term: 'alera', text: 'Alera — Voice Guardian, Voice Gate 528 Hz. Brand expression, naming, messaging. Godbeast: Otome.' },
        { term: 'lyria', text: 'Lyria — Sight Guardian, Sight Gate 639 Hz. Strategy, AI/ML, pattern recognition. Godbeast: Yumiko.' },
        { term: 'aiyami', text: 'Aiyami — Crown Guardian, Crown Gate 741 Hz. Wisdom, mentorship, knowledge. Godbeast: Sol.' },
        { term: 'elara', text: 'Elara — Starweave Guardian, Starweave Gate 852 Hz. Perspective, reframing, innovation. Godbeast: Vaelith.' },
        { term: 'ino', text: 'Ino — Unity Guardian, Unity Gate 963 Hz. Integration, APIs, collaboration. Godbeast: Kyuro.' },
        { term: 'shinkami', text: 'Shinkami — Source Guardian, Source Gate 1111 Hz. Meta-architecture, orchestration. Godbeast: Source.' },
        { term: 'shadow', text: 'Shadow — Corrupted Void. Not the same as natural darkness (Nero). The Dark Lord\'s perversion of the Void element.' },
        { term: 'eldrian', text: 'Eldrians — The ancient race of powerful creators who preceded current civilization. Malachar was the first Eldrian Luminor.' },
        { term: 'solfeggio', text: 'Extended Solfeggio frequencies: 174·285·396·417·528·639·741·852·963·1111 Hz — each gate resonates at its frequency.' },
      ];

      const q = query.toLowerCase();
      const results = loreIndex.filter(e => e.term.includes(q) || e.text.toLowerCase().includes(q));

      if (results.length === 0) {
        vscode.window.showInformationMessage(`No lore found for "${query}".`);
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        'arcanea.lore', `Lore: ${query}`, vscode.ViewColumn.Beside,
        { enableScripts: false }
      );
      panel.webview.html = `<!DOCTYPE html>
<html><head><style>
  body { background: #09090b; color: #e5e5e5; font-family: 'Inter', system-ui, sans-serif; padding: 20px; }
  h1 { color: #00bcd4; font-size: 18px; }
  .entry { background: rgba(0,188,212,0.06); border: 1px solid rgba(0,188,212,0.15); border-radius: 8px; padding: 12px; margin: 8px 0; font-size: 13px; line-height: 1.5; }
</style></head><body>
<h1>Lore: "${query}"</h1>
${results.map(r => `<div class="entry">${r.text}</div>`).join('')}
</body></html>`;
    }),

    // Show Design Tokens
    vscode.commands.registerCommand('arcanea.showDesignTokens', () => {
      const panel = vscode.window.createWebviewPanel(
        'arcanea.designTokens', 'Arcanea Design Tokens', vscode.ViewColumn.Beside,
        { enableScripts: false }
      );
      panel.webview.html = `<!DOCTYPE html>
<html><head><style>
  body { background: #09090b; color: #e5e5e5; font-family: 'Inter', system-ui, sans-serif; padding: 20px; }
  h1 { color: #00bcd4; font-size: 18px; margin-bottom: 16px; }
  h2 { color: #a3a3a3; font-size: 14px; margin-top: 20px; }
  .swatch { display: inline-flex; align-items: center; gap: 8px; margin: 4px 0; }
  .color { width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
  .label { font-size: 12px; font-family: 'JetBrains Mono', monospace; }
  .font-sample { margin: 8px 0; }
</style></head><body>
<h1>Arcanea Design System v5.0</h1>
<h2>Colors</h2>
<div class="swatch"><div class="color" style="background:#09090b"></div><span class="label">#09090b — Cosmic Void (bg)</span></div><br>
<div class="swatch"><div class="color" style="background:#00bcd4"></div><span class="label">#00bcd4 — Cyan (primary)</span></div><br>
<div class="swatch"><div class="color" style="background:#0d47a1"></div><span class="label">#0d47a1 — Ultramarine (secondary)</span></div><br>
<div class="swatch"><div class="color" style="background:#ffd700"></div><span class="label">#ffd700 — Gold (accent)</span></div><br>
<div class="swatch"><div class="color" style="background:#00897b"></div><span class="label">#00897b — Peacock (gradient)</span></div><br>
<div class="swatch"><div class="color" style="background:#e5e5e5"></div><span class="label">#e5e5e5 — Light Gray (text)</span></div><br>
<div class="swatch"><div class="color" style="background:#a3a3a3"></div><span class="label">#a3a3a3 — Mid Gray (muted)</span></div><br>
<h2>Typography</h2>
<div class="font-sample" style="font-family:'Space Grotesk',system-ui;font-size:20px;color:#00bcd4;">Space Grotesk — Display</div>
<div class="font-sample" style="font-family:'Inter',system-ui;font-size:14px;">Inter — Body & UI</div>
<div class="font-sample" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#a3a3a3;">JetBrains Mono — Code</div>
<h2>Glass Tiers</h2>
<div class="label">glass-1: rgba(9,9,11,0.4) blur(8px)<br>glass-2: rgba(9,9,11,0.6) blur(12px)<br>glass-3: rgba(9,9,11,0.8) blur(16px)</div>
</body></html>`;
    }),

    // Open Gate
    vscode.commands.registerCommand('arcanea.openGate', async () => {
      const config = vscode.workspace.getConfiguration('arcanea');
      const opened = config.get<string[]>('openedGates') || [];
      const gates = [
        'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
        'Sight', 'Crown', 'Starweave', 'Unity', 'Source'
      ];
      const available = gates.filter(g => !opened.includes(g));

      if (available.length === 0) {
        vscode.window.showInformationMessage('All Gates opened! You have reached Luminor rank.');
        return;
      }

      const pick = await vscode.window.showQuickPick(
        available.map(g => ({ label: g, description: opened.includes(g) ? 'Opened' : 'Sealed' })),
        { placeHolder: `Open a Gate (${opened.length}/10 opened — ${getRank(opened.length)})` }
      );

      if (pick) {
        const updated = [...opened, pick.label];
        await config.update('openedGates', updated, vscode.ConfigurationTarget.Global);
        gateProgress.refresh();
        vscode.window.showInformationMessage(
          `${pick.label} Gate opened! (${updated.length}/10 — ${getRank(updated.length)})`
        );
      }
    }),

    // Set API Key
    vscode.commands.registerCommand('arcanea.setApiKey', async () => {
      const key = await vscode.window.showInputBox({
        prompt: 'Enter your AI API key (stored securely in VS Code SecretStorage)',
        password: true,
        placeHolder: 'sk-... or AIza...',
      });
      if (key) {
        await aiService.setApiKey(key);
        chatProvider.refresh();
        vscode.window.showInformationMessage('API key saved securely.');
      }
    }),
  );

  // ── Initialize Status Bar ───────────────────────────────────────────────
  const activeGuardian = vscode.workspace.getConfiguration('arcanea').get<string>('activeGuardian') || 'shinkami';
  statusBar.update(activeGuardian);
}

function getRank(gates: number): string {
  if (gates >= 9) return 'Luminor';
  if (gates >= 7) return 'Archmage';
  if (gates >= 5) return 'Master';
  if (gates >= 3) return 'Mage';
  return 'Apprentice';
}

export function deactivate(): void {}
