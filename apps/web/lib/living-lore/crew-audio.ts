/**
 * Living Lore — Audio & Music Layer
 *
 * Each Gate has a canonical frequency. Each crew member has an element
 * that maps to a sonic palette. This file defines the audio identity
 * for the Living Lore experience.
 *
 * Future: integrate with Suno for AI-generated crew themes,
 * gate ambient tracks, and encounter soundscapes.
 */

// Gate frequencies from the canonical Ten Gates
export const GATE_FREQUENCIES: Record<number, { hz: number; name: string; note: string; mood: string }> = {
  1:  { hz: 174, name: 'Foundation', note: 'F3',  mood: 'Deep, grounding, primal. The heartbeat of stone.' },
  2:  { hz: 285, name: 'Flow',       note: 'C#4', mood: 'Fluid, shimmering, emotional. Water over smooth rock.' },
  3:  { hz: 396, name: 'Fire',       note: 'G4',  mood: 'Driving, intense, transformative. Drums and forge-heat.' },
  4:  { hz: 417, name: 'Heart',      note: 'G#4', mood: 'Warm, aching, healing. Strings and breath.' },
  5:  { hz: 528, name: 'Voice',      note: 'C5',  mood: 'Clear, resonant, truthful. A single pure tone.' },
  6:  { hz: 639, name: 'Sight',      note: 'D#5', mood: 'Ethereal, layered, prophetic. Overtones and whispers.' },
  7:  { hz: 741, name: 'Crown',      note: 'F#5', mood: 'Transcendent, minimal, vast. Silence between notes.' },
  8:  { hz: 852, name: 'Starweave',  note: 'G#5', mood: 'Cosmic, shifting, vertiginous. Multiple keys at once.' },
  9:  { hz: 963, name: 'Unity',      note: 'B5',  mood: 'Harmonic, convergent, complete. All instruments together.' },
  10: { hz: 1111, name: 'Source',    note: 'C#6', mood: 'Beyond music. The frequency of awareness itself.' },
};

// Crew member sonic identities — for Suno prompt generation
export const CREW_THEMES: Record<string, {
  instrument: string;
  genre: string;
  mood: string;
  tempo: string;
  sunoPrompt: string;
}> = {
  'crew-ren': {
    instrument: 'Pencil scratching as percussion, acoustic guitar, humming',
    genre: 'Lo-fi acoustic, indie folk',
    mood: 'Uncertain but hopeful, questioning, quietly determined',
    tempo: '85 BPM — walking pace',
    sunoPrompt: 'Lo-fi acoustic indie folk, pencil scratching rhythm, soft acoustic guitar, male humming melody, uncertain but hopeful, 85 BPM, warm intimate recording, fantasy setting',
  },
  'crew-vesper': {
    instrument: 'Synthesizer pads, glass harmonica, celestial choir',
    genre: 'Ambient electronic, ethereal',
    mood: 'Vast, fragmented, hauntingly beautiful, memories dissolving',
    tempo: '60 BPM — breathing pace',
    sunoPrompt: 'Ethereal ambient electronic, glass harmonica, celestial choir pads, fragmented melody that repeats then breaks apart, vast and haunting, 60 BPM, space-like reverb',
  },
  'crew-kaedra': {
    instrument: 'Industrial percussion, distorted cello, war drums',
    genre: 'Dark cinematic, industrial fantasy',
    mood: 'Tense, controlled fury, precision masking pain',
    tempo: '120 BPM — combat pace',
    sunoPrompt: 'Dark cinematic industrial, war drums, distorted cello, metallic percussion, tense and precise, controlled fury, 120 BPM, epic battle atmosphere',
  },
  'crew-thalien': {
    instrument: 'Ancient lyre, flowing water sounds, low woodwinds',
    genre: 'Classical ancient, world music',
    mood: 'Sorrowful, wise, weighted with centuries, oceanic depth',
    tempo: '50 BPM — deep tide pace',
    sunoPrompt: 'Ancient classical, lyre melody, flowing water ambience, low woodwinds, sorrowful and wise, oceanic depth, 50 BPM, timeless and melancholic',
  },
  'crew-axiom': {
    instrument: 'Stone resonance, crystal bowls, deep bass drone',
    genre: 'Minimal ambient, drone',
    mood: 'Still, wondering, vast inner space awakening slowly',
    tempo: '40 BPM — geological pace',
    sunoPrompt: 'Minimal ambient drone, crystal singing bowls, deep bass resonance, stone and mineral textures, vast stillness slowly awakening, 40 BPM, meditative and monumental',
  },
  'crew-solenne': {
    instrument: 'Full orchestra crescendo, cosmic harp, stellar wind',
    genre: 'Neo-classical, cosmic orchestral',
    mood: 'Grand then awkward, divine trying to be human, magnificent vulnerability',
    tempo: '70 BPM — celestial waltz',
    sunoPrompt: 'Neo-classical cosmic orchestral, sweeping harp, stellar wind textures, grand crescendo that stumbles into gentle piano, magnificent vulnerability, 70 BPM',
  },
  'crew-jinx': {
    instrument: 'Glitched samples, music box fragments, trickster flute',
    genre: 'Glitch-hop, playful experimental',
    mood: 'Chaotic, mischievous, accidentally profound',
    tempo: '140 BPM — manic, shifting time signatures',
    sunoPrompt: 'Experimental glitch-hop, broken music box, trickster pan flute, chaotic samples, mischievous and playful with sudden moments of clarity, 140 BPM, shifting time signatures',
  },
};

// Encounter ambient soundscape descriptions
export const ENCOUNTER_AMBIENCE: Record<string, string> = {
  'assembly-campfire': 'Crackling fire, distant wind through broken towers, night insects, occasional stone settling. The Foundation Gate hums at 174 Hz beneath everything.',
  'thaliens-confession': 'Rain beginning on stone, the acoustic of a roofless lecture hall, Thalien\'s voice echoing slightly. Water dripping through cracks.',
  'rens-sketchbook': 'Morning quiet after battle. Birds returning tentatively. The ward-dome residual hum fading. Pencil on paper.',
};

// Generate a Suno prompt for a specific Gate's ambient track
export function getGateAmbientPrompt(gateNumber: number): string {
  const gate = GATE_FREQUENCIES[gateNumber];
  if (!gate) return '';

  return `Ambient meditation music, ${gate.hz}Hz base frequency, ${gate.mood.toLowerCase()}, ${gate.name} Gate theme, Arcanea fantasy world, no lyrics, continuous atmospheric, ${gate.note} root note`;
}

// Generate a combined crew + gate theme prompt
export function getEncounterMusicPrompt(gateNumber: number, crewMemberIds: string[]): string {
  const gate = GATE_FREQUENCIES[gateNumber];
  const themes = crewMemberIds
    .map(id => CREW_THEMES[id])
    .filter(Boolean)
    .map(t => t.instrument)
    .join(', ');

  return `Cinematic fantasy soundtrack, ${gate?.hz ?? 174}Hz undertone, featuring ${themes}, ${gate?.mood ?? 'epic and mysterious'}, ensemble piece, Arcanea Living Lore`;
}
