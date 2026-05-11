/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Advisor | Luminor Council",
  description:
    "Design a custom advisor for your Luminor Council. Define its name, domain, frequency alignment, and capabilities.",
  openGraph: {
    title: "Create Advisor",
    description:
      "Design a custom advisor for your Luminor Council.",
  },
  alternates: { canonical: '/council/create-luminor' },
};

export default function CreateLuminorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
