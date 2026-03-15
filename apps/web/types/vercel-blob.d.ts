declare module '@vercel/blob' {
  interface BlobResult {
    url: string;
    pathname: string;
    uploadedAt: string;
    size: number;
  }
  interface ListResult {
    blobs: BlobResult[];
  }
  interface PutOptions {
    access: 'public' | 'private';
    contentType?: string;
    addRandomSuffix?: boolean;
  }
  export function list(options: { prefix?: string; limit?: number }): Promise<ListResult>;
  export function put(pathname: string, body: Buffer | ReadableStream | string, options: PutOptions): Promise<BlobResult>;
}
