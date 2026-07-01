import { Suspense } from "react";
import { getAtlasUniverses, getAtlasArcaneaVariants } from "@/lib/atlas/client";
import type { AtlasUniverse, AtlasArcaneaVariant } from "@/lib/atlas/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creature Atlas | Arcanea",
  description:
    "A multiverse encyclopedia of creatures, Leviathans, and Arcanea-original variants — fully open for community contribution.",
};

export const revalidate = 3600;

function UniverseCard({ universe }: { universe: AtlasUniverse }) {
  return (
    <div className="group relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-[#00bcd4]/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white/90 group-hover:text-[#00bcd4] transition-colors">
            {universe.name}
          </h3>
          <p className="mt-0.5 text-sm text-white/40">{universe.studio}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40 uppercase tracking-wide">
          {universe.medium}
        </span>
      </div>
      <p className="mt-3 text-sm text-white/60 line-clamp-3">{universe.description}</p>
      {universe.arcanea_elements && universe.arcanea_elements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {universe.arcanea_elements.map((el) => (
            <span
              key={el}
              className="rounded-full bg-[#0d47a1]/20 border border-[#0d47a1]/30 px-2 py-0.5 text-xs text-[#00bcd4]/80"
            >
              {el}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantCard({ variant }: { variant: AtlasArcaneaVariant }) {
  return (
    <div className="group relative rounded-xl border border-[#ffd700]/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-[#ffd700]/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#ffd700]/90 group-hover:text-[#ffd700] transition-colors">
            {variant.name}
          </h3>
          <p className="mt-0.5 text-xs text-white/40 uppercase tracking-wide">
            Tier {variant.arcanea_tier} · {variant.domain}
          </p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide",
            variant.canon_status === "locked"
              ? "border-[#00bcd4]/40 text-[#00bcd4]"
              : "border-white/10 text-white/30",
          ].join(" ")}
        >
          {variant.canon_status}
        </span>
      </div>
      <p className="mt-3 text-sm text-white/60 line-clamp-3">{variant.description}</p>
      {variant.elements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {variant.elements.map((el) => (
            <span
              key={el}
              className="rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 px-2 py-0.5 text-xs text-[#ffd700]/70"
            >
              {el}
            </span>
          ))}
        </div>
      )}
      {variant.material_correspondence && (
        <p className="mt-3 text-xs text-white/30 italic">
          ✦ {variant.material_correspondence.split(" — ")[0]}
        </p>
      )}
    </div>
  );
}

async function AtlasContent() {
  let universes: AtlasUniverse[] = [];
  let variants: AtlasArcaneaVariant[] = [];
  try {
    [universes, variants] = await Promise.all([
      getAtlasUniverses(),
      getAtlasArcaneaVariants("staging"),
    ]);
  } catch {
    // Tables not yet seeded / migration pending — render empty state
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/20 bg-[#00bcd4]/5 px-3 py-1 text-xs text-[#00bcd4] mb-4">
          ⏳ STAGING — community open
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Creature Atlas
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          A multiverse encyclopedia of creatures, Leviathans, and Arcanea-original variants.
          Open for community contribution via the{" "}
          <a
            href="https://github.com/frankxai/arcanea/blob/main/.arcanea/lore/atlas/WORLD_REPO_STANDARD.md"
            className="text-[#00bcd4] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Repo Standard
          </a>
          .
        </p>
      </div>

      {/* Universes */}
      {universes.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white/80">Reference Universes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universes.map((u) => (
              <UniverseCard key={u.id} universe={u} />
            ))}
          </div>
        </section>
      )}

      {/* Arcanea Variants */}
      {variants.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-2 text-xl font-semibold text-white/80">Arcanea Variants</h2>
          <p className="mb-6 text-sm text-white/40">
            Wholly original Arcanea creatures inspired by reference universes. Fully owned, promptable, STAGING canon.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((v) => (
              <VariantCard key={v.id} variant={v} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {universes.length === 0 && variants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-white/30 text-lg">Atlas is being populated.</p>
          <p className="mt-2 text-white/20 text-sm">
            Seed the database via{" "}
            <code className="font-mono text-[#00bcd4]/60">apps/web/lib/atlas/seed/avatar.ts</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00bcd4] border-t-transparent" />
          </div>
        }
      >
        <AtlasContent />
      </Suspense>
    </main>
  );
}
