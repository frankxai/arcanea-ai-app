import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session | Council",
  description:
    "Run a session with your Council. Consult nine specialized advisors across Vision, Strategy, Voice, Systems, and more.",
  openGraph: {
    title: "Council Session",
    description:
      "Run a session with your Council. Nine advisors, one strategic mind.",
  },
};

export default function ConveningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
