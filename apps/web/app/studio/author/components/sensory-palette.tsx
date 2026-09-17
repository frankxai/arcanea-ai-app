/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Eye, SpeakerHigh, Wind, Hand, Sparkle, Copy, Check } from '@/lib/phosphor-icons';
import type { GateResonance } from '@/lib/author/types';

interface SensoryPaletteProps {
  gate?: GateResonance;
  setting?: string;
  onInsertSnippet?: (text: string) => void;
}

const GATE_SENSORY_MAP: Record<
  GateResonance,
  {
    sight: string[];
    sound: string[];
    smell: string[];
    touch: string[];
    taste: string[];
    metaphor: string[];
  }
> = {
  Foundation: {
    sight: ['Granite fissures lined with quartz veins', 'Amber torchlight catching dust motes', 'Heavy iron hinges dark with patina'],
    sound: ['Low subterranean hum of settling stone', 'Scrape of a mason’s chisel on dry slate', 'Distant echo of water dripping in caverns'],
    smell: ['Crushed dry shale after rain (petrichor)', 'Cold limestone and damp earth', 'Faint tang of sulfur in deep rock'],
    touch: ['Chalky residue on fingertips', 'Unforgiving cold of ancient bedrock', 'Rough, coarse burlap soaked in sweat'],
    taste: ['Mineral sharpness of well water', 'Dry grit of stone dust on teeth', 'Bitter iron tang on the tongue'],
    metaphor: ['A grief rooted so deep only tectonic pressure could move it', 'Standing like a pillar before the ocean tide', 'A silence as heavy as uncarved marble'],
  },
  Flow: {
    sight: ['Iridescent phosphorescence on black waves', 'Silver foam churning over basalt stones', 'Reflections broken into a thousand rippling eyes'],
    sound: ['Rhythmic swell and crash of incoming breakers', 'Gurgling eddies swirling around rusted pilings', 'Hiss of retreating foam across pebbled beaches'],
    smell: ['Briny sea air mixed with decaying kelp', 'Ozone rising before an oceanic storm', 'Wet cedar soaked by perpetual mist'],
    touch: ['Numbing spray against wind-burnt cheeks', 'Slick, emerald moss on submerged timber', 'Cold current dragging at the ankles'],
    taste: ['Salt crust dried upon cracked lips', 'Crisp, clean taste of mountain runoff', 'Sharp brine catching the back of the throat'],
    metaphor: ['Memory flowing backwards like an inverse tide', 'Yielding like water yet carving canyons in stone', 'Thoughts dissolving into the oceanic dark'],
  },
  Fire: {
    sight: ['White-hot embers pulsing in the hearth', 'Heat shimmers distorting the horizon line', 'Crimson sparks dancing against soot-black stone'],
    sound: ['Sudden explosive crack of dried pine', 'Roaring intake of air feeding a kiln', 'Hiss of molten bronze quenched in oil'],
    smell: ['Acrid woodsmoke and scorched pine resin', 'Oily tang of furnace bellows and soot', 'Sweet sharpness of charred sugar'],
    touch: ['Radiant wave of blistering dry heat', 'Fine, silken ash coating sweaty palms', 'Throbbing sunburn beneath leather armor'],
    taste: ['Ash and charcoal on the dry tongue', 'Spicy warmth of cinnamon and clove tea', 'Smoky, charred crust of roasted grain'],
    metaphor: ['Ambition burning away the scaffolding of fear', 'A temper flaring like dry kindling caught by spark', 'Purified in the furnace of necessary loss'],
  },
  Heart: {
    sight: ['Soft rose-gold dawn breaking through fog', 'Faded woven ribbons tied around a wrist', 'A lantern swaying in an open window'],
    sound: ['A hitched breath before words form', 'The steady double-thump of a resting pulse', 'Rustle of dry autumn leaves underfoot'],
    smell: ['Dried lavender and sweet clover', 'Clean rain on warm cedar shingles', 'Old paper and beeswax in a quiet room'],
    touch: ['The unexpected warmth of another hand', 'A tight constriction in the center of the chest', 'Soft worn wool against bare skin'],
    taste: ['Sweet chamomile infused with raw honey', 'Salt tears slipping into the corner of a smile', 'Warm bread broken with two hands'],
    metaphor: ['An ache that held both grief and gratitude without contradiction', 'Forgiveness like letting go of a hot coal', 'Love that asked for nothing yet demanded everything'],
  },
  Voice: {
    sight: ['Azure soundwaves shimmering in still air', 'Silver bells vibrating on silk cords', 'Open amphitheater under starlit domes'],
    sound: ['Resonant harmonic singing from crystal bowls', 'A clear spoken truth cutting through crowd murmurs', 'Wind whistling through hollow flutes of bone'],
    smell: ['Incense of frankincense and dried sage', 'Cool mountain ozone at high altitude', 'Fresh morning frost on pine needles'],
    touch: ['Vibration in the collarbone as a chord strikes', 'Cold brass mouthpiece against resting lips', 'A sudden shiver traveling the length of the spine'],
    taste: ['Peppermint and cold spring water', 'Sweet licorice root cleansing the palate', 'A metallic clarity like swallowing lightning'],
    metaphor: ['A sentence that shattered ten thousand years of silence', 'Words carrying the density of folded steel', 'Speaking a name that summoned the wind'],
  },
  Sight: {
    sight: ['Prismatic light refracted through cut crystal', 'A constellation pattern glowing beneath translucent skin', 'Visions of probability branching like lightning'],
    sound: ['The high crystalline ringing of celestial spheres', 'A soft intake of breath as the unseen is revealed', 'Subtle shift of glass lenses aligning'],
    smell: ['Starlight ozone and dry lotus petals', 'Night-blooming jasmine under a full moon', 'Static electricity charging the humid air'],
    touch: ['A tingling pressure at the center of the brow', 'Cool silk blindfold resting over tired eyelids', 'A hair-raising sensation of being watched from the sky'],
    taste: ['Pure distilled water with zero impurities', 'Faint sweetness of elderflower nectar', 'Electric tang of lightning caught on silver'],
    metaphor: ['Seeing the outcome before the first stone was cast', 'Piercing the veil of physical certainty', 'An eye that wept for what was yet to happen'],
  },
  Crown: {
    sight: ['Aureoles of pure golden light crowning marble spires', 'White robes hemmed in woven starlight', 'Ancient celestial star-charts rotating in midair'],
    sound: ['A great bell tolling once across mountain peaks', 'The absolute, reverent silence of an empty throne room', 'Symphonic choir echoing across vast celestial arches'],
    smell: ['Precious myrrh, sandalwood, and sun-warmed amber', 'Cold high-altitude air where no trees grow', 'Pure incense rising toward open skies'],
    touch: ['The terrifying weight of a golden circlet', 'Smooth polished marble cool under bare feet', 'A light that warms without burning'],
    taste: ['Golden mead aged in subterranean vaults', 'Pomegranate seeds bursting with crimson juice', 'Pure nectar distilled from solar rays'],
    metaphor: ['The sovereign quiet of a mind that has transcended conflict', 'Carrying the grief of millions without bending', 'A crown forged not from gold, but from sacrifice'],
  },
  Starweave: {
    sight: ['Indigo nebula clouds pulsing with ultraviolet light', 'Silver ley-lines crisscrossing dark matter', 'Dimensional fractures glowing like violet glass'],
    sound: ['The deep bass frequency of gravitational waves', 'A sound like silk tearing across empty space', 'Static hum of synchronized chronometers'],
    smell: ['The dry cold scent of vacuum and crushed meteorites', 'Exotic orchid petals that bloom once an aeon', 'Ozone and burning stardust'],
    touch: ['A sensation of floating in zero gravity', 'Quantum resonance vibrating through marrow', 'Touching a surface that is both solid and permeable'],
    taste: ['Starlight dust that tingles like champagne bubbles', 'Sweet metallic elixir that expands perception', 'Cold absolute zero on the palate'],
    metaphor: ['Weaving threads of probability into a single immutable knot', 'A bridge across galaxies built from single intentions', 'The space between heartbeats where worlds are born'],
  },
  Source: {
    sight: ['Unfiltered blinding white luminescence', 'The singularity at the dawn of creation', 'Geometries of pure consciousness dancing in void'],
    sound: ['The primordial OM resonance underlying all atomic vibration', 'Complete silence that contains every symphony', 'A single chord sustained for ten thousand years'],
    smell: ['The scent of pure existence before form existed', 'Solar wind blowing across newborn stars', 'White lotus floating on waters of life'],
    touch: ['Dissolution of physical boundaries into pure light', 'Total immersion in unconditional warmth', 'The touch of the creator recognizing itself'],
    taste: ['The fundamental essence of being: sweet, eternal, whole', 'Liquid sunlight', 'Nectar of immortality'],
    metaphor: ['The ocean realizing it was never just a drop', 'Returning to the breath that spoke the world into being', 'The flame returning to the sun'],
  },
  Unity: {
    sight: ['All ten elements swirling in harmonious golden geometry', 'The entire Arcanean cosmos viewed as a single living cell', 'Every character and creature linked by golden cords of light'],
    sound: ['Ten thousand voices speaking as one without losing uniqueness', 'The cosmic heartbeat synchronized with mortal breath', 'The final chord resolving into eternal harmony'],
    smell: ['Every flower, rain, woodsmoke, and ocean mingled in perfect balance', 'The living breath of the unified realm', 'Sweet incense of fulfilled prophecy'],
    touch: ['The ground beneath your feet welcoming you home', 'Every hand clasped across all Academy rivalries', 'The weightlessness of complete completion'],
    taste: ['The banquet of creation shared equally among all beings', 'The taste of peace after ten thousand years of war', 'Sweet water of life'],
    metaphor: ['The story that wrote itself into existence through love', 'Not one hero alone, but the circle unbroken', 'The light that casts no shadow'],
  },
};

export function SensoryPalette({
  gate = 'Foundation',
  setting = 'The Ancient Stone Quay',
  onInsertSnippet,
}: SensoryPaletteProps) {
  const [activeSense, setActiveSense] = useState<'sight' | 'sound' | 'smell' | 'touch' | 'taste' | 'metaphor'>('sight');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sensoryData = GATE_SENSORY_MAP[gate] || GATE_SENSORY_MAP.Foundation;
  const snippets = sensoryData[activeSense] || [];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    if (onInsertSnippet) onInsertSnippet(text);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkle size={13} className="text-[var(--arc-brand-arcanean-gold)]" />
          <h3 className="font-display text-xs font-medium text-white/70">
            Sensory Expander ({gate})
          </h3>
        </div>
        <span className="text-[10px] text-white/30 truncate max-w-[120px]">{setting}</span>
      </div>

      {/* Sense Tabs */}
      <div className="grid grid-cols-6 gap-1 bg-white/[0.03] p-1 rounded-lg">
        {[
          { key: 'sight', icon: Eye, label: 'Sight' },
          { key: 'sound', icon: SpeakerHigh, label: 'Sound' },
          { key: 'smell', icon: Wind, label: 'Smell' },
          { key: 'touch', icon: Hand, label: 'Touch' },
          { key: 'taste', icon: Sparkle, label: 'Taste' },
          { key: 'metaphor', icon: Sparkle, label: 'Metaphor' },
        ].map(({ key, icon: Icon, label }) => {
          const isActive = activeSense === key;
          return (
            <button
              key={key}
              onClick={() => setActiveSense(key as any)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-md text-[9px] font-sans transition-all ${
                isActive
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] font-medium border border-[var(--arc-brand-atlantean-teal)]/30'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
              }`}
              title={label}
            >
              <Icon size={12} />
              <span className="mt-0.5">{label.slice(0, 3)}</span>
            </button>
          );
        })}
      </div>

      {/* Snippet List */}
      <div className="space-y-1.5">
        {snippets.map((snippet, idx) => (
          <div
            key={idx}
            onClick={() => handleCopy(snippet, idx)}
            className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-all text-[11px] text-white/60 hover:text-white/90 leading-relaxed"
          >
            <p className="flex-1 italic">&ldquo;{snippet}&rdquo;</p>
            <button
              type="button"
              className="p-1 text-white/20 group-hover:text-white/60 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {copiedIndex === idx ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
