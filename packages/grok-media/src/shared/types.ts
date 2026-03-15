/** Core media item from Grok Imagine */
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  hdUrl?: string;
  thumbnailUrl?: string;
  prompt?: string;
  timestamp: number;
  downloadedAt?: number;
  upscaleStatus: UpscaleStatus;
  projectId?: string;
  metadata?: Record<string, unknown>;
  // Arcanea pipeline fields (Phase 5)
  tasteScore?: number;
  guardian?: string;
  element?: string;
  exportedAt?: number;
}

export type UpscaleStatus = 'none' | 'pending' | 'processing' | 'done' | 'failed';

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  mediaIds: string[];
  metadata?: Record<string, unknown>;
}

export interface QueueItem {
  id: string;
  type: QueueItemType;
  status: QueueStatus;
  mediaId?: string;
  prompt?: string;
  mode?: GenMode;
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

export type QueueItemType = 'download' | 'upscale' | 'generate';
export type QueueStatus = 'pending' | 'active' | 'done' | 'failed' | 'retrying';
export type GenMode = 'custom' | 'normal' | 'fun' | 'spicy';

export interface DownloadRecord {
  mediaId: string;
  downloadedAt: number;
  filePath: string;
  fileSize?: number;
}

export interface ScanResult {
  items: MediaItem[];
  totalFound: number;
  duplicatesSkipped: number;
}

export interface DownloadProgress {
  mediaId: string;
  state: 'queued' | 'downloading' | 'complete' | 'failed';
  progress: number;
  error?: string;
}

export interface ExtensionSettings {
  downloadPath: string;
  scrollDelay: number;
  downloadDelay: number;
  upscaleDelay: number;
  maxRetries: number;
  autoDownloadAfterGen: boolean;
  smartFilenames: boolean;
  includeMetadata: boolean;
  organizeByDate: boolean;
}

// Message protocol between content script and service worker
export type Message =
  | { type: 'SCAN_FAVORITES'; payload: { scrollDelay?: number } }
  | { type: 'SCAN_RESULT'; payload: ScanResult }
  | { type: 'SCAN_PROGRESS'; payload: { found: number; scrollPosition: number } }
  | { type: 'DOWNLOAD_BATCH'; payload: { mediaIds: string[]; projectName?: string } }
  | { type: 'DOWNLOAD_PROGRESS'; payload: DownloadProgress }
  | { type: 'DOWNLOAD_SINGLE'; payload: { item: MediaItem } }
  | { type: 'UPSCALE_REQUEST'; payload: { videoId: string } }
  | { type: 'UPSCALE_STATUS'; payload: { videoId: string; status: UpscaleStatus } }
  | { type: 'STREAM_CAPTURE_START' }
  | { type: 'STREAM_CAPTURE_STOP' }
  | { type: 'STREAM_CAPTURE_ITEM'; payload: { item: MediaItem } }
  | { type: 'GEN_QUEUE_ADD'; payload: { prompt: string; mode: GenMode; count: number } }
  | { type: 'GEN_QUEUE_STATUS'; payload: { queue: QueueItem[] } }
  | { type: 'NETWORK_SNIFF'; payload: { postUrl: string } }
  | { type: 'SNIFF_RESULT'; payload: { urls: string[] } }
  | { type: 'GET_STATS' }
  | { type: 'STATS_RESULT'; payload: Stats }
  | { type: 'CANCEL_OPERATION' }
  | { type: 'GET_SETTINGS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ExtensionSettings> }
  | { type: 'SETTINGS_RESULT'; payload: ExtensionSettings }
  | { type: 'OPEN_SIDE_PANEL' }
  | { type: 'CONTENT_READY' };

export interface Stats {
  totalImages: number;
  totalVideos: number;
  totalDownloaded: number;
  sdVideos: number;
  hdVideos: number;
  pendingUpscales: number;
}

export interface MediaMetadata {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  generatedAt: string;
  downloadedAt: string;
  resolution?: string;
  duration?: number;
  model?: string;
  source: 'grok-imagine';
  hdUpscaled: boolean;
}
