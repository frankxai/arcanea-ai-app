export type Element = 'All' | 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Spirit'
export type ContentType = 'All' | 'Image' | 'Video' | 'Music' | 'Text'

export interface Creator {
  id: string
  name: string
  avatar: string
  handle: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  prompt: string
  thumbnail: string
  type: Exclude<ContentType, 'All'>
  element: Exclude<Element, 'All'>
  creator: Creator
  likes: number
  views: number
  bookmarked?: boolean
  liked?: boolean
  width: number
  height: number
  tags: string[]
  createdAt: string
}

const creators: Creator[] = [
  { id: 'c1', name: 'Seraphina Voss', handle: '@seraphv', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=seraphina&backgroundColor=8b5cf6' },
  { id: 'c2', name: 'Orion Thrace', handle: '@oriont', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=orion&backgroundColor=4fc3f7' },
  { id: 'c3', name: 'Lyra Ashfen', handle: '@lyraa', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=lyra&backgroundColor=ff6b35' },
  { id: 'c4', name: 'Caspian Null', handle: '@caspn', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=caspian&backgroundColor=81c784' },
  { id: 'c5', name: 'Vela Moonshard', handle: '@velam', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=vela&backgroundColor=ce93d8' },
  { id: 'c6', name: 'Dravex Arkon', handle: '@dravex', avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=dravex&backgroundColor=ffd700' },
]

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1', title: 'Phoenix Ascendant', type: 'Image', element: 'Fire',
    description: 'A mythological phoenix reborn from golden cosmic embers, wings outstretched across nebulae.',
    prompt: 'A majestic phoenix with wings made of solar flares ascending through cosmic clouds, ultra-detailed, dark background',
    thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&q=80',
    creator: creators[0], likes: 2847, views: 18420, liked: false, bookmarked: false,
    width: 600, height: 800, tags: ['phoenix', 'fire', 'cosmic'], createdAt: '2026-02-14',
  },
  {
    id: 'g2', title: 'Abyssal Throne', type: 'Image', element: 'Water',
    description: 'The sunken palace of the Leviathan god, crystalline halls frozen in time beneath obsidian seas.',
    prompt: 'Underwater ancient palace with bioluminescent coral, dark ocean depths, rays of teal light',
    thumbnail: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80',
    creator: creators[1], likes: 1923, views: 11280, liked: false, bookmarked: false,
    width: 600, height: 700, tags: ['ocean', 'palace', 'depth'], createdAt: '2026-02-10',
  },
  {
    id: 'g3', title: 'Verdant Titan', type: 'Image', element: 'Earth',
    description: 'Ancient stone colossus reclaimed by primordial forest, mossy glyphs aglow at dusk.',
    prompt: 'Giant stone golem overgrown with ancient forest, glowing runes, dramatic lighting, mythological',
    thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
    creator: creators[3], likes: 3104, views: 21900, liked: false, bookmarked: true,
    width: 600, height: 900, tags: ['golem', 'earth', 'forest'], createdAt: '2026-01-28',
  },
  {
    id: 'g4', title: 'Tempest Hymn', type: 'Music', element: 'Wind',
    description: 'A harmonic symphony woven from stratospheric winds and the resonance of ancient sky temples.',
    prompt: 'Ethereal wind goddess playing crystalline harp among storm clouds, lightning as music notes',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    creator: creators[4], likes: 891, views: 6420, liked: false, bookmarked: false,
    width: 600, height: 600, tags: ['music', 'wind', 'hymn'], createdAt: '2026-02-18',
  },
  {
    id: 'g5', title: 'Astral Weave', type: 'Image', element: 'Spirit',
    description: 'An ethereal deity spinning threads of fate from collapsed starlight, draped in nebular silks.',
    prompt: 'Celestial goddess weaving threads of light through space, cosmic silk gown, deep purple tones, 8k',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80',
    creator: creators[0], likes: 5621, views: 39100, liked: true, bookmarked: false,
    width: 600, height: 750, tags: ['spirit', 'cosmic', 'fate'], createdAt: '2026-02-20',
  },
  {
    id: 'g6', title: 'Cinder Codex', type: 'Text', element: 'Fire',
    description: 'Sacred verses from the Pyromancer\'s scripture, burning with prophecy that scorches the mind.',
    prompt: 'Ancient fire scripture in glowing runes on volcanic stone, ember particles, dramatic dark background',
    thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600&q=80',
    creator: creators[2], likes: 654, views: 4780, liked: false, bookmarked: false,
    width: 600, height: 650, tags: ['text', 'scripture', 'prophecy'], createdAt: '2026-02-05',
  },
  {
    id: 'g7', title: 'Vortex Rite', type: 'Video', element: 'Wind',
    description: 'Time-lapse ritual of the sky shamans summoning a celestial vortex above the mountain arc.',
    prompt: 'Sky shaman ritual with tornado of luminous blue wind energy, mountain peaks, cinematic, timelapse',
    thumbnail: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80',
    creator: creators[5], likes: 2190, views: 14500, liked: false, bookmarked: true,
    width: 600, height: 850, tags: ['ritual', 'wind', 'shaman'], createdAt: '2026-02-12',
  },
  {
    id: 'g8', title: 'Tidecaller', type: 'Image', element: 'Water',
    description: 'A sea oracle commanding the tides with outstretched arms, draped in living bioluminescent robes.',
    prompt: 'Powerful water sorceress commanding ocean waves, bioluminescent skin, dramatic stormy sea, fantasy',
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
    creator: creators[1], likes: 4302, views: 28700, liked: false, bookmarked: false,
    width: 600, height: 780, tags: ['oracle', 'sea', 'bioluminescent'], createdAt: '2026-02-16',
  },
  {
    id: 'g9', title: 'Rootsong', type: 'Music', element: 'Earth',
    description: 'Elemental percussion channeled from tectonic memory — the oldest rhythm beneath the crust.',
    prompt: 'Deep earth spirit playing drums made of ancient boulders and crystals, cave music ritual',
    thumbnail: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=80',
    creator: creators[3], likes: 1102, views: 8900, liked: false, bookmarked: false,
    width: 600, height: 600, tags: ['music', 'drums', 'earth'], createdAt: '2026-01-22',
  },
  {
    id: 'g10', title: 'Veil Between', type: 'Image', element: 'Spirit',
    description: 'The thin membrane separating the mortal plane from the realm of spectral divinity.',
    prompt: 'Two realities merging, translucent portal between worlds, spirits crossing over, violet cosmic light',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80',
    creator: creators[4], likes: 6887, views: 44200, liked: false, bookmarked: true,
    width: 600, height: 820, tags: ['portal', 'spirit', 'veil'], createdAt: '2026-02-22',
  },
  {
    id: 'g11', title: 'Magma Warden', type: 'Image', element: 'Fire',
    description: 'Guardian of the caldera — half obsidian, half living flame — protecting the sacred core.',
    prompt: 'Lava golem guardian standing in volcano crater, obsidian armor, orange magma veins, 8k render',
    thumbnail: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=600&q=80',
    creator: creators[2], likes: 3456, views: 23100, liked: false, bookmarked: false,
    width: 600, height: 700, tags: ['golem', 'fire', 'volcano'], createdAt: '2026-02-08',
  },
  {
    id: 'g12', title: 'Crystal Depths', type: 'Image', element: 'Water',
    description: 'Geometric crystalline structures formed by millennia of mineral-rich underwater current flows.',
    prompt: 'Underwater crystal cave with teal bioluminescent light, geometric formations, fantasy ocean realm',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    creator: creators[0], likes: 2715, views: 17800, liked: false, bookmarked: false,
    width: 600, height: 760, tags: ['crystal', 'water', 'cave'], createdAt: '2026-02-03',
  },
]

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ff6b35',
  Water: '#4fc3f7',
  Earth: '#81c784',
  Wind: '#b0bec5',
  Spirit: '#ce93d8',
}

export const TYPE_ICONS: Record<string, string> = {
  Image: 'image',
  Video: 'video',
  Music: 'music',
  Text: 'text',
}
