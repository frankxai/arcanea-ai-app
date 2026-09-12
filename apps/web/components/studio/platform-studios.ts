export type StudioId =
  | "world"
  | "book"
  | "game"
  | "music"
  | "cinema"
  | "marketing"
  | "canvas"
  | "agent-os";

export interface StudioMode {
  id: StudioId;
  name: string;
  eyebrow: string;
  href: string;
  cost: number;
  accent: string;
  gradient: string;
  prompt: string;
  assetHint: string;
  output: string;
  proof: string;
  presets: string[];
  workflow: string[];
  commands: string[];
  media: {
    poster: string;
    secondary: string;
    label: string;
    frames: string[];
  };
  stats: string[];
}

export const STUDIO_MODES: StudioMode[] = [
  {
    id: "world",
    name: "World Studio",
    eyebrow: "Living worlds",
    href: "/worlds",
    cost: 8,
    accent: "var(--arc-brand-atlantean-teal)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/45 via-[var(--arc-brand-atlantean-teal)]/25 to-[var(--arc-brand-arcanean-gold)]/35",
    prompt: "A drowned moon academy where music changes gravity",
    assetHint: "@atlas @characters @lore",
    output: "World bible, factions, locations, character seeds, timeline, visual style",
    proof: "Best for writers, RPG teams, lore studios, and IP builders.",
    presets: ["Mythic academy", "Dark fantasy", "Solar punk", "Studio bible"],
    workflow: ["Seed premise", "Generate canon", "Connect graph", "Export bible"],
    commands: ["plan_world", "world_report", "export_project_context"],
    media: {
      poster: "/images/forge/sea/006-storm-galleon.png",
      secondary: "/guardians/v3/leyla-hero-v3.webp",
      label: "World reel",
      frames: ["Atlas opens", "Faction tension", "Canon graph", "Studio bible"],
    },
    stats: ["24 canon nodes", "8 factions", "4 export formats"],
  },
  {
    id: "book",
    name: "Book Studio",
    eyebrow: "Author pipeline",
    href: "/books/drafts",
    cost: 12,
    accent: "var(--arc-brand-arcanean-gold)",
    gradient: "from-[var(--arc-brand-arcanean-gold)]/45 via-[var(--arc-fire)]/20 to-[var(--arc-cosmic-void)]/35",
    prompt: "A 12-chapter romantasy about a cartographer of forbidden stars",
    assetHint: "@world @voice @outline",
    output: "Book bible, chapter spine, sample scene, cover brief, publishing checklist",
    proof: "Best for novelists, nonfiction authors, editors, and publishing teams.",
    presets: ["Novel bible", "Memoir engine", "Serial fiction", "Launch packet"],
    workflow: ["Inception", "Outline", "Draft scenes", "Package release"],
    commands: ["plan_book", "generate_asset_brief", "save_to_arcanea_vault"],
    media: {
      poster: "/images/books/forge-of-ruin-cover.png",
      secondary: "/images/books/las-tierras-de-luz-ch01.png",
      label: "Book trailer",
      frames: ["Reader promise", "Chapter spine", "Sample scene", "Cover brief"],
    },
    stats: ["12 chapters", "1 cover brief", "5 launch assets"],
  },
  {
    id: "game",
    name: "Game Studio",
    eyebrow: "Prompt to playable",
    href: "/games",
    cost: 18,
    accent: "var(--arc-fire)",
    gradient: "from-[var(--arc-fire)]/45 via-[var(--arc-brand-cosmic-blue)]/25 to-[var(--arc-brand-atlantean-teal)]/25",
    prompt: "A cozy multiplayer relic-hunting game set inside a living library",
    assetHint: "@world @sprites @mechanics",
    output: "Game design doc, loop, levels, asset list, prototype plan, engine export",
    proof: "Best for indie teams, Roblox/Godot/Unity studios, and game jams.",
    presets: ["Browser game", "Roblox world", "Unity prototype", "Godot scene"],
    workflow: ["Core loop", "Playable spec", "Asset kit", "Build handoff"],
    commands: ["plan_game", "generate_quest", "export_project_context"],
    media: {
      poster: "/images/forge/space/005-interceptor-canyon.png",
      secondary: "/images/forge/sky/007-ironclad-airship.png",
      label: "Prototype reel",
      frames: ["Core loop", "First level", "Asset kit", "Codex build"],
    },
    stats: ["1 playable slice", "16 assets", "3 engine paths"],
  },
  {
    id: "music",
    name: "Music Studio",
    eyebrow: "Artist universe",
    href: "/music-studio",
    cost: 10,
    accent: "var(--arc-void)",
    gradient: "from-[var(--arc-void)]/45 via-[var(--arc-brand-cosmic-blue)]/25 to-[var(--arc-brand-arcanean-gold)]/25",
    prompt: "An AI artist whose songs are field recordings from other timelines",
    assetHint: "@artist @lyrics @cover",
    output: "Artist lore, song brief, album world, cover art brief, visualizer plan",
    proof: "Best for musicians, labels, AI artist projects, and release teams.",
    presets: ["Artist bible", "Single rollout", "Album world", "Visualizer pack"],
    workflow: ["Artist identity", "Track brief", "Visual assets", "Release kit"],
    commands: ["plan_music_project", "generate_asset_brief", "get_workflow_recipe"],
    media: {
      poster: "/images/luminors/11-aletheia-truth-singer.webp",
      secondary: "/guardians/v3/alera-hero-v3.webp",
      label: "Visualizer reel",
      frames: ["Artist lore", "Song brief", "Cover art", "Release pack"],
    },
    stats: ["7 sonic motifs", "3 visualizer shots", "9 release posts"],
  },
  {
    id: "cinema",
    name: "Cinema Studio",
    eyebrow: "Scenes and trailers",
    href: "/cinema-studio",
    cost: 16,
    accent: "var(--arc-brand-cosmic-blue)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/50 via-[var(--arc-cosmic-void)]/35 to-[var(--arc-brand-atlantean-teal)]/25",
    prompt: "A 20-second trailer for a world where dreams are traded as currency",
    assetHint: "@character @shotlist @music",
    output: "Scene plan, shot list, camera presets, character references, render prompts",
    proof: "Best for filmmakers, trailer teams, social video, and pitch decks.",
    presets: ["Trailer", "Character scene", "Music video", "Pitch animatic"],
    workflow: ["Scene intent", "Shot design", "Asset refs", "Render handoff"],
    commands: ["plan_cinematic_scene", "generate_asset_brief", "export_project_context"],
    media: {
      poster: "/brand/arcanea-hero.jpg",
      secondary: "/images/forge/space/004-dreadnought-nebula.png",
      label: "Trailer board",
      frames: ["Hook frame", "Camera plan", "Audio cue", "Render prompts"],
    },
    stats: ["6 shot beats", "4 render prompts", "2 aspect ratios"],
  },
  {
    id: "marketing",
    name: "Marketing Studio",
    eyebrow: "Campaign systems",
    href: "/create#campaign",
    cost: 14,
    accent: "var(--arc-brand-atlantean-teal)",
    gradient: "from-[var(--arc-brand-atlantean-teal)]/45 via-[var(--arc-brand-arcanean-gold)]/20 to-[var(--arc-fire)]/25",
    prompt: "Launch a creator tool for fantasy authors who want finished worlds",
    assetHint: "@brand @product @audience",
    output: "Audience map, ad angles, creator content pack, landing sections, hooks",
    proof: "Best for founders, creators, agencies, and product launches.",
    presets: ["DTC launch", "Creator funnel", "Social pack", "Affiliate kit"],
    workflow: ["Offer", "Angles", "Creative matrix", "Publish pack"],
    commands: ["get_workflow_recipe", "generate_asset_brief", "export_project_context"],
    media: {
      poster: "/images/blog/publishing/10-ecosystem-overview.png",
      secondary: "/brand/arcanea-og.jpg",
      label: "Campaign reel",
      frames: ["Audience map", "Offer angle", "Ad matrix", "Publish pack"],
    },
    stats: ["18 hooks", "6 creatives", "4 channels"],
  },
  {
    id: "canvas",
    name: "Canvas",
    eyebrow: "Node workflows",
    href: "/canvas",
    cost: 6,
    accent: "var(--arc-brand-atlantean-teal)",
    gradient: "from-[var(--arc-brand-atlantean-teal)]/35 via-[var(--arc-cosmic-void)]/35 to-[var(--arc-void)]/25",
    prompt: "Chain a world bible into a game spec, trailer, soundtrack, and landing page",
    assetHint: "@world @brief @repo",
    output: "Node graph, reusable workflow, handoff packets, agent context",
    proof: "Best for teams that want repeatable creative production systems.",
    presets: ["World to game", "Book launch", "Music video", "Agent sprint"],
    workflow: ["Drop node", "Chain tools", "Run agents", "Export context"],
    commands: ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"],
    media: {
      poster: "/images/books/open-library-architecture.png",
      secondary: "/images/blog/publishing/02-publishing-pipeline.png",
      label: "Workflow canvas",
      frames: ["Input node", "Studio chain", "Agent run", "Artifact export"],
    },
    stats: ["8 node types", "5 recipes", "1 portable graph"],
  },
  {
    id: "agent-os",
    name: "Agent OS",
    eyebrow: "Claude and Codex",
    href: "/mcp",
    cost: 4,
    accent: "var(--arc-brand-arcanean-gold)",
    gradient: "from-[var(--arc-brand-arcanean-gold)]/40 via-[var(--arc-cosmic-void)]/45 to-[var(--arc-brand-atlantean-teal)]/25",
    prompt: "Give Claude and Codex the full context to build this universe with me",
    assetHint: "@repo @world @vault",
    output: "MCP install, tool plan, agent rules, repo handoff, workflow recipes",
    proof: "Best for agent-native creators and studios that build with AI teammates.",
    presets: ["Claude Code", "Codex", "Cursor", "Local MCP"],
    workflow: ["Install MCP", "Load context", "Run recipe", "Ship artifact"],
    commands: ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"],
    media: {
      poster: "/guardians/v3/draconia-hero-v3.webp",
      secondary: "/images/blog/publishing/10-ecosystem-overview.png",
      label: "Agent handoff",
      frames: ["Install MCP", "List tools", "Run recipe", "Commit output"],
    },
    stats: ["4 agent hosts"],
  },
];

export const STUDIO_BY_ID = Object.fromEntries(
  STUDIO_MODES.map((studio) => [studio.id, studio]),
) as Record<StudioId, StudioMode>;
