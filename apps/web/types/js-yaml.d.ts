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
