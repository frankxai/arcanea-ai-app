/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useScroll, useTransform, m } from 'framer-motion';

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <m.div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] origin-left bg-atlantean-teal-aqua"
      style={{
        scaleX,
        boxShadow:
          '0 0 8px rgba(127,255,212,0.4), 0 0 20px rgba(127,255,212,0.2)',
      }}
    />
  );
}
