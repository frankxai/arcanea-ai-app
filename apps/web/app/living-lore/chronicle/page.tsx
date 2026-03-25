import type { Metadata } from 'next';
import { getActs } from '@/lib/living-lore/episode-loader';
import type { ActInfo } from '@/lib/living-lore/types';
import { ChronicleContent } from './chronicle-content';

export const metadata: Metadata = {
  title: 'The Chronicle — Living Lore',
  description:
    'All episodes of the Living Lore, grouped by Act and mapped to the Ten Gates of Arcanea.',
};

const ALL_ACTS = [
  { number: 1, title: 'Foundation', subtitle: 'Where We Begin', guardianName: 'Lyssandria' },
  { number: 2, title: 'Flow', subtitle: 'What Moves Us', guardianName: 'Leyla' },
  { number: 3, title: 'Fire', subtitle: 'What Transforms Us', guardianName: 'Draconia' },
  { number: 4, title: 'Heart', subtitle: 'What Heals Us', guardianName: 'Maylinn' },
  { number: 5, title: 'Voice', subtitle: 'What We Must Say', guardianName: 'Alera' },
  { number: 6, title: 'Sight', subtitle: 'What We Must See', guardianName: 'Lyria' },
  { number: 7, title: 'Crown', subtitle: 'What We Must Know', guardianName: 'Aiyami' },
  { number: 8, title: 'Starweave', subtitle: 'What We Must Become', guardianName: 'Elara' },
  { number: 9, title: 'Unity', subtitle: 'What We Build Together', guardianName: 'Ino' },
  { number: 10, title: 'Source', subtitle: 'Where All Returns', guardianName: 'Shinkami' },
];

export default async function ChroniclePage() {
  let acts: ActInfo[];
  try {
    acts = await getActs();
  } catch {
    acts = [];
  }

  return <ChronicleContent acts={acts} allActs={ALL_ACTS} />;
}
