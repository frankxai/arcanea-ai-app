/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { MetadataRoute } from "next";
import { brand, cosmic } from "@arcanea/design-system/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Arcanea",
    short_name: "Arcanea",
    description:
      "Creative intelligence platform — Luminor companions, worldbuilding graph, philosophy library, and studio tools for modern creators.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: cosmic.void,
    theme_color: brand.atlanteanTeal,
    categories: ["creativity", "productivity", "education", "entertainment"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Chat",
        short_name: "Chat",
        description: "Open Arcanea multi-model Chat",
        url: "/chat",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Imagine Studio",
        short_name: "Imagine",
        description: "Generate and curate visual creations",
        url: "/imagine",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Worlds",
        short_name: "Worlds",
        description: "Explore and build living multiverses",
        url: "/worlds",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Creation Studio",
        short_name: "Studio",
        description: "Write chapters, lore, and creative artifacts",
        url: "/studio",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Lumina Room",
        short_name: "Lumina",
        description: "Open the voice Presence Room with Lumina",
        url: "/room/lumina",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "JARVIS Room",
        short_name: "JARVIS",
        description: "Open the voice Presence Room in JARVIS mode",
        url: "/room/jarvis",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
