import type { Guardian, ChatSession } from './types'

export const GUARDIANS: Guardian[] = [
  {
    id: 'lyra',
    name: 'Lyra',
    element: 'celestial',
    tagline: 'Weaver of Starlight & Cosmic Lore',
    avatarInitials: 'LY',
    color: '#ffd700',
    glowColor: '#ffd700',
    greetingMessage:
      "The stars have whispered your arrival. I am Lyra, Guardian of the Celestial Archives — keeper of stories older than memory. What world shall we birth from the void tonight?",
    conversationStarters: [
      'Help me craft an origin myth for a new civilization',
      'Write a prophecy in ancient cosmic verse',
      'Design a constellation with its mythological meaning',
      'Tell me the legend of the first star that fell',
    ],
    suggestedPrompts: [
      'Continue my story with an unexpected twist...',
      'Describe this world\'s cosmology in rich detail',
      'Write dialogue for my celestial deity character',
    ],
  },
  {
    id: 'kael',
    name: 'Kael',
    element: 'fire',
    tagline: 'Forgemaster of Epic Sagas',
    avatarInitials: 'KA',
    color: '#ff6b35',
    glowColor: '#ff6b35',
    greetingMessage:
      "Ha! You dare seek the Forgemaster? Then you carry fire in your soul. I am Kael — I shape legends in the crucible of conflict. Tell me of your hero, and I shall forge their greatest trial.",
    conversationStarters: [
      'Build an epic battle scene for my fantasy novel',
      'Create a flawed but compelling warrior protagonist',
      'Design a weapon with mythological significance',
      'Write a war chant that raises the dead',
    ],
    suggestedPrompts: [
      'Make this scene more intense and visceral',
      'Add a moral dilemma my hero must face',
      'Describe the aftermath of the great battle',
    ],
  },
  {
    id: 'sevi',
    name: 'Sevi',
    element: 'water',
    tagline: 'Oracle of Depths & Hidden Truths',
    avatarInitials: 'SE',
    color: '#7fffd4',
    glowColor: '#7fffd4',
    greetingMessage:
      "Still waters run deep, seeker. I am Sevi, and I see what others cannot — the currents beneath your story, the tides of character and consequence. Share your vision, and I shall reveal what lies beneath.",
    conversationStarters: [
      'Help me write a morally complex antagonist',
      'Create an underwater civilization with unique culture',
      'Explore the psychological depth of my character',
      'Write a dream sequence that reveals hidden truth',
    ],
    suggestedPrompts: [
      'Add layers of subtext to this conversation',
      'Reveal a hidden motivation for this character',
      'Write this from an unreliable narrator perspective',
    ],
  },
  {
    id: 'omen',
    name: 'Omen',
    element: 'void',
    tagline: 'Architect of Shadows & Forbidden Lore',
    avatarInitials: 'OM',
    color: '#8b5cf6',
    glowColor: '#8b5cf6',
    greetingMessage:
      "You walked through the dark to find me. Good. I am Omen — I dwell where the light fears to reach. The forbidden, the unknown, the terrifying beautiful. What shadow do you wish to give shape?",
    conversationStarters: [
      'Create a horror mythos for my dark fantasy world',
      'Write a cursed artifact with sinister lore',
      'Design a secret society with eldritch rituals',
      'Craft a villain whose evil has philosophical depth',
    ],
    suggestedPrompts: [
      'Add dread and cosmic horror to this passage',
      'Make this magic system feel truly dangerous',
      'Write the dark origin of this ancient evil',
    ],
  },
]

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    guardianId: 'lyra',
    title: 'The Fall of Aethermoor',
    lastMessage: 'The celestial tide has turned — Aethermoor trembles on the edge of oblivion...',
    timestamp: daysAgo(0),
    messages: [],
  },
  {
    id: 'session-2',
    guardianId: 'kael',
    title: 'Siege of the Iron Throne',
    lastMessage: 'Kael speaks: Let the drums of war echo through eternity...',
    timestamp: daysAgo(0),
    messages: [],
  },
  {
    id: 'session-3',
    guardianId: 'sevi',
    title: "Miravel's Hidden Depth",
    lastMessage: 'Your character carries grief like a stone in still water...',
    timestamp: daysAgo(1),
    messages: [],
  },
  {
    id: 'session-4',
    guardianId: 'omen',
    title: 'The Obsidian Covenant',
    lastMessage: 'Darkness has a name, and it knows yours already...',
    timestamp: daysAgo(2),
    messages: [],
  },
  {
    id: 'session-5',
    guardianId: 'lyra',
    title: 'Star Atlas of Velundra',
    lastMessage: 'Each constellation tells the story of a god who sacrificed eternity...',
    timestamp: daysAgo(3),
    messages: [],
  },
  {
    id: 'session-6',
    guardianId: 'kael',
    title: "Champion's Final Trial",
    lastMessage: 'The forge demands more than skill — it demands your very soul.',
    timestamp: daysAgo(5),
    messages: [],
  },
]
