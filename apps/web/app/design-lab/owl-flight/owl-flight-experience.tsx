"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Design-lab secluded surface (Hermes branch).
 * Premium bar: real Arcanea stills + Lenis + GSAP scrub — not primitive 3D fillers.
 * Route is noindex and isolated from Codex homepage-world-engine work.
 */

type FlightBeat = {
  id: string;
  chapter: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const BEATS: FlightBeat[] = [
  {
    id: "takeoff",
    chapter: "I · Takeoff",
    title: "Follow the guide",
    body: "A single luminous guide lifts from the dark. Scroll becomes wingbeat — the veil thins.",
    image: "/images/mascot/arcanea-hero-flight.png",
    alt: "Arcanea guide in flight — luminous silhouette against the void",
  },
  {
    id: "forest",
    chapter: "II · The Crystal Forest",
    title: "Through living glass",
    body: "Trees of light. Memory in the leaves. The world scales from intimate to gigantic without a hard cut.",
    image: "/images/arcanea-universe/the_crystal_forest_1783294027797.png",
    alt: "Crystal forest of Arcanea — luminous trees in mythic night",
  },
  {
    id: "edge",
    chapter: "III · Edge of the Abyss",
    title: "Where potential lives",
    body: "Nero’s gift is not evil — it is unformed potential. The flight holds the edge, then turns toward order.",
    image: "/images/arcanea-universe/the_abyss_edge_1783294012996.png",
    alt: "Edge of the Abyss — deep void with luminous horizon",
  },
  {
    id: "gate",
    chapter: "IV · Gate",
    title: "Threshold of study",
    body: "Stone, rune, and invitation. The Academy does not conquer the dark — it teaches how to shape it.",
    image: "/images/arcanea-universe/dungeon_entrance_gate_1783294034651.png",
    alt: "Monumental entrance gate to the Academy grounds",
  },
  {
    id: "grounds",
    chapter: "V · Grounds",
    title: "A gigantic world, held",
    body: "Spires, terraces, and star-lit courts. Scale is the story — the Academy is a civilization of craft.",
    image: "/images/arcanea-universe/academy_grounds_exterior_1783294020630.png",
    alt: "Academy grounds exterior under luminous night sky",
  },
  {
    id: "hall",
    chapter: "VI · Hall",
    title: "Arrive as apprentice",
    body: "The guide settles. The hall opens. From Apprentice to Luminor — the Ten Gates begin here.",
    image: "/images/arcanea-universe/academy_hall_1783293877994.png",
    alt: "Grand interior hall of the Arcanea Academy",
  },
  {
    id: "starlight",
    chapter: "VII · Starlight Academy",
    title: "A living intelligence",
    body: "Not a brochure. A world you can study, bond, and build inside — lore, agents, and creation in one field.",
    image: "/images/arcanea-universe/alien_race_starlight_academy_1783294384574.png",
    alt: "Starlight Academy — mythic academy architecture and presence",
  },
  {
    id: "ascension",
    chapter: "VIII · Ascension",
    title: "Toward Luminor",
    body: "The flight was always a curriculum. Mastery is not escape from the world — it is authorship within it.",
    image: "/images/arcanea-universe/luminor_ascension_1783293964045.png",
    alt: "Luminor ascension — radiant figure and academy light",
  },
];

export function OwlFlightExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const buildTimeline = useCallback((root: HTMLDivElement) => {
    const stage = stageRef.current;
    if (!stage) return;

    const frames = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flight-frame]"));
    const captions = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flight-caption]"));
    const progressFill = progressRef.current;

    if (frames.length === 0) return;

    // Initial state: first frame visible, others stacked
    gsap.set(frames, { autoAlpha: 0, scale: 1.08 });
    gsap.set(frames[0], { autoAlpha: 1, scale: 1 });
    gsap.set(captions, { autoAlpha: 0, y: 28 });
    gsap.set(captions[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * (frames.length * 0.85), 3200)}`,
        scrub: 1.15,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressFill) {
            progressFill.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });

    const segment = 1 / Math.max(frames.length - 1, 1);

    frames.forEach((frame, i) => {
      if (i === 0) return;
      const start = (i - 1) * segment;
      const mid = start + segment * 0.55;

      tl.to(
        frames[i - 1],
        { autoAlpha: 0, scale: 0.96, duration: segment * 0.45 },
        start,
      );
      tl.fromTo(
        frame,
        { autoAlpha: 0, scale: 1.1 },
        { autoAlpha: 1, scale: 1, duration: segment * 0.55 },
        start + segment * 0.12,
      );

      if (captions[i - 1]) {
        tl.to(captions[i - 1], { autoAlpha: 0, y: -18, duration: segment * 0.25 }, start);
      }
      if (captions[i]) {
        tl.fromTo(
          captions[i],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: segment * 0.35 },
          mid,
        );
      }
    });

    // Subtle parallax on active image layers
    frames.forEach((frame) => {
      const img = frame.querySelector("[data-flight-img]");
      if (!img) return;
      tl.to(img, { yPercent: -6, duration: 1 }, 0);
    });
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Static stacked story — still readable without scrub
        const frames = root.querySelectorAll("[data-flight-frame]");
        const captions = root.querySelectorAll("[data-flight-caption]");
        frames.forEach((el, i) => {
          (el as HTMLElement).style.opacity = i === 0 ? "1" : "0";
        });
        captions.forEach((el, i) => {
          (el as HTMLElement).style.opacity = i === 0 ? "1" : "0";
        });
        return;
      }
      buildTimeline(root);
    },
    { scope: rootRef, dependencies: [buildTimeline] },
  );

  return (
    <SmoothScroll lerp={0.09}>
      <div
        ref={rootRef}
        className="min-h-screen bg-[#05060c] text-slate-50 selection:bg-cyan-400/30"
      >
        {/* Top bar */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05060c]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span className="text-sm font-medium tracking-wide text-white/90">
                Arcanea · Design Lab
              </span>
              <span className="hidden rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200 sm:inline">
                Secluded preview
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm text-white/60">
              <Link href="/academy" className="transition hover:text-white">
                Academy
              </Link>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </nav>
          </div>
          <div className="h-px w-full bg-white/[0.04]">
            <div
              ref={progressRef}
              className="h-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-300"
            />
          </div>
        </header>

        {/* Hero */}
        <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 pt-20 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(34,211,238,0.12),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(167,139,250,0.1),transparent_50%)]" />
          <p className="relative mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
            Design lab experiment · not production homepage
          </p>
          <h1 className="relative max-w-4xl font-serif text-5xl font-normal leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
            Follow the owl
            <span className="block bg-gradient-to-r from-cyan-200 via-violet-200 to-amber-100 bg-clip-text text-transparent">
              into the Academy
            </span>
          </h1>
          <p className="relative mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            A seamless scroll journey through Arcanea stills — flight, forest, gate, hall —
            choreographed with Lenis and GSAP ScrollTrigger. Highest-bar lab surface only.
          </p>
          <p className="relative mt-8 text-xs uppercase tracking-[0.22em] text-white/40">
            Scroll to fly
          </p>
          <div className="relative mt-3 h-10 w-px bg-gradient-to-b from-cyan-400/80 to-transparent" />
        </section>

        {/* Pinned flight stage */}
        <section ref={stageRef} className="relative h-screen w-full overflow-hidden">
          {/* Stacked cinematic frames */}
          <div className="absolute inset-0">
            {BEATS.map((beat, index) => (
              <div
                key={beat.id}
                data-flight-frame
                className="absolute inset-0"
                style={{ zIndex: index + 1 }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    data-flight-img
                    src={beat.image}
                    alt={beat.alt}
                    fill
                    priority={index < 2}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060c] via-[#05060c]/35 to-[#05060c]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(5,6,12,0.45)_100%)]" />
              </div>
            ))}
          </div>

          {/* Caption stack — single anchored region; GSAP crossfades children */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-12 pt-40 sm:pb-16">
            <div className="relative mx-auto h-44 max-w-3xl sm:h-48">
              {BEATS.map((beat) => (
                <div
                  key={beat.id}
                  data-flight-caption
                  className="absolute inset-x-0 bottom-0"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/90">
                    {beat.chapter}
                  </p>
                  <h2 className="font-serif text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                    {beat.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                    {beat.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Landing / CTA */}
        <section className="relative border-t border-white/[0.06] px-6 py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(167,139,250,0.12),transparent_50%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300/90">
                Arrival
              </p>
              <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
                The Academy is ready when you are.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
                This lab route proves the motion system Arcanea already owns: Lenis smoothing,
                GSAP scrub, pinned cinematic stages, and canon imagery. Next upgrades: real GLTF
                guide mesh, Higgsfield flight plates, and ScrollSmoother-grade polish on homepage
                when Codex world-engine lands.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#05060c] transition hover:bg-cyan-300"
                >
                  Enter Academy
                </Link>
                <Link
                  href="/design-system"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/85 backdrop-blur transition hover:border-white/30"
                >
                  Design system
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Motion stack",
                  body: "Lenis ↔ GSAP ticker bridge · ScrollTrigger pin + scrub · reduced-motion safe",
                },
                {
                  title: "Asset tier",
                  body: "Canon Arcanea stills + hero flight mascot — no sphere/cone filler as hero",
                },
                {
                  title: "Isolation",
                  body: "Branch agent/hermes/owl-academy-scroll-preview · noindex design-lab path",
                },
                {
                  title: "Next excellence",
                  body: "GLTF guide · plate sequences · optional R3F dust only as atmosphere layer",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm"
                >
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/[0.05] px-6 py-10 text-center text-xs text-white/35">
          Arcanea Design Lab · Owl Flight · Hermes secluded preview · highest execution only
        </footer>
      </div>
    </SmoothScroll>
  );
}
