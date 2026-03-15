import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'APL Prompt Library — Ready-to-Use SPARK.SHAPE.SHARPEN Prompts',
  description:
    '30+ copy-paste prompts for characters, images, music, scenes, and worlds. Each uses the SPARK.SHAPE.SHARPEN method for maximum AI output quality.',
  openGraph: {
    title: 'APL Prompt Library — 30+ Ready-to-Use Prompts',
    description: 'Browse, copy, and use SPARK.SHAPE.SHARPEN prompts for any AI model.',
    url: 'https://arcanea.ai/apl/library',
  },
};

export default function APLLibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
