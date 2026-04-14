import { mkdir, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Read-only in production',
        reason: 'Book creation requires a persistent filesystem. Use local dev or Claude Code.',
      },
      { status: 423 },
    );
  }

  const body = await req.json();
  const { title, slug, genre, description } = body as {
    title?: string;
    slug?: string;
    genre?: string;
    description?: string;
  };

  if (!title?.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  if (!slug?.trim()) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  // Sanitize slug: lowercase, alphanumeric and hyphens only, collapse multiples
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!safeSlug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const bookDir = join(BOOK_ROOT, safeSlug);

  if (await exists(bookDir)) {
    return NextResponse.json({ error: 'Book already exists' }, { status: 409 });
  }

  // Create directory structure
  await mkdir(join(bookDir, 'chapters'), { recursive: true });

  // Build book.yaml manifest
  const descLine = description?.trim()
    ? `\ndescription: "${description.trim().replace(/"/g, '\\"')}"\n`
    : '\n';
  const safeTitle = title.trim().replace(/"/g, '\\"');
  const safeGenre = genre?.trim() || 'fantasy';

  const yaml = `title: "${safeTitle}"
slug: ${safeSlug}
tier: community
status: in-progress
${descLine}authors:
  - name: FrankX
    github: frankxai
    role: creator

ai_transparency:
  models_used:
    - id: claude-opus-4-6
      provider: anthropic
      role: co-author
  human_contribution: 50%
  ai_contribution: 50%
  method: "Human-directed, AI-assisted writing via Arcanea Author Studio."

license: CC-BY-NC-SA-4.0
content_rating: general
tags: [${safeGenre}]

acknowledgments: |
  Created with Arcanea Author Studio. Written in the open.
`;
  await writeFile(join(bookDir, 'book.yaml'), yaml, 'utf-8');

  // Create first chapter
  const firstChapter = `# Chapter One\n\nBegin writing...\n`;
  await writeFile(join(bookDir, 'chapters', '01-chapter-one.md'), firstChapter, 'utf-8');

  return NextResponse.json({
    success: true,
    slug: safeSlug,
    redirect: `/studio/author/${safeSlug}/01-chapter-one`,
  });
}
