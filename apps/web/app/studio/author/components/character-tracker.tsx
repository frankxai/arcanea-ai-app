/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

interface CharacterInfo {
  name: string;
  filename: string;
  role?: string;
  mentioned: boolean;
}

async function detectCharacters(bookSlug: string, chapterContent: string): Promise<CharacterInfo[]> {
  const charsDir = join(BOOK_ROOT, bookSlug, 'characters');
  if (!(await exists(charsDir))) return [];

  const files = await readdir(charsDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  const characters: CharacterInfo[] = [];
  const contentLower = chapterContent.toLowerCase();

  for (const f of mdFiles) {
    const raw = await readFile(join(charsDir, f), 'utf-8');
    const nameMatch = raw.match(/^#\s+(.+?)(?:\s*\(|$)/m);
    const name = nameMatch ? nameMatch[1].trim() : f.replace('.md', '').replace(/-/g, ' ');

    // Extract role from content
    const roleMatch = raw.match(/\*\*(?:Role|Age):\*\*\s*(.+)/);
    const role = roleMatch ? roleMatch[1].trim() : undefined;

    // Check if character name appears in chapter
    const mentioned = contentLower.includes(name.toLowerCase()) ||
                      contentLower.includes(name.split(' ').pop()!.toLowerCase());

    characters.push({ name, filename: f, role, mentioned });
  }

  // Sort: mentioned first, then alphabetical
  return characters.sort((a, b) => {
    if (a.mentioned !== b.mentioned) return a.mentioned ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function CharacterTracker({ bookSlug, chapterContent }: { bookSlug: string; chapterContent: string }) {
  const characters = await detectCharacters(bookSlug, chapterContent);

  if (characters.length === 0) return null;

  return (
    <div className="p-4 border-b border-white/[0.06]">
      <h3 className="font-display text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Characters</h3>
      <div className="space-y-1.5">
        {characters.map((ch) => (
          <div key={ch.filename} className={`flex items-center gap-2 px-2 py-1 rounded-md ${ch.mentioned ? 'bg-[var(--arc-brand-atlantean-teal)]/5' : ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ch.mentioned ? 'bg-[var(--arc-brand-atlantean-teal)]/60' : 'bg-white/10'}`} />
            <span className={`text-[11px] ${ch.mentioned ? 'text-white/60' : 'text-white/25'}`}>{ch.name}</span>
            {ch.role && <span className="text-[9px] text-white/15 ml-auto">{ch.role}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
