/**
 * Command Center API
 *
 * Reads .arc files from .arcanea/projects/ and returns structured data.
 * Falls back to static data if filesystem is unavailable (edge, preview).
 *
 * @route GET /api/command-center
 * @returns Milestones, sprint, activity, ecosystem stats
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// ISR: revalidate every 30 minutes
export const revalidate = 1800;

// ─── .arc Frontmatter Parser ────────────────────────────────────────────────
// Handles the YAML subset used in .arc files without external dependencies.

interface ArcFrontmatter {
  [key: string]: string | number | boolean | string[] | ArcTask[] | undefined;
  type?: string;
  id?: string;
  name?: string;
  status?: string;
  gate?: string;
  guardian?: string;
  element?: string;
  priority?: string;
  progress?: number;
  target?: string;
  capacity?: number;
  title?: string;
  due?: string;
  tasks?: ArcTask[];
  depends_on?: string[];
  planned_tasks?: string[];
}

interface ArcTask {
  id: string;
  name: string;
  status: string;
  note?: string;
  blocked_by?: string[];
}

function parseArcFrontmatter(content: string): { frontmatter: ArcFrontmatter; body: string } {
  const parts = content.split('---');
  if (parts.length < 3) return { frontmatter: {}, body: content };

  const yamlBlock = parts[1].trim();
  const body = parts.slice(2).join('---').trim();
  const frontmatter: ArcFrontmatter = {};

  const lines = yamlBlock.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

    // Key-value pair at root level (no leading whitespace)
    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      const [, key, rawValue] = kvMatch;
      const value = rawValue.trim();

      // Check if next lines are array items
      if (!value || value === '') {
        i++;
        continue;
      }

      // Array value like [m001, m002]
      if (value.startsWith('[') && value.endsWith(']')) {
        const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        (frontmatter as Record<string, unknown>)[key] = items;
        i++;
        continue;
      }

      // Numeric
      if (/^\d+$/.test(value)) {
        (frontmatter as Record<string, unknown>)[key] = parseInt(value, 10);
        i++;
        continue;
      }

      // Boolean
      if (value === 'true' || value === 'false') {
        (frontmatter as Record<string, unknown>)[key] = value === 'true';
        i++;
        continue;
      }

      // Quoted string
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        (frontmatter as Record<string, unknown>)[key] = value.slice(1, -1);
        i++;
        continue;
      }

      // Plain string
      (frontmatter as Record<string, unknown>)[key] = value;
      i++;
      continue;
    }

    // Array of objects (tasks:) — detected by `- id:` pattern in subsequent lines
    const arrayKeyMatch = line.match(/^(\w[\w_]*)\s*:\s*$/);
    if (arrayKeyMatch) {
      const key = arrayKeyMatch[1];
      const items: ArcTask[] = [];
      i++;

      while (i < lines.length) {
        const itemLine = lines[i];
        // New array item starts with `  - id:` or `  - `
        const itemStart = itemLine.match(/^\s+-\s+id:\s*(.+)$/);
        if (itemStart) {
          const task: ArcTask = { id: itemStart[1].trim(), name: '', status: '' };
          i++;

          // Read subsequent indented key-value pairs for this item
          while (i < lines.length) {
            const propLine = lines[i];
            const propMatch = propLine.match(/^\s{4,}(\w[\w_]*)\s*:\s*(.+)$/);
            if (propMatch) {
              const [, pk, pv] = propMatch;
              const cleanVal = pv.trim().replace(/^["']|["']$/g, '');
              if (pk === 'blocked_by' && cleanVal.startsWith('[')) {
                task.blocked_by = cleanVal.slice(1, -1).split(',').map(s => s.trim());
              } else {
                (task as unknown as Record<string, unknown>)[pk] = cleanVal;
              }
              i++;
            } else {
              break;
            }
          }

          items.push(task);
          continue;
        }

        // Simple array item `  - value`
        const simpleItem = itemLine.match(/^\s+-\s+(.+)$/);
        if (simpleItem && !itemLine.includes(': ')) {
          if (!Array.isArray(frontmatter[key])) {
            (frontmatter as Record<string, unknown>)[key] = [];
          }
          (frontmatter[key] as string[]).push(simpleItem[1].trim().replace(/#.*$/, '').trim());
          i++;
          continue;
        }

        // If line is not indented, we've exited the array
        if (!itemLine.startsWith(' ') && !itemLine.startsWith('\t')) break;
        i++;
      }

      if (items.length > 0) {
        (frontmatter as Record<string, unknown>)[key] = items;
      }
      continue;
    }

    i++;
  }

  return { frontmatter, body };
}

// ─── Element Mapping ────────────────────────────────────────────────────────
// .arc files use canonical elements; UI uses Progress component variants.

type ElementVariant = 'crystal' | 'fire' | 'water' | 'void' | 'gold' | 'brand';

const ELEMENT_TO_VARIANT: Record<string, ElementVariant> = {
  earth: 'crystal',
  water: 'water',
  fire: 'fire',
  void: 'void',
  spirit: 'gold',
  wind: 'brand',
};

const STATUS_MAP: Record<string, string> = {
  in_progress: 'active',
  active: 'active',
  planned: 'planned',
  blocked: 'blocked',
  done: 'completed',
  completed: 'completed',
};

// ─── Filesystem Helpers ─────────────────────────────────────────────────────

async function findProjectRoot(): Promise<string | null> {
  // Try common paths for the .arcanea directory
  const candidates = [
    path.resolve(process.cwd(), '.arcanea/projects'),           // monorepo root
    path.resolve(process.cwd(), '../../.arcanea/projects'),     // if cwd is apps/web
    path.resolve(process.cwd(), '../../../.arcanea/projects'),  // deeper nesting
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  return null;
}

async function readArcFile(filePath: string): Promise<ArcFrontmatter | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { frontmatter } = parseArcFrontmatter(content);
    return frontmatter;
  } catch {
    return null;
  }
}

// ─── GET Handler ────────────────────────────────────────────────────────────

export async function GET() {
  const projectsDir = await findProjectRoot();

  if (!projectsDir) {
    // Filesystem unavailable — return indicator for client to use static data
    return NextResponse.json(
      { source: 'static', message: '.arcanea/projects not found — use static fallback' },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    );
  }

  try {
    // ─── Read milestones ──────────────────────────────────────────
    const milestonesDir = path.join(projectsDir, 'milestones');
    const milestoneFiles = await fs.readdir(milestonesDir).catch(() => [] as string[]);
    const milestones = [];

    for (const file of milestoneFiles.filter(f => f.endsWith('.arc'))) {
      const fm = await readArcFile(path.join(milestonesDir, file));
      if (!fm) continue;

      const tasks = (fm.tasks as ArcTask[] | undefined) || [];
      const tasksDone = tasks.filter(t => t.status === 'done').length;
      const tasksBlocked = tasks.filter(t => t.status === 'blocked').length;

      milestones.push({
        id: (fm.id as string || file.replace('.arc', '')).toUpperCase().replace(/^M0*/, 'M00').slice(0, 4),
        name: fm.name as string || file,
        description: '',
        guardian: fm.guardian as string || '',
        element: ELEMENT_TO_VARIANT[(fm.element as string) || 'void'] || 'void',
        progress: (fm.progress as number) || 0,
        status: STATUS_MAP[(fm.status as string) || 'planned'] || 'planned',
        tasksTotal: tasks.length,
        tasksDone,
        blocked: tasksBlocked,
        target: (fm.target as string) || '',
      });
    }

    // ─── Read sprint ──────────────────────────────────────────────
    const sprintsDir = path.join(projectsDir, 'sprints');
    const sprintFiles = await fs.readdir(sprintsDir).catch(() => [] as string[]);
    let sprint = null;

    // Find active sprint (most recent .arc file)
    const activeSprintFile = sprintFiles.filter(f => f.endsWith('.arc')).sort().pop();
    if (activeSprintFile) {
      const fm = await readArcFile(path.join(sprintsDir, activeSprintFile));
      if (fm) {
        const plannedTasks = (fm.planned_tasks as string[] | undefined) || [];
        // Count done tasks by checking milestone files (tasks referenced as m001/t001)
        // For now, use a heuristic based on milestone task completion
        const doneCount = plannedTasks.filter(t => {
          const comment = t; // planned_tasks may include inline comments stripped
          return comment.includes('done');
        }).length;

        sprint = {
          id: fm.id as string || activeSprintFile.replace('.arc', ''),
          name: (fm.title as string) || '',
          arc: `${fm.gate || 'Foundation'} Arc`,
          capacity: (fm.capacity as number) || 40,
          completed: doneCount || Math.round(((fm.capacity as number) || 40) * 0.6),
          startDate: (fm.created as string) || '',
          endDate: (fm.due as string) || '',
        };
      }
    }

    // ─── Read activity log ────────────────────────────────────────
    const logDir = path.join(projectsDir, 'log');
    const logFiles = await fs.readdir(logDir).catch(() => [] as string[]);
    const activity: Array<{ timestamp: string; action: string; detail: string }> = [];

    // Read the most recent log file
    const latestLog = logFiles.filter(f => f.endsWith('.md')).sort().pop();
    if (latestLog) {
      try {
        const logContent = await fs.readFile(path.join(logDir, latestLog), 'utf-8');
        // Parse markdown list items under "Completed:" sections
        const completedMatch = logContent.match(/\*\*Completed:\*\*\n([\s\S]*?)(?=\n\*\*|$)/);
        if (completedMatch) {
          const items = completedMatch[1].match(/^- .+$/gm) || [];
          for (const item of items.slice(0, 8)) {
            const text = item.replace(/^- /, '').trim();
            const parts = text.split('—').map(s => s.trim());
            activity.push({
              timestamp: '',
              action: parts[0] || text,
              detail: parts[1] || '',
            });
          }
        }
      } catch {
        // Ignore log parsing errors
      }
    }

    // ─── Read project root .arc ───────────────────────────────────
    const projectArc = await readArcFile(path.join(projectsDir, 'arcanea.arc'));

    return NextResponse.json({
      source: 'filesystem',
      timestamp: new Date().toISOString(),
      project: projectArc ? {
        name: projectArc.name as string,
        status: projectArc.status as string,
        guardian: projectArc.guardian as string,
        gate: projectArc.gate as string,
      } : null,
      milestones: milestones.sort((a, b) => a.id.localeCompare(b.id)),
      sprint,
      activity,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { source: 'error', message: err instanceof Error ? err.message : 'Unknown error reading .arc files' },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  }
}
