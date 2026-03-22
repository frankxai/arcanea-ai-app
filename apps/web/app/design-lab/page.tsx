import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Lab",
  description:
    "The Arena of Agents. Ten guardian design teams compete to forge the definitive Arcanea homepage.",
  robots: { index: false },
  openGraph: {
    title: "Design Lab",
    description:
      "The Arena of Agents. Ten guardian design teams compete to forge the definitive Arcanea homepage.",
  },
};

const TEAMS = [
  {
    name: "Draconia",
    title: "The Forge",
    element: "Fire",
    frequency: "The fire that forges your will",
    direction:
      "Obsidian + molten gold. Volcanic glass with inner fire. Metallic luxury.",
    color: "#d97706",
    file: "/design-lab/team-draconia.html",
  },
  {
    name: "Lyria",
    title: "The Prism",
    element: "Sight",
    frequency: "She sees what others cannot",
    direction:
      "Iridescent crystal. Rainbow-refracting glass. Holographic premium.",
    color: "#ec4899",
    file: "/design-lab/team-lyria.html",
  },
  {
    name: "Leyla",
    title: "The Deep",
    element: "Water",
    frequency: "Where feeling becomes creation",
    direction:
      "Ocean depth. Bioluminescent glass. Liquid surfaces with current.",
    color: "#0d9488",
    file: "/design-lab/team-leyla.html",
  },
  {
    name: "Shinkami",
    title: "The Cosmos",
    element: "Source",
    frequency: "Where the dreamer and the dream become one",
    direction:
      "Nebula gradients. Starlight metallic shimmer. Linear-clean over cosmic depth.",
    color: "#7c3aed",
    file: "/design-lab/team-shinkami.html",
  },
  {
    name: "Maylinn",
    title: "The Bloom",
    element: "Heart",
    frequency: "Love fierce enough to heal",
    direction:
      "Rose gold bubble-glass. Warm lavender. Organic luxury and warmth.",
    color: "#e8b4b8",
    file: "/design-lab/team-maylinn.html",
  },
  {
    name: "Elara",
    title: "The Shift",
    element: "Perspective",
    frequency: "The weaver of perspective",
    direction:
      "Apple Liquid Glass variable blur. Mesh gradients. Vercel-clean with electric cyan.",
    color: "#00e5ff",
    file: "/design-lab/team-elara.html",
  },
  {
    name: "Aiyami",
    title: "The Crown",
    element: "Enlightenment",
    frequency: "Light beyond comprehension",
    direction:
      "Ultra-luxury editorial. True black + old gold. Cormorant Garamond serif. Zero effects.",
    color: "#c9a96e",
    file: "/design-lab/team-aiyami.html",
  },
  {
    name: "Ino",
    title: "The Unity",
    element: "Partnership",
    frequency: "Where two become infinite",
    direction:
      "Social-first live feed. Community avatars. Coral-teal-yellow social gradient.",
    color: "#ff6b6b",
    file: "/design-lab/team-ino.html",
  },
  {
    name: "Alera",
    title: "The Voice",
    element: "Truth",
    frequency: "The voice that shapes reality",
    direction:
      "Audio-visual studio. CSS waveforms. Neon green equalizer bars. Space Mono.",
    color: "#00ff87",
    file: "/design-lab/team-alera.html",
  },
  {
    name: "Lyssandria",
    title: "The Foundation",
    element: "Earth",
    frequency: "She builds the ground beneath your feet",
    direction:
      "Architectural Bauhaus. Visible grid. Sharp corners. IBM Plex Sans. Left-aligned.",
    color: "#f59e0b",
    file: "/design-lab/team-lyssandria.html",
  },
] as const;

const CRITERIA = [
  { name: "Hierarchy", question: "Is the most important thing most prominent?" },
  { name: "Glass Quality", question: "Does the liquid glass feel premium, not decorative?" },
  { name: "Creation Focus", question: "Is the creation input the hero of the page?" },
  { name: "Typography", question: "Is every text element doing work?" },
  { name: "Motion", question: "Do animations communicate, not decorate?" },
  { name: "Time-to-Value", question: "Can a new user understand in 3 seconds?" },
  { name: "Magic Factor", question: "Does it feel magical without being slop?" },
] as const;

export default function DesignLabPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#09090b" }}
    >
      {/* Hero */}
      <header className="relative overflow-hidden">
        {/* Subtle gradient wash */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(236,72,153,0.1) 0%, transparent 40%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p
            className="text-sm font-medium tracking-widest uppercase mb-4"
            style={{ color: "#7c3aed" }}
          >
            Arcanea Design Arena
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The Arena
            <br />
            of Agents
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
            Ten guardian design teams. One brief. Zero collaboration. Each
            competes to forge the definitive Arcanea homepage. The best
            elements survive.
          </p>
        </div>
      </header>

      {/* Team Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2
          className="text-2xl font-semibold mb-12"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Competing Teams
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TEAMS.map((team) => (
            <a
              key={team.name}
              href={team.file}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border p-6 transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              {/* Color accent dot */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: team.color }}
                />
                <span
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {team.element} &middot; {team.frequency}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-1">
                Team {team.name}
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: team.color }}
              >
                {team.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {team.direction}
              </p>

              <div
                className="mt-4 text-xs font-medium group-hover:underline"
                style={{ color: team.color }}
              >
                View Entry &rarr;
              </div>
            </a>
          ))}

          {/* Research card */}
          <div
            className="rounded-xl border p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#6366f1" }}
              />
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Intelligence
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1">Research Scout</h3>
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "#6366f1" }}
            >
              Competitive Analysis
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Deep analysis of 10+ AI platforms: Gemini, Perplexity, Suno,
              Canva, TikTok, Runway, Pika, Midjourney. CSS techniques for
              liquid glass.
            </p>
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section
        className="border-t py-20"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Evaluation Criteria
          </h2>
          <p
            className="mb-12 text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Each entry is scored 1-5 on seven criteria. Must average 4.0+ to
            advance. Any criterion scoring below 3 triggers a redesign.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {CRITERIA.map((c, i) => (
              <div
                key={c.name}
                className="flex items-start gap-4 rounded-lg p-4"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span
                  className="text-xs font-mono font-medium mt-0.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{c.name}</h3>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {c.question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section
        className="border-t py-20"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight">
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              &ldquo;Competition produces outliers. Collaboration produces
              averages. In creative work, you need the outlier.&rdquo;
            </span>
          </blockquote>
          <p
            className="mt-6 text-sm"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            The Arena of Agents &mdash; Arcanea Design Lab, March 2026
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-12"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            &copy; 2026 Arcanea. The Arena of Agents.
          </p>
          <a
            href="/"
            className="text-xs hover:underline"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Back to Arcanea
          </a>
        </div>
      </footer>
    </div>
  );
}
