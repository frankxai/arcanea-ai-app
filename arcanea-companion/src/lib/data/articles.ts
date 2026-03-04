
export interface Article {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
}

export const ARTICLES: Article[] = [
    {
        slug: "architecting-intelligence",
        title: "Architecting Intelligence: Beyond the Chatbot",
        date: "2026-01-15",
        excerpt: "Why true AGI requires a platform-agnostic orchestrator, not just a model. Introducing the Starlight Engine philosophy.",
        tags: ["AGI", "Architecture", "Starlight"]
    },
    {
        slug: "cosmic-modernism",
        title: "Designing for the Void: The Cosmic Modernism Aesthetic",
        date: "2025-12-08",
        excerpt: "How to design interfaces that feel like artifacts from a higher dimension. A deep dive into Arcanea's visual language.",
        tags: ["Design", "UI/UX", "Philosophy"]
    },
    {
        slug: "agent-swarm-mechanics",
        title: "Swarm Mechanics in Next.js 16",
        date: "2025-11-20",
        excerpt: " leveraging Server Actions and AI SDK to create multi-agent collaborative environments.",
        tags: ["Dev", "Next.js", "AI Agents"]
    }
];
