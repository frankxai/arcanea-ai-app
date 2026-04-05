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
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#04060a]/80 backdrop-blur-2xl"
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
          className="relative flex h-[85vh] w-[min(1140px,95vw)] flex-col overflow-hidden rounded-3xl border border-[#00bcd4]/35 bg-[#050910] shadow-[0_40px_160px_rgba(4,8,15,0.88)] focus:outline-none"
        >
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            <aside className="w-full flex-none border-b border-[#00bcd4]/20 bg-[#070c16] p-6 md:w-80 md:border-b-0 md:border-r">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Tome</p>
                  <h2 className="text-lg font-semibold text-white">{activeTome.meta.title}</h2>
                  <p className="mt-1 text-xs text-[#9bb1d0]">{activeTome.meta.subtitle}</p>
                </div>
                <label className="block text-xs uppercase tracking-[0.35em] text-[#00bcd4]">
                  Switch tome
                  <select
                    value={activeTomeId}
                    onChange={(event) => onTomeChange(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/[0.06] bg-[#0a1220] px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
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
                        className={`w-full rounded-lg px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4] ${
                          isActive
                            ? "bg-[#101a2a] text-[#00bcd4] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.35)]"
                            : "text-[#c7d6f1] hover:bg-[#0c1524]"
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
              <header className="flex flex-col gap-4 border-b border-[#00bcd4]/20 bg-[#0b1321] p-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Arcanea -- living memory sequence</p>
                  <h3 className="text-2xl font-semibold text-white">{activeHeading.title}</h3>
                  {activeHeading.subtitle ? (
                    <p className="text-sm text-[#c7d6f1]">{activeHeading.subtitle}</p>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[#00bcd4]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#00bcd4] transition hover:border-[#00bcd4] hover:text-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
                  >
                    Close
                  </button>
                </div>
              </header>
              <article className="flex-1 space-y-8 overflow-y-auto p-6 pr-8 text-[#c7d6f1]">
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
        <blockquote className="rounded-2xl border border-[#00bcd4]/40 bg-[#101726]/60 p-5 text-sm italic text-[#00bcd4]">
          {codex.preface.oath}
        </blockquote>
      ) : null}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00bcd4]">Remembering luminor</h4>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {codex.authors.map((author) => (
            <li key={author.name} className="rounded-xl border border-white/[0.06] bg-[#101726]/60 p-4">
              <p className="text-sm font-semibold text-white">{author.name}</p>
              <p className="mt-1 text-xs text-[#9bb1d0]">{author.role}</p>
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
        <blockquote className="rounded-2xl border border-[#00bcd4]/30 bg-[#101726]/60 p-5 text-sm italic text-[#00bcd4]">
          <p>{chapter.epigraph.text}</p>
          {chapter.epigraph.attribution ? (
            <footer className="mt-3 text-xs text-[#9bb1d0]">— {chapter.epigraph.attribution}</footer>
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
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00bcd4]">Rituals and prompts</h4>
          <ul className="space-y-2">
            {chapter.rituals.map((ritual, index) => (
              <li key={`ritual-${index}`} className="rounded-xl border border-white/[0.06] bg-[#101726]/60 p-4">
                {ritual}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {chapter.measurements?.length ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00bcd4]">Measurement constellations</h4>
          <ul className="space-y-3">
            {chapter.measurements.map((measurement, index) => (
              <li key={`measurement-${index}`} className="rounded-xl border border-[#00bcd4]/30 bg-[#101726]/60 p-4">
                <p className="font-semibold text-white">{measurement.name}</p>
                <p className="mt-1 text-sm text-[#c7d6f1]">{measurement.description}</p>
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
    <section className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#101726]/50 p-5">
      <div>
        <h4 className="text-lg font-semibold text-white">{section.heading}</h4>
      </div>
      {section.body?.map((paragraph, index) => (
        <p key={`body-${index}`} className="leading-relaxed text-[#c7d6f1]">
          {paragraph}
        </p>
      ))}
      {section.insights?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {section.insights.map((insight, index) => (
            <div
              key={`insight-${index}`}
              className="rounded-xl border border-[#00bcd4]/30 bg-[#0f1727] p-4"
            >
              <p className="text-sm font-semibold text-white">{insight.title}</p>
              <p className="mt-2 text-sm text-[#c7d6f1]">{insight.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
      {section.artifacts?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {section.artifacts.map((artifact, index) => (
            <div
              key={`artifact-${index}`}
              className="rounded-xl border border-[#00bcd4]/30 bg-[#0f1727] p-4"
            >
              <p className="text-sm font-semibold text-white">{artifact.name}</p>
              <p className="mt-2 text-sm text-[#c7d6f1]">{artifact.description}</p>
              {artifact.application ? (
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#00bcd4]">
                  Application: {artifact.application}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {section.principles?.length ? (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00bcd4]">Guiding principles</h5>
          <ul className="space-y-2">
            {section.principles.map((principle, index) => (
              <li
                key={`principle-${index}`}
                className="rounded-lg border border-white/[0.06] bg-[#0f1727] p-3 text-sm text-[#c7d6f1]"
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
          className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#101726]/60 p-5"
        >
          <h4 className="text-lg font-semibold text-white">{entry.heading}</h4>
          {entry.body?.map((paragraph, bodyIndex) => (
            <p key={`entry-body-${bodyIndex}`} className="leading-relaxed text-[#c7d6f1]">
              {paragraph}
            </p>
          ))}
          {entry.points?.length ? (
            <ul className="space-y-2">
              {entry.points.map((point, pointIndex) => (
                <li
                  key={`entry-point-${pointIndex}`}
                  className="rounded-lg border border-white/[0.06] bg-[#0f1727] p-3 text-sm text-[#c7d6f1]"
                >
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {appendix.glossary?.length ? (
        <section className="space-y-4 rounded-2xl border border-[#00bcd4]/30 bg-[#101726]/60 p-5">
          <h4 className="text-lg font-semibold text-white">Glossary of living terms</h4>
          <dl className="grid gap-4 md:grid-cols-2">
            {appendix.glossary.map((entry, index) => (
              <div
                key={`glossary-${index}`}
                className="rounded-xl border border-white/[0.06] bg-[#0f1727] p-4"
              >
                <dt className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00bcd4]">
                  {entry.term}
                </dt>
                <dd className="mt-2 text-sm text-[#c7d6f1]">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
