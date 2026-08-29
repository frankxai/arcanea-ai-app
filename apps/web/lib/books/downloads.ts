import 'server-only';

import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_EDITION_ID,
} from '@/lib/books/cinematic-edition';
import {
  CINEMATIC_DOWNLOADS,
  cinematicAssetPath,
  type CinematicDownloadId,
} from '@/lib/books/cinematic-download-contract';

export {
  CINEMATIC_DOWNLOADS,
  isCinematicDownloadId,
  type CinematicDownloadId,
} from '@/lib/books/cinematic-download-contract';

export function cinematicDownloadPath(id: CinematicDownloadId): string {
  return cinematicAssetPath(CINEMATIC_BOOK_ID, CINEMATIC_EDITION_ID, id);
}

export function areCinematicDownloadsEnabled(): boolean {
  return Boolean(
    process.env.CINEMATIC_BOOK_DOWNLOADS_ENABLED === 'true'
    && process.env.BLOB_READ_WRITE_TOKEN?.trim(),
  );
}
