import type { ComponentType } from 'react';
import {
  Fire, Drop, Mountains, Wind, Circle, Sparkle, Sword, Shield,
} from '@/lib/phosphor-icons';
import type { Element, Discipline } from '@/lib/magic-system';

type IconCmp = ComponentType<Record<string, unknown>>;

export const ELEMENT_ICONS: Record<Element, IconCmp> = {
  fire: Fire,
  water: Drop,
  earth: Mountains,
  wind: Wind,
  void: Circle,
  spirit: Sparkle,
};

export const DISCIPLINE_ICONS: Record<Discipline, IconCmp> = {
  attack: Sword,
  defense: Shield,
  summoning: Sparkle,
};
