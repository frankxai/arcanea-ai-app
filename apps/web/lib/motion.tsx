'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * MotionProvider — wraps children with framer-motion's LazyMotion to reduce
 * the initial JS bundle. Instead of importing the full `motion` module (~33 kB),
 * pages wrapped in this provider can use `m.div`, `m.span`, etc. which only
 * load the `domAnimation` feature set (~7 kB) on demand.
 *
 * Usage:
 *   import { MotionProvider } from '@/lib/motion';
 *   import { m } from 'framer-motion';
 *
 *   export default function Page() {
 *     return (
 *       <MotionProvider>
 *         <m.div animate={{ opacity: 1 }}>Hello</m.div>
 *       </MotionProvider>
 *     );
 *   }
 *
 * The `strict` prop ensures that any accidental use of `motion.*` inside
 * the provider tree throws an error, catching bundle-size regressions early.
 *
 * For pages that need the full feature set (layout animations, drag, etc.),
 * swap `domAnimation` for `domMax`:
 *
 *   import { LazyMotion, domMax } from 'framer-motion';
 *
 * Migration strategy (incremental):
 *   1. Wrap the page/layout in <MotionProvider>
 *   2. Replace `motion.div` with `m.div` (etc.) inside that tree
 *   3. Remove the direct `import { motion } from 'framer-motion'`
 *   4. Verify animations still work
 *
 * Top candidates for migration (by file size & motion usage):
 *   - apps/web/app/v3/v3-below-fold.tsx        (1313 lines, ~30 motion.div instances)
 *   - apps/web/app/academy/gate-quiz/page.tsx   (1251 lines, AnimatePresence + motion)
 *   - apps/web/app/v2/v2-content.tsx            (1204 lines, ~25 motion.div instances)
 *   - apps/web/app/v1/v1-content.tsx            (1169 lines)
 *   - apps/web/app/library/graph/graph-visualization.tsx (1125 lines)
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Re-export `m` for convenience so consumers can do:
 *   import { MotionProvider, m } from '@/lib/motion';
 */
export { m };
