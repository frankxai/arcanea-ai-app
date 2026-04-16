import { Metadata } from 'next';
import { AcademyContent } from './academy-content';

export const metadata: Metadata = {
  title: "Academy — Master the Ten Gates — Arcanea",
  description:
    "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  openGraph: {
    title: "Academy — Master the Ten Gates — Arcanea",
    description:
      "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  },
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  return <AcademyContent />;
}
