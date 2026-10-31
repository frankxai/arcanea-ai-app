/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { MetadataRoute } from "next";
import { brand, cosmic } from "@arcanea/design-system";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arcanea",
    short_name: "Arcanea",
    description:
      "Creative intelligence platform — Luminor companions, a philosophy library, and studio tools for modern creators.",
    start_url: "/",
    display: "standalone",
    background_color: cosmic.void,
    theme_color: brand.atlanteanTeal,
    icons: [
      {
        src: "/brand-icon/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand-icon/512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Lumina Room",
        short_name: "Lumina",
        description: "Open the voice Presence Room with Lumina",
        url: "/room/lumina",
        icons: [
          { src: "/brand-icon/192", sizes: "192x192", type: "image/png" },
        ],
      },
      {
        name: "JARVIS Room",
        short_name: "JARVIS",
        description: "Open the voice Presence Room in JARVIS mode",
        url: "/room/jarvis",
        icons: [
          { src: "/brand-icon/192", sizes: "192x192", type: "image/png" },
        ],
      },
      {
        name: "Chat",
        short_name: "Chat",
        description: "Open Arcanea Chat",
        url: "/chat",
        icons: [
          { src: "/brand-icon/192", sizes: "192x192", type: "image/png" },
        ],
      },
    ],
  };
}
