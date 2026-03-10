export type Element = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void';

export interface CompanionArchetype {
  id: string;
  name: string;
  description: string;
  element: Element;
  personality: string[];
  visualStyle: string;
  baseColor: string;
  glowColor: string;
  icon: string;
  tier: 'common' | 'rare' | 'legendary';
}

export interface CreatorCompanion {
  id: string;
  creatorId: string;
  name: string;
  archetypeId: string;
  element: Element;
  personality: string[];
  imageUrl: string | null;
  level: number;
  xp: number;
  bondStrength: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanionForgeState {
  selectedArchetype: CompanionArchetype | null;
  customName: string;
  customElement: Element | null;
  customPersonality: string[];
  isVisualizing: boolean;
  generatedImageUrl: string | null;
}
