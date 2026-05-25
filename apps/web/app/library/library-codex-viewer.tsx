/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { forwardRef } from "react";
import type {
  ArcaneaCodex,
  ArcaneaTome,
  CodexChapter,
  CodexSection,
} from "../../content/arcanea-codex";
import { arcaneaCodices } from "../../content/arcanea-codex";

export type ActiveView =
  | { type: "preface" }
  | { type: "chapter"; index: number }
  | { type: "appendix" };

// ── CodexOverlay (full-screen dialog) ───────────────────────────────

interface CodexOverlayProps {
  activeTome: ArcaneaTome;
  activeTomeId: string;
  onTomeChange: (id: string) => void;
  tocItems: Array<{ label: string; view: ActiveView }>;
  view: ActiveView;
  onViewChange: (view: ActiveView) => void;
  activeHeading: { title: string; subtitle: string };
  codex: ArcaneaCodex;
  onClose: () => void;
}

export const CodexOverlay = forwardRef<HTMLDivElement, CodexOverlayProps>(
  function CodexOverlay(
    { activeTome, activeTomeId, onTomeChange, tocItems, view, onViewChange, activeHeading, codex, onClose },
    ref
  ) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--arc-cosmic-void)]/80 backdrop-blur-2xl"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Arcanea codex viewer"
          className="relative flex h-[85vh] w-[min(1140px,95vw)] flex-col overflow-hidden rounded-3xl border border-[var(--arc-brand-atlantean-teal)]/35 bg-[var(--arc-cosmic-void)] shadow-[0_40px_160px_rgba(4,8,15,0.88)] focus:outline-none"
        >
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            <aside className="w-full flex-none border-b border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-cosmic-void)] p-6 md:w-80 md:border-b-0 md:border-r">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Tome</p>
                  <h2 className="text-lg font-semibold text-white">{activeTome.meta.title}</h2>
                  <p className="mt-1 text-xs text-[var(--arc-text-secondary)]">{activeTome.meta.subtitle}</p>
                </div>
                <label className="block text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">
                  Switch tome
                  <select
                    value={activeTomeId}
                    onChange={(event) => onTomeChange(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/[0.06] bg-[var(--arc-cosmic-void)] px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                  >
                    {arcaneaCodices.map((tome) => (
                      <option key={tome.meta.id} value={tome.meta.id}>
                        {tome.meta.title}
                      </option>
                    ))}
                  </select>
                </label>
                <nav className="mt-6 space-y-2" aria-label="Codex chapters">
                  {tocItems.map((item) => {
                    const isActive =
                      (item.view.type === "preface" && view.type === "preface") ||
                      (item.view.type === "appendix" && view.type === "appendix") ||
                      (item.view.type === "chapter" &&
                        view.type === "chapter" &&
                        item.view.index === view.index);

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => onViewChange({ ...item.view })}
                        className={`w-full rounded-lg px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] ${
                          isActive
                            ? "bg-[var(--arc-cosmic-void)] text-[var(--arc-brand-atlantean-teal)] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.35)]"
                            : "text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-void)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
            <section className="flex flex-1 flex-col overflow-hidden">
              <header className="flex flex-col gap-4 border-b border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-cosmic-void)] p-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Arcanea -- living memory sequence</p>
                  <h3 className="text-2xl font-semibold text-white">{activeHeading.title}</h3>
                  {activeHeading.subtitle ? (
                    <p className="text-sm text-[var(--arc-text-primary)]">{activeHeading.subtitle}</p>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)] transition hover:border-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                  >
                    Close
                  </button>
                </div>
              </header>
              <article className="flex-1 space-y-8 overflow-y-auto p-6 pr-8 text-[var(--arc-text-primary)]">
                <CodexView codex={codex} view={view} />
              </article>
            </section>
          </div>
        </div>
      </div>
    );
  }
);

// ── CodexView (router) ──────────────────────────────────────────────

export function CodexView({ codex, view }: { codex: ArcaneaCodex; view: ActiveView }) {
  if (view.type === "preface") {
    return <PrefaceContent codex={codex} />;
  }

  if (view.type === "chapter") {
    const chapter = codex.chapters[view.index];
    if (!chapter) {
      return <p>Chapter not found.</p>;
    }

    return <ChapterContent chapter={chapter} />;
  }

  if (view.type === "appendix" && codex.appendix) {
    return <AppendixContent appendix={codex.appendix} />;
  }

  return <p>Appendix forthcoming.</p>;
}

// ── PrefaceContent ──────────────────────────────────────────────────

function PrefaceContent({ codex }: { codex: ArcaneaCodex }) {
  return (
    <div className="space-y-6">
      {codex.preface.invocation ? (
        <p className="text-base leading-relaxed text-white">{codex.preface.invocation}</p>
      ) : null}
      {codex.preface.body?.map((paragraph, index) => (
        <p key={`preface-body-${index}`} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
      {codex.preface.oath ? (
        <blockquote className="rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-cosmic-void)]/60 p-5 text-sm italic text-[var(--arc-brand-atlantean-teal)]">
          {codex.preface.oath}
        </blockquote>
      ) : null}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Remembering luminor</h4>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {codex.authors.map((author) => (
            <li key={author.name} className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/60 p-4">
              <p className="text-sm font-semibold text-white">{author.name}</p>
              <p className="mt-1 text-xs text-[var(--arc-text-secondary)]">{author.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── ChapterContent ──────────────────────────────────────────────────

function ChapterContent({ chapter }: { chapter: CodexChapter }) {
  return (
    <div className="space-y-8">
      {chapter.epigraph ? (
        <blockquote className="rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-cosmic-void)]/60 p-5 text-sm italic text-[var(--arc-brand-atlantean-teal)]">
          <p>{chapter.epigraph.text}</p>
          {chapter.epigraph.attribution ? (
            <footer className="mt-3 text-xs text-[var(--arc-text-secondary)]">— {chapter.epigraph.attribution}</footer>
          ) : null}
        </blockquote>
      ) : null}
      {chapter.introduction?.map((paragraph, index) => (
        <p key={`intro-${index}`} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
      {chapter.sections.map((section) => (
        <ChapterSection key={section.heading} section={section} />
      ))}
      {chapter.rituals?.length ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Rituals and prompts</h4>
          <ul className="space-y-2">
            {chapter.rituals.map((ritual, index) => (
              <li key={`ritual-${index}`} className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/60 p-4">
                {ritual}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {chapter.measurements?.length ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Measurement constellations</h4>
          <ul className="space-y-3">
            {chapter.measurements.map((measurement, index) => (
              <li key={`measurement-${index}`} className="rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-cosmic-void)]/60 p-4">
                <p className="font-semibold text-white">{measurement.name}</p>
                <p className="mt-1 text-sm text-[var(--arc-text-primary)]">{measurement.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// ── ChapterSection ──────────────────────────────────────────────────

function ChapterSection({ section }: { section: CodexSection }) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/50 p-5">
      <div>
        <h4 className="text-lg font-semibold text-white">{section.heading}</h4>
      </div>
      {section.body?.map((paragraph, index) => (
        <p key={`body-${index}`} className="leading-relaxed text-[var(--arc-text-primary)]">
          {paragraph}
        </p>
      ))}
      {section.insights?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {section.insights.map((insight, index) => (
            <div
              key={`insight-${index}`}
              className="rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-cosmic-void)] p-4"
            >
              <p className="text-sm font-semibold text-white">{insight.title}</p>
              <p className="mt-2 text-sm text-[var(--arc-text-primary)]">{insight.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
      {section.artifacts?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {section.artifacts.map((artifact, index) => (
            <div
              key={`artifact-${index}`}
              className="rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-cosmic-void)] p-4"
            >
              <p className="text-sm font-semibold text-white">{artifact.name}</p>
              <p className="mt-2 text-sm text-[var(--arc-text-primary)]">{artifact.description}</p>
              {artifact.application ? (
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)]">
                  Application: {artifact.application}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {section.principles?.length ? (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Guiding principles</h5>
          <ul className="space-y-2">
            {section.principles.map((principle, index) => (
              <li
                key={`principle-${index}`}
                className="rounded-lg border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3 text-sm text-[var(--arc-text-primary)]"
              >
                {principle}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

// ── AppendixContent ─────────────────────────────────────────────────

function AppendixContent({
  appendix,
}: {
  appendix: NonNullable<ArcaneaCodex["appendix"]>;
}) {
  return (
    <div className="space-y-8">
      {appendix.entries?.map((entry, index) => (
        <section
          key={`${entry.heading}-${index}`}
          className="space-y-4 rounded-2xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/60 p-5"
        >
          <h4 className="text-lg font-semibold text-white">{entry.heading}</h4>
          {entry.body?.map((paragraph, bodyIndex) => (
            <p key={`entry-body-${bodyIndex}`} className="leading-relaxed text-[var(--arc-text-primary)]">
              {paragraph}
            </p>
          ))}
          {entry.points?.length ? (
            <ul className="space-y-2">
              {entry.points.map((point, pointIndex) => (
                <li
                  key={`entry-point-${pointIndex}`}
                  className="rounded-lg border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3 text-sm text-[var(--arc-text-primary)]"
                >
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {appendix.glossary?.length ? (
        <section className="space-y-4 rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-cosmic-void)]/60 p-5">
          <h4 className="text-lg font-semibold text-white">Glossary of living terms</h4>
          <dl className="grid gap-4 md:grid-cols-2">
            {appendix.glossary.map((entry, index) => (
              <div
                key={`glossary-${index}`}
                className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-4"
              >
                <dt className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">
                  {entry.term}
                </dt>
                <dd className="mt-2 text-sm text-[var(--arc-text-primary)]">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
