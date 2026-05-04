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
