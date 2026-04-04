import type { Platform } from './types';

export interface PlatformConfig {
  platform: Platform;
  name: string;
  domains: string[];
  icon: string;
  color: string;
}

export const PLATFORM_REGISTRY: PlatformConfig[] = [
  {
    platform: 'chatgpt',
    name: 'ChatGPT',
    domains: ['chat.openai.com', 'chatgpt.com'],
    icon: 'GPT',
    color: '#10a37f',
  },
  {
    platform: 'claude',
    name: 'Claude',
    domains: ['claude.ai'],
    icon: 'CL',
    color: '#d97706',
  },
  {
    platform: 'perplexity',
    name: 'Perplexity',
    domains: ['perplexity.ai', 'www.perplexity.ai'],
    icon: 'PP',
    color: '#20b2aa',
  },
  {
    platform: 'grok',
    name: 'Grok',
    domains: ['grok.com'],
    icon: 'GK',
    color: '#1d9bf0',
  },
  {
    platform: 'gemini',
    name: 'Gemini',
    domains: ['gemini.google.com'],
    icon: 'GM',
    color: '#4285f4',
  },
];

/**
 * Detect which AI platform a URL belongs to.
 * Returns undefined if the URL doesn't match any known platform.
 */
export function detectPlatform(url: string): PlatformConfig | undefined {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return PLATFORM_REGISTRY.find((p) =>
      p.domains.some((d) => hostname === d || hostname.endsWith(`.${d}`))
    );
  } catch {
    return undefined;
  }
}
