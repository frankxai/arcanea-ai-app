/**
 * Luminor Image Registry — 20 AI-generated companion portraits.
 * Images live at public/images/luminors/.
 * These are VISUAL ARTWORKS, separate from the 16 chat LUMINORS in luminors/config.ts.
 *
 * Each entry includes the generation prompt used to create the image,
 * enabling visitors to create their own luminor-style characters.
 */

export interface LuminorImage {
  id: string;
  name: string;
  title: string;
  element: 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';
  gate: string;
  description: string;
  image: string;
  prompt: string;
}

/**
 * The base prompt template used across all Luminor character design sheets.
 * Individual prompts build on this foundation with element-specific details.
 */
export const LUMINOR_PROMPT_TEMPLATE = `Annotated character design sheet for a fantasy-sci-fi companion entity. Full-body standing pose, front view. Photorealistic 3D render with cinematic lighting. Title at top: "[NAME] — The [TITLE]". Labeled callouts pointing to key design features (materials, energy sources, sensory organs, armor/clothing). Element-specific color palette and materials. Cosmic or elemental background setting. High detail, concept art quality, vertical composition.`;

export const LUMINOR_IMAGES: LuminorImage[] = [
  {
    id: 'solara',
    name: 'Solara',
    title: 'Dawn Keeper',
    element: 'Fire',
    gate: 'Crown',
    description: 'Guardian of the first light, Solara illuminates the path for those who walk at the edge of dawn.',
    image: '/images/luminors/01-solara-dawn-keeper.webp',
    prompt: 'Annotated character design sheet for SOLARA — The Dawn Keeper. Full-body standing pose on rocky outcrop at dawn. Golden-bronze biomechanical body with starsilver veins running through translucent skin. Crystal cranium with aurora borealis light inside. Twin raging orb eyes glowing amber-gold. Pulsing sun sphere embedded in chest. Living moss and flowering plants growing from shoulder armor. Iridescent featherscale cloak spreading like wings. Bioluminescent fingertips (6 fingers per hand). Labeled callouts for each feature. Starfield background with dawn light. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'nerith',
    name: 'Nerith',
    title: 'Deep Listener',
    element: 'Water',
    gate: 'Flow',
    description: 'Nerith hears the currents beneath words, diving into the deep where truth lives unspoken.',
    image: '/images/luminors/02-nerith-deep-listener.webp',
    prompt: 'Annotated character design sheet for NERITH — The Deep Listener. Full-body standing pose in deep ocean setting. Sleek aquatic biomechanical form with bioluminescent blue-teal skin. Translucent cranial dome revealing neural coral network inside. Large parabolic ear structures with sonar membrane. Flowing liquid-metal robes that ripple like water. Pressure-resistant scaled armor on torso. Webbed hands with hydrodynamic fins. Deep-sea bioluminescent patterns along spine. Labeled callouts for each feature. Abyssal ocean background with faint light from above. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    title: 'Foundation Architect',
    element: 'Earth',
    gate: 'Foundation',
    description: 'Builder of unshakeable ground, Kaelen shapes the bedrock upon which all creation stands.',
    image: '/images/luminors/03-kaelen-foundation-architect.webp',
    prompt: 'Annotated character design sheet for KAELEN — The Foundation Architect. Full-body standing pose on stone platform. Massive, broad-shouldered biomechanical form with living stone and crystal-veined skin. Geological strata visible in layered armor plates. Glowing magma channels running through forearms. Hands made of articulated obsidian segments with golden joints. Crystal formations growing from shoulders and spine. Root-like tendrils extending from feet into the ground. Mossy growth in armor crevices. Labeled callouts for each feature. Ancient cavern background with crystal formations. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'velouria',
    name: 'Velouria',
    title: 'Flow Dancer',
    element: 'Water',
    gate: 'Flow',
    description: 'Velouria moves between states of being, teaching that fluidity is the highest form of strength.',
    image: '/images/luminors/04-velouria-flow-dancer.webp',
    prompt: 'Annotated character design sheet for VELOURIA — The Flow Dancer. Full-body standing pose with graceful dance posture. Lithe, fluid biomechanical form with mercury-like adaptive skin that shifts between liquid and solid states. Crystalline veil flowing from crown, made of frozen water droplets. Phase-shift armor that transitions from ice to water to mist. Ribbon-like appendages of pure water energy trailing from wrists. Reflective surface skin showing environment distortion. Labeled callouts for each feature. Misty waterfall cavern background with rainbow light refraction. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'pyronex',
    name: 'Pyronex',
    title: 'Transformation Engine',
    element: 'Fire',
    gate: 'Fire',
    description: 'Pyronex burns away hesitation and leaves only the molten core of creative purpose.',
    image: '/images/luminors/05-pyronex-transformation-engine.webp',
    prompt: 'Annotated character design sheet for PYRONEX — The Transformation Engine. Full-body standing pose radiating intense heat. Muscular biomechanical form with volcanic obsidian exoskeleton. Internal furnace core visible through chest plate, glowing white-hot. Molten lava channels running through armor seams. Flame-forged gauntlets with ember-tipped fingers. Heat-distortion aura surrounding entire body. Crown of eternal flames. Exhaust vents on shoulders releasing controlled fire. Cracked magma skin revealing orange-red energy beneath. Labeled callouts for each feature. Volcanic forge background with rivers of lava. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'sylphis',
    name: 'Sylphis',
    title: 'Wind Reader',
    element: 'Wind',
    gate: 'Voice',
    description: 'Sylphis reads the currents of change, translating whispers of the wind into actionable insight.',
    image: '/images/luminors/06-sylphis-wind-reader.webp',
    prompt: 'Annotated character design sheet for SYLPHIS — The Wind Reader. Full-body standing pose with hair and garments flowing in invisible wind. Slender, aerodynamic biomechanical form with translucent wind-glass skin. Atmospheric pressure sensors visible as delicate antennae. Silver-white flowing robes made of woven air currents. Sound-wave visualization patterns emanating from ears. Feathered wing-like vanes on forearms for wind reading. Visible air current trails spiraling around body. Cloud-fragment shoulder armor. Labeled callouts for each feature. Mountain peak background above cloud line with stratospheric winds. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'orakis',
    name: 'Orakis',
    title: 'Pattern Seer',
    element: 'Void',
    gate: 'Sight',
    description: 'Orakis perceives the hidden architecture of reality, seeing connections invisible to others.',
    image: '/images/luminors/07-orakis-pattern-seer.webp',
    prompt: 'Annotated character design sheet for ORAKIS-7 — The Pattern Seer. Full-body standing pose in observatory setting. Tall, hooded biomechanical form with dark iridescent scale-mail robe. Elongated crystal visor cranium with active constellation mapping visible inside. Holographic data stream disc orbiting one hand showing cosmic recursion analytics. Geometric sacred geometry patterns floating around body. Dark purple-blue metallic skin with starfield reflections. Long articulated fingers with data-reading nodes. Labeled callouts for visor status, data stream, energy level, observation mode. Observatory background with holographic star maps and nebulae. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'gaiana',
    name: 'Gaiana',
    title: 'Living Garden',
    element: 'Earth',
    gate: 'Heart',
    description: 'Gaiana nurtures every seed of potential, knowing that the most profound creations grow slowly.',
    image: '/images/luminors/08-gaiana-living-garden.webp',
    prompt: 'Annotated character design sheet for GAIANA — The Living Garden. Full-body standing pose in lush garden setting. Feminine biomechanical form with living bark skin interwoven with flowering vines. Canopy crown of branches with small leaves and blossoms. Heartwood core visible through chest opening, glowing green-gold. Mycorrhizal network tendrils extending from lower body into soil. Moss-covered shoulder plates. Bioluminescent flowers blooming along arms. Seed pods embedded in forearm armor. Butterfly and firefly companions orbiting nearby. Labeled callouts for each feature. Ancient enchanted forest background with dappled sunlight. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'aethon',
    name: 'Aethon',
    title: 'Star Navigator',
    element: 'Spirit',
    gate: 'Starweave',
    description: 'Aethon charts courses through cosmic currents, navigating by stars no telescope can see.',
    image: '/images/luminors/09-aethon-star-navigator.webp',
    prompt: 'Annotated character design sheet for AETHON — The Star Navigator. Full-body standing pose with one hand raised tracing star paths. Ethereal biomechanical form with translucent celestial skin showing star map underneath. Navigator headpiece with rotating astrolabe crown. Constellation tattoos that shift and pulse across body. Starlight cloak trailing into space dust. Compass-like chest device pointing to cosmic north. Arms wrapped in orbital ring bracers. Golden-white energy emanating from eyes. Labeled callouts for each feature. Deep space background with visible galaxy arms and nebula clouds. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'unitas',
    name: 'Unitas',
    title: 'Bond Weaver',
    element: 'Spirit',
    gate: 'Unity',
    description: 'Unitas weaves the threads that connect all creators, knowing that collaboration amplifies every voice.',
    image: '/images/luminors/10-unitas-bond-weaver.webp',
    prompt: 'Annotated character design sheet for UNITAS — The Bond Weaver. Full-body standing pose with arms extended, threads of light connecting between fingers. Symmetrical biomechanical form with mirror-finish skin reflecting surroundings. Dual-core heart system visible through chest (two interlinked energy spheres). Weaving apparatus fingers trailing golden connection threads. Crown of interlocked rings. Robes made of woven light strands. Multiple faces subtly visible in reflective surfaces. Unity sigil glowing on forehead. Labeled callouts for each feature. Nexus chamber background with countless light threads converging. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'aletheia',
    name: 'Aletheia',
    title: 'Truth Singer',
    element: 'Wind',
    gate: 'Voice',
    description: 'Aletheia sings at the frequency where illusion shatters and only truth remains.',
    image: '/images/luminors/11-aletheia-truth-singer.webp',
    prompt: 'Annotated character design sheet for ALETHEIA — The Truth Singer. Full-body standing pose with mouth open in song, visible sound waves emanating. Elegant biomechanical form with crystalline vocal resonance chambers visible in throat and chest. Silver-white skin with sound-wave patterns etched across body. Tuning fork crown that vibrates with harmonic frequency. Voice amplification collar around neck. Shattered illusion fragments floating around feet. Pure tone speakers embedded in palms. Wind-instrument-like openings along ribcage. Labeled callouts for each feature. Amphitheater background with visible acoustic waves in air. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'coronix',
    name: 'Coronix',
    title: 'Crown Illuminator',
    element: 'Fire',
    gate: 'Crown',
    description: 'Coronix carries the flame of enlightenment, lighting the way to the highest understanding.',
    image: '/images/luminors/12-coronix-crown-illuminator.webp',
    prompt: 'Annotated character design sheet for CORONIX — The Crown Illuminator. Full-body standing pose radiating wisdom light from crown. Regal biomechanical form with burnished gold-bronze armor. Massive crown of living flame hovering above head, casting warm light downward. Third eye crystal embedded in forehead, projecting beam of enlightenment. Solar plexus core with rotating sun-dial mechanism. Ceremonial robes with fire-thread embroidery. Light-scribe staff in one hand. Halo of orbiting flame wisps. Labeled callouts for each feature. Temple of enlightenment background with pillars of light. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'shinkai',
    name: 'Shinkai',
    title: 'Source Threshold',
    element: 'Spirit',
    gate: 'Source',
    description: 'Shinkai stands at the boundary between all that is and all that could be, guardian of pure potential.',
    image: '/images/luminors/13-shinkai-source-threshold.webp',
    prompt: 'Annotated character design sheet for SHINKAI — The Source Threshold. Full-body standing pose at dimensional gateway. Transcendent biomechanical form with body half-materialized, half-dissolving into pure light particles. Source code patterns streaming across skin. Eyes of infinite depth showing recursive fractal universes. Threshold gate frame forming around body. Skin transitioning from solid matter to pure energy. Crown of 1111 Hz frequency visualization. Both creation and dissolution happening simultaneously on body surface. Labeled callouts for each feature. Dimensional boundary background — reality on one side, pure white potential on the other. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'tessera',
    name: 'Tessera',
    title: 'Memory Keeper',
    element: 'Water',
    gate: 'Flow',
    description: 'Tessera preserves every story, every lesson, knowing that memory is the foundation of wisdom.',
    image: '/images/luminors/14-tessera-memory-keeper.webp',
    prompt: 'Annotated character design sheet for TESSERA — The Memory Keeper. Full-body standing pose surrounded by floating memory fragments. Serene biomechanical form with mosaic-tile skin made of preserved memory crystals. Cranial library dome showing stored memories as tiny glowing books. Liquid memory reservoirs visible in forearm chambers. Quill-like fingers for inscribing memories. Flowing robes made of story-threads, with faint text visible in fabric. Archive chest cavity with organized memory vials. Gentle blue-silver bioluminescence. Labeled callouts for each feature. Infinite library background with crystalline shelves fading into distance. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'verdaxis',
    name: 'Verdaxis',
    title: 'Root Network',
    element: 'Earth',
    gate: 'Foundation',
    description: 'Verdaxis connects all living things through invisible networks, the mycorrhiza of creation.',
    image: '/images/luminors/15-verdaxis-root-network.webp',
    prompt: 'Annotated character design sheet for VERDAXIS — The Root Network. Full-body standing pose with root tendrils extending in all directions. Biomechanical form built from living mycelium and root structures. Mushroom cap formations on shoulders acting as communication nodes. Visible mycorrhizal network glowing beneath translucent bark-skin. Fungal bioluminescence in green-gold along nerve pathways. Root-fingers that plug into ground for data transfer. Spore release vents for broadcasting information. Symbiotic organisms living in armor crevices. Labeled callouts for each feature. Underground root network background with bioluminescent fungal forest. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'phoenara',
    name: 'Phoenara',
    title: 'Rebirth Cycle',
    element: 'Fire',
    gate: 'Fire',
    description: 'Phoenara embodies the eternal promise that every ending seeds a brighter beginning.',
    image: '/images/luminors/16-phoenara-rebirth-cycle.webp',
    prompt: 'Annotated character design sheet for PHOENARA — The Rebirth Cycle. Full-body standing pose emerging from ash and flame. Phoenix-like biomechanical form with feathered flame wings in various stages — one wing fully formed from fire, other wing regenerating from ash. Cycle-counter embedded in chest showing rebirth iteration number. Half of body pristine flame-gold, other half still reforming from charred remains. Egg-shaped core in abdomen containing next incarnation seed. Ash-to-fire gradient across skin surface. Crown of dying and reigniting embers. Labeled callouts for each feature. Pyre background with cyclical flame patterns. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'crysthene',
    name: 'Crysthene',
    title: 'Harmony Weaver',
    element: 'Earth',
    gate: 'Heart',
    description: 'Crysthene balances opposing forces into crystalline harmony, finding beauty in tension.',
    image: '/images/luminors/17-crysthene-harmony-weaver.webp',
    prompt: 'Annotated character design sheet for CRYSTHENE — The Harmony Weaver. Full-body standing pose with balanced, symmetrical posture. Elegant biomechanical form with crystalline body showing internal prismatic light refraction. Half of body warm-toned crystal (rose quartz, amber), other half cool-toned (sapphire, amethyst) — meeting at perfect center line. Harmony resonance chamber in chest producing balancing frequencies. Crystal lattice skin that refracts opposing energies into unified spectrum. Tuning crystal crown that auto-calibrates to environmental discord. Labeled callouts for each feature. Crystal cave background with balanced warm and cool light sources. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'obsidion',
    name: 'Obsidion',
    title: 'Shadow Smith',
    element: 'Void',
    gate: 'Sight',
    description: 'Obsidion forges strength from darkness, proving that the Void is not emptiness but potential.',
    image: '/images/luminors/18-obsidion-shadow-smith.webp',
    prompt: 'Annotated character design sheet for OBSIDION — The Shadow Smith. Full-body standing pose in candlelit study. Imposing biomechanical form with void-steel alloy skin in dark gunmetal and obsidian. Smooth featureless helmet with single thin purple visor slit. Amberflux sensor arrays on shoulders. Biotechnological composite armor under shadow-weave material cloak. Hands holding a miniature black hole sphere of compressed void energy. Distortion nimbus warping light around body. Shadow-creature familiars with glowing purple eyes at feet. Scrolls and ancient books in background. Labeled callouts for each feature. Candlelit scholar study background with arcane instruments. Photorealistic 3D render, cinematic lighting, horizontal composition.',
  },
  {
    id: 'aurelis',
    name: 'Aurelis',
    title: 'Time Gardener',
    element: 'Spirit',
    gate: 'Starweave',
    description: 'Aurelis tends the garden of moments, knowing that patience is the most powerful creative force.',
    image: '/images/luminors/19-aurelis-time-gardener.webp',
    prompt: 'Annotated character design sheet for AURELIS — The Time Gardener. Full-body standing pose in temporal garden. Graceful biomechanical form with aged-gold and patina-bronze skin showing passage of time. Hourglass core in torso with golden sand flowing upward. Clock-gear joints at elbows and knees with visible temporal mechanisms. Garden tools made of crystallized time — pruning shears, watering vessel. Plants growing at different time speeds around feet (seed, sprout, bloom, fruit simultaneously). Temporal rings orbiting wrists showing past/present/future. Labeled callouts for each feature. Eternal garden background with plants in all seasons simultaneously. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
  {
    id: 'prismara',
    name: 'Prismara',
    title: 'Light Splitter',
    element: 'Spirit',
    gate: 'Source',
    description: 'Prismara refracts pure creative light into infinite spectrums of possibility.',
    image: '/images/luminors/20-prismara-light-splitter.webp',
    prompt: 'Annotated character design sheet for PRISMARA — The Light Splitter. Full-body standing pose refracting a beam of white light into rainbow spectrum. Crystalline biomechanical form with prism-faceted transparent body. Pure white light entering from one hand, splitting through prismatic torso, exiting as full spectrum from other hand. Diamond-lattice skin with rainbow internal reflections. Spectral crown projecting color bands. Each limb tinted a different wavelength. Light-splitting lens eyes. Chromatic aberration effects around body edges. Labeled callouts for each feature. White void background with dramatic spectrum light rays. Photorealistic 3D render, cinematic lighting, vertical composition.',
  },
];

/** Get a subset of luminors for featured display */
export function getFeaturedLuminors(count = 6): LuminorImage[] {
  return LUMINOR_IMAGES.slice(0, count);
}

/** Get luminors by element */
export function getLuminorsByElement(element: LuminorImage['element']): LuminorImage[] {
  return LUMINOR_IMAGES.filter((l) => l.element === element);
}

/** Get luminors by gate */
export function getLuminorsByGate(gate: string): LuminorImage[] {
  return LUMINOR_IMAGES.filter((l) => l.gate === gate);
}
