import type { ExtensionSettings } from './types';

/** Grok API endpoints (reverse-engineered from web UI) */
export const API = {
  /** GET — triggers media URL discovery via network sniffer */
  CONVERSATIONS: 'https://grok.com/rest/app-chat/conversations',
  /** POST {id} — unfavorite/unsave a post */
  UNLIKE: 'https://grok.com/rest/media/post/unlike',
  /** POST {videoId} — request 480p->720p HD upscale */
  VIDEO_UPSCALE: 'https://grok.com/rest/media/video/upscale',
  /** POST — new chat session for video generation */
  NEW_CONVERSATION: 'https://grok.com/rest/app-chat/conversations/new',
} as const;

/** Official xAI API (requires API key) */
export const OFFICIAL_API = {
  BASE: 'https://api.x.ai/v1',
  VIDEO_GENERATE: 'https://api.x.ai/v1/videos/generations',
  VIDEO_STATUS: (requestId: string) => `https://api.x.ai/v1/videos/${requestId}`,
} as const;

/** Known CDN domains serving Grok media assets */
export const CDN_DOMAINS = [
  'assets.grok.com',
  'imagine-public.x.ai',
  'assets.grokusercontent.com',
] as const;

/** Proven DOM selectors — isolated here for easy updates when Grok changes */
export const SELECTORS = {
  /** Masonry card wrapper for each media item */
  CARD: '.group\\/media-post-masonry-card',
  /** AI-generated image element */
  IMAGE: 'img[alt*="Generated"]',
  /** Video element variants */
  VIDEO: 'video, [data-testid="video-player"], .video-js',
  /** Play icon indicators (SVG-based) */
  PLAY_ICON: 'svg[data-icon="play"], svg[data-icon="play-fill"], [aria-label*="Play"], .fa-play',
  /** Unsave/unfavorite button (multi-language) */
  UNSAVE_BUTTON: [
    'button[aria-label="Unsave"]',
    'button[aria-label="保存解除"]',
    'button[aria-label*="nsave"]',
    'button[aria-label*="解除"]',
    'button:has(path[d^="M12.0014 6.339"])',
  ].join(', '),
  /** List item wrapper */
  LIST_ITEM: '[role="listitem"]',
  /** Scroll container detection cascade */
  SCROLL_CONTAINER: 'main, [role="main"], .overflow-y-auto, .overflow-auto',
  /** Post link pattern */
  POST_LINK: 'a[href*="/imagine/post/"]',
  /** Duration text indicator for videos */
  DURATION_TEXT: /\d+:\d+/,
  /** HD badge indicator */
  HD_BADGE: '[class*="HD"], [data-testid*="hd"]',
} as const;

/** Rate limits — conservative defaults to avoid account issues */
export const RATE_LIMITS = {
  /** ms between consecutive downloads */
  DOWNLOAD_DELAY: 1000,
  /** ms between upscale API requests */
  UPSCALE_DELAY: 500,
  /** ms between unfavorite API calls */
  UNFAVORITE_DELAY: 200,
  /** ms between scroll loads during scan */
  SCROLL_DELAY: 2000,
  /** ms of analysis delay after scroll settles */
  ANALYSIS_DELAY: 1000,
  /** max scroll cycles with no new items before stopping */
  MAX_IDLE_SCROLLS: 10,
  /** ms to wait for background tab sniff to complete */
  MAX_SNIFF_WAIT: 4000,
  /** ms of network idle before considering sniff done */
  SNIFF_IDLE_TIMEOUT: 600,
  /** max retry attempts for downloads */
  MAX_RETRIES: 3,
  /** base delay for exponential backoff (ms) */
  RETRY_BASE_DELAY: 2000,
} as const;

/** Media file extensions to capture */
export const MEDIA_EXTENSIONS = ['.mp4', '.jpg', '.jpeg', '.png', '.webp', '.gif'] as const;

/** Default download folder name */
export const DOWNLOAD_FOLDER = 'grok-media';

/** Default settings */
export const DEFAULT_SETTINGS: ExtensionSettings = {
  downloadPath: DOWNLOAD_FOLDER,
  scrollDelay: RATE_LIMITS.SCROLL_DELAY,
  downloadDelay: RATE_LIMITS.DOWNLOAD_DELAY,
  upscaleDelay: RATE_LIMITS.UPSCALE_DELAY,
  maxRetries: RATE_LIMITS.MAX_RETRIES,
  autoDownloadAfterGen: true,
  smartFilenames: true,
  includeMetadata: true,
  organizeByDate: true,
};

/** Storage keys for chrome.storage.local */
export const STORAGE_KEYS = {
  SETTINGS: 'arcanea_grok_settings',
  SCAN_STATE: 'arcanea_grok_scan_state',
  QUEUE_STATE: 'arcanea_grok_queue_state',
} as const;
