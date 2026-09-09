import type { VisualMedia } from '@/lib/visual-encyclopedia/schema';
import { validateEcologyEntry } from '@arcanea/world-engine';

import {
  atlasLightContract,
  atlasProposalSeed,
  atlasSeed,
  isAtlasVisualReady,
  toAtlasEntryView,
  type AtlasEntrySeed,
  type AtlasEntryView,
  type AtlasLightMechanismInput,
  type AtlasRelationshipInput,
  type AtlasSourceClaimInput,
  type CanonState,
} from './schema';

const p = atlasProposalSeed;

interface BotanicalSeed {
  id: string;
  slug: string;
  name: string;
  epithet: string;
  gate: AtlasEntrySeed['gate'];
  world: string;
  realm: string;
  biome: string;
  role: string;
  scale: string;
  morphology: string;
  energySource: string;
  lifecycle: string;
  propagation: string;
  lightMechanism: AtlasLightMechanismInput;
  lightTrigger: string;
  lightSignal: string;
  lightCost: string;
  failureMode: string;
  gift: string;
  price: string;
  practice: string;
  exploitationConsequence: string;
  relationships: AtlasRelationshipInput[];
  storyHooks: string[];
  sourceClaims: AtlasSourceClaimInput[];
  proposalMechanics: string[];
  canonState: Exclude<CanonState, 'locked'>;
  canonAnchors: string[];
  palette: string;
  sensoryDescription: string;
  materialLanguage: string;
  environmentLanguage: string;
  camera: string;
  scaleCue: string;
  focalAnchor: string;
  negativeSpace: string;
  emotion: string;
}

function botanical(seed: BotanicalSeed): AtlasEntrySeed {
  return atlasSeed({
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    epithet: seed.epithet,
    kind: 'flora',
    gate: seed.gate,
    world: seed.world,
    realm: seed.realm,
    biome: seed.biome,
    role: seed.role,
    scale: seed.scale,
    morphology: seed.morphology,
    biology: { energySource: seed.energySource, lifecycle: seed.lifecycle, propagation: seed.propagation },
    light: { mechanism: seed.lightMechanism, trigger: seed.lightTrigger, signal: seed.lightSignal, cost: seed.lightCost, failureMode: seed.failureMode },
    covenant: { gift: seed.gift, price: seed.price, practice: seed.practice, exploitationConsequence: seed.exploitationConsequence },
    relationships: seed.relationships,
    storyHooks: seed.storyHooks,
    sourceClaims: seed.sourceClaims,
    proposalMechanics: seed.proposalMechanics,
    canonState: seed.canonState,
    canonAnchors: seed.canonAnchors,
    canonNote: seed.canonState === 'proposal'
      ? 'Original botanical proposal. Gate and world references do not promote the organism into canon.'
      : 'The named organism or short trait is source-attested. Detailed biology, light contracts, and covenant mechanics remain proposals until explicit approval.',
    promptLanguage: {
      worldDNA: {
        spark: 'Arcanea is a living system of costly reciprocity, not decorative magic.',
        shape: 'Mature cinematic naturalism, biological legibility, restrained teal and warm-gold accents.',
        sharpen: ['No arbitrary glow', 'No ordinary Earth plant enlarged', 'No copied franchise traits'],
      },
      spark: seed.epithet,
      shape: { primaryPalette: seed.palette, sensoryDescription: seed.sensoryDescription },
      sharpen: ['Make anatomy support the scale', 'Show the trigger and cost through the organism', 'Preserve quiet negative space'],
      subject: `${seed.name} in its native ${seed.biome}`,
      biology: `${seed.morphology} ${seed.energySource} ${seed.lifecycle}`,
      lightBehavior: `${seed.lightSignal}; triggered by ${seed.lightTrigger}; paid for through ${seed.lightCost}`,
      materialLanguage: seed.materialLanguage,
      environmentLanguage: seed.environmentLanguage,
      composition: { camera: seed.camera, scaleCue: seed.scaleCue, focalAnchor: seed.focalAnchor, negativeSpace: seed.negativeSpace },
      emotion: seed.emotion,
      render: 'Premium feature-animation botanical realism, tactile macro detail, precise silhouette, restrained atmosphere, physically coherent light.',
      aspectRatio: '4:3',
    },
    visualPrompt: `[WORLD] Arcanea. [WORLD SPARK] Costly reciprocity makes the world alive. [SPARK] ${seed.epithet}. [SUBJECT] ${seed.name}. [BIOLOGY] ${seed.morphology} [LIGHT] ${seed.lightSignal}. [COMPOSITION] ${seed.camera}; ${seed.scaleCue}; focus on ${seed.focalAnchor}.`,
    negativePrompt: 'decorative neon, generic enchanted forest, ordinary plant enlarged, oversaturated purple-pink gradient, flat vector art, game collectible, text, label, collage, watermark',
  });
}

const RAW_ECOLOGY_ENTRIES: AtlasEntrySeed[] = [
  botanical({
    id: 'ECO-P01', slug: 'stonegrass', name: 'Stonegrass', epithet: 'The meadow that remembers weight', gate: 'Foundation', world: 'First Life', realm: 'First Life', biome: 'young mineral plains', role: 'pressure-sensing pioneer cover', scale: 'Ankle-high blades forming kilometre-wide tessellated fields', morphology: 'Silica-ribbed blades rise from hexagonal pressure plates above a braided rhizome mattress.', energySource: 'Harsh first-light photosynthesis with trace minerals recovered from fractured stone', lifecycle: 'Proposal: a plate mat grows for seven seasons, then divides along its quietest load paths', propagation: 'Proposal: compression loosens dormant edge grains that root after the pressure lifts', lightMechanism: 'mechanoluminescence', lightTrigger: 'Proposal: sustained pressure bends piezo-mineral ribs', lightSignal: 'Proposal: amber load lines travel outward to show safe and dangerous weight paths', lightCost: 'Proposal: each signal spends a finite mineral charge rebuilt only in full sun', failureMode: 'Proposal: repeated trampling turns plates opaque and erases their warning response', gift: 'Proposal: makes hidden ground strain visible before the crust collapses', price: 'Proposal: it cannot both signal and grow during the same light cycle', practice: 'Proposal: travellers wait for the field to draw a safe path instead of forcing one', exploitationConsequence: 'Proposal: mining the pressure plates blinds an entire plain to approaching fractures', relationships: [{ targetId: 'ECO-P10', relation: 'anchors', exchange: 'Proposal: seed-root filaments bind the rhizome mattress', consequence: 'Proposal: without the binding pattern, warned fractures still tear the meadow apart' }], storyHooks: ['A migration leaves no weight-memory at all', 'The grass draws a path toward a structure buried before First Life'], sourceClaims: [{ claim: 'Stonegrass is pressure-sensitive flora of First Life.', sourcePath: 'book/universe/TIMELINE.md' }], proposalMechanics: ['Hexagonal pressure plates', 'Piezo-mineral load signalling', 'Finite signal charge', 'Safety-path cultural practice'], canonState: 'staging', canonAnchors: ['First Life ecology reference', 'Foundation Gate · Lyssandria · Kaelith'], palette: 'basalt, moss-dark green, restrained amber', sensoryDescription: 'matte mineral blades, wet stone dust, fine load lines under dawn mist', materialLanguage: 'living stone, silica ribs, amber mineral seams', environmentLanguage: 'young tectonic plain after cold rain', camera: 'Ground-level wide field study', scaleCue: 'A distant caravan standing still at the meadow edge', focalAnchor: 'One pressure path opening through the plates', negativeSpace: 'A pale unbroken horizon above the low field', emotion: 'Safety discovered through patience',
  }),
  botanical({
    id: 'ECO-P02', slug: 'tideplant', name: 'Tideplant', epithet: 'The shore keeps what touches it', gate: 'Flow', world: 'First Life', realm: 'First Life', biome: 'primordial tidal shelves', role: 'contact-memory shoreline flora', scale: 'Waist-high transparent fronds in tidal colonies', morphology: 'Layered waterglass fronds contain proposal microcrystal vesicles arranged like growth rings.', energySource: 'Proposal: blue-spectrum photosynthesis and dissolved tidal minerals', lifecycle: 'Proposal: every flood adds a memory lamina; old plants shed the outermost record at solstice', propagation: 'Proposal: a released lamina folds around a mineral grain and roots in the next low tide', lightMechanism: 'fluorescence', lightTrigger: 'Proposal: a matching pressure, salinity, and temperature pattern touches a stored lamina', lightSignal: 'Proposal: the contacted frond briefly replays the colour and motion signature of an earlier touch', lightCost: 'Proposal: playback bleaches the oldest memory layer', failureMode: 'Proposal: polluted tides cause different records to fuse into convincing false memories', gift: 'Proposal: preserves environmental contact without speech or ownership', price: 'Proposal: every act of recall destroys part of what was stored', practice: 'Proposal: readers use gloved water currents and never touch the same lamina twice', exploitationConsequence: 'Proposal: forced playback can erase generations of coastal evidence in one night', relationships: [{ targetId: 'ECO-P06', relation: 'records', exchange: 'Proposal: Espejo pollen provides a clean optical calibration mark', consequence: 'Proposal: without calibration, memory colours drift until fact and reflection become indistinguishable' }], storyHooks: ['A Tideplant replays the handprint of a being older than the Gates', 'A ruler orders a coast repeatedly read until its evidence disappears'], sourceClaims: [{ claim: 'Tideplants record everything they touch.', sourcePath: 'book/universe/TIMELINE.md' }], proposalMechanics: ['Memory laminae', 'Destructive fluorescent playback', 'Pollution-induced false memories', 'Espejo calibration exchange'], canonState: 'staging', canonAnchors: ['First Life ecology reference', 'Flow Gate · Leyla · Veloura'], palette: 'waterglass blue, nacre, deep sea silver', sensoryDescription: 'transparent wet fronds, tidal foam, internal memory rings, cold reflected dawn', materialLanguage: 'nacre tissue, waterglass membranes, fluid silver veins', environmentLanguage: 'primordial shelf between low tide and returning storm', camera: 'Waterline medium-wide natural-history portrait', scaleCue: 'A lone gloved archivist beside the tallest frond', focalAnchor: 'One lamina replaying a vanished touch', negativeSpace: 'Open dark water beyond the colony', emotion: 'Wonder shadowed by the cost of remembering',
  }),
  botanical({
    id: 'ECO-P03', slug: 'heartbound-emberlily', name: 'Heartbound Emberlily', epithet: 'Two blooms survive one winter', gate: 'Fire', world: 'Arcanea', realm: 'Pyrathis', biome: 'cold seams between obsidian forests', role: 'paired thermogenic refuge bloom', scale: 'Two-metre paired flowers above a shared buried corm', morphology: 'Charcoal ceramic stems split into two copper-seamed flowers whose heat organs share one vascular chamber.', energySource: 'Proposal: chemical heat stored from volcanic sulphur and cold-season sugars', lifecycle: 'Proposal: paired buds alternate heat production; either bloom alone exhausts the common corm', propagation: 'Proposal: ash-set seeds germinate only between two genetically distinct root fires', lightMechanism: 'bioluminescence', lightTrigger: 'Proposal: one bloom senses the paired bloom falling below survival temperature', lightSignal: 'Proposal: ember-gold veins cross the shared root to declare which bloom is carrying the other', lightCost: 'Proposal: rescue light consumes the donor bloom’s next seed season', failureMode: 'Proposal: separating the pair creates one violent flare followed by permanent cold', gift: 'Proposal: creates survivable warm pockets for small life in Pyrathis cold zones', price: 'Proposal: every rescue transfers reproductive opportunity from one bloom to the other', practice: 'Proposal: travellers warm themselves between a pair, never beside a single flower', exploitationConsequence: 'Proposal: dividing pairs for portable heat sterilises entire cold-seam nurseries', relationships: [{ targetId: 'ECO-P04', relation: 'regulates', exchange: 'Proposal: shared thermogenic timing carried through traded corm cultures', consequence: 'Proposal: mistimed heat wakes pollinators before either giant bloom is fertile' }], storyHooks: ['Both flowers choose to give away their final seed season', 'A solitary lily burns beneath a city that never knew its missing twin'], sourceClaims: [], proposalMechanics: ['Paired thermogenic flowers', 'Transferred reproductive cost', 'Shared corm rescue signal', 'Cold-seam refuge ecology'], canonState: 'proposal', canonAnchors: ['Pyrathis staging world', 'Fire Gate · Draconia · Draconis'], palette: 'charcoal black, ember gold, oxidised copper', sensoryDescription: 'frost on warm petals, mineral ash, visible heat shimmer, quiet subterranean glow', materialLanguage: 'volcanic glass tissue, ember-gold veins, heat-safe fibrous stems', environmentLanguage: 'a cold rift between black-glass forests before dawn', camera: 'Low symmetrical portrait across the shared root seam', scaleCue: 'Small sheltering animals between the paired stems', focalAnchor: 'The single transfer pulse crossing from one bloom to the other', negativeSpace: 'A wide field of frozen obsidian behind the pair', emotion: 'Devotion made physically costly',
  }),
  botanical({
    id: 'ECO-P05', slug: 'floracion-azul', name: 'Floración Azul', epithet: 'The river answers only sustained song', gate: 'Voice', world: 'Arcanea', realm: 'Veldoria', biome: 'river margins and resonant irrigation channels', role: 'sound-responsive riparian flowering colony', scale: 'Knee-high blue blooms stretching along whole river bends', morphology: 'Proposal: bell-shaped petals attach to fine resonant silver ribs above ink-dark floating leaves.', energySource: 'Proposal: ordinary photosynthesis supplemented by vibration-assisted nutrient pumping', lifecycle: 'Proposal: colonies open sequentially when one clear tone is sustained through a full breath', propagation: 'Proposal: released seeds ride standing waves into quiet silt pockets', lightMechanism: 'fluorescence', lightTrigger: 'Proposal: a stable tone reaches the flower’s individual resonant frequency', lightSignal: 'Proposal: only correctly heard frequencies reveal a blue-white ring at the petal throat', lightCost: 'Proposal: sustained listening closes stomata and pauses growth', failureMode: 'Proposal: amplified noise leaves the colony open, dehydrated, and unable to distinguish speech from threat', gift: 'Proposal: reveals whether a sound is steady enough to survive distortion', price: 'Proposal: the plant gives up photosynthetic time to listen', practice: 'Proposal: waterkeepers tune channels with unamplified voices at dusk', exploitationConsequence: 'Proposal: using the flowers as concert spectacle can silence an entire watershed', relationships: [{ targetId: 'ECO-P11', relation: 'warns', exchange: 'Proposal: harmonic injury codes enter Pulseward nodal cups', consequence: 'Proposal: without the bridge, the far bank closes too late during grazing' }], storyHooks: ['A river answers a voice no living singer can hear', 'One bend refuses the official tuning song and saves the watershed'], sourceClaims: [{ claim: 'Floración Azul grows at Veldorian river margins and responds to sustained sound.', sourcePath: '.arcanea/lore/realms/veldoria.md' }], proposalMechanics: ['Bell-rib anatomy', 'Frequency-specific throat fluorescence', 'Listening-growth tradeoff', 'Watershed tuning practice'], canonState: 'staging', canonAnchors: ['Veldoria staging flora', 'Voice Gate · Alera · Otome'], palette: 'river blue, ink black, resonant silver', sensoryDescription: 'cool wet petals, shallow moving water, silver ribs, a single luminous throat ring', materialLanguage: 'bell-glass petals, resonant silver ribs, ink-dark leaves', environmentLanguage: 'Veldorian river margin at blue hour', camera: 'Low lateral view following the river bend', scaleCue: 'A waterkeeper singing from a narrow stone footbridge', focalAnchor: 'One bloom answering before the colony follows', negativeSpace: 'Quiet water upstream of the first response', emotion: 'The intimacy of being correctly heard',
  }),
  botanical({
    id: 'ECO-P06', slug: 'espejo-de-agua', name: 'Espejo de Agua', epithet: 'The leaf that refuses a false sky', gate: 'Sight', world: 'Arcanea', realm: 'Veldoria', biome: 'still pools fed by clear springs', role: 'proposal optical calibrator and water-health indicator', scale: 'Shield-wide floating leaves in sparse pool colonies', morphology: 'Proposal: concave pearl leaves carry adjustable optical cells around a clear central lens.', energySource: 'Proposal: diffuse photosynthesis across the underside while the upper lens remains reflective', lifecycle: 'Proposal: each leaf records one season of sky quality before sinking to feed the spring bed', propagation: 'Proposal: lens seeds descend only through water whose optical distortion remains below threshold', lightMechanism: 'structural-color', lightTrigger: 'Proposal: dissolved contaminants disturb the spacing of adjustable optical cells', lightSignal: 'Proposal: a healthy leaf reflects the true sky while contamination fractures it into indigo warning bands', lightCost: 'Proposal: recalibration consumes the leaf’s stored silica and shortens its floating season', failureMode: 'Proposal: prolonged contamination locks a beautiful false reflection in place', gift: 'Proposal: distinguishes clear water from merely attractive water', price: 'Proposal: every act of diagnosis erodes the lens', practice: 'Proposal: springkeepers compare the leaf to open sky without touching either surface', exploitationConsequence: 'Proposal: polishing harvested lenses creates flawless mirrors that conceal poisoned pools', relationships: [{ targetId: 'ECO-P02', relation: 'regulates', exchange: 'Proposal: clean optical pollen marks calibrate Tideplant memory colours', consequence: 'Proposal: losing the mirror colony makes old shoreline records increasingly ambiguous' }], storyHooks: ['A perfect reflection is the first proof that a spring is poisoned', 'A sunken leaf continues to show tomorrow’s sky'], sourceClaims: [{ claim: 'Espejo de Agua is named among Veldoria flora.', sourcePath: '.arcanea/lore/realms/veldoria.md' }], proposalMechanics: ['Adjustable optical cells', 'Water-quality reflection bands', 'Consumptive recalibration', 'Tideplant calibration exchange'], canonState: 'staging', canonAnchors: ['Veldoria staging flora', 'Sight Gate · Lyria · Yumiko'], palette: 'pearl, spring blue, restrained indigo', sensoryDescription: 'perfect still water, concave pearl leaf, fractured sky bands, clear spring depth', materialLanguage: 'prismatic mineral cells, pearl membrane, adjustable optical petals', environmentLanguage: 'quiet Veldorian spring beneath an open sky', camera: 'Overhead oblique field study', scaleCue: 'A springkeeper reflected beside a single shield-wide leaf', focalAnchor: 'The boundary between truthful and fractured reflection', negativeSpace: 'Undisturbed water surrounding the sparse colony', emotion: 'Discernment without certainty',
  }),
  botanical({
    id: 'ECO-P07', slug: 'granada-luminica', name: 'Granada Lumínica', epithet: 'A small sun that ripens in darkness', gate: 'Crown', world: 'Arcanea', realm: 'Avilara', biome: 'high sun orchards and shaded stone terraces', role: 'luminous orchard fruit and proposal solar-reserve clock', scale: 'Human-height trees carrying fist-sized faceted fruit', morphology: 'Proposal: cream-barked branches support matte leaves and many-chambered fruit with solar-quartz seed walls.', energySource: 'Proposal: daylight stored as chemical sugars and fluorescence-ready seed pigments', lifecycle: 'Proposal: fruit ripens in deep shade after the tree has completed its full season of sunlight', propagation: 'Proposal: seeds sprout only after their stored light is entirely spent underground', lightMechanism: 'bioluminescence', lightTrigger: 'Proposal: darkness and completed seed maturation unlock the inner fruit chambers', lightSignal: 'Proposal: chamber-by-chamber gold light shows actual ripeness rather than surface colour', lightCost: 'Proposal: every hour of fruit light spends germination energy', failureMode: 'Proposal: display harvesting leaves brilliant fruit whose exhausted seeds can never root', gift: 'Proposal: provides measured night light and nourishment from one finite reserve', price: 'Proposal: illumination and future germination draw from the same store', practice: 'Proposal: only one chamber is opened; the remaining light belongs to the seed', exploitationConsequence: 'Proposal: endless-lit palace fruit can erase an orchard’s next generation', relationships: [{ targetId: 'ECO-P10', relation: 'feeds', exchange: 'Proposal: spent-light seed minerals enter Firstseed nursery soil', consequence: 'Proposal: unspent decorative fruit overwhelms the nursery with unstable solar charge' }], storyHooks: ['A royal feast shines brighter as the future orchard dies', 'One fruit remains dark despite carrying the season’s strongest seed'], sourceClaims: [{ claim: 'Granada Lumínica is a luminous fruit associated with Avilara.', sourcePath: 'book/las-tierras-de-luz-valle-v0/BIBLE.md' }], proposalMechanics: ['Solar-quartz chamber anatomy', 'Ripeness light contract', 'Shared illumination-germination budget', 'Single-chamber harvest practice'], canonState: 'staging', canonAnchors: ['Avilara book-canon pending registry reconciliation', 'Crown Gate · Aiyami · Sol'], palette: 'cream bark, garnet skin, controlled solar gold', sensoryDescription: 'cool terrace shadow, matte leaves, faceted translucent chambers, contained warm light', materialLanguage: 'solar quartz seed walls, cream fibre, controlled gold radiance', environmentLanguage: 'high orchard terrace after sunset', camera: 'Intimate three-quarter orchard portrait', scaleCue: 'A grower holding one unopened fruit below the branch', focalAnchor: 'One chamber beginning to light from the centre', negativeSpace: 'Dark mountain air between sparse branches', emotion: 'Stewardship measured across generations',
  }),
  botanical({
    id: 'ECO-P08', slug: 'aevor-threadvine', name: 'Aevor Threadvine', epithet: 'It flowers where two consequences meet', gate: 'Starweave', world: 'Arcanea', realm: 'The Kingdom of Light', biome: 'probability gardens along Realm crossings', role: 'proposal phase-stress indicator and consequence bridge', scale: 'Fine vines spanning structures up to forty metres apart', morphology: 'Proposal: ghost-steel tendrils carry paired leaves that never occupy exactly the same plane.', energySource: 'Proposal: photosynthesis divided between two phase-offset leaf surfaces', lifecycle: 'Proposal: a vine persists only while both anchored structures remain mutually consequential', propagation: 'Proposal: thread seeds open at sites where two independent actions produce one shared outcome', lightMechanism: 'mechanoluminescence', lightTrigger: 'Proposal: phase stress rises between the vine’s two anchor points', lightSignal: 'Proposal: prismatic seams converge at the point where a distant action will create local strain', lightCost: 'Proposal: prediction anneals the active tendril into inert ghost steel', failureMode: 'Proposal: observers who repeatedly force an outcome turn the whole vine rigid and blind', gift: 'Proposal: makes distant consequences visible before systems break', price: 'Proposal: every clear warning permanently sacrifices one living thread', practice: 'Proposal: gardeners repair the cause, never cut the glowing symptom', exploitationConsequence: 'Proposal: using the vine to optimise private gain converts public gardens into dead metal webs', relationships: [{ targetId: 'ECO-P09', relation: 'warns', exchange: 'Proposal: Sombraluz shade reveals phase seams invisible in direct light', consequence: 'Proposal: without contrast shade, warnings appear only after the consequence arrives' }], storyHooks: ['A vine flowers between two people who have never met', 'An entire garden turns to metal to warn of one decision'], sourceClaims: [], proposalMechanics: ['Phase-offset leaves', 'Consequential anchoring', 'Sacrificial prediction tendrils', 'Sombraluz contrast partnership'], canonState: 'proposal', canonAnchors: ['Starweave Gate · Elara · Vaelith', 'Kingdom of Light staging realms'], palette: 'ghost silver, obsidian, narrow prismatic seams', sensoryDescription: 'hair-fine metallic vine, phase-doubled leaves, cold garden air, one converging seam', materialLanguage: 'ghost-steel ribs, obsidian facets, prismatic living seams', environmentLanguage: 'quiet probability garden between distant structures', camera: 'Long-lens view compressing both anchor points', scaleCue: 'Two far-apart maintenance crews visible in one frame', focalAnchor: 'The exact seam where two consequences converge', negativeSpace: 'A dark architectural interval between the anchors', emotion: 'Responsibility across distance',
  }),
  botanical({
    id: 'ECO-P09', slug: 'sombraluz', name: 'Sombraluz', epithet: 'The fruit teaches light to make room', gate: 'Unity', world: 'Arcanea', realm: 'Veldoria', biome: 'orchard understories and shaded courtyards', role: 'proposal contrast-regulating understory tree', scale: 'Six-metre tree with a broad low canopy', morphology: 'Proposal: charcoal leaves surround translucent fruit whose paired membranes divide incident light between canopy and ground.', energySource: 'Proposal: low-light photosynthesis balanced with sugars exchanged to shaded ground flora', lifecycle: 'Proposal: the canopy thins whenever understory light debt exceeds stored fruit reserves', propagation: 'Proposal: paired seeds separate only when planted beneath two different parent canopies', lightMechanism: 'structural-color', lightTrigger: 'Proposal: canopy light exceeds the understory’s safe photosynthetic range', lightSignal: 'Proposal: fruit membranes turn from silver to black-gold as they redirect light downward', lightCost: 'Proposal: redistribution lowers the tree’s own maximum growth rate', failureMode: 'Proposal: solitary plantation trees keep all light, grow quickly, and become sterile', gift: 'Proposal: shares usable light without flattening the needs of canopy and ground life', price: 'Proposal: the tree remains smaller than competitors that hoard sunlight', practice: 'Proposal: Veldorian orchards are planted as mixed circles, never rows of one clone', exploitationConsequence: 'Proposal: monoculture breeding creates magnificent sterile shade and a dead understory', relationships: [{ targetId: 'ECO-P08', relation: 'shelters', exchange: 'Proposal: controlled contrast exposes Threadvine phase seams', consequence: 'Proposal: the vine loses early warning in uniform direct light' }], storyHooks: ['A sterile royal orchard grows higher than every forest', 'One fruit divides moonlight between two rival gardens'], sourceClaims: [{ claim: 'Sombraluz is named among Veldoria flora.', sourcePath: '.arcanea/lore/realms/veldoria.md' }], proposalMechanics: ['Paired light-sharing membranes', 'Understory light debt', 'Mixed-circle orchard practice', 'Sterile monoculture consequence'], canonState: 'staging', canonAnchors: ['Veldoria staging flora', 'Unity Gate · Ino · Kyuro'], palette: 'charcoal leaf, smoky silver, black gold', sensoryDescription: 'cool orchard shade, translucent paired fruit, patterned light on living groundcover', materialLanguage: 'interlocking soft membranes, black-gold seed ceramic, silver leaf veins', environmentLanguage: 'mixed Veldorian orchard at late afternoon', camera: 'Human-height view from beneath the canopy', scaleCue: 'Two gardeners standing in separate pools of shared light', focalAnchor: 'One fruit splitting a sunbeam toward the understory', negativeSpace: 'A cool shadow corridor beyond the tree', emotion: 'Cooperation that preserves difference',
  }),
  botanical({
    id: 'ECO-P10', slug: 'firstseed-of-shinkami', name: 'Firstseed of Shinkami', epithet: 'Origin is carried, never owned', gate: 'Source', world: 'Arcanea', realm: 'Source sanctuaries', biome: 'quiet integration courtyards', role: 'proposal nursery organism that integrates incompatible soils without erasing them', scale: 'A hand-sized seed opening into a twelve-metre translucent tree', morphology: 'Proposal: a clear crystal seed unfolds white-gold root vanes around a black-glass heart, then grows nearly weightless leaves.', energySource: 'Proposal: small equal contributions of water, heat, mineral, wind-borne carbon, and living memory', lifecycle: 'Proposal: the tree matures only when no single input dominates; it returns to seed if balance is broken', propagation: 'Proposal: one seed forms at the meeting point of five independently healthy habitats', lightMechanism: 'bioluminescence', lightTrigger: 'Proposal: all five contributions arrive within a stable living range', lightSignal: 'Proposal: clear root-to-crown light confirms integration without showing one dominant colour', lightCost: 'Proposal: the tree spends stored resilience to keep the five inputs mutually legible', failureMode: 'Proposal: forced harmony turns the clear light white, then collapses the tree back into inert glass', gift: 'Proposal: establishes shared nursery ground between otherwise incompatible ecologies', price: 'Proposal: it cannot survive where diversity is simulated instead of maintained', practice: 'Proposal: each habitat tends only its own contribution and may not control the whole tree', exploitationConsequence: 'Proposal: centralising stewardship produces a perfect-looking sterile monument', relationships: [{ targetId: 'ECO-P01', relation: 'anchors', exchange: 'Proposal: root vanes bind Stonegrass rhizomes without flattening their pressure map', consequence: 'Proposal: if one system dominates, the seed seals and both habitats separate' }, { targetId: 'ECO-P07', relation: 'regulates', exchange: 'Proposal: spent solar seed walls contribute measured light minerals', consequence: 'Proposal: unspent fruit charge overwhelms the integration range' }], storyHooks: ['A Firstseed opens around an ecology declared irreconcilable', 'Its light turns white during a ceremony celebrating perfect unity'], sourceClaims: [], proposalMechanics: ['Five-input integration', 'Reversible tree-to-seed lifecycle', 'Non-dominant clear light', 'Distributed stewardship covenant'], canonState: 'proposal', canonAnchors: ['Source Gate · Shinkami · Source', 'Five Arcanean elements'], palette: 'clear crystal, white gold, black glass', sensoryDescription: 'weightless translucent leaves, quiet courtyard air, clear root light, five distinct soil textures', materialLanguage: 'clear crystal core, white-gold root metal, black-glass heart', environmentLanguage: 'minimal origin courtyard where five habitats meet', camera: 'Centered low wide portrait with restrained symmetry', scaleCue: 'Five stewards remaining at the edges of their own habitats', focalAnchor: 'The clear light crossing the black-glass seed heart', negativeSpace: 'An uncluttered dark canopy opening above the tree', emotion: 'Integration without possession',
  }),
  p({
    id: 'ECO-P04', slug: 'choirheart-rose', name: 'Choirheart Rose', epithet: 'The garden that keeps a covenant', kind: 'flora', gate: 'Heart', world: 'Arcanea', realm: 'Veldoria', biome: 'Vael-rain valley', role: 'keystone bloom and seasonal covenant clock', scale: 'Twenty-eight metres at full bloom', morphology: 'A rose-form megaflora with hollow load-bearing petal ribs, copper-veined sepals, and a buried decade bulb.',
    biology: { energySource: 'Ten years of stored sugars supplemented by Ledgerroot mineral exchange', lifecycle: 'A decade of accumulation culminates in a thermogenic three-night bloom', propagation: 'Seeds germinate only after passage through a Bractling digestive chamber' },
    light: { mechanism: 'bioluminescence', trigger: 'Heat, tissue damage, and successful pollination', signal: 'Vein-light separates fertility, injury, and energy debt into distinct pulse rhythms', cost: 'Every sustained pulse consumes stored bloom energy', failureMode: 'Excess signalling aborts the bloom and delays reproduction by a decade' },
    covenant: { gift: 'Warms its valley, feeds pollinators, and synchronises the surrounding reproductive season', price: 'It must retain every living bract until seed-set', practice: 'Gardeners harvest only fallen bracts after the third dawn', exploitationConsequence: 'Removing a living bract can cancel the valley bloom and collapse dependent nurseries' },
    relationships: [
      { targetId: 'ECO-A01', relation: 'feeds', exchange: 'Heat and nectar for pollination', consequence: 'Without moth contact, fertile veins never close their light cycle' },
      { targetId: 'ECO-A02', relation: 'regulates', exchange: 'Fallen bracts for seed scarification', consequence: 'Without Bractlings, seeds remain glass-hard and dormant' },
      { targetId: 'ECO-M01', relation: 'feeds', exchange: 'Sugars for rare minerals', consequence: 'Broken trade appears as darkened root-veins before the rose weakens' },
      { targetId: 'ECO-P11', relation: 'warns', exchange: 'Calcium-wave injury alerts', consequence: 'Disconnected colonies detect grazing too late to close their bracts' },
    ],
    storyHooks: ['A city removes one bract for a coronation and loses spring', 'The rose lights an injury pattern belonging to a creature thought extinct'],
    sourceClaims: [],
    proposalMechanics: ['Gigantic thermogenic rose form', 'Decade bulb', 'Covenant light vocabulary', 'Dependent bloom nursery'],
    canonAnchors: ['Vael Rain mutates flora into singing forests', 'Heart Gate · Maylinn · Laeylinn', 'Veldoria staging ecology'],
    promptLanguage: { worldDNA: { spark: 'Living worlds are built through costly reciprocity', shape: 'Mature feature-animation naturalism, cosmic restraint, biological legibility', sharpen: ['No decorative glow', 'No ordinary rose scaled up', 'No franchise likeness'] }, spark: 'A cathedral-sized bloom reveals the invisible exchanges keeping a valley alive', shape: { primaryPalette: 'deep carmine, aged ivory, rose-copper', secondaryPalette: 'restrained Vael teal and warm pollen gold', sensoryDescription: 'translucent ribbed petals, moist night air, visible heat shimmer, mineral dew' }, sharpen: ['Petal ribs visibly carry weight', 'Humans provide clear scale', 'Light remains inside living veins'], subject: 'Choirheart Rose at the first hour of its three-night bloom', biology: 'Buried decade bulb, vascular petal trusses, thermogenic core, scarification-dependent seeds', lightBehavior: 'Sequential vascular pulses show injury, fertility, and energy debt', materialLanguage: 'jade growth, warm ivory tissue, rose-copper vascular seams', environmentLanguage: 'Veldorian repair garden after Vael Rain', composition: { camera: 'Low wide field-lens from beneath the outer bracts', scaleCue: 'Three conservators crossing a root bridge', focalAnchor: 'The warm core framed by ribbed petals', negativeSpace: 'Quiet rain-dark sky above the upper bloom' }, emotion: 'Awe tempered by responsibility', render: 'Premium cinematic 3D botanical concept, tactile macro detail, believable subsurface scattering', aspectRatio: '16:9' },
    visualPrompt: 'Create the Choirheart Rose using the attached Arcanea Prompt Language record; render its biology and covenant as visible, plausible structure.',
    negativePrompt: 'ordinary rose enlarged, decorative neon, purple-pink gradient, fairy garden, game collectible, text, labels, collage, watermark',
  }),
  p({
    id: 'ECO-M01', slug: 'ledgerroot', name: 'Ledgerroot', epithet: 'The luminous account beneath the soil', kind: 'fungus', gate: 'Unity', world: 'Arcanea', realm: 'Veldoria', biome: 'Choirheart root basin', role: 'mycorrhizal exchange network and ecological debt signal', scale: 'Hair-fine threads spanning entire valleys', morphology: 'Pale paired hyphae braided around roots, interrupted by dark-gold mineral nodes.',
    biology: { energySource: 'Plant sugars traded for phosphorus, water, and Vael trace minerals', lifecycle: 'Networks divide, fuse, and prune routes according to reciprocal exchange', propagation: 'Airborne silver spores settle only beside metabolically active roots' },
    light: { mechanism: 'bioluminescence', trigger: 'Resource transfer across a living exchange junction', signal: 'Direction and duration reveal contribution, debt, and withdrawal', cost: 'Light consumes part of the carbon payment', failureMode: 'Chronically exploited routes go dark and are enzymatically severed' },
    covenant: { gift: 'Redistributes scarce nutrients and makes ecological extraction visible', price: 'It abandons organisms that take without returning', practice: 'Veldorian growers read exchange paths before planting or harvesting', exploitationConsequence: 'Forced feeding produces bright false ledgers followed by sudden network collapse' },
    relationships: [{ targetId: 'ECO-P04', relation: 'feeds', exchange: 'Minerals for stored sugars', consequence: 'The Choirheart loses structural colour before nutrient failure becomes fatal' }],
    storyHooks: ['A supposedly sacred grove is revealed as a net extractor', 'A severed network preserves the final ledger of a vanished village'],
    sourceClaims: [],
    proposalMechanics: ['Reciprocity ledger', 'Directional exchange light', 'Network pruning under exploitation'],
    canonAnchors: ['Singing forest mutation after Vael Rain', 'Unity Gate · Ino · Kyuro', 'Veldoria mycelial ecology'],
    promptLanguage: { worldDNA: { spark: 'Cooperation without sameness', shape: 'Scientific macro naturalism inside Arcanea material restraint', sharpen: ['Exchange must be visible', 'No glowing cable aesthetic'] }, spark: 'A living ledger records every gift beneath a monumental flower', shape: { primaryPalette: 'bone white, charcoal soil, black gold', secondaryPalette: 'restrained teal at active junctions', sensoryDescription: 'moist soil chambers, hair-fine paired hyphae, mineral granules, root hairs' }, sharpen: ['Macro cross-section', 'Directional light only at active exchange', 'Biological irregularity'], subject: 'Ledgerroot exchanging minerals with Choirheart feeder roots', biology: 'Paired mycorrhizal hyphae with enzyme gates and mineral storage nodes', lightBehavior: 'Short directional bioluminescent transfers, never a constant glow', materialLanguage: 'paired silver filaments, black-gold nodes, translucent root tissue', environmentLanguage: 'rain-fed subterranean Veldorian soil chamber', composition: { camera: 'Extreme macro cutaway', scaleCue: 'Root hairs and pollen-sized mineral grains', focalAnchor: 'One active exchange junction', negativeSpace: 'Dark soil channels around the active network' }, emotion: 'Intimacy, intelligence, and earned trust', render: 'Museum-grade biological macro render with cinematic depth', aspectRatio: '4:3' },
    visualPrompt: 'Render Ledgerroot as a plausible reciprocal mycorrhizal network whose light traces real resource movement.', negativePrompt: 'fiber optics, circuit board, generic magic roots, neon web, text, diagram labels, watermark',
  }),
  p({
    id: 'ECO-P11', slug: 'pulseward', name: 'Pulseward', epithet: 'The warning bridge', kind: 'flora', gate: 'Voice', world: 'Arcanea', realm: 'Veldoria', biome: 'Open seams between root colonies', role: 'long-distance defence messenger between disconnected plant communities', scale: 'Low mats up to six metres across', morphology: 'Ink-dark leaves joined by bell-glass petioles and silver nodal cups.',
    biology: { energySource: 'Photosynthesis and calcium storage in petiole cups', lifecycle: 'Perennial mats split after every seventh carried alarm', propagation: 'Detached nodal cups root where two foreign colonies overlap' },
    light: { mechanism: 'fluorescence', trigger: 'A calcium defence wave entering a nodal cup', signal: 'A single travelling flash carries the location and severity of damage', cost: 'Each transmission temporarily closes local stomata', failureMode: 'Repeated false alarms dehydrate the mat until its bridges fall silent' },
    covenant: { gift: 'Extends injury warnings across broken soil and stone', price: 'Sacrifices its own photosynthetic time for every message', practice: 'Paths are raised over Pulseward rather than cut through it', exploitationConsequence: 'Harvesting its cups leaves whole gardens unable to coordinate defence' },
    relationships: [{ targetId: 'ECO-P04', relation: 'warns', exchange: 'Calcium-wave location and severity', consequence: 'The rose closes only the threatened bracts instead of wasting a full defence response' }],
    storyHooks: ['A warning arrives from a garden erased generations ago', 'Someone is deliberately sending false alarms to exhaust a valley'],
    sourceClaims: [],
    proposalMechanics: ['Calcium-wave relay bridge', 'Visible alarm pulse', 'False-alarm dehydration'],
    canonAnchors: ['Voice Gate · Alera · Otome', 'Tone-responsive Veldorian flora', 'Plant long-distance defence signalling'],
    promptLanguage: { worldDNA: { spark: 'Truth must survive distance and distortion', shape: 'Botanical field realism with one exact visual event', sharpen: ['One pulse only', 'No UI waveform'] }, spark: 'A defence signal crosses a living bridge at night', shape: { primaryPalette: 'ink black, smoked silver, bell glass', secondaryPalette: 'brief cyan-white fluorescence', sensoryDescription: 'wet low leaves, glassy petioles, rain-dark stone seam' }, sharpen: ['The pulse occupies only one segment', 'Neighbouring tissue remains dark', 'Surface detail stays botanical'], subject: 'Pulseward carrying an injury message toward the Choirheart basin', biology: 'Calcium storage cups and articulated petiole bridges', lightBehavior: 'One travelling fluorescent wave triggered by injury chemistry', materialLanguage: 'resonant silver, ink-black leaf tissue, bell-glass petioles', environmentLanguage: 'a broken garden seam under rain', composition: { camera: 'Ground-level tracking perspective', scaleCue: 'Water droplets and a conservator boot bridge', focalAnchor: 'The single active calcium wave', negativeSpace: 'Dark destination colony ahead' }, emotion: 'Urgency without panic', render: 'Cinematic botanical macro realism, restrained premium 3D', aspectRatio: '16:9' },
    visualPrompt: 'Render Pulseward at the instant one calcium-warning flash crosses a physical break between colonies.', negativePrompt: 'constant glow, electric cable, cyberpunk, waveform overlay, fantasy runes, text, watermark',
  }),
  p({
    id: 'ECO-A01', slug: 'serein-moth', name: 'Serein Moth', epithet: 'The bloomwright', kind: 'fauna', gate: 'Heart', world: 'Arcanea', realm: 'Veldoria', biome: 'Choirheart canopy', role: 'petal-rib repairer and precision pollinator', scale: 'Adult wingspan of thirty centimetres', morphology: 'Velvet rain-grey wings, pollen combs, and a translucent nectar lantern along the abdomen.',
    biology: { energySource: 'Choirheart nectar and microbial wax cultivated by larvae', lifecycle: 'Larvae seal damaged petal ribs; adults emerge only when bloom heat reaches threshold', propagation: 'Eggs are placed inside naturally shed bract scars' },
    light: { mechanism: 'bioluminescence', trigger: 'Successful pollen transfer alters nectar chemistry', signal: 'The abdominal lantern confirms a completed pollination route', cost: 'The light spends the adult moth’s final stored sugars', failureMode: 'False heat can trigger emergence before nectar is available' },
    covenant: { gift: 'Repairs the structure it later pollinates', price: 'Its adult life lasts only three nights', practice: 'No lamps are lit above the garden during emergence', exploitationConsequence: 'Captive breeding separates repair from pollination and weakens both species' },
    relationships: [{ targetId: 'ECO-P04', relation: 'pollinates', exchange: 'Larval repair and pollen transfer for shelter and nectar', consequence: 'Neither organism completes reproduction alone' }],
    storyHooks: ['A moth returns with pollen from an unknown rose', 'Artificial bloom heat draws an entire generation into a winter night'],
    sourceClaims: [],
    proposalMechanics: ['Larval petal repair', 'Pollination-confirmation lantern', 'Three-night adult life'],
    canonAnchors: ['Heart Gate · Maylinn · Laeylinn', 'Veldorian singing-bee precedent', 'Choirheart proposal ecology'],
    promptLanguage: { worldDNA: { spark: 'Care is a reciprocal craft', shape: 'Mature creature design embedded in biological context', sharpen: ['Not a mascot', 'No butterfly fairy'] }, spark: 'A pollinator carries proof of fulfilled work in its own fading light', shape: { primaryPalette: 'rain grey, bone, pollen gold', secondaryPalette: 'warm jade-white abdominal light', sensoryDescription: 'velvet scales, pollen dust, warm petal condensation' }, sharpen: ['Pollen comb anatomy', 'Three-dimensional wing wear', 'No humanoid face'], subject: 'Serein Moth crossing a Choirheart stamen chamber after pollination', biology: 'Repair-adapted larvae, pollen combs, nectar-reactive abdominal lantern', lightBehavior: 'Soft abdominal light appears only after successful pollen transfer', materialLanguage: 'velvet wing scales, translucent chitin, warm pollen', environmentLanguage: 'thermogenic rose interior under rain', composition: { camera: 'Macro three-quarter in flight', scaleCue: 'Monumental stamens and falling pollen', focalAnchor: 'The newly lit abdominal lantern', negativeSpace: 'Dark passage toward the next bloom' }, emotion: 'Brief fulfilment and tenderness', render: 'Premium feature-animation creature naturalism with macro realism', aspectRatio: '4:3' },
    visualPrompt: 'Render the Serein Moth as a believable specialist pollinator inside the monumental Choirheart flower.', negativePrompt: 'cute mascot, fairy wings, humanoid eyes, glowing everywhere, collectible creature, text, watermark',
  }),
  p({
    id: 'ECO-A02', slug: 'bractling', name: 'Bractling', epithet: 'The patient gardener', kind: 'fauna', gate: 'Foundation', world: 'Arcanea', realm: 'Veldoria', biome: 'Choirheart basin floor', role: 'fallen-bract grazer and seed scarifier', scale: 'Knee-high, broad-bodied quadruped', morphology: 'Stone-brown plated back, moss-soft underside, petal shears, and translucent seed chambers.',
    biology: { energySource: 'Only naturally shed Choirheart tissue', lifecycle: 'Slow-lived family groups follow the bloom cycle across generations', propagation: 'One offspring is raised for every completed rose bloom', },
    light: { mechanism: 'fluorescence', trigger: 'Viable seeds enter the gut chamber', signal: 'A dim belly pattern lets gardeners count prepared seeds without handling them', cost: 'The fluorescent compound reduces digestive efficiency', failureMode: 'Living bract tissue poisons the chamber and extinguishes the pattern' },
    covenant: { gift: 'Turns glass-hard seeds into germination-ready capsules', price: 'Cannot digest living tissue', practice: 'Gardeners clear paths to fallen bracts but never feed the animals directly', exploitationConsequence: 'Domestication teaches indiscriminate feeding and makes the species toxic to its own nursery' },
    relationships: [{ targetId: 'ECO-P04', relation: 'feeds', exchange: 'Fallen bracts for prepared seeds and cleared soil', consequence: 'The rose spreads only where Bractlings complete digestion' }],
    storyHooks: ['A Bractling carries a seed that glows in an impossible Gate colour', 'Poachers teach a herd to eat living bracts'],
    sourceClaims: [],
    proposalMechanics: ['Fallen-bract diet', 'Digestive seed scarification', 'Viable-seed fluorescence'],
    canonAnchors: ['Foundation Gate · Lyssandria · Kaelith', 'Veldorian ecology staging', 'Choirheart proposal ecology'],
    promptLanguage: { worldDNA: { spark: 'Small lives carry structural responsibility', shape: 'Tactile non-humanoid fauna, quiet competence, no toy plastic', sharpen: ['Broad functional silhouette', 'No mascot proportions'] }, spark: 'A humble grazer carries the next cathedral garden inside its body', shape: { primaryPalette: 'slate brown, moss green, faded carmine', secondaryPalette: 'dim seed-white fluorescence', sensoryDescription: 'layered natural plates, damp fur, fallen petal leather, transparent gut chamber' }, sharpen: ['Biological plate articulation', 'Only fallen bracts in frame', 'Soft low belly signal'], subject: 'A Bractling family processing fallen Choirheart bracts at dawn', biology: 'Petal-cutting jaw plates and seed-scarifying digestive chamber', lightBehavior: 'Dim fluorescence around viable seeds inside the lower abdomen', materialLanguage: 'living stone plate, moss-soft weave, translucent membrane', environmentLanguage: 'valley floor after the third bloom night', composition: { camera: 'Low intimate field portrait', scaleCue: 'A human handprint on one fallen bract', focalAnchor: 'Prepared seeds visible through the belly chamber', negativeSpace: 'The distant rose trunk fading into mist' }, emotion: 'Trust earned through unglamorous work', render: 'Premium cinematic creature design with natural-history specificity', aspectRatio: '4:3' },
    visualPrompt: 'Render a Bractling family as essential ecological workers beneath the Choirheart Rose.', negativePrompt: 'cute pet, oversized eyes, armor costume, monster battle pose, neon, text, watermark',
  }),
];

export const HERO_PLANT_SLUGS = [
  'stonegrass',
  'tideplant',
  'heartbound-emberlily',
  'choirheart-rose',
  'floracion-azul',
  'espejo-de-agua',
  'granada-luminica',
  'aevor-threadvine',
  'sombraluz',
  'firstseed-of-shinkami',
] as const;

type HeroPlantSlug = (typeof HERO_PLANT_SLUGS)[number];
type EntryReconciler = (entry: AtlasEntrySeed) => AtlasEntrySeed;

const HERO_MEDIA_RECEIPTS: Record<HeroPlantSlug, VisualMedia> = {
  stonegrass: {
    status: 'staged',
    url: '/images/ecology/stonegrass-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '43b7ec3ab3e10cf888e52b2b82f800287ed5b3ca28f41f4f402c86e7ab93bfb0',
    alt: 'A pressure wave crossing Stonegrass as repeatedly trodden blades mineralize into pale seasonal pavement.',
    generatedAt: '2026-09-02T21:44:59.500Z',
  },
  tideplant: {
    status: 'staged',
    url: '/images/ecology/tideplant-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '395c0a94f418a5aaeedaa095a99f634e49143451e927786bb5f2ecf20c08b025',
    alt: 'Transparent Tideplant fronds recording a new touch while their oldest outer memory dissolves into the surf.',
    generatedAt: '2026-09-02T20:54:17.159Z',
  },
  'heartbound-emberlily': {
    status: 'staged',
    url: '/images/ecology/heartbound-emberlily-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: 'c8a927fee783414f6c2db65da0f204d2d8836d6352bf6253f7ce2648758c6832',
    alt: 'A single black ceramic Emberlily blooming on cooling lava inside the cold obsidian ring created by its final heat.',
    generatedAt: '2026-09-02T20:53:10.085Z',
  },
  'choirheart-rose': {
    status: 'staged',
    url: '/images/ecology/choirheart-rose-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: 'c4c62de05e462c62d52508802cf96fd7131a4146f3181284b15ea066871506f7',
    alt: 'The monumental ribbed Choirheart Rose warming its valley during the first night of its costly decade bloom.',
    generatedAt: '2026-09-02T20:50:24.037Z',
  },
  'floracion-azul': {
    status: 'staged',
    url: '/images/ecology/floracion-azul-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '25fd01aba4f5685e902bf5c0bfbbcd2f3501f7374173511f6b3d85c296f96ca4',
    alt: 'Blue river flowers opening one after another along a sustained exact pitch while conflicting blooms remain closed.',
    generatedAt: '2026-09-02T20:56:42.422Z',
  },
  'espejo-de-agua': {
    status: 'staged',
    url: '/images/ecology/espejo-de-agua-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '3b407cc5e0bfeaf955e990692ee8653911d99038038c4b81798b254f77257b6b',
    alt: 'Circular Espejo de Agua leaves canceling incoming ripples to hold a perfect sky reflection without emitting light.',
    generatedAt: '2026-09-02T20:57:08.403Z',
  },
  'granada-luminica': {
    status: 'staged',
    url: '/images/ecology/granada-luminica-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '7e47705fd24162634ae02009d17de44a6e989e764aff53f3517b8602346fe41d',
    alt: 'Daylight-filled arils glowing inside a cut Granada Lumínica while the fruiting branch enters a dark year of dormancy.',
    generatedAt: '2026-09-02T20:57:39.900Z',
  },
  'aevor-threadvine': {
    status: 'staged',
    url: '/images/ecology/aevor-threadvine-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '103804528f48dfbd318a80886d8dd673ee1fd559f311bc0b87601f8a5b56ab61',
    alt: 'An Aevor Threadvine fruit selecting one luminous route through paired probability leaves as every alternative goes dark.',
    generatedAt: '2026-09-02T21:45:29.789Z',
  },
  sombraluz: {
    status: 'staged',
    url: '/images/ecology/sombraluz-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: '9bc518cc8925f6a0401c10d0a37f1b98e9cf55497481c98b4d36d49b83910d27',
    alt: 'An eighteen-metre Sombraluz adjusting its living shade around visitors while one severed-root canopy sector remains inert.',
    generatedAt: '2026-09-02T21:46:33.834Z',
  },
  'firstseed-of-shinkami': {
    status: 'staged',
    url: '/images/ecology/firstseed-of-shinkami-hero.webp',
    width: 1448,
    height: 1086,
    mimeType: 'image/webp',
    sha256: 'aea7c8cee558afb0a68dc3ae0b297e2d467aa6f98c95400f9a068e5cab4a570c',
    alt: 'A Firstseed choosing one biome-adapted germ layer as its nine unchosen potential forms are permanently erased.',
    generatedAt: '2026-09-02T22:02:54.947Z',
  },
};

const HERO_MECHANISM_RECONCILIATIONS: Partial<Record<HeroPlantSlug, EntryReconciler>> = {
  stonegrass: (entry) => ({
    ...entry,
    biology: {
      ...entry.biology,
      lifecycle: 'Proposal: each seasonal field begins as flexible silica-ribbed blades; repeated pressure progressively mineralizes the loaded blades into inert pavement that breaks down only after the season turns',
      propagation: 'Proposal: flexible blades release edge grains after the seasonal mineral pavement fractures during thaw',
    },
    light: {
      mechanism: 'mechanoluminescence',
      trigger: 'Proposal: a first sustained load bends the living piezo-mineral ribs',
      signal: 'Proposal: one restrained amber pressure wave maps the load before the blades harden',
      cost: 'Proposal: every pressure response deposits silica into the flexing blade and reduces its remaining sensitivity',
      failureMode: 'Proposal: repeated pressure fully mineralizes the blades into inert seasonal pavement that can no longer sense or signal',
    },
    covenant: {
      gift: 'Proposal: reveals fresh weight and then lays a temporary durable path where passage repeats',
      price: 'Proposal: the meadow permanently gives up living blades wherever a seasonal route becomes established',
      practice: 'Proposal: travellers reuse an existing pale pavement instead of widening it into sensitive grass',
      exploitationConsequence: 'Proposal: indiscriminate trampling mineralizes the whole field and removes its pioneer cover until the next season',
    },
    proposalMechanics: ['Piezo-mineral first-pressure signal', 'Repeated-pressure mineralization', 'Inert seasonal pavement', 'Thaw-released edge grains'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'A living meadow becomes the road it is repeatedly asked to carry',
      biology: 'Flexible silica-ribbed blades progressively mineralize under repeated load into pale inert seasonal pavement',
      lightBehavior: 'One amber load wave precedes mineralization; established pavement emits nothing',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'The exact boundary where green sensing blades become pale inert pavement',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] A living meadow becomes the road it repeatedly carries. [SUBJECT] Stonegrass. [BIOLOGY] Flexible silica-ribbed blades under a first footprint send one amber pressure wave; a repeatedly traveled band has mineralized into pale inert seasonal pavement. [COMPOSITION] Ground-level wide field study; show the exact living-to-stone boundary and keep the established pavement dark.',
  }),
  tideplant: (entry) => ({
    ...entry,
    biology: {
      ...entry.biology,
      lifecycle: 'Proposal: each contact writes a new inner memory lamina and pushes the finite sequence outward, overwriting the oldest outer record',
      propagation: 'Proposal: only an overwritten outer lamina can detach, fold around a mineral grain, and root at low tide',
    },
    light: {
      mechanism: 'fluorescence',
      trigger: 'Proposal: a new pressure, salinity, and temperature signature touches the frond',
      signal: 'Proposal: the new contact flashes in the innermost lamina while every older record shifts one layer outward',
      cost: 'Proposal: recording the newest memory overwrites and dissolves the oldest memory; storage never expands',
      failureMode: 'Proposal: rapid repeated contact overwrites a lifetime of shoreline evidence before it can be read',
    },
    covenant: {
      gift: 'Proposal: preserves a finite chronological record of what touches the shore',
      price: 'Proposal: every newest memory necessarily destroys the oldest',
      practice: 'Proposal: readers approach through existing water currents and avoid adding an accidental final touch',
      exploitationConsequence: 'Proposal: deliberate handling can overwrite an entire coast with one manufactured sequence',
    },
    proposalMechanics: ['Finite contact-memory laminae', 'Newest-memory insertion', 'Oldest-memory overwrite', 'Overwritten-lamina propagation'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'The shore can remember only by deciding what it must forget',
      biology: 'A finite stack of waterglass memory laminae records each new touch at the center and pushes the oldest record out',
      lightBehavior: 'The newest contact fluoresces in the inner lamina while the oldest outer ring visibly dissolves without extra glow',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'A new central handprint-memory displacing the oldest outer ring into seawater',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] The shore remembers only by forgetting. [SUBJECT] Tideplant. [BIOLOGY] Finite concentric waterglass laminae; a newest touch appears at the center and pushes every older memory outward until the oldest ring dissolves into the tide. [COMPOSITION] Waterline natural-history portrait with one legible overwrite event, no holograms or archive UI.',
  }),
  'heartbound-emberlily': (entry) => ({
    ...entry,
    epithet: 'One bloom spends itself to cool the fire',
    role: 'single-use thermogenic pioneer bloom',
    scale: 'One two-metre bloom rising directly from a cooling lava tongue',
    morphology: 'Proposal: a single black ceramic flower opens from a heat-proof corm, with ember-gold seams above a circular band of newly quenched obsidian.',
    biology: {
      energySource: 'Proposal: thermal energy and sulphur chemistry drawn from one cooling lava flow',
      lifecycle: 'Proposal: one bloom draws out the remaining lava heat, forms a cold obsidian ring, dies completely, and leaves exactly one seed',
      propagation: 'Proposal: its single heat-sealed seed remains dormant until carried to a new cooling lava front',
    },
    light: {
      mechanism: 'bioluminescence',
      trigger: 'Proposal: the surrounding lava falls through the flower’s final viable temperature range',
      signal: 'Proposal: ember-gold seams contract toward the ovary as the surrounding obsidian ring turns cold and black',
      cost: 'Proposal: the terminal light converts the entire bloom and corm into one viable seed',
      failureMode: 'Proposal: removing the bloom or seed before the ring is fully cold kills the plant without viable offspring',
    },
    covenant: {
      gift: 'Proposal: leaves one cold obsidian refuge where pioneer life can cross a fresh lava field',
      price: 'Proposal: the parent dies after making exactly one seed',
      practice: 'Proposal: travellers wait outside the dark ring until the last ember seam reaches the ovary',
      exploitationConsequence: 'Proposal: harvesting a living flower for heat destroys both the refuge and the only next generation',
    },
    relationships: [],
    storyHooks: ['An Emberlily dies without leaving its promised seed', 'A chain of cold rings marks a route across lava that no traveller remembers making'],
    proposalMechanics: ['Single black ceramic bloom', 'Cooling-lava thermogenesis', 'Cold obsidian refuge ring', 'Terminal one-seed reproduction'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'One black bloom spends its whole life making a single safe circle',
      shape: {
        ...entry.promptLanguage.shape,
        sensoryDescription: 'one black ceramic flower, cooling red lava, a perfectly cold obsidian ring, contracting ember-gold seams',
      },
      subject: 'One Heartbound Emberlily completing its terminal bloom on cooling lava',
      biology: 'A solitary heat-proof corm and black ceramic bloom die into exactly one sealed seed after quenching a circular obsidian refuge',
      lightBehavior: 'The final ember seams contract into the one seed; the cold ring and dead tissue remain completely dark',
      composition: {
        camera: 'Low three-quarter portrait across the cooling lava surface',
        scaleCue: 'One distant traveller waiting beyond the ring',
        focalAnchor: 'The single seed forming as the last petal seam goes dark',
        negativeSpace: 'Unbroken black lava beyond the cold circular refuge',
      },
      emotion: 'A severe, complete act of generational devotion',
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] One bloom spends its whole life making one safe circle. [SUBJECT] A single Heartbound Emberlily, never a pair. [BIOLOGY] One black ceramic flower rises from cooling lava inside a cold obsidian ring; its contracting ember seams die into exactly one seed. [COMPOSITION] Low three-quarter portrait, severe volcanic negative space, no second flower.',
  }),
  'floracion-azul': (entry) => ({
    ...entry,
    biology: {
      ...entry.biology,
      lifecycle: 'Proposal: an exact sustained pitch opens the first bloom and then propagates a sequential opening down the connected river colony',
    },
    light: {
      mechanism: 'fluorescence',
      trigger: 'Proposal: one unamplified tone matches the colony’s exact resonant pitch and remains stable for a full breath',
      signal: 'Proposal: a blue-white throat ring appears in each flower precisely as the opening sequence reaches it',
      cost: 'Proposal: every opened flower closes its stomata and pauses growth while listening',
      failureMode: 'Proposal: a conflicting tone closes already-open flowers and suppresses every downstream bud until the river completes a quiet reset',
    },
    covenant: {
      ...entry.covenant,
      gift: 'Proposal: makes exact tonal agreement visible as a sequential living response',
      practice: 'Proposal: waterkeepers hold one exact unamplified pitch and stop immediately if a conflicting voice closes the first bloom',
      exploitationConsequence: 'Proposal: competing amplified tones can suppress flowering along an entire river bend',
    },
    proposalMechanics: ['Exact-pitch resonance', 'Sequential colony opening', 'Pitch-local throat fluorescence', 'Conflicting-tone closure and suppression'],
    promptLanguage: {
      ...entry.promptLanguage,
      biology: 'Bell-ribbed river flowers share a resonant rhizome; one exact sustained pitch opens them sequentially along the current',
      lightBehavior: 'A single blue-white throat ring advances bloom by bloom; a conflicting-tone branch is visibly closed and dark',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'The moving boundary between sequentially open flowers and suppressed closed buds',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] A river answers one exact voice in sequence. [SUBJECT] Floración Azul. [BIOLOGY] An exact sustained pitch opens connected blue bell flowers one after another; a visibly conflicting side colony closes and remains suppressed. [COMPOSITION] Follow the opening wave along the river bend, with one luminous throat ring per currently responding flower and no sound-wave graphics.',
  }),
  'espejo-de-agua': (entry) => ({
    ...entry,
    epithet: 'The colony that makes stillness',
    role: 'active ripple-cancelling aquatic colony',
    morphology: 'Proposal: perfect circular floating leaves coordinate flexible margins around pressure-sensitive radial veins.',
    biology: {
      energySource: 'Proposal: diffuse underside photosynthesis and elastic energy stored while the water is calm',
      lifecycle: 'Proposal: each tidal cycle unfurls the colony, restores turgor, and prepares one finite interval of active surface control',
      propagation: 'Proposal: folded colonies release underside seeds only at the next returning tide',
    },
    light: {
      mechanism: 'none',
      trigger: 'Proposal: an incoming surface ripple reaches the pressure-sensitive outer leaves',
      signal: 'Proposal: the leaves emit no light; coordinated margins generate counter-ripples that cancel disturbance and preserve an exact sky reflection',
      cost: 'Proposal: active cancellation spends stored turgor and progressively stiffens the leaf margins',
      failureMode: 'Proposal: a disturbance beyond the colony’s remaining capacity makes every leaf fold shut until the next tide',
    },
    covenant: {
      gift: 'Proposal: creates a true still-water interval without masking the force that reached it',
      price: 'Proposal: every cancelled ripple shortens the colony’s open interval',
      practice: 'Proposal: observers wait outside the pool and read the reflection before approaching the margin',
      exploitationConsequence: 'Proposal: repeated demonstrations exhaust and fold a whole colony until the next tide',
    },
    relationships: [{ targetId: 'ECO-P02', relation: 'regulates', exchange: 'Proposal: a ripple-free interval gives Tideplant readers one contactless view of its laminae', consequence: 'Proposal: exhausting the mirror colony forces readers to add new touches and overwrite old records' }],
    storyHooks: ['The colony folds although no visible object touched the pool', 'A reflection remains exact while a storm tears the surrounding shore'],
    proposalMechanics: ['Active counter-ripple generation', 'No emitted light', 'Finite turgor budget', 'Whole-colony folding until next tide'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'Stillness is an active expenditure, not an absence',
      biology: 'Perfect circular leaves coordinate flexible margins to generate counter-ripples; overload folds the whole colony until the next tide',
      lightBehavior: 'No bioluminescence or emitted light; the only visual signal is an optically exact sky reflection held inside opposing ripples',
      materialLanguage: 'matte pearl leaf tissue, radial pressure veins, clear natural water',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'The cancellation boundary where two ripples disappear into a perfect reflection',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] Stillness is an active expenditure. [SUBJECT] Espejo de Agua. [BIOLOGY] Perfect circular leaves flex their margins to create counter-ripples and preserve one exact sky reflection; a disturbed outer sector is folded shut until the next tide. [LIGHT] No emitted light, no glow, only natural reflection. [COMPOSITION] Overhead oblique field study centered on the cancellation boundary.',
  }),
  'granada-luminica': (entry) => ({
    ...entry,
    morphology: 'Proposal: cream-barked branches carry matte leaves and thick-skinned fruit whose jewel-like arils are individual daylight reservoirs.',
    biology: {
      energySource: 'Proposal: each aril stores daylight as sugar and a bioluminescent seed-coat precursor',
      lifecycle: 'Proposal: after its fruit releases stored daylight, that entire branch goes dark and remains dormant for one full year',
      propagation: 'Proposal: a spent aril seed germinates underground only after the parent branch begins its year of dormancy',
    },
    light: {
      mechanism: 'bioluminescence',
      trigger: 'Proposal: mature arils are exposed to darkness inside an opened fruit',
      signal: 'Proposal: each ripe aril releases its own measured reservoir of warm daylight',
      cost: 'Proposal: lighting the arils consumes the fruiting branch’s stored growth budget and commits it to one dark dormant year',
      failureMode: 'Proposal: stripping every aril leaves the branch dormant without enough viable seed to replace its lost year',
    },
    covenant: {
      gift: 'Proposal: concentrates a season of daylight into edible, countable night reservoirs',
      price: 'Proposal: the fruiting branch goes completely dark and dormant for the following year',
      practice: 'Proposal: orchard keepers mark resting branches and never demand fruit from them in consecutive years',
      exploitationConsequence: 'Proposal: forcing every branch to fruit at once creates a luminous harvest followed by a wholly dormant orchard',
    },
    proposalMechanics: ['Daylight-storing arils', 'Measured aril bioluminescence', 'Whole-branch energy expenditure', 'One-year dark branch dormancy'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'A branch gives away its next year one chamber of daylight at a time',
      biology: 'Individual pomegranate-like arils store daylight; releasing their light sends the entire bearing branch into a dark year of dormancy',
      lightBehavior: 'Warm light remains inside mature exposed arils only; the spent fruiting branch is visibly dark and dormant',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'A cut fruit with daylight stored in separate arils beside its dark dormant branch',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] A branch gives away its next year one aril at a time. [SUBJECT] Granada Lumínica. [BIOLOGY] Jewel-like arils store daylight and glow only when a mature fruit opens in darkness; the bearing branch beside them has gone completely dark and dormant for one full year. [COMPOSITION] Intimate orchard portrait, contained aril light, no glowing leaves or trunk.',
  }),
  'aevor-threadvine': (entry) => ({
    ...entry,
    epithet: 'The fruit that leaves one future alive',
    role: 'proposal probability-route selector',
    morphology: 'Proposal: a ghost-steel vine bears paired probability leaves at every node, their opposed veins converging on one dark central fruit.',
    biology: {
      energySource: 'Proposal: each paired leaf photosynthesizes into a different phase-compatible sugar path',
      lifecycle: 'Proposal: all paired routes remain viable until the central fruit ripens and irreversibly chooses one path',
      propagation: 'Proposal: the chosen fruit produces one thread seed carrying only the selected route; no discarded alternative is inherited',
    },
    light: {
      mechanism: 'bioluminescence',
      trigger: 'Proposal: the central fruit reaches maturity while two or more probability routes remain viable',
      signal: 'Proposal: one route lights from fruit to leaf tip as every alternative vein extinguishes permanently',
      cost: 'Proposal: selection enzymatically consumes the living tissue of every unchosen probability leaf',
      failureMode: 'Proposal: cutting or duplicating the fruit before selection extinguishes every route and leaves a sterile vine',
    },
    covenant: {
      gift: 'Proposal: commits distributed possibility into one survivable route',
      price: 'Proposal: every unchosen alternative is physically erased and cannot be recovered',
      practice: 'Proposal: gardeners may tend the paired leaves but never choose on the fruit’s behalf',
      exploitationConsequence: 'Proposal: forced prediction destroys the alternatives without producing a viable chosen seed',
    },
    relationships: [{ targetId: 'ECO-P09', relation: 'shelters', exchange: 'Proposal: Sombraluz shade keeps paired probability leaves from resolving before the fruit matures', consequence: 'Proposal: without responsive shade, the first sun-struck route extinguishes its alternatives prematurely' }],
    storyHooks: ['A fruit selects the route everyone had already abandoned', 'One severed vine keeps both probability leaves alive but can never fruit'],
    proposalMechanics: ['Paired probability leaves', 'Single route-selecting fruit', 'Permanent extinction of alternatives', 'Unclonable route inheritance'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'A fruit becomes real by extinguishing every future it does not choose',
      biology: 'Paired phase-offset probability leaves converge on one fruit; ripening selects one vascular route and erases every alternative',
      lightBehavior: 'Exactly one path glows from fruit through one leaf of each pair while all alternative leaves go optically and biologically dark',
      composition: {
        ...entry.promptLanguage.composition,
        focalAnchor: 'The central fruit at the fork between one living luminous route and several newly extinguished leaves',
      },
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] A fruit becomes real by extinguishing every future it does not choose. [SUBJECT] Aevor Threadvine. [BIOLOGY] Paired probability leaves feed one central fruit; at ripeness exactly one continuous route illuminates while every alternative leaf and vein permanently goes dark. [COMPOSITION] Macro-to-medium botanical portrait of one decisive fork, not a diagram or branching UI.',
  }),
  sombraluz: (entry) => ({
    ...entry,
    epithet: 'The shade that makes room for feeling',
    role: 'emotion-responsive networked shade tree',
    scale: 'Eighteen-metre tree with a radial canopy and matching root network',
    morphology: 'Proposal: an eighteen-metre Sombraluz carries broad charcoal fan leaves in radial canopy sectors, each joined to one corresponding conductive root spoke.',
    biology: {
      energySource: 'Proposal: ordinary photosynthesis redistributed among intact root-and-canopy sectors',
      lifecycle: 'Proposal: neighbouring trees slowly graft root tips into a local shade network while preserving distinct trunks and crowns',
      propagation: 'Proposal: fallen shade pods germinate only within the overlapping cool margins of two mature trees',
    },
    light: {
      mechanism: 'none',
      trigger: 'Proposal: intact root sectors combine ground pressure, voice vibration, heat, and transpiration changes associated with nearby emotion',
      signal: 'Proposal: the tree emits no light; fan leaves alter angle and density to deepen, soften, or open shade around the sensed group',
      cost: 'Proposal: responsive shade reduces photosynthesis in the active canopy sector and must be repaid by the connected root network',
      failureMode: 'Proposal: severing one root spoke makes its corresponding canopy sector permanently inert even while the rest of the tree continues responding',
    },
    covenant: {
      gift: 'Proposal: reshapes communal shade around emotional intensity without exposing or naming an individual',
      price: 'Proposal: each act of shelter reduces the active sector’s own energy gain',
      practice: 'Proposal: paths curve between root spokes, and gatherings leave any inert canopy sector empty',
      exploitationConsequence: 'Proposal: severing roots to force uniform shade creates dead canopy wedges and fractures the wider tree network',
    },
    relationships: [{ targetId: 'ECO-P08', relation: 'shelters', exchange: 'Proposal: responsive shade keeps paired Threadvine leaves unresolved until their fruit is mature', consequence: 'Proposal: an inert canopy sector can force a probability fruit to choose too early' }],
    storyHooks: ['One canopy sector stays inert above a celebration, revealing an old severed root', 'A connected grove opens a corridor of light for a grief no one has spoken'],
    sourceClaims: [{ claim: 'Sombraluz is a large Veldorian shade tree whose shade responds to emotion.', sourcePath: '.arcanea/lore/realms/veldoria.md' }],
    proposalMechanics: ['Eighteen-metre radial anatomy', 'Emotion-responsive shade network', 'Root-to-canopy sector mapping', 'Severed-root canopy inertia'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'An eighteen-metre tree shelters emotion through shade, while one severed root leaves a visible silence overhead',
      biology: 'Radial root spokes map directly to broad canopy sectors across a grafted tree network',
      lightBehavior: 'No emission or decorative glow; emotion-responsive leaf angle changes natural shade, while the severed-root sector remains rigid and unchanged',
      materialLanguage: 'charcoal fan leaves, smoke-silver veins, livingwood trunk, exposed severed root tissue',
      composition: {
        camera: 'Human-height wide portrait from beneath the eighteen-metre canopy',
        scaleCue: 'A small gathering beneath responsive leaves and one gardener beside the exposed severed root',
        focalAnchor: 'The sharp boundary between living adaptive shade and the inert canopy wedge',
        negativeSpace: 'A quiet sky opening beyond the dead sector',
      },
      emotion: 'Collective shelter marked by one irreparable silence',
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] Shade makes room for feeling. [SUBJECT] One eighteen-metre Sombraluz within a connected grove. [BIOLOGY] Radial root spokes map to matching charcoal canopy sectors; intact sectors angle their leaves to reshape natural shade around a gathering, while one severed root makes one canopy wedge completely inert. [LIGHT] No emitted glow. [COMPOSITION] Human-height wide view with the root-to-canopy failure visually legible.',
  }),
  'firstseed-of-shinkami': (entry) => ({
    ...entry,
    epithet: 'One world grows; nine are erased',
    role: 'proposal ten-form biome commitment seed',
    scale: 'A hand-sized seed whose selected form matures to the scale required by its biome',
    morphology: 'Proposal: a black-glass seed heart is wrapped by ten distinct potential germ layers, each carrying the anatomy for one possible biome-adapted form.',
    biology: {
      energySource: 'Proposal: the ten dormant layers share one finite endosperm reserve until germination begins',
      lifecycle: 'Proposal: local biome conditions select exactly one of 10 potential germ layers; the chosen layer unfolds while the other nine are enzymatically erased',
      propagation: 'Proposal: a mature Firstseed form can make one recombined seed, but no cutting, tissue sample, or daughter seed can clone the parent choice',
    },
    light: {
      mechanism: 'structural-color',
      trigger: 'Proposal: sustained contact with one coherent biome crosses the germination threshold',
      signal: 'Proposal: the chosen germ layer becomes optically distinct through structural colour while the other nine lose structure and disappear; no light is emitted',
      cost: 'Proposal: selection consumes every unchosen layer and makes all nine alternative forms permanently inaccessible',
      failureMode: 'Proposal: cloning or forcing multiple layers produces inert transparent tissue with no viable biome form',
    },
    covenant: {
      gift: 'Proposal: becomes one deeply adapted organism for the biome that actually receives it',
      price: 'Proposal: nine real potential lives are erased at the moment one form is chosen',
      practice: 'Proposal: stewards choose the planting place but never prescribe the resulting anatomy',
      exploitationConsequence: 'Proposal: attempts to clone a desirable form reduce every sample to sterile glass-like tissue',
    },
    relationships: [{ targetId: 'ECO-P01', relation: 'anchors', exchange: 'Proposal: a mineral-plain form can root through Stonegrass only after reading its living-to-pavement boundary', consequence: 'Proposal: a copied or preselected root plan hardens with the grass and dies' }],
    storyHooks: ['A Firstseed chooses a biome everyone believed dead', 'A cloned royal specimen becomes clear inert tissue on the eve of planting'],
    proposalMechanics: ['Ten potential germ layers', 'Single biome-selected form', 'Permanent erasure of nine alternatives', 'Biological anti-cloning constraint'],
    promptLanguage: {
      ...entry.promptLanguage,
      spark: 'One living world is chosen by permanently erasing nine equally possible bodies',
      biology: 'A black-glass seed holds ten visibly distinct potential germ layers; local biome contact unfolds exactly one and digests the remaining nine',
      lightBehavior: 'Structural colour identifies the selected layer without emission; the nine alternatives fade into transparent inert remnants',
      materialLanguage: 'black-glass seed heart, ten organic translucent germ membranes, one biome-specific living tissue',
      composition: {
        camera: 'Intimate macro cutaway grounded in the selected native biome',
        scaleCue: 'Soil grains and one steward fingertip outside the seed chamber',
        focalAnchor: 'The one germ layer breaking outward as nine distinct layers collapse behind it',
        negativeSpace: 'Quiet native habitat opening in the chosen direction',
      },
      emotion: 'Creation felt as irreversible responsibility',
    },
    visualPrompt: '[WORLD] Arcanea. [SPARK] One world grows; nine are erased. [SUBJECT] Firstseed of Shinkami. [BIOLOGY] A hand-sized black-glass seed contains ten distinct organic potential germ layers; one biome-adapted layer breaks outward while the other nine visibly collapse into inert transparent remnants. The selected form cannot be cloned. [LIGHT] Structural colour only, no crystal glow. [COMPOSITION] Botanical macro cutaway, biological rather than diagrammatic.',
    negativePrompt: `${entry.negativePrompt}, ten identical petals, cloning laboratory, decorative rainbow, sacred geometry interface`,
  }),
};

const heroSlugSet = new Set<string>(HERO_PLANT_SLUGS);

function isHeroPlantSlug(slug: string): slug is HeroPlantSlug {
  return heroSlugSet.has(slug);
}

function reconcileHeroPlant(entry: AtlasEntrySeed): AtlasEntrySeed {
  if (!isHeroPlantSlug(entry.slug)) return entry;
  const reconciled = HERO_MECHANISM_RECONCILIATIONS[entry.slug]?.(entry) ?? entry;
  return { ...reconciled, media: HERO_MEDIA_RECEIPTS[entry.slug] };
}

const heroOrder = new Map<string, number>(HERO_PLANT_SLUGS.map((slug, index) => [slug, index]));

const RECONCILED_ECOLOGY_SEEDS = RAW_ECOLOGY_ENTRIES.map(reconcileHeroPlant).sort((left, right) => {
  const leftOrder = heroOrder.get(left.slug) ?? Number.POSITIVE_INFINITY;
  const rightOrder = heroOrder.get(right.slug) ?? Number.POSITIVE_INFINITY;
  return leftOrder - rightOrder || left.id.localeCompare(right.id);
});

export const ECOLOGY_ENTRIES: AtlasEntryView[] = RECONCILED_ECOLOGY_SEEDS.map(toAtlasEntryView);
export const ECOLOGY_RECORDS = ECOLOGY_ENTRIES.map((entry) => entry.record);

export const ECOLOGY_BY_SLUG = new Map(ECOLOGY_ENTRIES.map((entry) => [entry.record.slug, entry]));
export const ECOLOGY_BY_ID = new Map(ECOLOGY_ENTRIES.map((entry) => [entry.record.id, entry]));

export function validateEcologyCatalog(entries: AtlasEntryView[] = ECOLOGY_ENTRIES): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const entry of entries) {
    const { record } = entry;
    if (ids.has(record.id)) errors.push(`Duplicate ecology id: ${record.id}`);
    if (slugs.has(record.slug)) errors.push(`Duplicate ecology slug: ${record.slug}`);
    ids.add(record.id);
    slugs.add(record.slug);
    if (record.canon.state !== 'proposal') errors.push(`${record.id} Wave 01 records must remain proposals`);
    if (record.provenance.sourceClaims.some((claim) => /\bproposal\b/i.test(claim.claim))) {
      errors.push(`${record.id} mixes proposal language into source claims`);
    }
    if (!record.provenance.proposalMechanics.length) errors.push(`${record.id} must identify its proposal mechanics`);
    const light = atlasLightContract(entry);
    if (record.radiance && (!light.trigger || !light.cost || !light.failureMode)) {
      errors.push(`${record.id} has decorative light without a complete biological contract`);
    }
    const validation = validateEcologyEntry(record, 'draft');
    for (const issue of validation.errors) {
      errors.push(`${record.id} ${issue.path} [${issue.code}]: ${issue.message}`);
    }
  }
  for (const entry of entries) {
    for (const relationship of entry.record.ecology.relationships) {
      if (!ids.has(relationship.targetId)) errors.push(`${entry.record.id} links to missing record ${relationship.targetId}`);
    }
  }
  for (const slug of HERO_PLANT_SLUGS) {
    const hero = entries.find((entry) => entry.record.slug === slug);
    if (!hero) errors.push(`Missing hero plant: ${slug}`);
    else if (!isAtlasVisualReady(hero)) errors.push(`${hero.record.id} must have staged or published media before entering the visual atlas`);
  }
  return errors;
}

const catalogErrors = validateEcologyCatalog();
if (catalogErrors.length) throw new Error(`Invalid ecology catalog:\n${catalogErrors.join('\n')}`);
