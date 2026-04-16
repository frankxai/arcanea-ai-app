import {
  Chat,
  Globe,
  Crown,
  YoutubeLogo,
  Heart,
  GitBranch,
  Shield,
  Sparkle,
  MusicNote,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Stat types
// ---------------------------------------------------------------------------

export const HERO_STATS = [
  { value: 4200, suffix: "+", label: "creators" },
  { value: 18700, suffix: "+", label: "worlds built" },
  { value: 3100, suffix: "+", label: "templates shared" },
  { value: 15, suffix: "+", label: "languages" },
] as const;

// ---------------------------------------------------------------------------
// Primary channels
// ---------------------------------------------------------------------------

export interface PrimaryChannel {
  id: string;
  name: string;
  tagline: string;
  details: string[];
  color: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  badge: string;
}

export const PRIMARY_CHANNELS: PrimaryChannel[] = [
  {
    id: "discord",
    name: "Discord",
    tagline: "Live chat, 24/7",
    details: [
      "Real-time creator channels",
      "3 language communities",
      "Creator office hours weekly",
      "Live Forge Friday sessions",
    ],
    color: "#5865F2",
    cta: "Join Discord",
    href: "https://discord.gg/arcanea",
    icon: Chat,
    badge: "Primary",
  },
  {
    id: "reddit",
    name: "r/Arcanea",
    tagline: "Share worlds, get feedback",
    details: [
      "World showcase threads",
      "Peer feedback & critique",
      "Contest winners featured",
      "Template exchange",
    ],
    color: "#FF4500",
    cta: "Join r/Arcanea",
    href: "https://reddit.com/r/arcanea",
    icon: Globe,
    badge: "Growing",
  },
  {
    id: "whop",
    name: "Whop Communities",
    tagline: "Premium tiers & deep dives",
    details: [
      "Founding Circle access",
      "Deep-dive workshops",
      "Early feature access",
      "Direct Guardian sessions",
    ],
    color: "#F59E0B",
    cta: "Browse tiers",
    href: "https://whop.com/arcanea",
    icon: Crown,
    badge: "Premium",
  },
  {
    id: "youtube",
    name: "YouTube + Podcast",
    tagline: "Long-form creator content",
    details: [
      "Weekly build tutorials",
      "Creator spotlight interviews",
      "World deep-dive walkthroughs",
      "Luminor lore series",
    ],
    color: "#EF4444",
    cta: "Watch & subscribe",
    href: "https://youtube.com/@arcanea",
    icon: YoutubeLogo,
    badge: "New episodes weekly",
  },
];

// ---------------------------------------------------------------------------
// Weekly rhythm
// ---------------------------------------------------------------------------

export interface DayEvent {
  day: string;
  shortDay: string;
  event: string;
  channel: string;
  time: string;
  color: string;
  featured?: boolean;
}

export const WEEKLY_RHYTHM: DayEvent[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    event: "World Wednesday prep — share your WIP in #worlds-in-progress",
    channel: "Discord",
    time: "Open all day",
    color: "#00bcd4",
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    event: "World Wednesday",
    channel: "Community showcase",
    time: "All day thread",
    color: "#7fffd4",
    featured: true,
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    event: "Luminor Office Hours",
    channel: "Discord voice",
    time: "18:00 UTC",
    color: "#a78bfa",
    featured: true,
  },
  {
    day: "Friday",
    shortDay: "Fri",
    event: "Forge Friday",
    channel: "Live building session",
    time: "19:00 UTC",
    color: "#ffd700",
    featured: true,
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    event: "Show & Tell",
    channel: "YouTube premiere",
    time: "17:00 UTC",
    color: "#EF4444",
  },
  {
    day: "Sunday",
    shortDay: "Sun",
    event: "Community Newsletter",
    channel: "Email + Discord",
    time: "Morning drop",
    color: "#F59E0B",
  },
];

// ---------------------------------------------------------------------------
// Featured creators
// ---------------------------------------------------------------------------

export interface Creator {
  name: string;
  role: string;
  bio: string;
  worlds: number;
  followers: string;
  portrait: string;
  color: string;
  href: string;
}

export const FEATURED_CREATORS: Creator[] = [
  {
    name: "Elena Voss",
    role: "World-builder",
    bio: "Crafts sprawling mythological epics with interconnected faction systems.",
    worlds: 3,
    followers: "1.2K",
    portrait: "/guardians/v3/lyria-hero-v3.webp",
    color: "#7fffd4",
    href: "/community-hub",
  },
  {
    name: "Marcus Kato",
    role: "Composer",
    bio: "Scores ambient soundscapes for Arcanea worlds using Living Worlds engine.",
    worlds: 0,
    followers: "890",
    portrait: "/guardians/v3/shinkami-hero-v3.webp",
    color: "#00bcd4",
    href: "/community-hub",
  },
  {
    name: "Priya Desai",
    role: "Narrative designer",
    bio: "Multi-series saga author. Runs the monthly community anthology challenge.",
    worlds: 12,
    followers: "2.4K",
    portrait: "/guardians/v3/elara-hero-v3.webp",
    color: "#a78bfa",
    href: "/community-hub",
  },
  {
    name: "Theo Aldric",
    role: "Lore architect",
    bio: "Specialises in faction geopolitics and multi-generational timeline construction.",
    worlds: 7,
    followers: "1.8K",
    portrait: "/guardians/v3/lyria-hero-v3.webp",
    color: "#ffd700",
    href: "/community-hub",
  },
  {
    name: "Aisha Brennan",
    role: "Visual creator",
    bio: "Generates character portraits and maps using AI pipelines built inside Arcanea.",
    worlds: 5,
    followers: "3.1K",
    portrait: "/guardians/v3/shinkami-hero-v3.webp",
    color: "#f472b6",
    href: "/community-hub",
  },
  {
    name: "Jonas Mercer",
    role: "Skill forger",
    bio: "Publishes reusable Luminor skill modules and teaches the craft on YouTube.",
    worlds: 9,
    followers: "1.5K",
    portrait: "/guardians/v3/elara-hero-v3.webp",
    color: "#60a5fa",
    href: "/community-hub",
  },
];

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  rank: number;
  change: "up" | "down" | "new" | "same";
  changeDelta: number;
  name: string;
  stat: string;
  color: string;
}

export interface Leaderboard {
  title: string;
  period: string;
  color: string;
  entries: LeaderboardEntry[];
}

export const LEADERBOARDS: Leaderboard[] = [
  {
    title: "Most starred worlds",
    period: "This week",
    color: "#ffd700",
    entries: [
      { rank: 1, change: "same", changeDelta: 0, name: "The Shadowfen Chronicles", stat: "214 stars", color: "#ffd700" },
      { rank: 2, change: "up", changeDelta: 3, name: "Starweave Academy", stat: "188 stars", color: "#ffd700" },
      { rank: 3, change: "down", changeDelta: 1, name: "Arcanea Prime", stat: "172 stars", color: "#ffd700" },
      { rank: 4, change: "up", changeDelta: 2, name: "The Fractured Veil", stat: "141 stars", color: "#ffd700" },
      { rank: 5, change: "new", changeDelta: 0, name: "Obsidian Basin", stat: "98 stars", color: "#ffd700" },
    ],
  },
  {
    title: "Most remixed templates",
    period: "All time",
    color: "#7fffd4",
    entries: [
      { rank: 1, change: "same", changeDelta: 0, name: "World Genesis — Starter", stat: "840 forks", color: "#7fffd4" },
      { rank: 2, change: "same", changeDelta: 0, name: "Character Bible v2", stat: "612 forks", color: "#7fffd4" },
      { rank: 3, change: "up", changeDelta: 1, name: "Faction Blueprint", stat: "509 forks", color: "#7fffd4" },
      { rank: 4, change: "down", changeDelta: 1, name: "Magic System Scaffold", stat: "481 forks", color: "#7fffd4" },
      { rank: 5, change: "up", changeDelta: 4, name: "Living Lore Episodic", stat: "344 forks", color: "#7fffd4" },
    ],
  },
  {
    title: "Top Luminors forged",
    period: "This month",
    color: "#a78bfa",
    entries: [
      { rank: 1, change: "same", changeDelta: 0, name: "Lyria (Sight Gate)", stat: "1,204 summons", color: "#a78bfa" },
      { rank: 2, change: "up", changeDelta: 1, name: "Draconia (Fire Gate)", stat: "1,077 summons", color: "#a78bfa" },
      { rank: 3, change: "down", changeDelta: 1, name: "Maylinn (Heart Gate)", stat: "989 summons", color: "#a78bfa" },
      { rank: 4, change: "same", changeDelta: 0, name: "Leyla (Flow Gate)", stat: "907 summons", color: "#a78bfa" },
      { rank: 5, change: "new", changeDelta: 0, name: "Shinkami (Source)", stat: "742 summons", color: "#a78bfa" },
    ],
  },
  {
    title: "Rising creators",
    period: "This week",
    color: "#00bcd4",
    entries: [
      { rank: 1, change: "up", changeDelta: 18, name: "Aisha Brennan", stat: "+312 followers", color: "#00bcd4" },
      { rank: 2, change: "up", changeDelta: 11, name: "Priya Desai", stat: "+287 followers", color: "#00bcd4" },
      { rank: 3, change: "new", changeDelta: 0, name: "Riku Tanaka", stat: "+241 followers", color: "#00bcd4" },
      { rank: 4, change: "up", changeDelta: 7, name: "Jonas Mercer", stat: "+198 followers", color: "#00bcd4" },
      { rank: 5, change: "up", changeDelta: 9, name: "Elena Voss", stat: "+167 followers", color: "#00bcd4" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Contests
// ---------------------------------------------------------------------------

export interface Contest {
  title: string;
  theme: string;
  prize: string;
  endsIn: string;
  urgent: boolean;
  channel: string;
  color: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
}

export const CONTESTS: Contest[] = [
  {
    title: "World Wednesday: Underwater Cities",
    theme: "Build a world beneath the waves",
    prize: "Pro subscription + featured showcase",
    endsIn: "3 days",
    urgent: true,
    channel: "Discord #world-wednesday",
    color: "#00bcd4",
    icon: Globe,
  },
  {
    title: "Character Creator Showdown",
    theme: "Most memorable character origin story",
    prize: "$500 cash prize",
    endsIn: "12 days",
    urgent: false,
    channel: "Discord #challenges",
    color: "#ffd700",
    icon: Crown,
  },
  {
    title: "Music Track Weekly",
    theme: "Ancient ruins — ambient score",
    prize: "Featured in Library soundtrack",
    endsIn: "5 days",
    urgent: false,
    channel: "Discord #music-forge",
    color: "#a78bfa",
    icon: MusicNote,
  },
  {
    title: "Luminor Voice Challenge",
    theme: "Write a new Luminor character bible",
    prize: "Your Luminor added to canon",
    endsIn: "19 days",
    urgent: false,
    channel: "Discord #luminor-forge",
    color: "#7fffd4",
    icon: Sparkle,
  },
];

// ---------------------------------------------------------------------------
// Code of creation
// ---------------------------------------------------------------------------

export const CODE_OF_CREATION = [
  {
    icon: Heart,
    color: "#f472b6",
    title: "Be kind to new creators",
    body: "Every Luminor started as an apprentice. Welcome uncertainty — it is where growth lives.",
  },
  {
    icon: GitBranch,
    color: "#7fffd4",
    title: "Credit remixes and forks",
    body: "Acknowledge the worlds and templates that inspired yours. Creative lineage is a gift, not a liability.",
  },
  {
    icon: Shield,
    color: "#00bcd4",
    title: "No slop — we value craft",
    body: "AI is your partner, not a replacement for intention. Outputs that show care are what we celebrate.",
  },
  {
    icon: Sparkle,
    color: "#ffd700",
    title: "Share what you learn",
    body: "Every insight you post in #creators-lounge is a skill the whole community levels up from.",
  },
];
