/**
 * Arcanea Design Preset v3.0
 * Tailwind CSS preset for ALL Arcanea apps and packages.
 * Source of truth: .arcanea/config/design-tokens.yaml
 *
 * Usage in any tailwind.config:
 *   presets: [require('../../packages/arcanea-design-preset')]
 *
 * This preset provides:
 * - Cosmic color palette (6 depth levels)
 * - Brand colors (aquamarine/teal primary)
 * - Elemental colors (fire, water, wind, earth, void)
 * - Typography (Space Grotesk display, Inter body, JetBrains Mono, Newsreader serif)
 * - Animation system (ambient, reveal, celebration)
 * - Elevation shadows
 * - Glow system
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        // ── Cosmic Palette (6 depth levels) ──
        cosmic: {
          void: "#0b0e14",
          deep: "#121826",
          surface: "#1a2332",
          raised: "#242f42",
          elevated: "#2d3a52",
          overlay: "#364562",
          border: "#242f42",
          "border-bright": "#364562",
        },
        // ── Brand ──
        brand: {
          primary: "#00bcd4",     // atlantean teal — THE accent
          hover: "#99ffe0",
          active: "#5ce6b8",
          secondary: "#78a6ff",   // cosmic blue
          gold: "#ffd700",        // premium accent
        },
        // ── Text ──
        "text-primary": "#e6eefc",
        "text-secondary": "#9bb1d0",
        "text-muted": "#708094",
        "text-disabled": "#515b6b",
        // ── Elemental (for themed content, not product shell) ──
        crystal: {
          DEFAULT: "#7fffd4",
          bright: "#99ffe0",
          deep: "#5ce6b8",
        },
        fire: {
          DEFAULT: "#ff6b35",
          bright: "#ff8c5a",
          deep: "#d94e1f",
        },
        water: {
          DEFAULT: "#78a6ff",
          bright: "#9dbfff",
          deep: "#5a8ce6",
        },
        "void-el": {
          DEFAULT: "#9966ff",
          bright: "#b38cff",
          deep: "#7a4dcc",
        },
        gold: {
          DEFAULT: "#ffd700",
          bright: "#ffe44d",
          deep: "#ccac00",
          light: "#fff3b3",
          dark: "#997f00",
        },
        wind: {
          DEFAULT: "#00ff88",
          bright: "#33ffaa",
          deep: "#00cc6d",
        },
        earth: {
          DEFAULT: "#8b7355",
          bright: "#a89070",
          deep: "#6e5940",
        },
        // ── Semantic ──
        success: { DEFAULT: "#22c55e", light: "#86efac", dark: "#15803d" },
        warning: { DEFAULT: "#eab308", light: "#fde68a", dark: "#a16207" },
        error: { DEFAULT: "#ef4444", light: "#fca5a5", dark: "#b91c1c" },
        info: { DEFAULT: "#3b82f6", light: "#93c5fd", dark: "#1d4ed8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",    // 8px — small elements (buttons, inputs, badges)
        "2xl": "1rem",   // 16px — large containers (cards, modals, panels)
      },
      backgroundImage: {
        "cosmic-mesh": "radial-gradient(ellipse at 20% 50%, rgba(0, 188, 212, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(153, 102, 255, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(120, 166, 255, 0.03) 0%, transparent 50%)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(0, 188, 212, 0.15)",
        "glow-md": "0 0 20px rgba(0, 188, 212, 0.25)",
        "glow-lg": "0 0 40px rgba(0, 188, 212, 0.35)",
        "glow-xl": "0 0 60px rgba(0, 188, 212, 0.45)",
        "glow-brand": "0 0 20px rgba(0, 188, 212, 0.3)",
        "elevation-1": "0 2px 8px rgba(0,0,0,0.2), 0 0 1px rgba(255,255,255,0.05)",
        "elevation-2": "0 4px 16px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.06)",
        "elevation-3": "0 8px 32px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.08)",
        "elevation-4": "0 16px 64px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
      },
      animation: {
        // Ambient — slow, background, barely noticeable
        "float": "float 6s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        // Reveal — content appearing
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        // Shimmer — loading states
        "shimmer": "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
