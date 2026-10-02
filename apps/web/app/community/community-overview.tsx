import Image from "next/image";
import Link from "next/link";
import {
  PhArrowUpRight,
  PhChatCircle,
  PhGitBranch,
  PhGithubLogo,
  PhLeaf,
  PhUsers,
} from "@/lib/phosphor-icons";
import {
  OSS_STATS,
  WAYS_TO_CONTRIBUTE,
  FEATURED_REPOS,
} from "./community-data";

export function CommunityOverview() {
  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-16 sm:py-20 lg:px-20 lg:py-24">
          <Image
            src="/guardians/v3/elara-hero-v3.webp"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.11] pointer-events-none object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-8">
              <PhUsers className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                Community
              </span>
            </div>

            <h1 className="text-fluid-hero font-display font-bold mb-6 leading-none tracking-tight">
              Join the
              <span className="block text-gradient-brand">
                Creative Civilization
              </span>
            </h1>

            <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-10">
              Not just users — co-creators. Contribute lore, agents, skills,
              code, art, music. Shape a living ecosystem where imagination
              becomes infrastructure and every creator has a voice.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://discord.gg/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
              >
                <PhChatCircle className="w-4 h-4" />
                Join Discord
              </a>
              <a
                href="https://github.com/frankxai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
              >
                <PhGithubLogo className="w-4 h-4" />
                Explore GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Open Source Stats ─────────────────────────────────────────── */}
      <section
        className="py-16 border-t border-white/[0.04]"
        aria-labelledby="oss-stats-heading"
      >
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
            <PhGithubLogo className="w-3 h-3 text-crystal" />
            <span className="text-xs font-mono tracking-widest uppercase text-crystal">
              Open Source
            </span>
          </div>
          <h2
            id="oss-stats-heading"
            className="text-fluid-3xl font-display font-bold mb-4"
          >
            Built in the open
          </h2>
          <p className="text-text-secondary font-sans max-w-2xl">
            Arcanea is fully open source. Explore the codebase, contribute
            features, build skills, and help shape the platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {OSS_STATS.map((stat) => (
            <div
              key={stat.label}
              className="relative card-3d liquid-glass rounded-2xl p-6 text-center overflow-hidden group hover-lift transition-all"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, ${stat.color}12, transparent 70%)`,
                }}
              />
              <div className="relative">
                <p
                  className="text-3xl md:text-4xl font-display font-bold mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted font-sans">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Ways to Contribute ───────────────────────────────────────── */}
      <section
        className="py-16 border-t border-white/[0.04]"
        aria-labelledby="contribute-heading"
      >
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-earth/30 bg-earth/10 mb-5">
            <PhLeaf className="w-3 h-3 text-earth" />
            <span className="text-xs font-mono tracking-widest uppercase text-earth-bright">
              Contribute
            </span>
          </div>
          <h2
            id="contribute-heading"
            className="text-fluid-3xl font-display font-bold mb-4"
          >
            Ways to shape Arcanea
          </h2>
          <p className="text-text-secondary font-sans max-w-2xl">
            The platform, the mythology, and the intelligence layer are all open
            to contribution. Every form of creative work is welcome here.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WAYS_TO_CONTRIBUTE.map((way) => {
            const Icon = way.icon;
            return (
              <div
                key={way.title}
                className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%, ${way.color}15, transparent 65%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${way.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: way.color }} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-1">
                    {way.title}
                  </h3>
                  <p
                    className="text-sm font-mono mb-3 opacity-80"
                    style={{ color: way.color }}
                  >
                    {way.subtitle}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                    {way.description}
                  </p>
                  <ul className="space-y-1.5" role="list">
                    {way.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-text-muted font-sans"
                      >
                        <span
                          className="mt-1 w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: way.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Featured Repos ───────────────────────────────────────────── */}
      <section
        className="py-16 border-t border-white/[0.04]"
        aria-labelledby="repos-heading"
      >
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
            <PhGitBranch className="w-3 h-3 text-brand-gold" />
            <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
              Featured Repos
            </span>
          </div>
          <h2
            id="repos-heading"
            className="text-fluid-3xl font-display font-bold mb-4"
          >
            Explore the ecosystem
          </h2>
          <p className="text-text-secondary font-sans max-w-2xl">
            The Arcanea ecosystem spans multiple repositories. Start with any of
            these to contribute, learn, or build something new.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURED_REPOS.map((repo) => {
            const RepoIcon = repo.icon;
            return (
              <a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
                aria-label={`${repo.name} — ${repo.description}`}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, ${repo.color}12, transparent 65%)`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${repo.color}18` }}
                    >
                      <RepoIcon
                        className="w-5 h-5"
                        style={{ color: repo.color }}
                      />
                    </div>
                    <PhArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-mono font-semibold text-lg mb-1">
                    {repo.name}
                  </h3>
                  <p className="text-xs text-text-muted font-mono mb-3">
                    {repo.fullName}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {repo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${repo.color}10`,
                          color: repo.color,
                          borderColor: `${repo.color}25`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/frankxai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-crystal/10 border border-crystal/20 text-crystal font-semibold hover:bg-crystal/15 hover:border-crystal/30 transition-all btn-glow"
          >
            <PhGithubLogo className="w-4 h-4" />
            View all repositories
            <PhArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </>
  );
}
