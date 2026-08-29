export const CINEMATIC_DOWNLOADS = {
  epub: {
    label: 'Reflowable EPUB',
    filename: 'the-last-free-path.epub',
    contentType: 'application/epub+zip',
  },
  'screen-pdf': {
    label: 'Screen edition PDF',
    filename: 'the-last-free-path-screen.pdf',
    contentType: 'application/pdf',
  },
  'print-pdf': {
    label: 'Print-friendly PDF',
    filename: 'the-last-free-path-print.pdf',
    contentType: 'application/pdf',
  },
  artbook: {
    label: 'Cinematic artbook PDF',
    filename: 'the-last-free-path-artbook.pdf',
    contentType: 'application/pdf',
  },
} as const;

export type CinematicDownloadId = keyof typeof CINEMATIC_DOWNLOADS;

export function isCinematicDownloadId(value: string): value is CinematicDownloadId {
  return Object.hasOwn(CINEMATIC_DOWNLOADS, value);
}

export function cinematicAssetPath(
  bookId: string,
  editionId: string,
  id: CinematicDownloadId,
): string {
  return [
    'editions',
    bookId,
    editionId,
    CINEMATIC_DOWNLOADS[id].filename,
  ].join('/');
}
