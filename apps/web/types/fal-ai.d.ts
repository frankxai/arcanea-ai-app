/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
declare module '@fal-ai/client' {
  interface FalConfig {
    credentials: string;
  }
  interface FalClient {
    config(options: FalConfig): void;
    subscribe(model: string, options: { input: Record<string, unknown> }): Promise<{ data: Record<string, unknown> }>;
  }
  export const fal: FalClient;
}
