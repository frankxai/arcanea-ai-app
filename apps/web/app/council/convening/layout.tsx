import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convening | Luminor Council",
  description:
    "Enter the Council Chamber. Summon your Luminors and receive transmissions of wisdom, strategy, and perception.",
  openGraph: {
    title: "Convening | Luminor Council",
    description:
      "Enter the Council Chamber. Summon your Luminors and receive transmissions.",
  },
};

export default function ConveningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
