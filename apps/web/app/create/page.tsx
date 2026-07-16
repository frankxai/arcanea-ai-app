/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { CreateHub } from "./create-hub";

export const metadata: Metadata = {
  title: "Create — Start building",
  description:
    "Start from a template or build from scratch. Worlds, characters, stories, agents, music, images — all in one place.",
  openGraph: {
    title: "Create — Start building",
    description:
      "Start from a template or build from scratch. Worlds, characters, stories, agents, music, images — all in one place.",
  },
  alternates: { canonical: "/create" },
};

export default function CreatePage() {
  return <CreateHub />;
}
