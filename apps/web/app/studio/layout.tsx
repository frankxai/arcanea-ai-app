import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creation Studio",
  description:
    "Write, design, compose, and code in one workspace. Text, images, music, and code — all with intelligent creative tools.",
  openGraph: {
    title: "Creation Studio",
    description: "Write, design, compose, and code in one workspace.",
    type: "website",
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
