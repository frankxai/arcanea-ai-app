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
};

export default function CouncilLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
