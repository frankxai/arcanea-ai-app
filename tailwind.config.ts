import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // === COSMIC PALETTE (Universal) ===
        cosmic: {
          void: '#0b0e14',
          deep: '#121826',
          surface: '#1a2332',
          raised: '#242f42',
          elevated: '#2d3a52',
          overlay: '#364562',
        },

        // === ARCANEAN COLORS ===
        arcane: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',

          // Elemental colors
          fire: '#ff6b35',
          'fire-bright': '#ff8c5a',
          'fire-deep': '#d94e1f',
          water: '#78a6ff',
          'water-bright': '#9dbfff',
          'water-deep': '#5a8ce6',
          earth: '#8b7355',
          'earth-bright': '#a89070',
          'earth-deep': '#6e5940',
          wind: '#00ff88',
          'wind-bright': '#33ffaa',
          'wind-deep': '#00cc6d',
          void: '#9966ff',
          'void-bright': '#b38cff',
          'void-deep': '#7a4dcc',

          // Premium accents
          gold: '#ffd700',
          'gold-bright': '#ffe44d',
          'gold-deep': '#ccac00',
          crystal: '#7fffd4',
          'crystal-bright': '#99ffe0',
          'crystal-deep': '#5ce6b8',
          shadow: '#1a1a2e',
          cosmic: '#16213e',

          // Atlantean Academy
          'atlantean-primary': '#0f3566',
          'atlantean-glow': '#00e6e6',
          'atlantean-bio': '#26cccc',

          // Draconic Academy
          'draconic-primary': '#d92952',
          'draconic-gold': '#ffc61a',

          // Creation Academy
          'creation-primary': '#ffcc33',
          'creation-glow': '#ffffff',
        },

        // === TEXT HIERARCHY ===
        'text-primary': '#e6eefc',
        'text-secondary': '#9bb1d0',
        'text-muted': '#708094',
        'text-disabled': '#515b6b',

        // === SEMANTIC ===
        success: { DEFAULT: '#20cc73', light: '#5ae096', dark: '#18a65c' },
        warning: { DEFAULT: '#ffa500', light: '#ffbf4d', dark: '#cc8400' },
        error: { DEFAULT: '#f52952', light: '#f75c7a', dark: '#cc1f42' },
        info: { DEFAULT: '#26b8e6', light: '#5ccde6', dark: '#1f99bf' },
      },

      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // === FLUID TYPOGRAPHY ===
      fontSize: {
        // Fluid type scale using clamp()
        'fluid-xs': ['clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(0.9rem, 0.85rem + 0.25vw, 1rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.1rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 1.25rem + 1.25vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.25rem, 1.75rem + 2.5vw, 3rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(3rem, 2rem + 5vw, 4.5rem)', { lineHeight: '1' }],
        'fluid-6xl': ['clamp(3.75rem, 2.5rem + 6.25vw, 6rem)', { lineHeight: '0.95' }],
        'fluid-hero': ['clamp(3rem, 1.5rem + 7.5vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      backdropBlur: {
        xs: '2px',
      },

      // === ANIMATIONS (40+ variants) ===
      animation: {
        // Cosmic
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'energy-flow': 'energy-flow 4s ease-in-out infinite',
        'portal-rotate': 'portal-rotate 20s linear infinite',
        'cosmic-pulse': 'cosmic-pulse 4s ease-in-out infinite',
        'aurora': 'aurora 8s ease-in-out infinite',

        // Atlantean (Water)
        'water-flow': 'water-flow 6s ease-in-out infinite',
        'wave': 'wave 4s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out forwards',

        // Draconic (Fire)
        'fire-flicker': 'fire-flicker 2s ease-in-out infinite',
        'flame': 'flame 1.5s ease-in-out infinite',
        'ember': 'ember 2s ease-in-out infinite',

        // Creation (Light)
        'prism-rotate': 'prism-rotate 10s linear infinite',
        'radial-pulse': 'radial-pulse 2s ease-in-out infinite',

        // UI Transitions
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.6s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-down': 'slide-down 0.5s ease-out forwards',

        // Special
        'glow-breathe': 'glow-breathe 3s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',

        // Accordion
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      keyframes: {
        // Cosmic
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(127, 255, 212, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(127, 255, 212, 0.8)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'energy-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'portal-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'cosmic-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'aurora': {
          '0%, 100%': { backgroundPosition: '0% 50%', opacity: '0.5' },
          '25%': { backgroundPosition: '50% 0%', opacity: '0.7' },
          '50%': { backgroundPosition: '100% 50%', opacity: '0.5' },
          '75%': { backgroundPosition: '50% 100%', opacity: '0.7' },
        },

        // Atlantean (Water)
        'water-flow': {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(5px) translateY(-3px)' },
          '50%': { transform: 'translateX(0) translateY(-5px)' },
          '75%': { transform: 'translateX(-5px) translateY(-3px)' },
        },
        'wave': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(1deg)' },
          '75%': { transform: 'translateY(3px) rotate(-1deg)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },

        // Draconic (Fire)
        'fire-flicker': {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.8', transform: 'scaleY(0.95)' },
        },
        'flame': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(-20px) scale(0.9)', opacity: '0' },
        },
        'ember': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) rotate(180deg)', opacity: '0' },
        },

        // Creation (Light)
        'prism-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'radial-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 204, 51, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(255, 204, 51, 0)' },
        },

        // UI Transitions
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },

        // Special
        'glow-breathe': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(127, 255, 212, 0.3), 0 0 30px rgba(127, 255, 212, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(127, 255, 212, 0.5), 0 0 50px rgba(127, 255, 212, 0.2)' },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(127, 255, 212, 0.3)' },
          '50%': { borderColor: 'rgba(127, 255, 212, 0.7)' },
        },

        // Accordion
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      // === GRADIENTS ===
      backgroundImage: {
        'arcane-gradient': 'radial-gradient(ellipse at top, rgba(127, 255, 212, 0.15) 0%, transparent 70%)',
        'energy-gradient': 'linear-gradient(45deg, #ff6b35, #78a6ff, #9966ff, #ffd700)',
        'cosmic-gradient': 'linear-gradient(135deg, #0b0e14 0%, #121826 30%, #1a2332 60%, #16213e 100%)',
        'portal-gradient': 'radial-gradient(circle, rgba(127, 255, 212, 0.8) 0%, transparent 70%)',
        'aurora-gradient': 'linear-gradient(135deg, rgba(127, 255, 212, 0.15), rgba(153, 102, 255, 0.15), rgba(255, 107, 53, 0.15), rgba(120, 166, 255, 0.15))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
        'crystal-shimmer': 'linear-gradient(90deg, transparent, rgba(127, 255, 212, 0.3), transparent)',
        'hero-glow': 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(127, 255, 212, 0.06), transparent 40%)',
        'section-divider': 'linear-gradient(90deg, transparent, rgba(127, 255, 212, 0.3), transparent)',
      },

      // === BOX SHADOWS ===
      boxShadow: {
        'glow-sm': '0 0 10px rgba(127, 255, 212, 0.2)',
        'glow-md': '0 0 20px rgba(127, 255, 212, 0.3)',
        'glow-lg': '0 0 40px rgba(127, 255, 212, 0.4)',
        'glow-xl': '0 0 60px rgba(127, 255, 212, 0.5)',
        'glow-crystal': '0 0 20px rgba(127, 255, 212, 0.3), 0 0 40px rgba(127, 255, 212, 0.1)',
        'glow-fire': '0 0 20px rgba(255, 107, 53, 0.3), 0 0 40px rgba(255, 107, 53, 0.1)',
        'glow-void': '0 0 20px rgba(153, 102, 255, 0.3), 0 0 40px rgba(153, 102, 255, 0.1)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(127, 255, 212, 0.1)',
        'cosmic': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(127, 255, 212, 0.05)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
