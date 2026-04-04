export interface FileUIPart {
  type: 'file';
  mediaType: string;
  filename: string;
  url: string;
}

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Filter files that exceed the size limit, logging a warning for each skipped file.
 * Then encode valid files to base64 data-URL FileUIParts for the AI SDK.
 * Returns undefined if no valid files remain.
 */
export async function encodeAttachments(attachments: File[]): Promise<FileUIPart[] | undefined> {
  const validFiles = attachments.filter((f) => {
    if (f.size > MAX_ATTACHMENT_SIZE) {
      console.warn(`Skipping "${f.name}" — exceeds 10 MB limit (${(f.size / 1024 / 1024).toFixed(1)} MB)`);
      return false;
    }
    return true;
  });
  if (validFiles.length === 0) return undefined;
  return Promise.all(validFiles.map(encodeFileAttachment));
}

/**
 * Encode a File object to a base64 data-URL FileUIPart for the AI SDK.
 */
export async function encodeFileAttachment(file: File): Promise<FileUIPart> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const mediaType = file.type || 'application/octet-stream';
  return {
    type: 'file' as const,
    mediaType,
    filename: file.name,
    url: `data:${mediaType};base64,${base64}`,
  };
}
