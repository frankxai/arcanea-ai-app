import type { CalliopeAgent, VoiceProfile } from '../types/pantheon';

export class Calliope implements CalliopeAgent {
  id = 'calliope';
  name = 'Calliope';
  role = 'Dialogue and Voice Agent';
  description = 'Handles generation and evaluation of character dialogue and stylistic consistency.';

  async generateDialogue(characters: string[], context: string, profiles?: VoiceProfile[]): Promise<string> {
    if (characters.length === 0) {
      return '';
    }

    // Standard character dialogue mapping based on profiles or defaults
    let script = '';
    const charA = characters[0];
    const charB = characters[1] || 'Mera';

    const getProfileOrDefault = (name: string): VoiceProfile => {
      const found = profiles?.find(p => p.characterName.toLowerCase() === name.toLowerCase());
      if (found) return found;

      if (name.toLowerCase() === 'ariona') {
        return {
          characterName: 'Ariona',
          tone: 'determined but haunted',
          vocabulary: ['storm', 'crest', 'ashes', 'truth', 'burned'],
          speechPatterns: ['Short sentences when tense', 'Addresses people by name']
        };
      }
      return {
        characterName: name,
        tone: 'calm and structured',
        vocabulary: ['scroll', 'athenaeum', 'focus', 'flow'],
        speechPatterns: ['Precise syntax', 'Ends with questions']
      };
    };

    const profA = getProfileOrDefault(charA);
    const profB = getProfileOrDefault(charB);

    script += `[Context: ${context}]\n\n`;
    script += `${charA} (${profA.tone}): "The fires that burned the village... they aren't just ash. There is a storm in my blood, a crest of lightning I can't control yet."\n\n`;
    script += `${charB} (${profB.tone}): "You are looking in the wrong place for control. Mastery isn't holding the lightning back, it is directing the flow. Let's find the manuscripts in the Abyssal Athenaeum."\n\n`;
    script += `${charA}: "And if the guardians wake?"\n\n`;
    script += `${charB}: "Then we flow past them."`;

    return script;
  }

  async checkVoiceConsistency(text: string, voiceSpec: string): Promise<{ score: number; suggestions: string[] }> {
    const suggestions: string[] = [];
    let score = 1.0;

    const lowerText = text.toLowerCase();
    const lowerSpec = voiceSpec.toLowerCase();

    // Perform alignment checks based on terms or indicators
    if (lowerSpec.includes('ariona')) {
      // Ariona should sound determined. If she sounds overly submissive or weak, flag it
      if (lowerText.includes('i cannot') || lowerText.includes('i am too weak')) {
        score -= 0.2;
        suggestions.push("Modify Ariona's line to be more self-reliant or determined, avoiding passive victim phrases.");
      }
      // Check for key vocabulary terms
      if (!lowerText.includes('storm') && !lowerText.includes('crest') && !lowerText.includes('truth')) {
        score -= 0.1;
        suggestions.push("Consider adding elemental storm or truth associations to align with Ariona's background.");
      }
    }

    if (lowerSpec.includes('mera')) {
      // Mera is an Atlantean/Water school student, should talk about flow, Athenaeum, etc.
      if (!lowerText.includes('flow') && !lowerText.includes('athenaeum') && !lowerText.includes('depths')) {
        score -= 0.1;
        suggestions.push("Mera's language could benefit from fluid metaphors (flow, waves, deep, tide).");
      }
    }

    return {
      score: Math.max(0.1, parseFloat(score.toFixed(2))),
      suggestions
    };
  }
}
