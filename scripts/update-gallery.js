const fs = require('fs');
const path = require('path');

const imgDir = path.join('c:', 'Users', 'frank', 'starlight', 'repos', 'arcanea-ai-app', 'apps', 'web', 'public', 'images', 'arcanea-universe');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));

const formatTitle = (filename) => {
  return filename.replace('.png', '').replace(/-/g, ' ').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const items = files.map((file, i) => {
  return {
    id: 'gen_' + i,
    title: formatTitle(file).replace(/ \d+$/, ''),
    description: 'An AI-generated artifact from the Arcanea universe, crafted to evoke awe and cosmic scale.',
    type: 'image',
    element: 'Void',
    gate: 'Source',
    guardian: 'Shinkami',
    creatorName: 'Arcanea Visual Engine',
    academyHouse: 'Nero',
    thumbnailUrl: '/images/arcanea-universe/' + file,
    likeCount: Math.floor(Math.random() * 500) + 100,
    viewCount: Math.floor(Math.random() * 5000) + 1000,
    tags: ['ai-art', 'concept', 'arcanea'],
  };
});

const content = `import type { CreationType, ElementName, GateName, GuardianName } from "@/lib/database/types/api-responses";
import {
  PhFire,
  PhDrop,
  PhLeaf,
  PhWind,
  PhSpiral,
  PhStar,
  PhFileText,
  PhImage,
  PhVideo,
  PhMusicNote,
  PhCode,
  PhStack,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Showcase creation shape (hardcoded canonical data)
// ---------------------------------------------------------------------------

export interface ShowcaseCreation {
  id: string;
  title: string;
  description: string;
  type: CreationType;
  element: ElementName;
  gate: GateName;
  guardian: GuardianName;
  creatorName: string;
  academyHouse: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
  thumbnailUrl?: string;
}

// ---------------------------------------------------------------------------
// Element styling maps
// ---------------------------------------------------------------------------

export const ELEMENT_COLORS: Record<
  ElementName,
  { gradient: string; badge: string; text: string }
> = {
  Fire: {
    gradient: "from-red-500/20 to-orange-500/5",
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
    text: "text-red-400",
  },
  Water: {
    gradient: "from-blue-500/20 to-cyan-500/5",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    text: "text-blue-400",
  },
  Earth: {
    gradient: "from-green-500/20 to-emerald-500/5",
    badge: "bg-green-500/15 text-green-400 border-green-500/25",
    text: "text-green-400",
  },
  Wind: {
    gradient: "from-slate-300/20 to-slate-200/5",
    badge: "bg-slate-300/15 text-slate-300 border-slate-300/25",
    text: "text-slate-300",
  },
  Void: {
    gradient: "from-violet-500/20 to-purple-500/5",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    text: "text-violet-400",
  },
  Spirit: {
    gradient: "from-amber-400/20 to-yellow-300/5",
    badge: "bg-amber-400/15 text-amber-300 border-amber-400/25",
    text: "text-amber-300",
  },
};

export const ELEMENT_ICONS: Record<ElementName, typeof PhFire> = {
  Fire: PhFire,
  Water: PhDrop,
  Earth: PhLeaf,
  Wind: PhWind,
  Void: PhSpiral,
  Spirit: PhStar,
};

// ---------------------------------------------------------------------------
// Type styling maps
// ---------------------------------------------------------------------------

export const TYPE_ICONS: Record<CreationType, typeof PhFileText> = {
  text: PhFileText,
  image: PhImage,
  video: PhVideo,
  audio: PhMusicNote,
  code: PhCode,
  mixed: PhStack,
};

export const TYPE_LABELS: Record<CreationType, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
  code: "Code",
  mixed: "Mixed",
};

// ---------------------------------------------------------------------------
// Canonical showcase creations
// ---------------------------------------------------------------------------

export const SHOWCASE_CREATIONS: ShowcaseCreation[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync(path.join('c:', 'Users', 'frank', 'starlight', 'repos', 'arcanea-ai-app', 'apps', 'web', 'app', 'gallery', 'gallery-data.ts'), content);
