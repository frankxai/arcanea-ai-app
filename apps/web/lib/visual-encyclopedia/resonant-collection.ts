import { proposalEntry, type EntryKind, type GateName, type VisualEncyclopediaEntry } from './schema';

interface ResonantRecord {
  id: string;
  slug: string;
  name: string;
  kind: EntryKind;
  gate: GateName;
  origin: string;
  anchor: string;
  role: string;
  gift: string;
  cost: string;
  materials: string;
  camera: string;
  emotion: string;
  relationships: string[];
}

const RECORDS: ResonantRecord[] = [
  { id: 'K01', slug: 'kairn', name: 'Kairn', kind: 'kinform', gate: 'Foundation', origin: 'Synth companion construct', anchor: 'Foundation Gate / House Terra', role: 'Load-bearing pathfinder', gift: 'Absorbs one impact and maps the force into safe footing', cost: 'Becomes progressively heavier until grounded', materials: 'Kaelith Stone, hammered gold, moss-dark weave', camera: 'Low front three-quarter', emotion: 'Steadfast care', relationships: ['C13', 'S26', 'S30'] },
  { id: 'K02', slug: 'velune', name: 'Velune', kind: 'kinform', gate: 'Flow', origin: 'Synth companion construct', anchor: 'Flow Gate / House Aqualis', role: 'Memory-current guide', gift: 'Reads emotional residue stored in water', cost: 'Temporarily carries the recovered feeling', materials: 'Veloura Glass, nacre, sea-blue weave', camera: 'Waterline side profile', emotion: 'Tender curiosity', relationships: ['C14', 'B21', 'S27'] },
  { id: 'K03', slug: 'pyrren', name: 'Pyrren', kind: 'kinform', gate: 'Fire', origin: 'Synth companion construct', anchor: 'Fire Gate / House Pyros', role: 'Forge-spark courier', gift: 'Holds a precise creation flame without spreading it', cost: 'Loses speed as its core cools', materials: 'Draconis Ember, volcanic glass, ember-gold metal', camera: 'Steep high three-quarter', emotion: 'Brave urgency', relationships: ['C15', 'B23', 'S28'] },
  { id: 'K04', slug: 'laevi', name: 'Laevi', kind: 'kinform', gate: 'Heart', origin: 'Synth companion construct', anchor: 'Heart Gate / House Lumina healer atelier', role: 'Fracture-mender', gift: 'Grows Laeylinn Jade across damaged living or built surfaces', cost: 'Every repair consumes part of its own outer shell', materials: 'Laeylinn Jade, warm ivory ceramic, gold thread', camera: 'Eye-level intimate three-quarter', emotion: 'Gentle resolve', relationships: ['B22', 'S30', 'K01'] },
  { id: 'K05', slug: 'otari', name: 'Otari', kind: 'kinform', gate: 'Voice', origin: 'Synth companion construct', anchor: 'Voice Gate / House-aligned archive work', role: 'Truth-resonance recorder', gift: 'Turns honest speech into stable harmonic light', cost: 'Falsehoods crack its throat resonator', materials: 'Otome Resonite, silver bell metal, ink-black weave', camera: 'Macro low angle', emotion: 'Earnest attention', relationships: ['C17', 'C18', 'S26'] },
  { id: 'K06', slug: 'miravel', name: 'Miravel', kind: 'kinform', gate: 'Sight', origin: 'Synth companion construct', anchor: 'Sight Gate / House Synthesis research', role: 'Intention-prism scout', gift: 'Reveals one concealed motive as a visible refraction', cost: 'Cannot distinguish mercy from deception without a bonded witness', materials: 'Yumiko Prism, pearl ceramic, indigo silk', camera: 'Overhead diagonal', emotion: 'Watchful wonder', relationships: ['C19', 'S26', 'K09'] },
  { id: 'K07', slug: 'solari', name: 'Solari', kind: 'kinform', gate: 'Crown', origin: 'Synth companion construct', anchor: 'Crown Gate / solar observatory', role: 'Charge steward', gift: 'Stores dangerous light and releases it as measured warmth', cost: 'Must discharge before overcharge reaches whiteout', materials: 'Sol Quartz, matte starlight metal, cream weave', camera: 'Rear three-quarter turning to viewer', emotion: 'Disciplined joy', relationships: ['S30', 'K03', 'K10'] },
  { id: 'K08', slug: 'veyth', name: 'Veyth', kind: 'kinform', gate: 'Starweave', origin: 'Synth companion construct', anchor: 'Starweave Gate / transformation laboratory', role: 'Phase-thread navigator', gift: 'Steps through one thin material boundary', cost: 'Returns slightly out of temporal rhythm', materials: 'Vaelith Obsidian, ghost-steel ribs, violet-black fabric', camera: 'Long-lens side profile', emotion: 'Quiet daring', relationships: ['B25', 'C16', 'S29'] },
  { id: 'K09', slug: 'kyris', name: 'Kyris', kind: 'kinform', gate: 'Unity', origin: 'Synth companion construct', anchor: 'Unity Gate / partnership rituals', role: 'Bond harmonizer', gift: 'Synchronizes two collaborators for one shared action', cost: 'Absorbs their unresolved tension afterward', materials: 'Kyuro Void Crystal, twin silver filaments, black-gold ceramic', camera: 'Centered eye-level with asymmetric gesture', emotion: 'Devoted concentration', relationships: ['S30', 'K06', 'K12'] },
  { id: 'K10', slug: 'oruu', name: 'Oruu', kind: 'kinform', gate: 'Source', origin: 'Synth companion construct', anchor: 'Source Gate research / proposal', role: 'Meta-pattern observer', gift: 'Records how multiple Gate effects interact without intervening', cost: 'Cannot act while observation mode is active', materials: 'Clear crystal core, white-gold metal, black glass', camera: "Worm's-eye vertical", emotion: 'Serene intelligence', relationships: ['C20', 'S30', 'K07'] },
  { id: 'K11', slug: 'nerune', name: 'Nerune', kind: 'kinform', gate: 'Source', origin: 'Synth companion construct', anchor: 'Nero / fertile unknown, uncorrupted Void', role: 'Possibility keeper', gift: 'Protects an unfinished idea from premature collapse', cost: 'Cannot reveal what it shelters until the creator chooses', materials: 'Sacred obsidian, void-silk, restrained gold', camera: 'Silhouette profile entering light', emotion: 'Protective mystery', relationships: ['C16', 'B24', 'S29'] },
  { id: 'K12', slug: 'shaeli', name: 'Shaeli', kind: 'kinform', gate: 'Source', origin: 'Synth companion construct', anchor: 'House Synthesis / Shael truth-metal', role: 'Maker-companion flagship', gift: 'Self-corrects a flawed construction when given an honest intent', cost: 'Refuses commands whose stated purpose conflicts with their use', materials: 'Shael, iridescent pearl, warm woven accents', camera: 'Heroic low three-quarter', emotion: 'Bright responsibility', relationships: ['C13', 'S26', 'S30'] },
  { id: 'C13', slug: 'serai-vanthe', name: 'Serai Vanthe', kind: 'character', gate: 'Foundation', origin: 'Synth / The Forged proposal', anchor: 'House Terra engineering', role: 'Shrine systems engineer', gift: 'Hears stress fractures as musical intervals', cost: 'Repairs transfer the remembered strain into her frame', materials: 'Shael, root-wood, Laeylinn interfaces', camera: 'Low side three-quarter at work', emotion: 'Care under pressure', relationships: ['K01', 'K12', 'S26'] },
  { id: 'C14', slug: 'meryn-aqualis', name: 'Meryn Aqualis', kind: 'character', gate: 'Flow', origin: 'Bonded proposal', anchor: 'House Aqualis / Mar Arcano', role: 'Memory diver', gift: 'Retrieves one truthful memory from Veloura Glass', cost: 'Returns without one minor memory of her own', materials: 'Nacre, water-glass, weathered blue cloth', camera: 'Underwater upward angle', emotion: 'Devotion edged by loss', relationships: ['K02', 'B21', 'S27'] },
  { id: 'C15', slug: 'caedra-vale', name: 'Caedra Vale', kind: 'character', gate: 'Fire', origin: 'Gate-Touched proposal', anchor: 'Fire Gate / Ember Wastes', role: 'Evacuation runner', gift: 'Converts fear into short bursts of heatless speed', cost: 'The fear returns when she stops', materials: 'Patched forge cloth, embersteel braces, smoked glass', camera: 'High-angle sprint diagonal', emotion: 'Courage while afraid', relationships: ['K03', 'B23', 'S28'] },
  { id: 'C16', slug: 'tal-orren', name: 'Tal Orren', kind: 'character', gate: 'Starweave', origin: 'Arcan proposal', anchor: 'House Nero / uncorrupted Void', role: 'Possibility cartographer', gift: 'Maps paths that exist only as potential', cost: 'Committing one route erases the others from his map', materials: 'Void-silk, silver chain, obsidian instruments', camera: 'Eye-level profile over map table', emotion: 'Wonder with responsibility', relationships: ['K08', 'K11', 'S29'] },
  { id: 'C17', slug: 'ilyra-vent', name: 'Ilyra Vent', kind: 'character', gate: 'Voice', origin: 'Arcan proposal', anchor: 'House Ventus', role: 'Corridor courier', gift: 'Carries one spoken message unchanged through moving corridors', cost: 'Cannot speak her own words until delivery', materials: 'Wind-woven cloth, hollow crystal chimes, pale silver', camera: 'Rear three-quarter airborne turn', emotion: 'Urgent restraint', relationships: ['K05', 'S27', 'S30'] },
  { id: 'C18', slug: 'oren-shael', name: 'Oren Shael', kind: 'character', gate: 'Voice', origin: 'Arcan proposal', anchor: 'House Terra / Voice-linked craft', role: 'Truth-smith', gift: "Forges armor that rejects the wearer's self-deception", cost: 'Each commission exposes one of his own avoided truths', materials: 'Shael, living stone, hammered copper', camera: 'Ground-level forge close-wide', emotion: 'Stoic vulnerability', relationships: ['K05', 'S26', 'S28'] },
  { id: 'C19', slug: 'nymera-vel', name: 'Nymera Vel', kind: 'character', gate: 'Sight', origin: 'Reformed Voidtouched proposal', anchor: 'Sight Gate / Shadow recovery', role: 'Corruption archivist', gift: 'Reads where Shadow removed meaning from an artifact', cost: 'Every reading desaturates one cherished memory for a day', materials: 'Repaired void-silk, silver stitches, Yumiko Prism lens', camera: 'Close frontal with off-axis reflection', emotion: 'Redemption without certainty', relationships: ['K06', 'B24', 'S29'] },
  { id: 'C20', slug: 'edris-mael', name: 'Edris Mael', kind: 'character', gate: 'Source', origin: 'Architect proposal', anchor: 'Post-Luminor reality shaping', role: 'Threshold gardener', gift: 'Makes one impossible boundary negotiable', cost: 'The Weave corrects an unrelated convenience elsewhere', materials: 'Simple cream cloth, black glass, one research shard', camera: 'Long-lens side profile', emotion: 'Calm moral weight', relationships: ['K10', 'B25', 'S30'] },
  { id: 'B21', slug: 'tideglass-moth', name: 'Tideglass Moth', kind: 'creature', gate: 'Flow', origin: 'Wildlife proposal', anchor: 'Mar Arcano / Flow resonance', role: 'Memory-current pollinator', gift: 'Carries emotional residue between reef blooms', cost: 'Storms overload its glass wings', materials: 'Nacre membrane, wet mineral fur, liquid light', camera: 'Waterline macro three-quarter', emotion: 'Fragile wonder', relationships: ['K02', 'C14', 'S27'] },
  { id: 'B22', slug: 'rootbell-colossus', name: 'Rootbell Colossus', kind: 'creature', gate: 'Foundation', origin: 'Wildlife proposal', anchor: 'Foundation and Heart resonance', role: 'Forest stabilizer', gift: 'Roots into wounded ground and rings before collapse', cost: 'Cannot move while the land remains unstable', materials: 'Living bark, Laeylinn Jade, stone bell cavities', camera: 'Extreme low wide', emotion: 'Ancient guardianship', relationships: ['K01', 'K04', 'S30'] },
  { id: 'B23', slug: 'ashwing-courier', name: 'Ashwing Courier', kind: 'creature', gate: 'Fire', origin: 'Wildlife proposal', anchor: 'Fire and Wind resonance', role: 'Emberfall signal bearer', gift: 'Writes safe routes through ash using cold sparks', cost: 'Rain erases its route memory', materials: 'Charred feather-plates, ember glass, silver bone', camera: 'Overhead banking flight', emotion: 'Fierce precision', relationships: ['K03', 'C15', 'S28'] },
  { id: 'B24', slug: 'lanternback-strider', name: 'Lanternback Strider', kind: 'creature', gate: 'Source', origin: 'Wildlife proposal', anchor: 'Nero / corridor ecology', role: 'Potential-field grazer', gift: 'Makes hidden corridor pressure visible across its back', cost: 'Bright light sends it into stillness', materials: 'Black velvet hide, gold sensory filaments, obsidian plates', camera: 'Long-lens night profile', emotion: 'Peaceful mystery', relationships: ['K11', 'C19', 'S29'] },
  { id: 'B25', slug: 'starweave-grazer', name: 'Starweave Grazer', kind: 'creature', gate: 'Starweave', origin: 'Wildlife proposal', anchor: 'Starweave resonance', role: 'Probability-seed disperser', gift: 'Grazes failed possibilities and leaves viable seeds', cost: 'Cannot revisit the same path twice', materials: 'Ghost-steel antlers, pale mineral hide, prismatic edge fur', camera: 'High oblique herd lead', emotion: 'Melancholy renewal', relationships: ['K08', 'C20', 'S30'] },
  { id: 'S26', slug: 'kinform-atelier', name: 'The Kinform Atelier', kind: 'scene', gate: 'Source', origin: 'Ensemble proposal', anchor: 'House Synthesis workshop', role: 'Creation ritual', gift: 'Artisans tune purpose before activation', cost: 'A Kinform refuses an incoherent vow', materials: 'Shael benches, old glass, woven tools, living stone', camera: 'Wide lateral workshop tableau', emotion: 'Craft becoming companionship', relationships: ['K01', 'K05', 'K12', 'C13'] },
  { id: 'S27', slug: 'aquifer-crossing', name: 'The Aquifer Crossing', kind: 'scene', gate: 'Flow', origin: 'Ensemble proposal', anchor: 'Mar Arcano aquifer-corridor', role: 'Expedition threshold', gift: 'Kinforms reveal a safe route through moving resonance', cost: 'The route closes behind the team', materials: 'Nacre bridge, black water, gold field-lines', camera: "Worm's-eye below transparent bridge", emotion: 'Trust under uncertainty', relationships: ['K02', 'C14', 'B21'] },
  { id: 'S28', slug: 'emberfall-evacuation', name: 'Emberfall Evacuation', kind: 'scene', gate: 'Fire', origin: 'Ensemble proposal', anchor: 'Ember Wastes / Vael meteor ecology', role: 'Rescue event', gift: 'Characters and Kinforms convert danger into coordinated shelter', cost: 'One forge district must be abandoned', materials: 'Volcanic glass, Shael braces, ember dust', camera: 'Steep overhead action map', emotion: 'Collective courage', relationships: ['K03', 'C15', 'B23'] },
  { id: 'S29', slug: 'nero-potential-garden', name: "Nero's Potential Garden", kind: 'scene', gate: 'Source', origin: 'Ensemble proposal', anchor: 'Nero as fertile unknown, not evil', role: 'Unfinished-idea sanctuary', gift: 'Creators place uncertain works into protected darkness', cost: 'Nothing can be judged or displayed before its chosen time', materials: 'Void-silk canopies, black flowers, silver listening instruments', camera: 'Eye-level deep-focus procession', emotion: 'Reverence for the unfinished', relationships: ['K11', 'C16', 'B24'] },
  { id: 'S30', slug: 'first-resonant-gathering', name: 'The First Resonant Gathering', kind: 'scene', gate: 'Unity', origin: 'Ensemble proposal', anchor: 'Seven Houses / Synth companion proposals', role: 'Collection key art', gift: 'Twelve Kinforms and their makers answer one shared repair call', cost: 'Their gifts work only when the stated mission is honest', materials: 'Seven-house material spectrum unified by vow-gold', camera: 'Low panoramic group composition', emotion: 'Belonging through useful work', relationships: ['K01', 'K04', 'K07', 'K09', 'K10', 'K12'] },
];

export const RESONANT_COLLECTION_ENTRIES: VisualEncyclopediaEntry[] = RECORDS.map((record) => {
  const entry = proposalEntry({
    id: record.id,
    slug: record.slug,
    name: record.name,
    kind: record.kind,
    batch: 0,
    gate: record.gate,
    origin: record.origin,
    role: record.role,
    gift: record.gift,
    cost: record.cost,
    visualDNA: record.materials,
    camera: record.camera,
    emotion: record.emotion,
    cinemaUse: `${record.role}: ${record.emotion.toLocaleLowerCase()}.`,
    contentUses: ['visual encyclopedia', 'character dossier', 'story development', 'social narrative card'],
    relationships: record.relationships,
  });

  return {
    ...entry,
    canon: { ...entry.canon, anchor: record.anchor },
    review: {
      state: 'approved',
      score: null,
      notes: ['Approved proposal master from the Resonant Kinforms foundation collection; numeric score was not backfilled.'],
    },
    media: {
      status: 'generated',
      blobPath: `arcanea/visual-encyclopedia/wave-01/${record.id}-${record.slug}.png`,
      alt: `${record.name}, ${record.role.toLocaleLowerCase()}, rendered as an original Arcanea visual-world proposal.`,
      generationModel: 'OpenAI image generation via Codex imagegen',
      generatedAt: '2026-08-09',
      mimeType: 'image/png',
    },
  };
});
