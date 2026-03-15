import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'APL — The Arcanean Prompt Language',
  description:
    'SPARK. SHAPE. SHARPEN. Three words that turn generic AI output into work you are proud of. Works on every model. Learnable in 60 seconds.',
  openGraph: {
    title: 'APL — SPARK. SHAPE. SHARPEN.',
    description: 'The three-word system that eliminates AI slop. Works on Claude, GPT, Gemini, Grok, Midjourney, Suno.',
    url: 'https://arcanea.ai/apl',
  },
};

export default function APLLayout({ children }: { children: React.ReactNode }) {
  return children;
}
