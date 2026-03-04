export type GalleryItem = {
    id: string;
    title: string;
    subtitle: string;
    aspectRatio: "3/4" | "4/5" | "16/9";
    type: "image" | "video";
    src: string; // Ensure this points to a valid image or placeholder
    liked: boolean;
    category: "Guardian" | "Godbeast" | "Cosmic" | "Companion" | "Lore";
    prompt: string;
};

export const MOCK_GALLERY: GalleryItem[] = [
    {
        id: "1",
        title: "Lyssandria & Kaelith",
        subtitle: "Guardian of Arcane Wisdom",
        aspectRatio: "3/4",
        type: "image",
        src: "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=1000&auto=format&fit=crop", // Abstract purple/cosmic
        liked: true,
        category: "Guardian",
        prompt: "A mystic anime guardian with purple hair holding a glowing orb, fantasy art, intricate details",
    },
    {
        id: "2",
        title: "Leyla's Melody",
        subtitle: "Guardian of Harmony",
        aspectRatio: "4/5",
        type: "image",
        src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop", // Pink/musical vibe
        liked: false,
        category: "Guardian",
        prompt: "Anime girl playing a crystal violin in a bio-luminescent forest, pink and blue lighting",
    },
    {
        id: "3",
        title: "Draconia Rising",
        subtitle: "Reality Architects",
        aspectRatio: "3/4",
        type: "video",
        src: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1000&auto=format&fit=crop", // Fire/Red
        liked: true,
        category: "Guardian",
        prompt: "Fierce warrior woman with dragon wings breathing fire, cinematic lighting, 8k",
    },
    {
        id: "4",
        title: "Cosmic Fox",
        subtitle: "The Harmony Beast",
        aspectRatio: "16/9",
        type: "image",
        src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop", // Nature/Fox
        liked: false,
        category: "Companion",
        prompt: "A nine-tailed fox made of starlight running through the void",
    },
    {
        id: "5",
        title: "Portal to Arcanea",
        subtitle: "Dimensional Shift",
        aspectRatio: "4/5",
        type: "video",
        src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop", // Nebula
        liked: true,
        category: "Cosmic",
        prompt: "Swirling vortex of purple and gold energy opening a portal in space",
    },
    {
        id: "6",
        title: "Evi's Awakening",
        subtitle: "Creative Companion",
        aspectRatio: "3/4",
        type: "image",
        src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", // Cyberpunk/Tech
        liked: true,
        category: "Companion",
        prompt: "A beautiful digital butterfly entity interacting with a holographic interface",
    },
    {
        id: "7",
        title: "Library of Souls",
        subtitle: "Ancient Knowledge",
        aspectRatio: "3/4",
        type: "image",
        src: "https://images.unsplash.com/photo-1507842217121-9e93c8aaf27c?q=80&w=1000&auto=format&fit=crop", // Library
        liked: false,
        category: "Lore",
        prompt: "Infinite library with floating books and spiral staircases, dust motes catching light",
    },
];
