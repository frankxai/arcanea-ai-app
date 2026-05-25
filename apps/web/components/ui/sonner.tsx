/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

/**
 * Arcanea-themed sonner Toaster.
 * Dark glass surface with Atlantean Teal accents.
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-white/90',
          title: 'text-white/95 font-medium',
          description: 'text-white/60',
          actionButton: 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]',
          cancelButton: 'bg-white/[0.04] text-white/60',
        },
      }}
      {...props}
    />
  );
}
