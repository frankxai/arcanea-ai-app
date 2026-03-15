import type { MediaItem, MediaMetadata } from './types';

/** Generate a JSON metadata object for a downloaded media item */
export function buildMetadata(item: MediaItem): MediaMetadata {
  return {
    id: item.id,
    type: item.type,
    prompt: item.prompt ?? '',
    generatedAt: new Date(item.timestamp).toISOString(),
    downloadedAt: new Date().toISOString(),
    resolution: item.hdUrl ? '720p' : '480p',
    model: 'grok-imagine',
    source: 'grok-imagine',
    hdUpscaled: item.upscaleStatus === 'done',
  };
}

/** Create a safe filename from a prompt string */
export function promptToFilename(prompt: string, maxLength = 80): string {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength);
}

/** Build the download path for a media item */
export function buildDownloadPath(
  item: MediaItem,
  basePath: string,
  organizeByDate: boolean,
  smartFilenames: boolean,
): string {
  const parts: string[] = [basePath];

  if (organizeByDate) {
    const date = new Date(item.timestamp);
    parts.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    );
  }

  const ext = item.type === 'video' ? 'mp4' : 'jpg';
  const name = smartFilenames && item.prompt
    ? `${promptToFilename(item.prompt)}-${item.id.slice(0, 8)}.${ext}`
    : `${item.id}.${ext}`;

  parts.push(name);
  return parts.join('/');
}
