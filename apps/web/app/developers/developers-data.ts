/* ------------------------------------------------------------------ */
/*  Developers Page Data — no 'use client'                             */
/* ------------------------------------------------------------------ */

export const PACKAGES = [
  {
    name: "@arcanea/council",
    description: "Byzantine/Raft/Gossip/Gate Quorum consensus algorithms",
    tags: ["Consensus", "Byzantine", "Raft", "Multi-agent"],
    color: "#0d47a1",
    stars: "2.4K",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/council",
  },
  {
    name: "@arcanea/guardian-evolution",
    description: "SONA learning + 7 RL algorithms (A2C, DQN, PPO, Q-learning)",
    tags: ["RL", "Learning", "SONA", "Evolution"],
    color: "#ef4444",
    stars: "1.8K",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/guardian-evolution",
  },
  {
    name: "@arcanea/guardian-memory",
    description: "HNSW vector search with Intelligence-namespaced vaults",
    tags: ["Vector", "HNSW", "Memory", "Search"],
    color: "#00bcd4",
    stars: "1.5K",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/guardian-memory",
  },
  {
    name: "@arcanea/rituals",
    description: "Swarm communication, 12 Spirits workers, MCP bridge",
    tags: ["MCP", "Swarm", "Workers", "Rituals"],
    color: "#ffd700",
    stars: "1.2K",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/rituals",
  },
  {
    name: "@arcanea/creative-pipeline",
    description: "Prompt engine, asset vault, curator, sessions",
    tags: ["Creative", "Pipeline", "Prompt", "Assets"],
    color: "#3b82f6",
    stars: "980",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/creative-pipeline",
  },
  {
    name: "@arcanea/swarm-coordinator",
    description: "Multi-agent workflow orchestration",
    tags: ["Orchestration", "Multi-agent", "Workflow", "Coordination"],
    color: "#a855f7",
    stars: "756",
    href: "https://github.com/frankxai/arcanea/tree/main/packages/swarm-coordinator",
  },
];

export const TOOLS = [
  {
    category: "Intelligence",
    items: [
      { name: "HNSW Memory", description: "Vector search with 150x speedup" },
      { name: "ReasoningBank", description: "Adaptive learning from outcomes" },
      {
        name: "Skill-Rules Engine",
        description: "35 Intelligence-aligned activation rules",
      },
      { name: "Event Bus", description: "Intelligent routing and feedback" },
    ],
    color: "#0d47a1",
  },
  {
    category: "Creative",
    items: [
      {
        name: "Prompt Engine",
        description: "Mythological framework templates",
      },
      { name: "Asset Vault", description: "Cosmic media storage" },
      { name: "Curator", description: "Content quality assessment" },
      { name: "Sessions", description: "Creation state management" },
    ],
    color: "#ef4444",
  },
  {
    category: "Infrastructure",
    items: [
      { name: "IntelligenceRouter", description: "Request routing to AI models" },
      { name: "VoiceEnforcer", description: "Output validation" },
      { name: "Token Optimizer", description: "Context window management" },
      { name: "MCP Server", description: "42 tools with skill-rules" },
    ],
    color: "#00bcd4",
  },
];

export const QUICK_STARTS = [
  {
    title: "API Reference",
    description: "OpenAI-compatible API with 26 models from 13 providers",
    href: "/developers/api",
    iconKey: "Code" as const,
    color: "#78a6ff",
  },
  {
    title: "Create a Skill",
    description: "Build a procedural skill that equips creators",
    href: "/skills",
    iconKey: "Zap" as const,
    color: "#0d47a1",
  },
  {
    title: "Use the MCP Server",
    description: "Integrate Arcanea tools into your workflow",
    href: "/docs/mcp",
    iconKey: "Terminal" as const,
    color: "#00bcd4",
  },
  {
    title: "Contribute to Packages",
    description: "Open source contributions welcome",
    href: "https://github.com/frankxai/arcanea",
    iconKey: "Github" as const,
    color: "#ffd700",
  },
];

export const CREDITS_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/credits/balance",
    description:
      "Returns the authenticated user\u2019s credit balance including purchased credits, daily free credits, and Forge subscription status.",
    response: '{ "purchased": 100, "dailyRemaining": 5, "forgeActive": false, "total": 105 }',
  },
  {
    method: "POST",
    path: "/api/credits/spend",
    description:
      "Spend 1 credit for a creation. Checks entitlement in priority order: Forge subscription (unlimited), daily free credits, then purchased credits.",
    body: '{ "type": "chat" | "image" | "music" | "story" }',
    response: '{ "success": true, "remaining": 104, "source": "purchased" }',
  },
  {
    method: "POST",
    path: "/api/credits/checkout",
    description:
      "Creates a Stripe Checkout session for purchasing a credit pack. Returns a checkout URL to redirect the user.",
    body: '{ "packId": "starter" | "creator" | "studio" }',
    response: '{ "url": "https://checkout.stripe.com/..." }',
  },
  {
    method: "POST",
    path: "/api/credits/webhook",
    description:
      "Stripe webhook handler. Processes checkout.session.completed and subscription lifecycle events. Requires Stripe signature verification.",
    body: "Raw Stripe event payload",
    response: '{ "received": true }',
  },
];

export const MCP_SERVERS = [
  {
    name: "arcanea-mcp",
    description:
      "The core MCP server with 42 tools: world-building, canon validation, Luminor companions, story generation, agent orchestration.",
    install: "npx @arcanea/mcp-server",
    color: "#7fffd4",
  },
  {
    name: "arcanea-memory",
    description:
      "HNSW vector memory with vault storage, classification, sync, and horizon logging. Persistent memory across sessions.",
    install: "npx @arcanea/memory-server",
    color: "#78a6ff",
  },
  {
    name: "arcanea-infogenius",
    description:
      "Intelligence layer for research, knowledge synthesis, and domain-expert routing. Connects to 13 AI providers.",
    install: "npx @arcanea/infogenius-server",
    color: "#ffd700",
  },
];

export const OPEN_SOURCE_REPOS = [
  {
    name: "frankxai/arcanea",
    description:
      "Main monorepo. Web app, intelligence packages, MCP servers, creative pipeline, and 49 npm packages.",
    href: "https://github.com/frankxai/arcanea",
    color: "#7fffd4",
  },
  {
    name: "frankxai/arcanea-skills-opensource",
    description:
      "103 open-source skills for Claude Code, Cursor, Windsurf, and any MCP-compatible agent. Fork and extend.",
    href: "https://github.com/frankxai/arcanea-skills-opensource",
    color: "#a855f7",
  },
  {
    name: "frankxai/arcanea-soul",
    description:
      "The Arcanea Soul engine. Canon-aware personality system, world config generation, and identity framework.",
    href: "https://github.com/frankxai/arcanea-soul",
    color: "#ffd700",
  },
  {
    name: "frankxai/arcanea-companion",
    description:
      "Standalone companion app with Luminor chat, creative tools, Docker deployment, and Railway support.",
    href: "https://github.com/frankxai/arcanea-companion",
    color: "#ef4444",
  },
];

export const ARCHITECTURE_LAYERS = [
  {
    layer: "Presentation",
    iconKey: "Layers" as const,
    color: "#ef4444",
    items: ["Next.js 16", "React 19", "Tailwind"],
  },
  {
    layer: "Intelligence",
    iconKey: "Brain" as const,
    color: "#0d47a1",
    items: ["Intelligence Evolution", "ReasoningBank", "Skill-Rules"],
  },
  {
    layer: "Orchestration",
    iconKey: "Cpu" as const,
    color: "#00bcd4",
    items: ["Swarm Coordinator", "Rituals", "Event Bus"],
  },
  {
    layer: "Storage",
    iconKey: "Database" as const,
    color: "#ffd700",
    items: ["HNSW Memory", "Hybrid Memory", "AgentDB"],
  },
  {
    layer: "Integration",
    iconKey: "Code" as const,
    color: "#3b82f6",
    items: ["MCP Server", "CLI Tools", "Webhooks"],
  },
];
