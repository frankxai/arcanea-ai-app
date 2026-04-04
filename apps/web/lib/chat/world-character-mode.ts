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
    color: '#00bcd4',
    gradient: 'from-[#00bcd4] to-[#7c3aed]',
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
    color: '#7c3aed',
    gradient: 'from-[#7c3aed] to-[#00bcd4]',
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
