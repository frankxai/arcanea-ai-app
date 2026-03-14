/**
 * Anti-Slop Engine — the SHARPEN layer of APL
 *
 * Detects the Seven Defaults in text and suggests fixes.
 */

export interface SlopPattern {
  id: string;
  name: string;
  description: string;
  patterns: RegExp[];
  fix: string;
}

export interface SlopMatch {
  id: string;
  name: string;
  match: string;
  fix: string;
  position: number;
}

export const ANTI_SLOP: SlopPattern[] = [
  {
    id: 'opener',
    name: 'The Opener',
    description: 'Generic story/essay openers',
    patterns: [
      /\bin a world where\b/i,
      /\bonce upon a time\b/i,
      /\bimagine a world\b/i,
      /\bpicture this\b/i,
      /\blet me paint a picture\b/i,
      /\bin the realm of\b/i,
    ],
    fix: 'Start in the middle. Start with a sound. Start with a lie.',
  },
  {
    id: 'avalanche',
    name: 'The Avalanche',
    description: 'Adjective pileups that say nothing',
    patterns: [
      /\bhauntingly beautiful\b/i,
      /\betherealm?\s+(and\s+)?cascading\b/i,
      /\bbreathtakingly\s+\w+\b/i,
      /\bstunning(?:ly)?\s+(?:and\s+)?(?:beautiful|gorgeous|magnificent)\b/i,
      /\bmajestic\s+(?:and\s+)?(?:ethereal|beautiful|stunning)\b/i,
      /\bmesmerizing(?:ly)?\b/i,
    ],
    fix: 'One strong word beats five weak ones.',
  },
  {
    id: 'slop',
    name: 'The Slop',
    description: 'AI assistant tics and filler',
    patterns: [
      /\bi'?d be happy to help\b/i,
      /\bgreat question\b/i,
      /\bthat's a (?:great|wonderful|excellent|fantastic) (?:question|point|idea)\b/i,
      /\babsolutely!\s/i,
      /\bcertainly!\s/i,
      /\blet me (?:help you|assist you)\b/i,
      /\bdive (?:deep )?into\b/i,
      /\bunpack (?:this|that)\b/i,
      /\btap(?:ping)? into\b/i,
    ],
    fix: 'Respond AS the thing, not ABOUT the thing.',
  },
  {
    id: 'explanation',
    name: 'The Explanation',
    description: 'Explaining what the metaphor means',
    patterns: [
      /\bthis (?:metaphor |symbol(?:izes?|ism) )(?:represents?|means?|signif(?:ies|ying))\b/i,
      /\bin other words\b/i,
      /\bwhat (?:this|i) mean(?:s|t)? (?:is|by) (?:that|this)\b/i,
    ],
    fix: 'Trust the reader. They are smart.',
  },
  {
    id: 'perfection',
    name: 'The Perfection',
    description: 'Flawless heroes, pure villains',
    patterns: [
      /\bnoble (?:and |yet )?(?:brave|courageous|fearless|selfless)\b/i,
      /\bpure(?:ly)? evil\b/i,
      /\bthe embodiment of (?:good|evil|hope|darkness)\b/i,
    ],
    fix: 'Scars are more interesting than polish.',
  },
  {
    id: 'resolution',
    name: 'The Resolution',
    description: 'Tidy endings that resolve all tension',
    patterns: [
      /\band they (?:all )?lived happily\b/i,
      /\bin the end,?\s+(?:everything|it all)\s+(?:worked out|turned out|was)\b/i,
      /\band so,?\s+(?:our|the)\s+(?:hero|protagonist|journey)\b/i,
    ],
    fix: 'Sometimes the best ending is a door left open.',
  },
  {
    id: 'safety',
    name: 'The Safety',
    description: 'Generic, forgettable, could-be-anything',
    patterns: [
      /\ba (?:beautiful|stunning) (?:landscape|sunset|vista|panorama)\b/i,
      /\ba (?:brave|courageous) (?:hero|warrior|knight)\b/i,
      /\ban? (?:epic|grand|magnificent) (?:adventure|quest|journey)\b/i,
    ],
    fix: 'If it does not make you feel something, it is not done.',
  },
];

/**
 * Scan text for slop patterns and return matches
 */
export function detectSlop(text: string): SlopMatch[] {
  const matches: SlopMatch[] = [];

  for (const pattern of ANTI_SLOP) {
    for (const regex of pattern.patterns) {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          id: pattern.id,
          name: pattern.name,
          match: match[0],
          fix: pattern.fix,
          position: match.index,
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

/**
 * Calculate a slop score (0 = clean, 1 = maximum slop)
 */
export function slopScore(text: string): number {
  const words = text.split(/\s+/).length;
  if (words === 0) return 0;
  const matches = detectSlop(text);
  // Normalize: 1 match per 50 words = score of 1
  return Math.min(matches.length / (words / 50), 1);
}
