export class WorldService {
  buildCharacterPrompt(params: { name?: string; role?: string; element?: string; backstory?: string }): string {
    const lines = [
      'Create a detailed character sheet for a fantasy world:',
      '',
      params.name ? `Name: ${params.name}` : 'Name: [Generate a unique name]',
      params.role ? `Role: ${params.role}` : 'Role: [Suggest a compelling role]',
      params.element ? `Element: ${params.element}` : 'Element: [Choose from Fire, Water, Earth, Wind, Void/Spirit]',
      '',
      'Include:',
      '- Physical appearance and distinguishing features',
      '- Personality traits and motivations',
      '- Abilities tied to their element',
      '- A defining moment from their past',
      '- Relationships and allegiances',
      '- A secret or hidden depth',
    ];
    if (params.backstory) {
      lines.push('', `Context: ${params.backstory}`);
    }
    return lines.join('\n');
  }

  buildRealmPrompt(params: { name?: string; element?: string; terrain?: string; culture?: string }): string {
    const lines = [
      'Design a realm card for a fantasy world:',
      '',
      params.name ? `Realm: ${params.name}` : 'Realm: [Generate a unique name]',
      params.element ? `Dominant Element: ${params.element}` : 'Dominant Element: [Choose one]',
      params.terrain ? `Terrain: ${params.terrain}` : 'Terrain: [Describe the landscape]',
      '',
      'Include:',
      '- Geography and climate',
      '- Flora and fauna unique to this realm',
      '- Major settlements or landmarks',
      '- Cultural practices and traditions',
      '- Political structure or governance',
      '- Magical phenomena specific to this realm',
      '- Threats or challenges inhabitants face',
    ];
    if (params.culture) {
      lines.push('', `Cultural inspiration: ${params.culture}`);
    }
    return lines.join('\n');
  }

  buildArtifactPrompt(params: { name?: string; type?: string; power?: string; origin?: string }): string {
    const lines = [
      'Create a legendary artifact specification:',
      '',
      params.name ? `Artifact: ${params.name}` : 'Artifact: [Generate a mythic name]',
      params.type ? `Type: ${params.type}` : 'Type: [Weapon, Armor, Relic, Tool, Tome, etc.]',
      '',
      'Include:',
      '- Physical description and materials',
      '- Primary power or ability',
      '- Secondary effects or drawbacks',
      '- Origin story — who created it and why',
      '- Current location or bearer',
      '- Activation conditions or requirements',
      '- Lore significance in the world',
    ];
    if (params.power) {
      lines.push('', `Intended power: ${params.power}`);
    }
    if (params.origin) {
      lines.push(`Origin context: ${params.origin}`);
    }
    return lines.join('\n');
  }

  buildScenePrompt(params: { setting?: string; characters?: string; conflict?: string; mood?: string }): string {
    const lines = [
      'Write a vivid scene for a fantasy narrative:',
      '',
    ];
    if (params.setting) { lines.push(`Setting: ${params.setting}`); }
    if (params.characters) { lines.push(`Characters: ${params.characters}`); }
    if (params.conflict) { lines.push(`Conflict: ${params.conflict}`); }
    if (params.mood) { lines.push(`Mood: ${params.mood}`); }
    lines.push(
      '',
      'Guidelines:',
      '- Open with sensory immersion (sight, sound, smell)',
      '- Show character through action and dialogue',
      '- Build tension through the conflict',
      '- End with a hook or revelation',
      '- Use elevated but accessible prose',
      '- 500-800 words',
    );
    return lines.join('\n');
  }

  buildImagePrompt(guardian: { element: string; name: string } | string, subject: string): string {
    const elementColors: Record<string, string> = {
      fire: 'deep crimson and molten gold',
      water: 'sapphire blue and silver',
      earth: 'emerald green and amber',
      wind: 'pearl white and silver',
      void: 'obsidian black and starlight purple',
      spirit: 'radiant gold and celestial white',
    };

    const element = typeof guardian === 'string' ? guardian.toLowerCase() : guardian.element.toLowerCase();
    const palette = elementColors[element] || 'mystical cyan and deep blue';

    return [
      `${subject}, fantasy art style`,
      `color palette: ${palette}`,
      'dramatic lighting, volumetric atmosphere',
      'highly detailed, 8k resolution',
      'trending on ArtStation, concept art',
      'epic fantasy, magical realism',
    ].join(', ');
  }
}
