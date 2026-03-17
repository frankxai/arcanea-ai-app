/**
 * Arc Protocol — Core Operations
 *
 * Create, parse, validate, advance, and bond .arc files.
 * Works in Node.js, browser, and any AI agent runtime.
 */

import type { Arc, ArcType, ArcStage, ArcAPL, ArcHistoryEntry, ArcBond, Palette } from './types';

// ── ID Generation ────────────────────────────────────────────────────────────

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
function nanoid(len = 8): string {
  let id = '';
  for (let i = 0; i < len; i++) id += CHARS[Math.floor(Math.random() * CHARS.length)];
  return id;
}

export function createId(prefix: 'arc' | 'nea' = 'arc'): string {
  return `${prefix}_${nanoid(8)}`;
}

// ── Create ───────────────────────────────────────────────────────────────────

export interface CreateArcOptions {
  type: ArcType;
  creator: string;
  spark?: string;
  palette?: Palette;
  sharpen?: string[];
  tags?: string[];
  gate?: number;
  element?: string;
}

export function createArc(options: CreateArcOptions): Arc {
  const id = createId('arc');
  const now = new Date().toISOString();

  const arc: Arc = {
    arc: '1.0',
    id,
    type: options.type,
    stage: 'potential',
    created: now,
    creator: options.creator,
  };

  if (options.spark || options.palette || options.sharpen) {
    arc.apl = {
      spark: options.spark || '',
      palette: options.palette,
      sharpen: options.sharpen,
    };
  }

  arc.history = [{
    stage: 'potential',
    at: now,
    input: options.spark,
  }];

  if (options.tags) arc.tags = options.tags;
  if (options.gate !== undefined) arc.gate = options.gate;
  if (options.element) arc.element = options.element;

  return arc;
}

// ── Stage Advancement ────────────────────────────────────────────────────────

const STAGE_ORDER: ArcStage[] = ['potential', 'manifestation', 'experience', 'dissolution', 'evolved'];

export function advanceStage(arc: Arc, entry: Omit<ArcHistoryEntry, 'stage'>): Arc {
  const currentIdx = STAGE_ORDER.indexOf(arc.stage);
  if (currentIdx >= STAGE_ORDER.length - 1) {
    // Already at 'evolved' — start a new cycle
    return {
      ...arc,
      stage: 'potential',
      updated: new Date().toISOString(),
      history: [...(arc.history || []), { ...entry, stage: 'potential' }],
    };
  }

  const nextStage = STAGE_ORDER[currentIdx + 1];
  return {
    ...arc,
    stage: nextStage,
    updated: new Date().toISOString(),
    history: [...(arc.history || []), { ...entry, stage: nextStage }],
  };
}

// ── Bonding ──────────────────────────────────────────────────────────────────

export function bond(arc: Arc, newBond: ArcBond): Arc {
  const existing = arc.bonds || [];
  // Prevent duplicate bonds
  if (existing.some(b => b.target === newBond.target && b.relation === newBond.relation)) {
    return arc;
  }
  return {
    ...arc,
    bonds: [...existing, newBond],
    updated: new Date().toISOString(),
  };
}

// ── Agent Context ────────────────────────────────────────────────────────────

/**
 * Generate a prompt context block from an arc file.
 * Any AI agent can use this to continue the creation.
 */
export function toAgentContext(arc: Arc): string {
  const lines: string[] = [];

  lines.push(`[ARC CONTEXT — ${arc.type}: ${arc.id}]`);
  lines.push(`Stage: ${arc.stage}`);
  lines.push(`Creator: ${arc.creator}`);

  if (arc.apl) {
    if (arc.apl.spark) lines.push(`SPARK: ${arc.apl.spark}`);
    if (arc.apl.palette) lines.push(`PALETTE: ${arc.apl.palette.toUpperCase()}`);
    if (arc.apl.sharpen?.length) {
      lines.push(`SHARPEN: ${arc.apl.sharpen.map(s => `NOT ${s}`).join('. ')}`);
    }
  }

  if (arc.agent) {
    lines.push('');
    lines.push(`CONTEXT: ${arc.agent.context}`);
    if (arc.agent.next_step) lines.push(`NEXT: ${arc.agent.next_step}`);
    if (arc.agent.constraints?.length) {
      lines.push(`CONSTRAINTS:`);
      arc.agent.constraints.forEach(c => lines.push(`  - ${c}`));
    }
  }

  if (arc.bonds?.length) {
    lines.push('');
    lines.push(`BONDS: ${arc.bonds.map(b => `${b.relation} → ${b.target}`).join(', ')}`);
  }

  const lastHistory = arc.history?.[arc.history.length - 1];
  if (lastHistory?.model) {
    lines.push(`Last model: ${lastHistory.model}`);
  }

  return lines.join('\n');
}

// ── Serialization ────────────────────────────────────────────────────────────

/**
 * Serialize an Arc to YAML frontmatter + markdown body
 */
export function serialize(arc: Arc): string {
  const { body, ...meta } = arc;
  const yaml = toYaml(meta);
  if (body) {
    return `---\n${yaml}---\n\n${body}\n`;
  }
  return `---\n${yaml}---\n`;
}

/**
 * Parse a .arc file string into an Arc object
 */
export function parse(content: string): Arc {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) throw new Error('Invalid .arc file: no frontmatter found');

  const yaml = fmMatch[1];
  const body = content.slice(fmMatch[0].length).trim() || undefined;

  const arc = fromYaml(yaml) as unknown as Arc;
  if (body) arc.body = body;

  return arc;
}

// ── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validate(arc: Arc): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (arc.arc !== '1.0') errors.push(`Unknown arc version: ${arc.arc}`);
  if (!arc.id) errors.push('Missing id');
  if (!arc.type) errors.push('Missing type');
  if (!arc.stage) errors.push('Missing stage');
  if (!arc.created) errors.push('Missing created timestamp');
  if (!arc.creator) errors.push('Missing creator');

  if (!STAGE_ORDER.includes(arc.stage)) {
    errors.push(`Invalid stage: ${arc.stage}`);
  }

  if (arc.apl && !arc.apl.spark) {
    warnings.push('APL block exists but spark is empty');
  }

  if (arc.stage !== 'potential' && (!arc.history || arc.history.length === 0)) {
    warnings.push('Arc is past potential stage but has no history');
  }

  if (arc.gate !== undefined && (arc.gate < 1 || arc.gate > 10)) {
    errors.push(`Gate must be 1-10, got ${arc.gate}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ── Simple YAML helpers (no dependency) ──────────────────────────────────────

function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent);
  let result = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string') {
      if (value.includes('\n') || value.length > 80) {
        result += `${pad}${key}: |\n${value.split('\n').map(l => `${pad}  ${l}`).join('\n')}\n`;
      } else {
        result += `${pad}${key}: "${value.replace(/"/g, '\\"')}"\n`;
      }
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result += `${pad}${key}: ${value}\n`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (typeof value[0] === 'string') {
        result += `${pad}${key}:\n`;
        value.forEach(v => { result += `${pad}  - "${v}"\n`; });
      } else {
        result += `${pad}${key}:\n`;
        value.forEach(v => {
          result += `${pad}  - `;
          const inner = toYaml(v as Record<string, unknown>, indent + 2).trim();
          result += inner.replace(/\n/g, `\n${pad}    `) + '\n';
        });
      }
    } else if (typeof value === 'object') {
      result += `${pad}${key}:\n`;
      result += toYaml(value as Record<string, unknown>, indent + 1);
    }
  }

  return result;
}

function fromYaml(yaml: string): Record<string, unknown> {
  // Minimal YAML parser for .arc files — handles the subset we generate
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)([\w_]+):\s*(.*)/);
    if (!match) { i++; continue; }

    const [, spaces, key, rawValue] = match;
    const indent = spaces.length;
    const value = rawValue.trim();

    if (value === '' || value === '|') {
      // Could be object, array, or multiline string
      const children: string[] = [];
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextIndent = nextLine.match(/^(\s*)/)?.[1].length ?? 0;
        if (nextIndent <= indent && nextLine.trim() !== '') break;
        children.push(nextLine);
        i++;
      }

      if (children.length > 0 && children[0].trim().startsWith('-')) {
        // Array
        const items: unknown[] = [];
        let item = '';
        for (const child of children) {
          const trimmed = child.trim();
          if (trimmed.startsWith('- ')) {
            if (item) items.push(item.startsWith('"') ? item.slice(1, -1) : item);
            item = trimmed.slice(2).trim();
          } else if (trimmed.startsWith('-')) {
            if (item) items.push(item);
            item = '';
          } else {
            item += ' ' + trimmed;
          }
        }
        if (item) items.push(item.startsWith('"') ? item.slice(1, -1) : item);
        result[key] = items;
      } else if (value === '|') {
        result[key] = children.map(c => c.trim()).join('\n');
      } else {
        // Nested object — recurse
        result[key] = fromYaml(children.join('\n'));
      }
    } else {
      // Simple value
      let parsed: unknown = value;
      if (value.startsWith('"') && value.endsWith('"')) {
        parsed = value.slice(1, -1);
      } else if (value === 'true') parsed = true;
      else if (value === 'false') parsed = false;
      else if (value === 'null') parsed = null;
      else if (/^\d+$/.test(value)) parsed = parseInt(value, 10);
      else if (/^\d+\.\d+$/.test(value)) parsed = parseFloat(value);

      result[key] = parsed;
      i++;
    }
  }

  return result;
}
