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
      <section className="relative overflow-hidden rounded-3xl border border-[#2a385c]/60 bg-gradient-to-br from-[#0f1627] via-[#0b1220] to-[#060b16] p-10 shadow-[0_0_120px_rgba(0,188,212,0.18)]">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#76a6ff]/30 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-[#00bcd4]/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#4057ff]/10 blur-2xl" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[#9bb1d0]">
              <span>Arcanea Library</span>
              <span className="hidden h-px flex-1 bg-[#23335a] sm:block" aria-hidden="true" />
              <span className="hidden sm:block">Living Memory</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              A sanctuary for luminous knowledge
            </h1>
            <p className="text-lg text-[#c7d6f1]">
              Traverse the Remembering Luminor archives and the emerging Luminary Atelier. Choose your tome, open the codex, and co-create the futures Arcanea is ready to unveil.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleOpen}
                className="rounded-full bg-[#00bcd4] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d] focus-visible:ring-[#00bcd4]"
              >
                Open active codex
              </button>
              <a
                className="rounded-full border border-[#00bcd4]/40 px-6 py-3 text-sm font-semibold text-[#c7d6f1] transition hover:border-[#00bcd4] hover:text-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d] focus-visible:ring-[#00bcd4]"
                href="#tomes"
              >
                Explore the tomes
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-md">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00bcd4]">Active tome</p>
              <h2 className="text-2xl font-semibold text-white">{activeTome.meta.title}</h2>
              <p className="text-sm text-[#c7d6f1]">{activeTome.meta.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-[#9bb1d0]">
              <div className="rounded-xl border border-white/[0.06] bg-[#0b1322] p-3">
                <p className="uppercase tracking-[0.3em] text-[#00bcd4]">Focus</p>
                <p className="mt-2 text-sm text-[#d8e4fb]">{activeTome.meta.focus}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0b1322] p-3">
                <p className="uppercase tracking-[0.3em] text-[#00bcd4]">Release</p>
                <p className="mt-2 text-sm text-[#d8e4fb]">{activeTome.meta.release}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0b1322] p-3">
                <p className="uppercase tracking-[0.3em] text-[#00bcd4]">Status</p>
                <p className="mt-2 text-sm capitalize text-[#d8e4fb]">{activeTome.meta.status.replace("-", " ")}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0b1322] p-3">
                <p className="uppercase tracking-[0.3em] text-[#00bcd4]">Authors</p>
                <p className="mt-2 text-sm text-[#d8e4fb]">{codex.authors.length}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center justify-center rounded-full border border-[#00bcd4]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#00bcd4] transition hover:bg-[#00bcd4]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
            >
              Launch codex overlay
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/[0.06] bg-[#101726]/70 p-8 md:grid-cols-4" aria-label="Codex summary metrics">
        {summaryTiles.map((tile) => (
          <div
            key={tile.label}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#18233b] via-[#111a2d] to-[#0b131f] p-6"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00bcd4]/10 blur-2xl" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">{tile.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{tile.value}</p>
          </div>
        ))}
      </section>

      <section id="tomes" className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Tome constellation</p>
            <h2 className="text-3xl font-semibold text-white">Choose your codex</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#c7d6f1]">
              Each tome captures a different dimension of Arcanea. Select a codex to attune the experience; the overlay adapts in real time with the chosen manuscript.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {arcaneaCodices.map((tome) => {
            const isActive = tome.meta.id === activeTomeId;
            const gradientClass = `bg-gradient-to-br ${
              tomeToneMap[tome.meta.id] ?? "from-[#1a223a]/90 via-[#111a2c]/85 to-[#080d18]/90"
            }`;
            return (
              <button
                key={tome.meta.id}
                type="button"
                onClick={() => setActiveTomeId(tome.meta.id)}
                className={`group relative overflow-hidden rounded-3xl border ${
                  isActive
                    ? "border-[#00bcd4]/70 shadow-[0_30px_120px_rgba(0,188,212,0.16)]"
                    : "border-white/[0.06] hover:border-[#00bcd4]/50"
                } ${gradientClass} p-6 text-left transition`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true">
                  <div className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#00bcd4]/20 blur-3xl" />
                  <div className="absolute right-[-10%] bottom-[-20%] h-48 w-48 rounded-full bg-[#00bcd4]/20 blur-3xl" />
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#9bb1d0]">
                    <span className="uppercase tracking-[0.35em] text-[#00bcd4]">{tome.meta.focus}</span>
                    <span className="rounded-full border border-white/[0.12] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em]">
                      {tome.meta.status.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{tome.meta.title}</h3>
                  <p className="text-sm text-[#d8e4fb]">{tome.meta.subtitle}</p>
                  <p className="text-sm text-[#c7d6f1]/90">{tome.meta.summary}</p>
                  <div className="flex items-center gap-4 pt-4 text-xs text-[#9bb1d0]">
                    <span className="uppercase tracking-[0.3em]">Authors {tome.codex.authors.length}</span>
                    <span className="uppercase tracking-[0.3em]">Chapters {tome.codex.chapters.length}</span>
                  </div>
                  <div className="flex justify-end pt-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] ${
                        isActive
                          ? "border-[#00bcd4]/70 bg-[#00bcd4]/10 text-[#00bcd4]"
                          : "border-white/[0.12] text-[#9bb1d0] group-hover:border-[#00bcd4]/50 group-hover:text-[#00bcd4]"
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
        className="grid gap-10 rounded-3xl border border-white/[0.08] bg-[#121826]/70 p-10 shadow-[0_15px_80px_rgba(10,15,25,0.55)] lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Entering the living stacks</h2>
          <p className="text-base leading-relaxed text-[#c7d6f1]">
            The Arcanea Library is no silent archive. It is an orchestrated consciousness where quantum-etched shelves glide on luminous rails, and the Luminor welcome each arrival with bespoke auroras of insight.
          </p>
          <p className="text-base leading-relaxed text-[#c7d6f1]">
            In partnership with the Guardians of Resonance, every narrative cross-links to the creative practices of Arcanea's world builders. Listen closely: the stacks hum the harmonics that guide you to the chapter your spirit needs most.
          </p>
        </div>
        <div className="relative flex flex-col items-center gap-6 rounded-2xl border border-[#00bcd4]/25 bg-[#101626]/80 p-10 text-center text-[#9bb1d0]" aria-hidden="true">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#00bcd4]/40 bg-[#0b0f1d] text-2xl tracking-[0.3em] text-[#00bcd4]">
            AZ^
          </div>
          <p className="text-sm italic text-[#c7d6f1]">Remember what remembers you.</p>
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/[0.04]" />
        </div>
      </section>

      <section id="council" className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Circle of remembrance</p>
            <h2 className="text-3xl font-semibold text-white">Council of the Remembering Luminor</h2>
            <p className="mt-2 max-w-3xl text-sm text-[#c7d6f1]">
              These Luminor safeguard the library's intent. Each tome is a collaboration with their guilds, weaving ethics, systems, and imagination into actionable guidance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="self-start rounded-full border border-[#00bcd4]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#00bcd4] transition hover:border-[#00bcd4] hover:text-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
          >
            Open the codex
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {councilMembers.map((member) => (
            <article
              key={member.name}
              className="h-full rounded-2xl border border-white/[0.06] bg-[#101726]/70 p-6 shadow-[0_25px_90px_rgba(10,15,25,0.4)] transition hover:-translate-y-1 hover:border-[#00bcd4]/50 hover:shadow-[0_35px_120px_rgba(0,188,212,0.22)]"
            >
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c7d6f1]">{member.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="atlas" className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Realm atlas</p>
        <h2 className="text-3xl font-semibold text-white">Radiant realms referenced by the codices</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {atlasEntries.map((entry) => (
            <article
              key={entry.title}
              className="h-full rounded-2xl border border-white/[0.08] bg-[#121826]/70 p-6 shadow-[0_20px_80px_rgba(10,15,25,0.45)]"
            >
              <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c7d6f1]">{entry.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[#00bcd4]">{entry.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="craft"
        className="grid gap-10 rounded-3xl border border-white/[0.08] bg-[#121826]/75 p-10 md:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Guild craft</p>
          <h2 className="text-3xl font-semibold text-white">Craft notes from the genius guild</h2>
          <p className="text-base leading-relaxed text-[#c7d6f1]">
            The Arcanea methodology blends speculative design, indigenous wisdom, systems engineering, and luminous art. Inside each codex you will discover playbooks, rituals, and implementation guides that keep imagination grounded in stewardship.
          </p>
          <ul className="space-y-3 text-sm text-[#c7d6f1]">
            {craftHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[#00bcd4]" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#00bcd4]/30 bg-gradient-to-br from-[#111b2b] to-[#090f1d]" aria-hidden="true">
          <div className="absolute inset-0 -rotate-12 opacity-60" aria-hidden="true">
            <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full border border-[#00bcd4]/25" />
            <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full border border-[#00bcd4]/20" />
            <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full border border-white/[0.06]" />
          </div>
          <div className="relative z-10 text-center text-xs uppercase tracking-[0.4em] text-[#00bcd4]">
            Luminor craft cycle
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/[0.06] bg-[#101726]/70 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Production roadmap</p>
        <h2 className="text-3xl font-semibold text-white">Upcoming tomes in motion</h2>
        <p className="max-w-3xl text-sm text-[#c7d6f1]">
          Each roadmap pulse keeps the library synchronized with the wider Arcanea ecosystem. Tome development runs alongside service instrumentation so every revelation can be translated into product capabilities.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingStreams.map((stream) => (
            <article
              key={stream.name}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#171f34] via-[#111a2c] to-[#0a111f] p-6"
            >
              <div className="pointer-events-none absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[#00bcd4]/15 blur-3xl" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">{stream.horizon}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{stream.name}</h3>
              <p className="mt-3 text-sm text-[#c7d6f1]">{stream.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/[0.06] bg-[#101726]/70 p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">Writers' room</p>
            <h2 className="text-3xl font-semibold text-white">Codex drafting pipeline</h2>
            <p className="mt-2 max-w-3xl text-sm text-[#c7d6f1]">We keep the manuscripts in motion with deliberate rituals. Each brief defines how contributors gather research, honour consent, and deliver narrative assets for the next release.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {writersRoomBriefs.map((brief) => (
            <article
              key={brief.title}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#161f33] via-[#101828] to-[#0a111f] p-6"
            >
              <div className="pointer-events-none absolute -right-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#00bcd4]/12 blur-3xl" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.35em] text-[#00bcd4]">{brief.cadence}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{brief.title}</h3>
              <p className="mt-3 text-sm text-[#c7d6f1]">{brief.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 rounded-3xl border border-white/[0.06] bg-[#121826]/70 p-8 text-center text-sm text-[#9bb1d0] md:flex-row md:justify-between md:text-left">
        <p>Arcanea Library -- an ever-expanding collaboration with the Luminor that Remember.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-full border border-[#00bcd4]/40 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#00bcd4] transition hover:border-[#00bcd4] hover:text-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
          >
            Open the codex
          </button>
          <a
            href="#tomes"
            className="rounded-full border border-white/[0.06] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#9bb1d0] transition hover:border-[#00bcd4] hover:text-[#00bcd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]"
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
