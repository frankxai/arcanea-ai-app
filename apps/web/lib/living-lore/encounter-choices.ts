/**
 * Encounter Choices — Predefined story choices for Living Lore encounters.
 *
 * Each encounter can have pre-chat and post-chat choices that affect
 * crew bonds and shape the narrative context for the AI conversation.
 */

import type { StoryChoice } from './types';

export const ENCOUNTER_CHOICES: Record<string, StoryChoice[]> = {
  'assembly-campfire': [
    {
      id: 'campfire-seat',
      encounterId: 'assembly-campfire',
      prompt: 'The fire crackles. There are spaces around it. Where do you sit?',
      options: [
        {
          id: 'beside-ren',
          label: 'Beside Ren, who is sketching nervously',
          crewMemberId: 'crew-ren',
          bondEffect: [{ memberId: 'crew-ren', change: 5 }],
        },
        {
          id: 'beside-kaedra',
          label: 'Beside Kaedra, who is sharpening a blade',
          crewMemberId: 'crew-kaedra',
          bondEffect: [{ memberId: 'crew-kaedra', change: 5 }],
        },
        {
          id: 'beside-axiom',
          label: 'Beside Axiom, who watches the flames in perfect stillness',
          crewMemberId: 'crew-axiom',
          bondEffect: [{ memberId: 'crew-axiom', change: 5 }],
        },
        {
          id: 'across-thalien',
          label: 'Across from Thalien, meeting his ancient gaze',
          crewMemberId: 'crew-thalien',
          bondEffect: [{ memberId: 'crew-thalien', change: 5 }],
        },
      ],
      consequence: 'Your first connection shapes the journey ahead.',
    },
    {
      id: 'campfire-question',
      encounterId: 'assembly-campfire',
      prompt: 'The silence grows heavy. Someone should speak. What do you ask?',
      options: [
        {
          id: 'ask-why',
          label: '"Why were we chosen?"',
          description: 'The practical question.',
        },
        {
          id: 'ask-afraid',
          label: '"Is anyone else afraid?"',
          description: 'The honest question.',
        },
        {
          id: 'ask-malachar',
          label: '"What do you know about Malachar?"',
          description: 'The dangerous question.',
        },
        {
          id: 'say-nothing',
          label: 'Say nothing. Listen.',
          description: 'Sometimes silence says more.',
        },
      ],
      consequence: 'What you ask reveals who you are.',
    },
  ],
  'thaliens-confession': [
    {
      id: 'thalien-response',
      encounterId: 'thaliens-confession',
      prompt:
        'Thalien finishes speaking. Five Ages of guilt hang in the air. How do you respond?',
      options: [
        {
          id: 'comfort',
          label: '"You couldn\'t have known."',
          bondEffect: [{ memberId: 'crew-thalien', change: 8 }],
        },
        {
          id: 'challenge',
          label: '"But you did know. And you said nothing."',
          bondEffect: [
            { memberId: 'crew-thalien', change: -3 },
            { memberId: 'crew-kaedra', change: 5 },
          ],
        },
        {
          id: 'relate',
          label: '"I\'ve failed too. That\'s why I came back."',
          bondEffect: [
            { memberId: 'crew-thalien', change: 5 },
            { memberId: 'crew-ren', change: 3 },
          ],
        },
        {
          id: 'ask-axiom',
          label: 'Turn to Axiom: "What do you think?"',
          bondEffect: [{ memberId: 'crew-axiom', change: 5 }],
        },
      ],
      consequence: 'How you handle truth shapes how the crew trusts you.',
    },
  ],
  'rens-sketchbook': [
    {
      id: 'ren-art',
      encounterId: 'rens-sketchbook',
      prompt:
        'Ren holds the burned sketchbook. His art just saved everyone. He looks lost.',
      options: [
        {
          id: 'praise',
          label: '"That was incredible. You saved us."',
          bondEffect: [{ memberId: 'crew-ren', change: 8 }],
        },
        {
          id: 'practical',
          label: '"Can you do it again? On purpose?"',
          bondEffect: [
            { memberId: 'crew-kaedra', change: 5 },
            { memberId: 'crew-ren', change: 2 },
          ],
        },
        {
          id: 'empathize',
          label: '"Are you okay? Your hands..."',
          bondEffect: [
            { memberId: 'crew-ren', change: 6 },
            { memberId: 'crew-vesper', change: 3 },
          ],
        },
        {
          id: 'draw-together',
          label: '"Show me. I want to understand what you see."',
          bondEffect: [{ memberId: 'crew-ren', change: 10 }],
        },
      ],
      consequence: 'How you treat a creator in their most vulnerable moment.',
    },
  ],
};

/**
 * Get pre-chat choices for an encounter (presented before "Enter the Scene").
 * Convention: the first choice in the array is the pre-chat choice.
 */
export function getPreChatChoices(encounterId: string): StoryChoice[] {
  const choices = ENCOUNTER_CHOICES[encounterId];
  if (!choices || choices.length === 0) return [];
  return [choices[0]];
}

/**
 * Get post-chat choices for an encounter (presented after AI chat concludes).
 * Convention: all choices after the first are post-chat choices.
 */
export function getPostChatChoices(encounterId: string): StoryChoice[] {
  const choices = ENCOUNTER_CHOICES[encounterId];
  if (!choices || choices.length <= 1) return [];
  return choices.slice(1);
}
