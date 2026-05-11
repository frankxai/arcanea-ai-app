/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
