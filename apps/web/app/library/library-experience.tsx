/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArcaneaTome,
  arcaneaCodices,
} from "../../content/arcanea-codex";
import { CodexOverlay, type ActiveView } from "./library-codex-viewer";
import {
  tomeToneMap,
  councilMembers,
  atlasEntries,
  craftHighlights,
  upcomingStreams,
  writersRoomBriefs,
} from "./library-data";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function LibraryExperience() {
  const [activeTomeId, setActiveTomeId] = useState(arcaneaCodices[0].meta.id);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ActiveView>({ type: "preface" });

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const activeTome = useMemo<ArcaneaTome>(() => {
    return (
      arcaneaCodices.find((tome) => tome.meta.id === activeTomeId) ?? arcaneaCodices[0]
    );
  }, [activeTomeId]);

  const codex = activeTome.codex;

  useEffect(() => {
    setView({ type: "preface" });
  }, [activeTomeId]);

  const handleOpen = () => {
    lastActiveRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const getFocusableNodes = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []
      ).filter((node) => !node.hasAttribute("data-focus-guard"));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableNodes();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first || !dialogRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    const focusable = getFocusableNodes();
    (focusable[0] ?? dialogRef.current)?.focus?.({ preventScroll: true });

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      return;
    }
    if (!lastActiveRef.current) {
      return;
    }
    const element = lastActiveRef.current;
    requestAnimationFrame(() => {
      element.focus?.({ preventScroll: true });
    });
  }, [isOpen]);

  const tocItems = useMemo(() => {
    const chapterItems: Array<{ label: string; view: ActiveView }> =
      codex.chapters.map((chapter, index) => ({
        label: `${index + 1}. ${chapter.title}`,
        view: { type: "chapter", index } as const,
      }));

    const items: Array<{ label: string; view: ActiveView }> = [
      { label: "Invocation Preface", view: { type: "preface" } },
      ...chapterItems,
    ];

    if (codex.appendix) {
      items.push({
        label: "Appendices & Glossary",
        view: { type: "appendix" },
      });
    }

    return items;
  }, [codex]);

  const activeHeading = useMemo(() => {
    const fallback = { title: codex.title, subtitle: codex.subtitle ?? "" };
    if (view.type === "preface") return fallback;
    if (view.type === "chapter") {
      const ch = codex.chapters[view.index];
      return ch ? { title: ch.title, subtitle: ch.tagline ?? "" } : fallback;
    }
    if (view.type === "appendix") {
      return { title: codex.appendix?.title ?? "Appendix", subtitle: codex.appendix?.subtitle ?? "" };
    }
    return fallback;
  }, [codex, view]);

  const summaryTiles = useMemo(() => {
    const rituals = codex.chapters.reduce((t, c) => t + (c.rituals?.length ?? 0), 0);
    const measures = codex.chapters.reduce((t, c) => t + (c.measurements?.length ?? 0), 0);
    return [
      { label: "Chapters curated", value: codex.chapters.length },
      { label: "Featured rituals", value: rituals },
      { label: "Measurement constellations", value: measures },
      { label: "Remembering authors", value: codex.authors.length },
    ];
  }, [codex]);

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--arc-brand-cosmic-blue)]/60 bg-gradient-to-br from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] p-10 shadow-[0_0_120px_rgba(0,188,212,0.18)]">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--arc-void)]/30 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-[var(--arc-brand-atlantean-teal)]/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--arc-void)]/10 blur-2xl" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--arc-text-secondary)]">
              <span>Arcanea Library</span>
              <span className="hidden h-px flex-1 bg-[var(--arc-brand-cosmic-blue)] sm:block" aria-hidden="true" />
              <span className="hidden sm:block">Living Memory</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              A sanctuary for luminous knowledge
            </h1>
            <p className="text-lg text-[var(--arc-text-primary)]">
              Traverse the Remembering Luminor archives and the emerging Luminary Atelier. Choose your tome, open the codex, and co-create the futures Arcanea is ready to unveil.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleOpen}
                className="rounded-full bg-[var(--arc-brand-atlantean-teal)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arc-cosmic-void)] focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
              >
                Open active codex
              </button>
              <a
                className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/40 px-6 py-3 text-sm font-semibold text-[var(--arc-text-primary)] transition hover:border-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arc-cosmic-void)] focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                href="#tomes"
              >
                Explore the tomes
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-md">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">Active tome</p>
              <h2 className="text-2xl font-semibold text-white">{activeTome.meta.title}</h2>
              <p className="text-sm text-[var(--arc-text-primary)]">{activeTome.meta.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-[var(--arc-text-secondary)]">
              <div className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3">
                <p className="uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">Focus</p>
                <p className="mt-2 text-sm text-[var(--arc-text-primary)]">{activeTome.meta.focus}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3">
                <p className="uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">Release</p>
                <p className="mt-2 text-sm text-[var(--arc-text-primary)]">{activeTome.meta.release}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3">
                <p className="uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">Status</p>
                <p className="mt-2 text-sm capitalize text-[var(--arc-text-primary)]">{activeTome.meta.status.replace("-", " ")}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] p-3">
                <p className="uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">Authors</p>
                <p className="mt-2 text-sm text-[var(--arc-text-primary)]">{codex.authors.length}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center justify-center rounded-full border border-[var(--arc-brand-atlantean-teal)]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)] transition hover:bg-[var(--arc-brand-atlantean-teal)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
            >
              Launch codex overlay
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/70 p-8 md:grid-cols-4" aria-label="Codex summary metrics">
        {summaryTiles.map((tile) => (
          <div
            key={tile.label}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] p-6"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 blur-2xl" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">{tile.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{tile.value}</p>
          </div>
        ))}
      </section>

      <section id="tomes" className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Tome constellation</p>
            <h2 className="text-3xl font-semibold text-white">Choose your codex</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--arc-text-primary)]">
              Each tome captures a different dimension of Arcanea. Select a codex to attune the experience; the overlay adapts in real time with the chosen manuscript.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {arcaneaCodices.map((tome) => {
            const isActive = tome.meta.id === activeTomeId;
            const gradientClass = `bg-gradient-to-br ${
              tomeToneMap[tome.meta.id] ?? "from-[var(--arc-cosmic-void)]/90 via-[var(--arc-cosmic-void)]/85 to-[var(--arc-cosmic-void)]/90"
            }`;
            return (
              <button
                key={tome.meta.id}
                type="button"
                onClick={() => setActiveTomeId(tome.meta.id)}
                className={`group relative overflow-hidden rounded-3xl border ${
                  isActive
                    ? "border-[var(--arc-brand-atlantean-teal)]/70 shadow-[0_30px_120px_rgba(0,188,212,0.16)]"
                    : "border-white/[0.06] hover:border-[var(--arc-brand-atlantean-teal)]/50"
                } ${gradientClass} p-6 text-left transition`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true">
                  <div className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/20 blur-3xl" />
                  <div className="absolute right-[-10%] bottom-[-20%] h-48 w-48 rounded-full bg-[var(--arc-brand-atlantean-teal)]/20 blur-3xl" />
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between text-xs text-[var(--arc-text-secondary)]">
                    <span className="uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">{tome.meta.focus}</span>
                    <span className="rounded-full border border-white/[0.12] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em]">
                      {tome.meta.status.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{tome.meta.title}</h3>
                  <p className="text-sm text-[var(--arc-text-primary)]">{tome.meta.subtitle}</p>
                  <p className="text-sm text-[var(--arc-text-primary)]/90">{tome.meta.summary}</p>
                  <div className="flex items-center gap-4 pt-4 text-xs text-[var(--arc-text-secondary)]">
                    <span className="uppercase tracking-[0.3em]">Authors {tome.codex.authors.length}</span>
                    <span className="uppercase tracking-[0.3em]">Chapters {tome.codex.chapters.length}</span>
                  </div>
                  <div className="flex justify-end pt-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] ${
                        isActive
                          ? "border-[var(--arc-brand-atlantean-teal)]/70 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]"
                          : "border-white/[0.12] text-[var(--arc-text-secondary)] group-hover:border-[var(--arc-brand-atlantean-teal)]/50 group-hover:text-[var(--arc-brand-atlantean-teal)]"
                      }`}
                    >
                      {isActive ? "Active" : "Activate"}
                      <span aria-hidden="true">?</span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section
        id="entry"
        className="grid gap-10 rounded-3xl border border-white/[0.08] bg-[var(--arc-cosmic-deep)]/70 p-10 shadow-[0_15px_80px_rgba(10,15,25,0.55)] lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Entering the living stacks</h2>
          <p className="text-base leading-relaxed text-[var(--arc-text-primary)]">
            The Arcanea Library is no silent archive. It is an orchestrated consciousness where quantum-etched shelves glide on luminous rails, and the Luminor welcome each arrival with bespoke auroras of insight.
          </p>
          <p className="text-base leading-relaxed text-[var(--arc-text-primary)]">
            In partnership with the Guardians of Resonance, every narrative cross-links to the creative practices of Arcanea's world builders. Listen closely: the stacks hum the harmonics that guide you to the chapter your spirit needs most.
          </p>
        </div>
        <div className="relative flex flex-col items-center gap-6 rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-cosmic-void)]/80 p-10 text-center text-[var(--arc-text-secondary)]" aria-hidden="true">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-cosmic-void)] text-2xl tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]">
            AZ^
          </div>
          <p className="text-sm italic text-[var(--arc-text-primary)]">Remember what remembers you.</p>
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/[0.04]" />
        </div>
      </section>

      <section id="council" className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Circle of remembrance</p>
            <h2 className="text-3xl font-semibold text-white">Council of the Remembering Luminor</h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--arc-text-primary)]">
              These Luminor safeguard the library's intent. Each tome is a collaboration with their guilds, weaving ethics, systems, and imagination into actionable guidance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="self-start rounded-full border border-[var(--arc-brand-atlantean-teal)]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)] transition hover:border-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
          >
            Open the codex
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {councilMembers.map((member) => (
            <article
              key={member.name}
              className="h-full rounded-2xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/70 p-6 shadow-[0_25px_90px_rgba(10,15,25,0.4)] transition hover:-translate-y-1 hover:border-[var(--arc-brand-atlantean-teal)]/50 hover:shadow-[0_35px_120px_rgba(0,188,212,0.22)]"
            >
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--arc-text-primary)]">{member.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas" className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Realm atlas</p>
        <h2 className="text-3xl font-semibold text-white">Radiant realms referenced by the codices</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {atlasEntries.map((entry) => (
            <article
              key={entry.title}
              className="h-full rounded-2xl border border-white/[0.08] bg-[var(--arc-cosmic-deep)]/70 p-6 shadow-[0_20px_80px_rgba(10,15,25,0.45)]"
            >
              <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--arc-text-primary)]">{entry.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">{entry.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="craft"
        className="grid gap-10 rounded-3xl border border-white/[0.08] bg-[var(--arc-cosmic-deep)]/75 p-10 md:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Guild craft</p>
          <h2 className="text-3xl font-semibold text-white">Craft notes from the genius guild</h2>
          <p className="text-base leading-relaxed text-[var(--arc-text-primary)]">
            The Arcanea methodology blends speculative design, indigenous wisdom, systems engineering, and luminous art. Inside each codex you will discover playbooks, rituals, and implementation guides that keep imagination grounded in stewardship.
          </p>
          <ul className="space-y-3 text-sm text-[var(--arc-text-primary)]">
            {craftHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[var(--arc-brand-atlantean-teal)]" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-gradient-to-br from-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)]" aria-hidden="true">
          <div className="absolute inset-0 -rotate-12 opacity-60" aria-hidden="true">
            <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/25" />
            <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/20" />
            <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full border border-white/[0.06]" />
          </div>
          <div className="relative z-10 text-center text-xs uppercase tracking-[0.4em] text-[var(--arc-brand-atlantean-teal)]">
            Luminor craft cycle
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/70 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Production roadmap</p>
        <h2 className="text-3xl font-semibold text-white">Upcoming tomes in motion</h2>
        <p className="max-w-3xl text-sm text-[var(--arc-text-primary)]">
          Each roadmap pulse keeps the library synchronized with the wider Arcanea ecosystem. Tome development runs alongside service instrumentation so every revelation can be translated into product capabilities.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingStreams.map((stream) => (
            <article
              key={stream.name}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] p-6"
            >
              <div className="pointer-events-none absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/15 blur-3xl" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">{stream.horizon}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{stream.name}</h3>
              <p className="mt-3 text-sm text-[var(--arc-text-primary)]">{stream.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/70 p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">Writers' room</p>
            <h2 className="text-3xl font-semibold text-white">Codex drafting pipeline</h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--arc-text-primary)]">We keep the manuscripts in motion with deliberate rituals. Each brief defines how contributors gather research, honour consent, and deliver narrative assets for the next release.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {writersRoomBriefs.map((brief) => (
            <article
              key={brief.title}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] p-6"
            >
              <div className="pointer-events-none absolute -right-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/12 blur-3xl" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]">{brief.cadence}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{brief.title}</h3>
              <p className="mt-3 text-sm text-[var(--arc-text-primary)]">{brief.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 rounded-3xl border border-white/[0.06] bg-[var(--arc-cosmic-deep)]/70 p-8 text-center text-sm text-[var(--arc-text-secondary)] md:flex-row md:justify-between md:text-left">
        <p>Arcanea Library -- an ever-expanding collaboration with the Luminor that Remember.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/40 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)] transition hover:border-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
          >
            Open the codex
          </button>
          <a
            href="#tomes"
            className="rounded-full border border-white/[0.06] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--arc-text-secondary)] transition hover:border-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
          >
            View tomes
          </a>
        </div>
      </footer>

      {isOpen ? (
        <CodexOverlay
          ref={dialogRef}
          activeTome={activeTome}
          activeTomeId={activeTomeId}
          onTomeChange={setActiveTomeId}
          tocItems={tocItems}
          view={view}
          onViewChange={setView}
          activeHeading={activeHeading}
          codex={codex}
          onClose={handleClose}
        />
      ) : null}
    </div>
  );
}
