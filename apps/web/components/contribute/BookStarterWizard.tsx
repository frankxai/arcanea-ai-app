'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Download, FileCode, Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Schema                                                                    */
/* -------------------------------------------------------------------------- */

const GENRES = [
  { value: 'dark-fantasy', label: 'Dark Fantasy' },
  { value: 'literary-fantasy', label: 'Literary Fantasy' },
  { value: 'epic-fantasy', label: 'Epic Fantasy' },
  { value: 'sci-fi', label: 'Science Fiction' },
  { value: 'literary-fiction', label: 'Literary Fiction' },
  { value: 'other', label: 'Other' },
] as const;

const TIERS = [
  {
    value: 'community',
    label: 'Community',
    helper: 'Auto-publish. Free forever. Start here.',
  },
  {
    value: 'featured',
    label: 'Featured',
    helper: 'Editor curation. Revenue share. By promotion.',
  },
  {
    value: 'canon',
    label: 'Canon',
    helper: 'Arcanea universe. By invitation only.',
  },
] as const;

const MODELS = [
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', provider: 'anthropic' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'anthropic' },
  { id: 'gpt-5', label: 'GPT-5', provider: 'openai' },
  { id: 'gpt-4-1', label: 'GPT-4.1', provider: 'openai' },
  { id: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro', provider: 'google' },
  { id: 'grok-4', label: 'Grok 4', provider: 'xai' },
  { id: 'deepseek-r1', label: 'DeepSeek R1', provider: 'deepseek' },
  { id: 'llama-4', label: 'Llama 4', provider: 'meta' },
] as const;

const LICENSES = [
  { value: 'CC-BY-NC-SA-4.0', label: 'CC BY-NC-SA 4.0 (share, no commercial, share-alike)' },
  { value: 'CC-BY-4.0', label: 'CC BY 4.0 (share with attribution)' },
  { value: 'CC0-1.0', label: 'CC0 1.0 (public domain)' },
  { value: 'MIT', label: 'MIT' },
  { value: 'All Rights Reserved', label: 'All Rights Reserved' },
] as const;

const WizardSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(120),
    slug: z
      .string()
      .min(3, 'Slug must be at least 3 characters')
      .max(80)
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
    genre: z.enum(['dark-fantasy', 'literary-fantasy', 'epic-fantasy', 'sci-fi', 'literary-fiction', 'other']),
    tier: z.enum(['community', 'featured', 'canon']),
    authorName: z.string().min(1, 'Your name is required').max(120),
    authorGithub: z
      .string()
      .max(60)
      .regex(/^[a-zA-Z0-9-]*$/, 'GitHub handle can only contain letters, numbers, and hyphens')
      .optional()
      .or(z.literal('')),
    coAuthor: z.string().max(120).optional().or(z.literal('')),
    humanPercent: z.number().min(0).max(100),
    models: z.array(z.string()).default([]),
    license: z.string().min(1),
    logline: z.string().max(240).optional().or(z.literal('')),
  })
  .refine((data) => data.humanPercent >= 0 && data.humanPercent <= 100, {
    message: 'Human contribution must be between 0 and 100',
    path: ['humanPercent'],
  });

type WizardInput = z.input<typeof WizardSchema>;
type WizardValues = z.output<typeof WizardSchema>;

/* -------------------------------------------------------------------------- */
/*  YAML generation                                                           */
/* -------------------------------------------------------------------------- */

function escapeYamlString(value: string): string {
  // Quote anything containing chars that would confuse a YAML parser.
  if (/[:#&*!|>'"%@`{}\[\],]/.test(value) || /^\s|\s$/.test(value)) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `"${value}"`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['".,!?]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

interface GeneratedBundle {
  yaml: string;
  firstChapter: string;
  outline: string;
  characters: string;
  readme: string;
}

function buildBundle(values: WizardValues): GeneratedBundle {
  const aiPercent = 100 - values.humanPercent;
  const selectedModels = MODELS.filter((m) => values.models.includes(m.id));

  const modelsBlock =
    selectedModels.length > 0
      ? selectedModels
          .map(
            (m) =>
              `    - id: ${m.id}\n      provider: ${m.provider}\n      role: prose-drafting`,
          )
          .join('\n')
      : '    - id: claude-opus-4-6\n      provider: anthropic\n      role: prose-drafting';

  const coAuthorBlock = values.coAuthor?.trim()
    ? `\n  - name: ${escapeYamlString(values.coAuthor.trim())}\n    role: co_author`
    : '';

  const githubBlock = values.authorGithub?.trim()
    ? `\n    github: ${values.authorGithub.trim()}`
    : '';

  const loglineBlock = values.logline?.trim()
    ? `\n\nlogline: ${escapeYamlString(values.logline.trim())}`
    : '';

  const yaml = `title: ${escapeYamlString(values.title)}
slug: ${values.slug}
tier: ${values.tier}
status: draft

authors:
  - name: ${escapeYamlString(values.authorName)}${githubBlock}
    role: creator${coAuthorBlock}

ai_transparency:
  models_used:
${modelsBlock}
  human_contribution: ${values.humanPercent}
  ai_contribution: ${aiPercent}
  method: "Human direction and editing; AI-assisted prose drafting"

license: ${values.license}
content_rating: general
tags: [${values.genre}]${loglineBlock}

acknowledgments: |
  Drafted in the open on Arcanea. Human direction by ${values.authorName}.
  AI-assisted prose generation curated and edited by human authors.
`;

  const firstChapter = `# Chapter One

> Replace this placeholder with your opening scene. The quality gate
> requires at least 500 words per chapter — enough for a meaningful
> foothold, not a full manuscript.

Write the first sentence that makes the reader lean in.

Then the paragraph that keeps them there.

Then the scene that earns the turn of the page.
`;

  const outline = `# Story Architecture — ${values.title}

## Premise

One or two sentences. What is this book about, stripped to its bones?

## Protagonist

Who are they? What do they want? What do they fear?

## Antagonist / Opposing Force

Who or what stands in the way? Why?

## Core Tension

The central question the book answers.

## Three-Act Skeleton

### Act I — Ordinary World
- Inciting incident:
- Lock-in:

### Act II — Spiraling Stakes
- Midpoint reversal:
- All is lost:

### Act III — Resolution
- Climax:
- Denouement:

## Themes

- Theme one
- Theme two
- Theme three
`;

  const characters = `# Characters — ${values.title}

## Protagonist

**Name:**
**Age:**
**Want (external):**
**Need (internal):**
**Wound:**
**Ghost:**
**Arc (from → to):**

## Antagonist

**Name:**
**Why they are the hero of their own story:**
**Methods:**
**Relationship to protagonist:**

## Supporting Cast

### Ally
**Name:**
**Role in protagonist's journey:**

### Mentor
**Name:**
**What wisdom they carry:**

### Shadow
**Name:**
**What they reflect back:**
`;

  const readme = `# ${values.title}

A ${GENRES.find((g) => g.value === values.genre)?.label ?? values.genre} book
drafted on Arcanea by ${values.authorName}.

## Structure

\`\`\`
${values.slug}/
├── book.yaml              # Manifest (tier, authors, AI transparency, license)
├── chapters/              # Numbered markdown — 500+ words each
├── outline/               # Story architecture
└── characters/            # Character profiles
\`\`\`

## Publishing

1. Copy this folder to \`book/${values.slug}/\` in your fork of
   https://github.com/frankxai/arcanea-ai-app
2. Commit to a branch named \`book/${values.slug}\`
3. Open a PR — the quality gate runs automatically
4. On pass, your book goes live at \`arcanea.ai/books/drafts/${values.slug}\`

Generated by the Arcanea Book Starter Wizard.
`;

  return { yaml, firstChapter, outline, characters, readme };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const FIELD_BASE =
  'w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#00bcd4]/40 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20';

const LABEL_BASE = 'block text-[11px] uppercase tracking-[0.18em] text-white/50';

export function BookStarterWizard() {
  const [generated, setGenerated] = React.useState<GeneratedBundle | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WizardInput>({
    defaultValues: {
      title: '',
      slug: '',
      genre: 'literary-fantasy',
      tier: 'community',
      authorName: '',
      authorGithub: '',
      coAuthor: '',
      humanPercent: 40,
      models: ['claude-opus-4-6'],
      license: 'CC-BY-NC-SA-4.0',
      logline: '',
    },
    mode: 'onBlur',
  });

  const title = watch('title');
  const humanPercent = watch('humanPercent');
  const slugValue = watch('slug');
  const selectedModels = watch('models') ?? [];

  // Auto-derive slug from title while user has not manually edited it.
  const slugTouched = React.useRef(false);
  React.useEffect(() => {
    if (!slugTouched.current && title) {
      setValue('slug', slugify(title), { shouldValidate: false });
    }
  }, [title, setValue]);

  const onSubmit = handleSubmit((raw) => {
    const parsed = WizardSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? 'Please check the form');
      return;
    }
    const bundle = buildBundle(parsed.data);
    setGenerated(bundle);
    toast.success('Book starter generated');
    // Smooth scroll to result after render.
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const handleCopyYaml = React.useCallback(async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated.yaml);
      setCopied(true);
      toast.success('book.yaml copied to clipboard');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed — select the text manually');
    }
  }, [generated]);

  const handleDownloadZip = React.useCallback(async () => {
    if (!generated) return;
    setDownloading(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const slug = slugValue || 'my-book';
      const folder = zip.folder(slug);
      if (!folder) throw new Error('Failed to create zip folder');
      folder.file('book.yaml', generated.yaml);
      folder.file('README.md', generated.readme);
      folder.folder('chapters')?.file('01-first-chapter.md', generated.firstChapter);
      folder.folder('outline')?.file('story-architecture.md', generated.outline);
      folder.folder('characters')?.file('profiles.md', generated.characters);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${slug}-starter.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast.success('Starter bundle downloaded');
    } catch (error) {
      console.error(error);
      toast.error('ZIP generation failed');
    } finally {
      setDownloading(false);
    }
  }, [generated, slugValue]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.035] to-white/[0.01] p-6 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#00bcd4]/10 blur-3xl"
      />
      <div className="relative">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00bcd4]/30 bg-[#00bcd4]/10">
            <Sparkles className="h-4 w-4 text-[#00bcd4]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-white/95">
              Book Starter Wizard
            </h3>
            <p className="mt-1 text-sm text-white/55">
              Fill in the essentials and we will generate a valid{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px] text-[#9befe8]">
                book.yaml
              </code>{' '}
              plus a ready-to-commit folder structure.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2" noValidate>
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="wizard-title" className={LABEL_BASE}>
              Book Title
            </label>
            <input
              id="wizard-title"
              type="text"
              placeholder="The Tides of Silence"
              className={cn(FIELD_BASE, 'mt-1.5')}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'wizard-title-error' : undefined}
              {...register('title')}
            />
            {errors.title ? (
              <p id="wizard-title-error" className="mt-1 text-xs text-red-400/90">
                {errors.title.message}
              </p>
            ) : null}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="wizard-slug" className={LABEL_BASE}>
              Slug (auto)
            </label>
            <input
              id="wizard-slug"
              type="text"
              placeholder="tides-of-silence"
              className={cn(FIELD_BASE, 'mt-1.5 font-mono text-[13px]')}
              aria-invalid={Boolean(errors.slug)}
              {...register('slug', {
                onChange: () => {
                  slugTouched.current = true;
                },
              })}
            />
            {errors.slug ? (
              <p className="mt-1 text-xs text-red-400/90">{errors.slug.message}</p>
            ) : (
              <p className="mt-1 text-[11px] text-white/35">
                Lives at /books/drafts/{slugValue || 'your-slug'}
              </p>
            )}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="wizard-genre" className={LABEL_BASE}>
              Genre
            </label>
            <select
              id="wizard-genre"
              className={cn(FIELD_BASE, 'mt-1.5')}
              {...register('genre')}
            >
              {GENRES.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#0c0c12]">
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Logline */}
          <div className="md:col-span-2">
            <label htmlFor="wizard-logline" className={LABEL_BASE}>
              Logline <span className="text-white/25">(optional, 1 sentence)</span>
            </label>
            <input
              id="wizard-logline"
              type="text"
              maxLength={240}
              placeholder="A coastal archivist hunts a drowned saint's confession before the tide takes it back."
              className={cn(FIELD_BASE, 'mt-1.5')}
              {...register('logline')}
            />
          </div>

          {/* Tier */}
          <div className="md:col-span-2">
            <span className={LABEL_BASE}>Tier</span>
            <Controller
              control={control}
              name="tier"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Tier"
                  className="mt-2 grid gap-2 md:grid-cols-3"
                >
                  {TIERS.map((tier) => {
                    const selected = field.value === tier.value;
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(tier.value)}
                        className={cn(
                          'rounded-xl border px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40',
                          selected
                            ? 'border-[#00bcd4]/50 bg-[#00bcd4]/[0.08] shadow-[0_0_24px_rgba(0,188,212,0.14)]'
                            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]',
                        )}
                      >
                        <div className="text-sm font-semibold text-white/90">{tier.label}</div>
                        <div className="mt-1 text-[11px] leading-relaxed text-white/50">
                          {tier.helper}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {/* Author name */}
          <div>
            <label htmlFor="wizard-author" className={LABEL_BASE}>
              Your Name
            </label>
            <input
              id="wizard-author"
              type="text"
              className={cn(FIELD_BASE, 'mt-1.5')}
              aria-invalid={Boolean(errors.authorName)}
              {...register('authorName')}
            />
            {errors.authorName ? (
              <p className="mt-1 text-xs text-red-400/90">{errors.authorName.message}</p>
            ) : null}
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="wizard-github" className={LABEL_BASE}>
              GitHub Handle <span className="text-white/25">(optional)</span>
            </label>
            <input
              id="wizard-github"
              type="text"
              placeholder="your-handle"
              className={cn(FIELD_BASE, 'mt-1.5 font-mono text-[13px]')}
              {...register('authorGithub')}
            />
            {errors.authorGithub ? (
              <p className="mt-1 text-xs text-red-400/90">{errors.authorGithub.message}</p>
            ) : null}
          </div>

          {/* Co-author */}
          <div className="md:col-span-2">
            <label htmlFor="wizard-coauthor" className={LABEL_BASE}>
              Co-Author <span className="text-white/25">(optional)</span>
            </label>
            <input
              id="wizard-coauthor"
              type="text"
              placeholder="Collaborator name"
              className={cn(FIELD_BASE, 'mt-1.5')}
              {...register('coAuthor')}
            />
          </div>

          {/* AI Transparency slider */}
          <div className="md:col-span-2">
            <label htmlFor="wizard-human-percent" className={LABEL_BASE}>
              AI Transparency
            </label>
            <div className="mt-2 flex items-center gap-4">
              <span className="w-16 text-xs text-white/50">Human {humanPercent}%</span>
              <Controller
                control={control}
                name="humanPercent"
                render={({ field }) => (
                  <input
                    id="wizard-human-percent"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="flex-1 accent-[#00bcd4]"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={field.value}
                  />
                )}
              />
              <span className="w-16 text-right text-xs text-white/50">
                AI {100 - humanPercent}%
              </span>
            </div>
            <p className="mt-2 text-[11px] text-white/35">
              Be honest. Readers respect transparency over performance.
            </p>
          </div>

          {/* Models */}
          <div className="md:col-span-2">
            <span className={LABEL_BASE}>Models Used</span>
            <Controller
              control={control}
              name="models"
              render={({ field }) => (
                <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {MODELS.map((model) => {
                    const checked = (field.value ?? []).includes(model.id);
                    return (
                      <label
                        key={model.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[12px] transition-all',
                          checked
                            ? 'border-[#00bcd4]/40 bg-[#00bcd4]/[0.06] text-white/90'
                            : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/[0.15]',
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-[#00bcd4]"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(field.value ?? []), model.id]
                              : (field.value ?? []).filter((id) => id !== model.id);
                            field.onChange(next);
                          }}
                        />
                        <span>{model.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            <p className="mt-2 text-[11px] text-white/35">
              {selectedModels.length} selected
            </p>
          </div>

          {/* License */}
          <div className="md:col-span-2">
            <label htmlFor="wizard-license" className={LABEL_BASE}>
              License
            </label>
            <select
              id="wizard-license"
              className={cn(FIELD_BASE, 'mt-1.5')}
              {...register('license')}
            >
              {LICENSES.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#0c0c12]">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] px-5 py-2.5 text-sm font-semibold text-white',
                'shadow-[0_0_32px_rgba(0,188,212,0.25)] transition-transform hover:-translate-y-0.5',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate book.yaml
            </button>
            <span className="text-[11px] text-white/35">
              Everything runs in your browser. Nothing is uploaded.
            </span>
          </div>
        </form>

        {/* Result */}
        {generated ? (
          <div ref={resultRef} className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <FileCode className="h-4 w-4 text-[#00bcd4]" aria-hidden="true" />
                <span className="font-semibold">Generated book.yaml</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyYaml}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 hover:border-[#00bcd4]/30 hover:text-[#00bcd4]"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied' : 'Copy YAML'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#00bcd4]/30 bg-[#00bcd4]/[0.08] px-3 py-1.5 text-[12px] font-semibold text-[#00bcd4] hover:bg-[#00bcd4]/[0.15] disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Zipping…' : 'Download ZIP'}
                </button>
              </div>
            </div>
            <pre className="max-h-[480px] overflow-auto rounded-xl border border-white/[0.08] bg-[#0c0c12]/90 p-4 font-mono text-[12.5px] leading-relaxed text-[#d6f9f6]">
              <code>{generated.yaml}</code>
            </pre>
            <p className="text-[11px] text-white/40">
              The ZIP contains <code className="text-white/60">book.yaml</code>, a
              starter chapter, outline, character template, and a README with
              publishing instructions.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
