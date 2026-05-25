/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your vision with Arcanea. Report issues, request features, or offer insights that shape the future of the creative platform.",
  openGraph: {
    title: "Share Your Vision | Feedback",
    description:
      "Your feedback shapes the living mythology. Help us build the future of creation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Your Vision | Feedback",
    description:
      "Your feedback shapes the living mythology. Help us build the future of creation.",
  },
  alternates: { canonical: '/feedback' },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
