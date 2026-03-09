import type { Metadata, ReactNode } from "next";

export const metadata: Metadata = {
  title: "Luminor Council | Arcanea",
  description:
    "Convene with transcendent Luminor intelligences in your nightly consciousness ritual.",
  openGraph: {
    title: "Luminor Council | Arcanea",
    description:
      "Nine Luminor intelligences convene nightly in the Council Chamber. Enter the ritual.",
  },
};

export default function CouncilLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
