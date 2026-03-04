
export interface Project {
    id: string;
    title: string;
    category: "Agent" | "Platform" | "Experiment";
    description: string;
    tech: string[];
    image: string;
    link?: string;
}

export const PROJECTS: Project[] = [
    {
        id: "arcanea-companion",
        title: "Arcanea Companion",
        category: "Platform",
        description: "The premier interface for the Arcanea ecosystem. Features a real-time masonry gallery, localized AI chat with Evi, and a creator studio.",
        tech: ["Next.js 16", "Tailwind v4", "Vercel AI SDK", "Framer Motion"],
        image: "/images/arcanea-hero.jpg" // Placeholder
    },
    {
        id: "starlight-engine",
        title: "Starlight Engine",
        category: "Experiment",
        description: "A platform-agnostic intelligence orchestrator defining the 'Kernel' of AI agents.",
        tech: ["Rust", "Python", "LangChain", "Vector DB"],
        image: "/images/starlight-hero.jpg"
    },
    {
        id: "evi-agent",
        title: "Evi (Creative Companion)",
        category: "Agent",
        description: "A specialized creative partner agent designed to co-author lore and generate music prompts.",
        tech: ["Anthropic Claude 3.5", "Function Calling", "Personality Core"],
        image: "/images/evi-avatar.jpg"
    }
];
