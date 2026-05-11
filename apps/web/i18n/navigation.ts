/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Type-safe locale-aware navigation primitives.
 *
 * Use these in place of next/link, next/navigation when targeting localized routes:
 *   - <Link href="/about" /> — auto-switches to /de/ueber for German users
 *   - router.push('/books') — same
 *   - usePathname() — returns the canonical path (without locale prefix)
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
