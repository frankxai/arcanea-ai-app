import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcanea — Creative Intelligence Platform",
  description:
    "Build with 16 creative intelligences. Development, design, writing, and research — AI that works the way you think.",
};

export default function V3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
