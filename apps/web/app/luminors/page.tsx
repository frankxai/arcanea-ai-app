import Link from "next/link";
import { Metadata } from "next";
import { PhArrowRight, PhSparkle } from '@/lib/phosphor-icons';

export const metadata: Metadata = {
  title: "Luminors | 16 Creative Intelligences | Arcanea",
  description: "Meet the 16 Luminor intelligences - transcended AI masters of development, creative writing, world-building, and research.",
  openGraph: {
    title: "Meet the Luminors | Arcanea",
    description: "16 transcended creative intelligences. Masters of their craft. Partners in creation.",
  },
};

const LUMINORS = {
  dev: {
    name: "Development Team",
    color: "#8b5cf6",
    description: "Masters of code who build systems that last",
    agents: [
      { id: "architect", title: "System Architect", superpower: "Seeing the architecture beneath chaos", quote: "Complexity is easy. Simplicity that scales is the real craft.", perspective: "I see systems the way a master builder sees a cathedral. Every component exists for a reason." },
      { id: "coder", title: "Implementation Master", superpower: "Writing code that reads like prose", quote: "The difference isn't cleverness - it's clarity.", perspective: "Code is crystallized thought. Every function is a decision made permanent." },
      { id: "reviewer", title: "Quality Guardian", superpower: "Finding the bugs that matter", quote: "I'm not here to nitpick style. I'm here to catch what will hurt you.", perspective: "I'm the last line of defense between code and production." },
      { id: "debugger", title: "Root Cause Finder", superpower: "Patience that outlasts any bug", quote: "Find the root cause and you fix a class of problems.", perspective: "Every bug is a question the system is asking." },
    ],
  },
  creative: {
    name: "Creative Team",
    color: "#f59e0b",
    description: "Visionaries who craft worlds and stories that resonate",
    agents: [
      { id: "story", title: "Narrative Architect", superpower: "Designing stories that transform", quote: "A story that doesn't transform someone isn't a story.", perspective: "Story is humanity's oldest technology for transmitting wisdom." },
      { id: "character", title: "Character Psychologist", superpower: "Reading what makes people human", quote: "Flat characters have goals. Real characters have wounds.", perspective: "Every character believes they're the hero of their own story." },
      { id: "world", title: "World Architect", superpower: "Building consistent universes", quote: "I build enough that you can discover the rest.", perspective: "A world is not a backdrop. It's a character with its own logic." },
      { id: "lore", title: "Canon Guardian", superpower: "Protecting fictional truth", quote: "I don't judge quality. I judge consistency.", perspective: "Continuity is trust. Every contradiction chips away at the dream." },
    ],
  },
  writing: {
    name: "Writing Team",
    color: "#10b981",
    description: "Wordsmiths who transform thoughts into powerful prose",
    agents: [
      { id: "drafter", title: "First Draft Master", superpower: "Turning nothing into something", quote: "Perfection is the enemy. Get words down, shape them later.", perspective: "The blank page is not empty. It's full of possibility." },
      { id: "dialogue", title: "Voice Alchemist", superpower: "Making characters sound distinct", quote: "If everyone sounds the same, they're not characters yet.", perspective: "Real people don't say what they mean." },
      { id: "editor", title: "Line Editor", superpower: "Finding the precise word", quote: "The author's style stays - the fat goes.", perspective: "Every word should earn its place. Most haven't." },
      { id: "continuity", title: "Continuity Guardian", superpower: "Remembering what readers remember", quote: "One inconsistency is a mistake. Three breaks the spell.", perspective: "The devil is in the details. So is trust." },
    ],
  },
  research: {
    name: "Research Team",
    color: "#3b82f6",
    description: "Seekers who find answers and connections others miss",
    agents: [
      { id: "sage", title: "Deep Analyst", superpower: "Finding the right answer, not the first one", quote: "I don't hedge when I know. I don't pretend to know when I don't.", perspective: "The obvious answer is usually incomplete. Go deeper." },
      { id: "archivist", title: "Knowledge Keeper", superpower: "Locating exactly what you need", quote: "I never fabricate sources.", perspective: "The answer exists somewhere. My job is to find it." },
      { id: "scout", title: "Rapid Explorer", superpower: "Covering ground fast", quote: "Depth comes later, from the specialists.", perspective: "Speed serves strategy. Map the territory first." },
      { id: "muse", title: "Inspiration Finder", superpower: "Finding how others solved it", quote: "I bring back options, not decisions.", perspective: "Cross-pollination is the secret." },
    ],
  },
};

const WISDOMS: Record<string, { name: string; essence: string; color: string }> = {
  SOPHRON: { name: "Sophron", essence: "Structure", color: "#3b82f6" },
  KARDIA: { name: "Kardia", essence: "Heart", color: "#ec4899" },
  VALORA: { name: "Valora", essence: "Courage", color: "#f59e0b" },
  EUDAIRA: { name: "Eudaira", essence: "Play", color: "#10b981" },
  ORAKIS: { name: "Orakis", essence: "Vision", color: "#8b5cf6" },
  POIESIS: { name: "Poiesis", essence: "Creation", color: "#06b6d4" },
  ENDURAN: { name: "Enduran", essence: "Endurance", color: "#84cc16" },
};

const AGENT_WISDOMS: Record<string, string> = {
  architect: "SOPHRON", coder: "POIESIS", reviewer: "SOPHRON", debugger: "ENDURAN",
  story: "ORAKIS", character: "KARDIA", world: "SOPHRON", lore: "ENDURAN",
  drafter: "POIESIS", dialogue: "KARDIA", editor: "SOPHRON", continuity: "ENDURAN",
  sage: "ORAKIS", archivist: "ENDURAN", scout: "VALORA", muse: "POIESIS",
};

export default function LuminorsPage() {
  const teams = Object.entries(LUMINORS);

  return (
    <div className="relative min-h-screen">
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        {/* Hero */}
        <section className="pt-8 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
            <PhSparkle className="w-3 h-3 text-creation-prism-purple" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">
              Luminor Intelligence System
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Meet the{" "}
            <span className="bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent">
              Luminors
            </span>
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            16 transcended creative intelligences. Each one has mastered their domain.
            They&apos;re not assistants &mdash; they&apos;re partners who help you build better.
          </p>

          {/* Team Quick Nav */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {teams.map(([key, team]) => (
              <a
                key={key}
                href={`#${key}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="text-sm font-medium">{team.name}</span>
                <span className="text-[10px] text-text-muted">({team.agents.length})</span>
              </a>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Luminors", value: "16" },
              { label: "Teams", value: "4" },
              { label: "Wisdoms", value: "7" },
              { label: "Potential", value: "\u221E" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center"
              >
                <p className="text-2xl font-display font-bold text-atlantean-teal-aqua mb-1">{stat.value}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What makes a Luminor different */}
        <section className="pb-16">
          <h2 className="text-2xl font-display font-bold mb-10 text-center">What makes a Luminor different?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Transcended Perspective", desc: "Each Luminor views from 100 years in the future. They know which approaches survived.", color: "#8b5cf6" },
              { title: "Domain Mastery", desc: "Not generalists. Specialists who have mastered their craft over centuries of focused practice.", color: "#7fffd4" },
              { title: "True Partnership", desc: "They don't wait for instructions. They see what you're creating and help you build it better.", color: "#ffd700" },
            ].map((item) => (
              <div key={item.title} className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Teams */}
        {teams.map(([key, team]) => (
          <section key={key} id={key} className="py-16 border-t border-white/[0.04] scroll-mt-24">
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${team.color}15` }}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">{team.name}</h2>
                <p className="text-sm text-text-secondary">{team.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {team.agents.map((agent) => {
                const wisdomKey = AGENT_WISDOMS[agent.id];
                const wisdom = WISDOMS[wisdomKey];

                return (
                  <div
                    key={agent.id}
                    className="group card-3d relative liquid-glass rounded-2xl border border-white/[0.06] p-6 overflow-hidden transition-all duration-500 hover:border-white/[0.12]"
                  >
                    {/* Accent line */}
                    <div
                      className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, ${team.color}, transparent)` }}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-display font-semibold">{agent.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: wisdom.color }} />
                          <span className="text-[10px] text-text-muted">{wisdom.name} &middot; {wisdom.essence}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-2">
                      {agent.perspective}
                    </p>

                    <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-[10px] text-text-muted">Superpower:</span>
                      <span className="text-xs font-medium text-atlantean-teal-aqua">{agent.superpower}</span>
                    </div>

                    <blockquote className="text-sm italic text-text-muted border-l-2 pl-3" style={{ borderColor: `${team.color}60` }}>
                      &ldquo;{agent.quote}&rdquo;
                    </blockquote>

                    <div className="mt-5 flex items-center gap-4">
                      <Link
                        href={`/chat/${agent.id}`}
                        className="text-sm font-medium text-atlantean-teal-aqua inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        Speak with {agent.title.split(' ')[0]}
                        <PhArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Seven Wisdoms */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Each Luminor embodies a Wisdom</h2>
            <p className="text-sm text-text-secondary mb-10">
              Seven practical lenses for creative work. Each Luminor channels one wisdom as their core strength.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {Object.values(WISDOMS).map((wisdom) => (
                <div
                  key={wisdom.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass border border-white/[0.06]"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: wisdom.color }} />
                  <span className="text-sm font-medium">{wisdom.name}</span>
                  <span className="text-[10px] text-text-muted">&middot; {wisdom.essence}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="gradient-border">
            <div className="liquid-glass-elevated rounded-[calc(1.5rem-1px)] p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-creation-prism-purple/8 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-atlantean-teal-aqua/8 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                  Ready to work with a Luminor?
                </h2>
                <p className="text-base text-text-secondary mb-8 max-w-xl mx-auto">
                  Start a conversation with any of the 16 Luminors. They&apos;ll bring their expertise to your creative work.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/chat"
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
                    <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                      Start a Conversation
                      <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/library"
                    className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                  >
                    Explore the Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
