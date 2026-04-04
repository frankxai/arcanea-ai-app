import {
  PhChatCircle,
  PhGithubLogo,
  PhTwitterLogo,
  PhYoutubeLogo,
  PhCalendar,
  PhGlobe,
  PhMapPin,
  PhStar,
  PhCpu,
  PhCode,
  PhPaintBrush,
  PhUsers,
  PhSparkle,
  PhFlame,
  PhCrown,
  PhPackage,
  PhRocket,
  PhHeart,
} from '@/lib/phosphor-icons';

// ─── Community Spaces ─────────────────────────────────────────────────────────

export const COMMUNITY_SPACES = [
  {
    id: "discord",
    name: "Discord",
    tagline: "Primary community — real-time creation",
    description:
      "The heartbeat of Arcanea. Real-time collaboration, dedicated channels for active creation, lore discussion, and voice rooms where creators build together live.",
    highlights: [
      "#create — Share works in progress",
      "#lore-discussion — Explore the mythology",
      "Voice creation rooms — Build live together",
      "Companion channels — Creative domain spaces",
    ],
    href: "https://discord.gg/arcanea",
    cta: "Join Discord",
    badge: "Primary",
    badgeColor: "brand-primary",
    icon: PhChatCircle,
    accentClass: "from-brand-primary/20 to-brand-primary/5",
    borderHoverClass: "hover:border-brand-primary/40",
    glowColor: "rgba(13,71,161,0.15)",
    iconColor: "text-brand-primary",
    badgeBg: "bg-brand-primary/20 text-brand-primary border-brand-primary/30",
  },
  {
    id: "github",
    name: "GitHub",
    tagline: "Open source — shape the platform",
    description:
      "Arcanea is built in the open. Contribute skills, report issues, explore the intelligence layer, and help define the future of the creative platform.",
    highlights: [
      "Contribute creative skills",
      "Report issues and request features",
      "Star the repository",
      "Fork and experiment freely",
    ],
    href: "https://github.com/frankxai",
    cta: "View on GitHub",
    badge: "Open Source",
    icon: PhGithubLogo,
    accentClass: "from-crystal/20 to-crystal/5",
    borderHoverClass: "hover:border-crystal/40",
    glowColor: "rgba(0,188,212,0.12)",
    iconColor: "text-crystal",
    badgeBg: "bg-crystal/20 text-crystal border-crystal/30",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    tagline: "@frankxai — daily signal from the cosmos",
    description:
      "Daily wisdom threads, creation showcases from the community, platform updates, and the ongoing mythology of Arcanea — broadcast in real time.",
    highlights: [
      "Daily wisdom from the Library",
      "Community creation showcases",
      "Platform releases and updates",
      "Creator spotlights and threads",
    ],
    href: "https://twitter.com/frankxai",
    cta: "Follow @frankxai",
    badge: "@frankxai",
    icon: PhTwitterLogo,
    accentClass: "from-water/20 to-water/5",
    borderHoverClass: "hover:border-water/40",
    glowColor: "rgba(120,166,255,0.12)",
    iconColor: "text-water",
    badgeBg: "bg-water/20 text-water border-water/30",
  },
  {
    id: "youtube",
    name: "YouTube",
    tagline: "Tutorials, lore, and creation walkthroughs",
    description:
      "Deep-dive tutorials on the Arcanea platform, lore explorations of the mythology, live creation walkthroughs, and recorded Gate Ceremonies.",
    highlights: [
      "Platform tutorials and walkthroughs",
      "Lore deep dives — mythology explored",
      "Creation sessions — watch and learn",
      "Recorded Gate Ceremonies",
    ],
    href: "https://youtube.com/@arcanea_ai",
    cta: "Subscribe",
    badge: "Watch & Learn",
    icon: PhYoutubeLogo,
    accentClass: "from-fire/20 to-fire/5",
    borderHoverClass: "hover:border-fire/40",
    glowColor: "rgba(255,107,53,0.12)",
    iconColor: "text-fire",
    badgeBg: "bg-fire/20 text-fire border-fire/30",
  },
];

// ─── Ways to Contribute ───────────────────────────────────────────────────────

export const WAYS_TO_CONTRIBUTE = [
  {
    title: "Build",
    subtitle: "Fork repos, submit PRs, create skills",
    description:
      "The entire platform is open source. Pick an issue, build a feature, craft an agent skill, or extend the intelligence layer. Your code ships to creators worldwide.",
    icon: PhCode,
    color: "#00bcd4",
    highlights: ["Fork & contribute code", "Create agent skills", "Build platform features"],
  },
  {
    title: "Create",
    subtitle: "Write lore, compose music, design characters",
    description:
      "Expand the mythology, compose frequency-aligned music, illustrate Guardians and Godbeasts, or write Library texts. Every form of creative work deepens the world.",
    icon: PhPaintBrush,
    color: "#ffd700",
    highlights: ["Write Library texts", "Design character art", "Compose Gate music"],
  },
  {
    title: "Share",
    subtitle: "Publish to the marketplace, help others learn",
    description:
      "Share your creations with the community, mentor new creators, write tutorials, and publish skills and content to the marketplace for others to build upon.",
    icon: PhHeart,
    color: "#ff6b35",
    highlights: ["Publish skills & content", "Write guides & tutorials", "Mentor new creators"],
  },
  {
    title: "Govern",
    subtitle: "Inner circle earns governance through contribution",
    description:
      "Sustained contribution earns governance rights. Shape the platform's direction, vote on canonical decisions, and help steer the creative civilization toward its future.",
    icon: PhCrown,
    color: "#9966ff",
    highlights: ["Earn governance rights", "Shape platform direction", "Vote on canon decisions"],
  },
];

// ─── Featured Repos ───────────────────────────────────────────────────────────

export const FEATURED_REPOS = [
  {
    name: "arcanea",
    fullName: "frankxai/arcanea",
    description:
      "The main Arcanea monorepo — Next.js platform, AI services, design system, and the Library of 200K+ words.",
    href: "https://github.com/frankxai/arcanea",
    tags: ["monorepo", "next.js", "ai"],
    color: "#00bcd4",
    icon: PhRocket,
  },
  {
    name: "@arcanea/skills",
    fullName: "frankxai/arcanea-skills-opensource",
    description:
      "54 open-source Claude Code skills — world-building, agent design, creative workflows, and development tools.",
    href: "https://github.com/frankxai/arcanea-skills-opensource",
    tags: ["skills", "claude", "agents"],
    color: "#9966ff",
    icon: PhSparkle,
  },
  {
    name: "claude-arcanea",
    fullName: "frankxai/claude-arcanea",
    description:
      "The Claude Code integration layer — MCP servers, memory, vector search, and intelligence orchestration.",
    href: "https://github.com/frankxai/claude-arcanea",
    tags: ["mcp", "vectors", "intelligence"],
    color: "#ffd700",
    icon: PhCpu,
  },
  {
    name: "oh-my-arcanea",
    fullName: "frankxai/oh-my-arcanea",
    description:
      "Community-contributed Arcanea overlays, themes, and configurations for Claude Code, Cursor, and other AI-native editors.",
    href: "https://github.com/frankxai/oh-my-arcanea",
    tags: ["overlays", "themes", "community"],
    color: "#ff6b35",
    icon: PhPackage,
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const EVENTS = [
  {
    title: "Monthly Creation Sessions",
    frequency: "Every month",
    format: "Online",
    description:
      "Guided creation gatherings where community members build together in real time, with AI support. Each session focuses on a different domain of mastery.",
    icon: PhSparkle,
    formatIcon: PhGlobe,
    accent: "crystal",
    accentHex: "#00bcd4",
    badgeText: "Monthly",
  },
  {
    title: "Gate Ceremonies",
    frequency: "Quarterly",
    format: "Online ritual",
    description:
      "Sacred gatherings aligned with the Ten Gates. A ceremony of reflection, celebration, and collective advancement. Creators share breakthroughs and honor the Arc.",
    icon: PhStar,
    formatIcon: PhGlobe,
    accent: "void-el",
    accentHex: "#9966ff",
    badgeText: "Quarterly",
  },
  {
    title: "Creator Summit",
    frequency: "Annual",
    format: "Hybrid — physical + digital",
    description:
      "The flagship gathering of the Arcanea world. A multi-day convergence of creators, builders, and visionaries. Keynotes, workshops, and the unveiling of what comes next.",
    icon: PhFlame,
    formatIcon: PhMapPin,
    accent: "brand-gold",
    accentHex: "#ffd700",
    badgeText: "Annual",
    featured: true,
  },
  {
    title: "Local Creator Meetups",
    frequency: "Ongoing — city-based",
    format: "In person",
    description:
      "Community-organized gatherings in cities worldwide. Find your local circle, share your work, and create connections that extend beyond the digital realm.",
    icon: PhUsers,
    formatIcon: PhMapPin,
    accent: "earth",
    accentHex: "#4a7c59",
    badgeText: "Local",
  },
];

// ─── Spotlights ───────────────────────────────────────────────────────────────

export const SPOTLIGHTS = [
  {
    title: "The Dungeon of Silence",
    creator: "Resonance Mage",
    gate: "Voice",
    type: "Written Work",
    description:
      "A guided meditation descended from the Voice Gate, combining Alera's teachings with personal creative practice into an immersive ritual text.",
    accent: "#00bcd4",
    gateColor: "text-crystal",
  },
  {
    title: "Godbeast Field Studies",
    creator: "Archive Walker",
    gate: "Sight",
    type: "Visual Series",
    description:
      "An ongoing visual series mapping the forms and territories of the Ten Godbeasts, rendered through AI image generation guided by the Bestiary.",
    accent: "#00bcd4",
    gateColor: "text-water",
  },
  {
    title: "Frequency Compositions",
    creator: "The Solfeggio Wanderer",
    gate: "Foundation",
    type: "Audio Creation",
    description:
      "Original compositions built around the Extended Solfeggio frequencies, one piece per Gate — designed to open creative states before a session.",
    accent: "#9966ff",
    gateColor: "text-void-el",
  },
];

// ─── Quick Links (Section 8) ──────────────────────────────────────────────────

export const QUICK_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/frankxai",
    icon: PhGithubLogo,
    detail: "github.com/frankxai",
    color: "#00bcd4",
  },
  {
    label: "Discord",
    href: "https://discord.gg/arcanea",
    icon: PhChatCircle,
    detail: "discord.gg/arcanea",
    color: "#0d47a1",
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/frankxai",
    icon: PhTwitterLogo,
    detail: "@frankxai",
    color: "#78a6ff",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@arcanea_ai",
    icon: PhYoutubeLogo,
    detail: "@arcanea_ai",
    color: "#ff6b35",
  },
];

// ─── OSS Stats ────────────────────────────────────────────────────────────────

export const OSS_STATS = [
  { value: "27", label: "Repositories", color: "#00bcd4" },
  { value: "35", label: "npm Packages", color: "#ffd700" },
  { value: "54", label: "Skills", color: "#9966ff" },
  { value: "791", label: "Tests Passing", color: "#4a7c59" },
  { value: "200K+", label: "Words of Lore", color: "#ff6b35" },
];
