import type { Metadata } from "next";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "What Is Your Origin Class? | Arcanea",
  description:
    "Take the Arcanea Origin Class Quiz and discover the source of your power. Are you an Arcan, Gate-Touched, Celestial, Architect, or one of the five other origins? Eight questions reveal your place in the multiverse.",
  openGraph: {
    title: "What Is Your Origin Class? | Arcanea",
    description:
      "Discover your Arcanean origin in 8 questions. Your power has a source — find it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is Your Origin Class? | Arcanea",
    description: "Discover your Arcanean origin in 8 questions.",
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
