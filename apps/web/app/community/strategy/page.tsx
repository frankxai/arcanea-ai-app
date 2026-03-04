'use client';

/**
 * Community Strategy - Planning & Governance
 *
 * A space for community governance, proposals, and strategic planning.
 */

import Link from "next/link";
import {
  PhUsers,
  PhSparkle,
  PhArrowRight,
  PhChecks,
  PhFileText,
  PhCheckCircle,
  PhClock,
  PhTrendUp,
  PhShield,
  PhLightbulb,
  PhChatSquare,
  PhArrowUpRight,
  PhScales,
  PhHeart,
} from '@/lib/phosphor-icons';

const ACTIVE_PROPOSALS = [
  {
    id: "prop-001",
    title: "Establish Community Moderation Council",
    description:
      "A proposal to form a dedicated moderation council elected by the community to ensure healthy discourse and adherence to community values.",
    type: "governance",
    status: "voting",
    votesFor: 156,
    votesAgainst: 23,
    totalVotes: 179,
    endsIn: "3 days",
    category: "governance",
  },
  {
    id: "prop-002",
    title: "Quarterly Creative Challenges",
    description:
      "Establish quarterly themed creative challenges with community-voted prizes and showcase events.",
    type: "initiative",
    status: "discussion",
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 42,
    endsIn: "7 days",
    category: "events",
  },
  {
    id: "prop-003",
    title: "Guardian Art Standards",
    description:
      "Define canonical guidelines for Guardian and Godbeast visual representations to maintain consistency across the community.",
    type: "standards",
    status: "voting",
    votesFor: 89,
    votesAgainst: 12,
    totalVotes: 101,
    endsIn: "1 day",
    category: "creative",
  },
];

const PAST_PROPOSALS = [
  {
    id: "prop-past-1",
    title: "Community Discord Reorganization",
    result: "passed",
    votes: 234,
    date: "Jan 2026",
  },
  {
    id: "prop-past-2",
    title: "Weekly Creation Sessions Pilot",
    result: "passed",
    votes: 189,
    date: "Dec 2025",
  },
  {
    id: "prop-past-3",
    title: "Open Source Contribution Guidelines",
    result: "passed",
    votes: 156,
    date: "Nov 2025",
  },
];

const GOVERNANCE_ROLES = [
  {
    name: "Proposer",
    description: "Submit proposals for community consideration",
    icon: PhLightbulb,
    color: "#ffd700",
  },
  {
    name: "Validator",
    description: "Review and refine proposals before voting",
    icon: PhScales,
    color: "#0d47a1",
  },
  {
    name: "Voter",
    description: "Participate in governance decisions",
    icon: PhChecks,
    color: "#00bcd4",
  },
  {
    name: "Moderator",
    description: "Ensure civil discourse in discussions",
    icon: PhShield,
    color: "#ef4444",
  },
];

const STATS = [
  { label: "Active Proposals", value: "3", icon: PhFileText },
  { label: "Total Votes Cast", value: "892", icon: PhChecks },
  { label: "Community Members", value: "2.4K", icon: PhUsers },
  { label: "Proposals Passed", value: "18", icon: PhCheckCircle },
];

export default function CommunityStrategyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhSparkle className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Strategy & Governance
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6">
                Shape the future
                <span className="block text-gradient-brand">of Arcanea</span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-8">
                Every voice matters in the evolution of Arcanea. Propose ideas,
                vote on initiatives, and help guide the community toward the
                future we envision together.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#proposals"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhChecks className="w-4 h-4" />
                  View Proposals
                </Link>
                <Link
                  href="#propose"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhLightbulb className="w-4 h-4" />
                  Submit Proposal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="liquid-glass rounded-xl p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-crystal mx-auto mb-2" />
                  <div className="text-2xl font-display font-bold text-text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted font-sans">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Active Proposals */}
        <section id="proposals" className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
              <PhChecks className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Active Proposals
              </span>
            </div>
            <h2 className="text-fluid-3xl font-display font-bold mb-4">
              Decisions in Progress
            </h2>
          </div>

          <div className="space-y-6">
            {ACTIVE_PROPOSALS.map((proposal) => {
              const forPercentage = Math.round(
                (proposal.votesFor / proposal.totalVotes) * 100,
              );
              const againstPercentage = 100 - forPercentage;

              return (
                <div
                  key={proposal.id}
                  className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden transition-all hover-lift"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                            proposal.status === "voting"
                              ? "bg-crystal/15 text-crystal border-crystal/30"
                              : "bg-brand-primary/15 text-brand-primary border-brand-primary/30"
                          }`}
                        >
                          {proposal.status}
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <PhClock className="w-3 h-3" />
                          Ends in {proposal.endsIn}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-text-muted uppercase">
                        {proposal.type}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed font-sans mb-4">
                      {proposal.description}
                    </p>

                    {/* Vote Bar */}
                    {proposal.status === "voting" ? (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-crystal">
                            For {forPercentage}%
                          </span>
                          <span className="text-fire">
                            Against {againstPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-crystal rounded-full"
                            style={{ width: `${forPercentage}%` }}
                          />
                          <div
                            className="h-full bg-fire rounded-full"
                            style={{ width: `${againstPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {proposal.totalVotes} votes
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-xs text-text-muted flex items-center gap-1.5">
                          <PhChatSquare className="w-3.5 h-3.5 text-brand-primary" />
                          {proposal.totalVotes} participants in discussion
                        </p>
                      </div>
                    )}

                    <button className="flex items-center gap-2 text-sm text-crystal opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Cast Your Vote</span>
                      <PhArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Governance Roles */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
              <PhShield className="w-3 h-3 text-crystal" />
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                Community Roles
              </span>
            </div>
            <h2 className="text-fluid-3xl font-display font-bold mb-4">
              Participate in Governance
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOVERNANCE_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.name}
                  className="card-3d liquid-glass rounded-2xl p-6 text-center hover-lift transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${role.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: role.color }} />
                  </div>
                  <h3 className="font-display font-semibold mb-1">
                    {role.name}
                  </h3>
                  <p className="text-text-muted text-xs font-sans">
                    {role.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past Proposals */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/20 bg-water/8 mb-5">
              <PhCheckCircle className="w-3 h-3 text-water" />
              <span className="text-xs font-mono tracking-widest uppercase text-water">
                History
              </span>
            </div>
            <h2 className="text-fluid-3xl font-display font-bold mb-4">
              Past Decisions
            </h2>
          </div>

          <div className="liquid-glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-mono text-text-muted uppercase tracking-wider px-6 py-4">
                    Proposal
                  </th>
                  <th className="text-left text-xs font-mono text-text-muted uppercase tracking-wider px-6 py-4">
                    Result
                  </th>
                  <th className="text-left text-xs font-mono text-text-muted uppercase tracking-wider px-6 py-4">
                    Votes
                  </th>
                  <th className="text-left text-xs font-mono text-text-muted uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {PAST_PROPOSALS.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-text-primary font-sans">
                        {proposal.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-crystal">
                        <PhCheckCircle className="w-3 h-3" />
                        {proposal.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-sm">
                      {proposal.votes}
                    </td>
                    <td className="px-6 py-4 text-text-muted text-sm">
                      {proposal.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section id="propose" className="py-16 border-t border-white/[0.04] pb-24">
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />

            <div className="relative max-w-2xl text-center mx-auto">
              <PhLightbulb className="w-8 h-8 text-brand-gold mx-auto mb-6 pt-4" />
              <h2 className="text-fluid-3xl font-display font-bold mb-4">
                Have a proposal?
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8 max-w-xl mx-auto">
                Ideas for improving Arcanea start here. Submit a proposal for
                community consideration and gather support for your vision.
              </p>
              <Link
                href="/community/strategy"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
              >
                <PhFileText className="w-4 h-4" />
                Submit Proposal
                <PhArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
