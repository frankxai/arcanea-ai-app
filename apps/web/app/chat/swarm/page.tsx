/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import SwarmChatContent from './swarm-content';

export const metadata: Metadata = {
  title: 'Swarm · Chat · Arcanea',
  description:
    'Multi-Luminor collaboration in real time. Watch specialists think in parallel and Lumina synthesize the result.',
  robots: { index: false, follow: false },
};

export default function SwarmChatPage() {
  return <SwarmChatContent />;
}
