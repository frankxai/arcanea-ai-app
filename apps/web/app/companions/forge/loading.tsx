/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function ForgeLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--arc-cosmic-void)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[var(--arc-brand-atlantean-teal)]" />
    </div>
  );
}
