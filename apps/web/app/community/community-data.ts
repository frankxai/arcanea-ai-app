import {
  PhChatCircle,
  PhGithubLogo,
  PhGlobe,
  PhMapPin,
  PhStar,
  PhCode,
  PhPaintBrush,
  PhUsers,
  PhSparkle,
  PhFlame,
  PhPackage,
  PhRocket,
  PhHeart,
} from "@/lib/phosphor-icons";

export const CANONICAL_REPO_URL = "https://github.com/frankxai/arcanea-ai-app";

export const COMMUNITY_STARTS = [
  {
    value: "Read",
    label: "Explore the books",
    href: "/books",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    value: "Build",
    label: "Explore the source",
    href: CANONICAL_REPO_URL,
    color: "var(--arc-brand-arcanean-gold)",
  },
  {
    value: "Discuss",
    label: "Report or propose",
    href: CANONICAL_REPO_URL + "/issues",
    color: "var(--arc-void)",
  },
  {
    value: "Follow",
    label: "Register interest",
    href: "#community-updates",
    color: "var(--arc-earth)",
  },
];

export const COMMUNITY_SPACES = [
  {
    id: "updates",
    name: "Arcanea updates",
    tagline: "Follow the stories and worlds taking shape",
    description:
      "Register your interest in Arcanea stories, worlds and release updates through the form below.",
    highlights: [
      "Stories and world building",
      "Platform release updates",
      "A confirmation when your interest is saved",
    ],
    href: "#community-updates",
    cta: "Register interest",
    badge: "Interest list",
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
    tagline: "The canonical Arcanea source repository",
    description:
      "Read the app, shared packages and story source. Use issues to report a problem or discuss a contribution. Review the applicable code and content terms before reuse.",
    highlights: [
      "Explore the app and shared packages",
      "Report issues and request features",
      "Discuss code and creative proposals",
    ],
    href: CANONICAL_REPO_URL,
    cta: "Explore the source",
    badge: "Public source",
    icon: PhGithubLogo,
    accentClass: "from-crystal/20 to-crystal/5",
    borderHoverClass: "hover:border-crystal/40",
    glowColor: "rgba(0,188,212,0.12)",
    iconColor: "text-crystal",
    badgeBg: "bg-crystal/20 text-crystal border-crystal/30",
  },
  {
    id: "books",
    name: "Books",
    tagline: "Enter the Arcanea universe through its stories",
    description:
      "Browse the book catalog and follow its reading paths into Arcanea's fiction and philosophy.",
    highlights: [
      "Browse the catalog",
      "Choose a story to read",
      "Explore the worlds behind the platform",
    ],
    href: "/books",
    cta: "Explore the books",
    badge: "Read",
    icon: PhPaintBrush,
    accentClass: "from-water/20 to-water/5",
    borderHoverClass: "hover:border-water/40",
    glowColor: "rgba(120,166,255,0.12)",
    iconColor: "text-water",
    badgeBg: "bg-water/20 text-water border-water/30",
  },
  {
    id: "library",
    name: "Library",
    tagline: "Find a text for your creative practice",
    description:
      "Explore the Library's collections and writing on creation, collaboration and the creative life.",
    highlights: [
      "Browse the collections",
      "Read philosophy for creators",
      "Find a starting point for your practice",
    ],
    href: "/library",
    cta: "Explore the library",
    badge: "Read",
    icon: PhGlobe,
    accentClass: "from-fire/20 to-fire/5",
    borderHoverClass: "hover:border-fire/40",
    glowColor: "rgba(255,107,53,0.12)",
    iconColor: "text-fire",
    badgeBg: "bg-fire/20 text-fire border-fire/30",
  },
];

export const WAYS_TO_CONTRIBUTE = [
  {
    title: "Build",
    subtitle: "Discuss an issue or propose a change",
    description:
      "Explore the app and shared packages, reproduce a bug, or propose a feature or creative skill. Changes go through repository review before they ship.",
    icon: PhCode,
    color: "var(--arc-brand-atlantean-teal)",
    highlights: [
      "Reproduce a reported issue",
      "Discuss a feature",
      "Propose code or a skill",
    ],
  },
  {
    title: "Create",
    subtitle: "Develop a story, character, artwork or composition",
    description:
      "Bring a creative proposal with its sources and intended use. Contributions to Arcanea's stories and mythology need author review before becoming part of the world.",
    icon: PhPaintBrush,
    color: "var(--arc-brand-arcanean-gold)",
    highlights: [
      "Propose a story or character",
      "Develop art or music concepts",
      "Discuss continuity and provenance",
    ],
  },
  {
    title: "Share",
    subtitle: "Help another creator understand your process",
    description:
      "Discuss a useful guide, a reproducible example or a creation workflow in the repository's issues. Include what worked, what needed repair and what others can learn.",
    icon: PhHeart,
    color: "var(--arc-fire)",
    highlights: [
      "Explain a creation workflow",
      "Share a reproducible example",
      "Propose a guide",
    ],
  },
  {
    title: "Review",
    subtitle: "Test the experience and question the details",
    description:
      "Report broken journeys, evaluate a proposed skill, or give feedback on story continuity. Canon decisions remain with Arcanea's creator.",
    icon: PhUsers,
    color: "var(--arc-void)",
    highlights: [
      "Test a reader or builder journey",
      "Review a proposal",
      "Flag a continuity question",
    ],
  },
];

export const FEATURED_REPOS = [
  {
    name: "Web app",
    fullName: "arcanea-ai-app / apps/web",
    description:
      "The Next.js application, reader routes and creator interface. Start here to understand how the public experience works.",
    href: CANONICAL_REPO_URL + "/tree/main/apps/web",
    tags: ["app", "readers", "creators"],
    color: "var(--arc-brand-atlantean-teal)",
    icon: PhRocket,
  },
  {
    name: "Story source",
    fullName: "arcanea-ai-app / book",
    description:
      "The books and Library texts behind Arcanea. Source availability does not replace author approval for publication or reuse.",
    href: CANONICAL_REPO_URL + "/tree/main/book",
    tags: ["books", "library", "writing"],
    color: "var(--arc-void)",
    icon: PhPaintBrush,
  },
  {
    name: "Shared packages",
    fullName: "arcanea-ai-app / packages",
    description:
      "Explore the shared implementation used by the platform. Check each package's documentation and terms before adopting it.",
    href: CANONICAL_REPO_URL + "/tree/main/packages",
    tags: ["packages", "builders", "tools"],
    color: "var(--arc-brand-arcanean-gold)",
    icon: PhPackage,
  },
  {
    name: "Docs and decisions",
    fullName: "arcanea-ai-app / docs",
    description:
      "Architecture notes, research and proposals. Read each document's status to distinguish working plans from accepted decisions.",
    href: CANONICAL_REPO_URL + "/tree/main/docs",
    tags: ["architecture", "research", "proposals"],
    color: "var(--arc-fire)",
    icon: PhCode,
  },
];

export const EVENT_IDEAS = [
  {
    title: "Creation sessions",
    format: "Online",
    description:
      "A proposed format for creators to build together and compare their process, with a different creative focus each session.",
    icon: PhSparkle,
    formatIcon: PhGlobe,
    accentHex: "var(--arc-brand-atlantean-teal)",
    badgeText: "Idea",
    featured: false,
  },
  {
    title: "Gate ceremonies",
    format: "Online reflection",
    description:
      "A proposed gathering around the Ten Gates, where creators could reflect on a project and share what they learned.",
    icon: PhStar,
    formatIcon: PhGlobe,
    accentHex: "var(--arc-void)",
    badgeText: "Idea",
    featured: false,
  },
  {
    title: "Creator summit",
    format: "Hybrid",
    description:
      "A proposed gathering for authors, world builders and developers to exchange work through talks and workshops.",
    icon: PhFlame,
    formatIcon: PhMapPin,
    accentHex: "var(--arc-brand-arcanean-gold)",
    badgeText: "Idea",
    featured: true,
  },
  {
    title: "Local creator meetups",
    format: "In person",
    description:
      "A proposed format for small local groups to share work and make connections through a creative project.",
    icon: PhUsers,
    formatIcon: PhMapPin,
    accentHex: "var(--arc-earth)",
    badgeText: "Idea",
    featured: false,
  },
];

export const CREATION_IDEAS = [
  {
    title: "The Dungeon of Silence",
    gate: "Voice",
    type: "Writing idea",
    description:
      "Explore silence and creative expression through a scene, a reflection or a guided practice. This is a starting concept for your own writing.",
    accent: "var(--arc-brand-atlantean-teal)",
    gateColor: "text-crystal",
  },
  {
    title: "Godbeast field studies",
    gate: "Sight",
    type: "Art idea",
    description:
      "Develop a field notebook with sketches and observations of Arcanea's Godbeasts, using the existing lore as a reference.",
    accent: "var(--arc-brand-atlantean-teal)",
    gateColor: "text-water",
  },
  {
    title: "Gate compositions",
    gate: "Foundation",
    type: "Music idea",
    description:
      "Compose a piece around a Gate's themes and explain the choices behind its rhythm, instrumentation and texture.",
    accent: "var(--arc-void)",
    gateColor: "text-void-el",
  },
];

export const QUICK_LINKS = [
  {
    label: "Canonical repo",
    href: CANONICAL_REPO_URL,
    icon: PhGithubLogo,
    detail: "arcanea-ai-app",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    label: "Report an issue",
    href: CANONICAL_REPO_URL + "/issues",
    icon: PhChatCircle,
    detail: "Problems and proposals",
    color: "var(--arc-brand-cosmic-blue)",
  },
  {
    label: "Books",
    href: "/books",
    icon: PhPaintBrush,
    detail: "The reading catalog",
    color: "var(--arc-brand-cosmic-blue)",
  },
  {
    label: "Library",
    href: "/library",
    icon: PhGlobe,
    detail: "Texts for creators",
    color: "var(--arc-fire)",
  },
];
