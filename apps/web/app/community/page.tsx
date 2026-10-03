import { type Metadata } from "next";
import Link from "next/link";
import {
  PhArrowRight,
  PhArrowUpRight,
  PhCalendar,
  PhChatCircle,
  PhDrop,
  PhFlame,
  PhLeaf,
  PhShieldStar,
  PhSparkle,
  PhStar,
} from "@/lib/phosphor-icons";
import { CommunityOverview } from "./community-overview";
import { NewsletterForm } from "@/components/community/newsletter-form";
import {
  CANONICAL_REPO_URL,
  COMMUNITY_SPACES,
  EVENT_IDEAS,
  CREATION_IDEAS,
  QUICK_LINKS,
} from "./community-data";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Read Arcanea stories, explore the source and register interest in community updates.",
  openGraph: {
    title: "Community",
    description:
      "Read Arcanea stories, explore the source and register interest in community updates.",
  },
};

// ─── Page Component ────────────────────────────────────────────────────────────

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <div
        id="community-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <CommunityOverview />

        {/* ── 5. Community Spaces ─────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="spaces-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
              <span className="text-xs font-mono tracking-widest text-crystal">
                Reader and builder paths
              </span>
            </div>
            <h2
              id="spaces-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Read, build and follow
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              Read the books and Library, explore the repository, or register
              your interest in what comes next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COMMUNITY_SPACES.map((space) => {
              const Icon = space.icon;
              return (
                <Link
                  key={space.id}
                  href={space.href}
                  target={
                    space.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    space.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`group relative card-3d liquid-glass rounded-2xl p-8 overflow-hidden glow-card hover-lift transition-all ${space.borderHoverClass}`}
                  aria-label={`${space.name} — ${space.tagline}`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 30%, ${space.glowColor}, transparent 65%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${space.accentClass}`}
                      >
                        <Icon className={`w-5 h-5 ${space.iconColor}`} />
                      </div>
                      <span
                        className={`text-xs font-mono px-3 py-1 rounded-full border ${space.badgeBg}`}
                      >
                        {space.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {space.name}
                    </h3>
                    <p
                      className={`text-sm font-mono mb-3 ${space.iconColor} opacity-80`}
                    >
                      {space.tagline}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                      {space.description}
                    </p>
                    <ul className="space-y-1.5 mb-6" role="list">
                      {space.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-text-muted font-sans"
                        >
                          <span
                            className={`mt-1 w-1 h-1 rounded-full shrink-0 ${space.iconColor.replace("text-", "bg-")}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className={space.iconColor}>{space.cta}</span>
                      <PhArrowUpRight
                        className={`w-3.5 h-3.5 ${space.iconColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 6. Events ───────────────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="events-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
              <PhCalendar className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest text-brand-gold">
                Gatherings
              </span>
            </div>
            <h2
              id="events-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Gathering ideas
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              These formats are proposals. No dates are announced here. Register
              your interest if you would like to follow their development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_IDEAS.map((event) => {
              const EventIcon = event.icon;
              const FormatIcon = event.formatIcon;
              return (
                <div
                  key={event.title}
                  className={`relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden transition-all ${event.featured ? "ring-1 ring-brand-gold/30 shadow-glow-gold" : ""}`}
                >
                  {event.featured && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/8 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  )}
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${event.accentHex}18` }}
                    >
                      <EventIcon
                        className="w-4 h-4"
                        style={{ color: event.accentHex }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${event.accentHex}15`,
                          color: event.accentHex,
                          borderColor: `${event.accentHex}30`,
                        }}
                      >
                        {event.badgeText}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                      <FormatIcon className="w-3 h-3 shrink-0" />
                      <span>{event.format}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a
              href="#community-updates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl liquid-glass border border-brand-gold/20 text-brand-gold text-sm font-semibold hover:bg-brand-gold/5 hover:border-brand-gold/40 transition-all"
            >
              <PhCalendar className="w-4 h-4" />
              Register interest in gatherings
              <PhArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── 7. Creator Spotlight ─────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="spotlight-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/20 bg-water/8 mb-5">
              <PhStar className="w-3 h-3 text-water" />
              <span className="text-xs font-mono tracking-widest text-water">
                Creative starting points
              </span>
            </div>
            <h2
              id="spotlight-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Creation ideas
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              These are starting concepts for writing, art and music inspired by
              Arcanea. Explore one in your own creative practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CREATION_IDEAS.map((work) => (
              <div
                key={work.title}
                className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${work.accent}18, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border mb-5"
                    style={{
                      backgroundColor: `${work.accent}15`,
                      color: work.accent,
                      borderColor: `${work.accent}30`,
                    }}
                  >
                    {work.type}
                  </div>
                  <div
                    className="w-full h-28 rounded-xl mb-5 flex items-center justify-center"
                    style={{
                      backgroundColor: `${work.accent}10`,
                      borderColor: `${work.accent}20`,
                    }}
                    aria-hidden="true"
                  >
                    <PhSparkle
                      className="w-6 h-6 opacity-40"
                      style={{ color: work.accent }}
                    />
                  </div>
                  <h3 className="font-display font-semibold mb-1">
                    {work.title}
                  </h3>
                  <p
                    className={`text-xs font-mono mb-3 ${work.gateColor} opacity-80`}
                  >
                    {work.gate}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-4">
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-text-muted font-sans">
            Have a concept to discuss?{" "}
            <a
              href={CANONICAL_REPO_URL + "/issues"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-crystal underline underline-offset-2 hover:text-crystal-bright transition-colors"
            >
              Propose it in the repository
            </a>
            .
          </p>
        </section>

        {/* ── 8. Community Links ──────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="links-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/8 mb-5">
              <PhShieldStar className="w-3 h-3 text-brand-primary" />
              <span className="text-xs font-mono tracking-widest text-brand-primary">
                Connect
              </span>
            </div>
            <h2
              id="links-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Useful links
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    link.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center gap-4 liquid-glass rounded-xl p-5 hover-lift transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${link.color}18` }}
                  >
                    <LinkIcon
                      className="w-4.5 h-4.5"
                      style={{ color: link.color }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{link.label}</p>
                    <p className="text-xs text-text-muted font-mono truncate">
                      {link.detail}
                    </p>
                  </div>
                  <PhArrowUpRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 ml-auto shrink-0 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 9. Newsletter CTA ───────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          id="community-updates"
          aria-labelledby="newsletter-heading"
        >
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhSparkle className="w-3 h-3 text-brand-primary" />
                <span className="text-xs font-mono tracking-wide text-brand-primary">
                  Arcanea updates
                </span>
              </div>
              <h2
                id="newsletter-heading"
                className="text-fluid-3xl font-display font-bold mb-4"
              >
                Follow the worlds
                <span className="block text-gradient-brand">taking shape</span>
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8 max-w-xl">
                Register your interest in Arcanea stories, worlds and release
                updates.
              </p>
              <NewsletterForm />
              <p className="mt-3 text-xs text-text-muted font-sans">
                This saves your interest. It does not create an account or start
                a paid plan.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. Philosophy Banner ─────────────────────────────────────────── */}
        <section className="py-16 pb-24 border-t border-white/[0.04]">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="h-0.5 w-full bg-gradient-to-r from-fire via-brand-primary via-crystal via-water to-earth" />
            <div className="px-8 py-16 sm:px-14 sm:py-20 text-center">
              <div
                className="flex justify-center gap-5 mb-10"
                aria-hidden="true"
              >
                <div className="w-8 h-8 rounded-lg bg-fire/15 flex items-center justify-center">
                  <PhFlame className="w-4 h-4 text-fire" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-water/15 flex items-center justify-center">
                  <PhDrop className="w-4 h-4 text-water" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-earth/15 flex items-center justify-center">
                  <PhLeaf className="w-4 h-4 text-earth" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-crystal/15 flex items-center justify-center">
                  <PhSparkle className="w-4 h-4 text-crystal" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-primary/15 flex items-center justify-center">
                  <PhStar className="w-4 h-4 text-brand-primary" />
                </div>
              </div>

              <blockquote className="max-w-3xl mx-auto">
                <p className="text-fluid-3xl font-display font-bold leading-snug mb-6">
                  The antidote to a terrible future{" "}
                  <span className="text-gradient-crystal">
                    is imagining a good one.
                  </span>
                </p>
                <p className="text-xl font-display font-semibold text-brand-gold mb-8">
                  Build it here.
                </p>
                <p className="text-text-secondary font-body leading-relaxed max-w-xl mx-auto">
                  Every creator who joins this community, every skill
                  contributed, every line of code, every Library text written —
                  all of it is a vote for the future we want to inhabit. The Arc
                  turns. Begin.
                </p>
              </blockquote>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <a
                  href="#community-updates"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhChatCircle className="w-4 h-4" />
                  Follow Arcanea updates
                </a>
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  Explore the Academy
                  <PhArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-earth via-crystal via-water via-brand-primary to-fire" />
          </div>
        </section>
      </div>
    </div>
  );
}
