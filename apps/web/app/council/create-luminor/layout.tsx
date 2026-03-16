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
};

export default function CreateLuminorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
