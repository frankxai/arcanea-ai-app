/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { LuminorConfig } from '@/lib/luminors/config';

/**
 * Build a synthetic LuminorConfig for a world character loaded via query params.
 */
export function buildWorldCharacterLuminor(wc: {
  characterName: string;
  worldName: string;
  characterPortrait?: string | null;
  systemPrompt: string;
}): LuminorConfig {
  return {
    id: `world-char-${Date.now()}`,
    name: wc.characterName,
    loreName: wc.characterName,
    title: `Character from ${wc.worldName}`,
    tagline: `Chatting with ${wc.characterName}`,
    team: 'creative' as never,
    academy: 'Synthesis' as never,
    color: 'var(--arc-brand-atlantean-teal)',
    gradient: 'from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-void)]',
    avatar: wc.characterPortrait || '/images/luminors/default.webp',
    wisdom: { philosophy: '', greeting: '', farewell: '' } as never,
    guardian: [],
    specialty: 'World Character',
    description: `${wc.characterName} from ${wc.worldName}`,
    personality: [],
    systemPrompt: wc.systemPrompt,
    quickActions: [],
  } as LuminorConfig;
}

/**
 * Build a synthetic LuminorConfig for world-builder mode.
 */
export function buildWorldBuilderLuminor(worldPrompt: string): LuminorConfig {
  return {
    id: 'world-builder-mode',
    name: 'World Builder',
    loreName: 'World Builder',
    title: 'AI World-Building Assistant',
    tagline: 'Describe your world and bring it to life',
    team: 'creative' as never,
    academy: 'Synthesis' as never,
    color: 'var(--arc-void)',
    gradient: 'from-[var(--arc-void)] to-[var(--arc-brand-atlantean-teal)]',
    avatar: '/images/luminors/default.webp',
    wisdom: { philosophy: '', greeting: '', farewell: '' } as never,
    guardian: [],
    specialty: 'World Building',
    description: 'Guides creators through structured world design',
    personality: [],
    systemPrompt: worldPrompt,
    quickActions: [],
  } as LuminorConfig;
}
