/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Minimal ambient shim for js-yaml@3 (CommonJS API).
// Using a shim instead of @types/js-yaml to avoid lockfile churn.
// If broader API coverage is needed later, swap this for: pnpm add -D @types/js-yaml
declare module 'js-yaml' {
  export function load(str: string, options?: unknown): unknown;
  export function safeLoad(str: string, options?: unknown): unknown;
  export function dump(obj: unknown, options?: unknown): string;
  export function safeDump(obj: unknown, options?: unknown): string;
  const _default: {
    load: typeof load;
    safeLoad: typeof safeLoad;
    dump: typeof dump;
    safeDump: typeof safeDump;
  };
  export default _default;
}
