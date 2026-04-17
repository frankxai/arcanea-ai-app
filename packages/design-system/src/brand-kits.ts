export interface BrandKit {
  id: string;
  name: string;
  tagline: string;
  palette: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    bg: string;
    bgElevated: string;
    text: string;
    textMuted: string;
    border: string;
  };
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  motion: {
    speed: 'calm' | 'standard' | 'energetic';
    intensity: 'subtle' | 'balanced' | 'bold';
  };
  logo: {
    primary: string;
    wordmark?: string;
  };
}

export const arcanea: BrandKit = {
  id: 'arcanea',
  name: 'Arcanea',
  tagline: 'A portal into a creative universe',
  palette: {
    primary: '#00bcd4',
    primaryHover: '#99ffe0',
    secondary: '#0d47a1',
    accent: '#ffd700',
    bg: '#09090b',
    bgElevated: '#1a2332',
    text: '#e6eefc',
    textMuted: '#9bb1d0',
    border: 'rgba(255,255,255,0.06)',
  },
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  motion: { speed: 'standard', intensity: 'balanced' },
  logo: {
    primary: '/brand/arcanea-mark.jpg',
    wordmark: '/brand/arcanea-wordmark.svg',
  },
};

export const frankx: BrandKit = {
  id: 'frankx',
  name: 'FrankX',
  tagline: 'AI architect & creator',
  palette: {
    primary: '#AB47C7',
    primaryHover: '#C478D8',
    secondary: '#43BFE3',
    accent: '#F59E0B',
    bg: '#0F172A',
    bgElevated: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: 'rgba(255,255,255,0.04)',
  },
  fonts: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  motion: { speed: 'standard', intensity: 'subtle' },
  logo: {
    primary: '/brand/frankx-mark.png',
  },
};

export const oss: BrandKit = {
  id: 'oss',
  name: 'Arcanea OSS',
  tagline: 'Open creative intelligence',
  palette: {
    primary: '#00bcd4',
    primaryHover: '#99ffe0',
    secondary: '#7fffd4',
    accent: '#ffd700',
    bg: '#0a0a0a',
    bgElevated: '#161616',
    text: '#e6eefc',
    textMuted: '#9bb1d0',
    border: 'rgba(255,255,255,0.06)',
  },
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  motion: { speed: 'standard', intensity: 'balanced' },
  logo: {
    primary: '/brand/arcanea-oss-mark.svg',
  },
};

export const brandKits = { arcanea, frankx, oss } as const;
export type BrandKitId = keyof typeof brandKits;

export function getBrandKit(id: BrandKitId): BrandKit {
  return brandKits[id];
}
