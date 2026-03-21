import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your vision with Arcanea. Report issues, request features, or offer insights that shape the future of the creative platform.",
  openGraph: {
    title: "Share Your Vision | Feedback",
    description:
      "Your feedback shapes the living mythology. Help us build the future of AI-powered creation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Your Vision | Feedback",
    description:
      "Your feedback shapes the living mythology. Help us build the future of AI-powered creation.",
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
