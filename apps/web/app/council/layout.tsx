/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Council",
  description:
    "Your personal AI advisory council. Nine specialized advisors across Vision, Strategy, Voice, Systems, and more.",
  openGraph: {
    title: "Council",
    description:
      "Nine specialized AI advisors. One strategic mind. Build your Council.",
  },
  alternates: { canonical: '/council' },
};

export default function CouncilLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
