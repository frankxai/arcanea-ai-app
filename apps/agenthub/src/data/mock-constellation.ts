import { type SkillNode, type Element, type GateName } from '@arcanea/core';

export interface ConstellationNode extends SkillNode {
  position: [number, number, number];
}

// Helper to generate coordinates in a cluster
function generateCluster(center: [number, number, number], radius: number, count: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = center[0] + r * Math.sin(phi) * Math.cos(theta);
    const y = center[1] + r * Math.sin(phi) * Math.sin(theta);
    const z = center[2] + r * Math.cos(phi);
    points.push([x, y, z]);
  }
  return points;
}

const firePoints = generateCluster([-10, 5, -5], 8, 8);
const waterPoints = generateCluster([10, -5, -5], 8, 8);
const earthPoints = generateCluster([-5, -10, 5], 8, 8);
const windPoints = generateCluster([5, 10, 5], 8, 8);
const voidPoints = generateCluster([0, 0, 0], 4, 8);

function createMockNode(id: string, name: string, element: Element, gate: GateName, pos: [number, number, number], prerequisites: string[] = []): ConstellationNode {
  return {
    id,
    name,
    element,
    gate,
    agent: { id: `agent-${id}`, name: `${name} Agent` },
    level: Math.floor(Math.random() * 100),
    xp: Math.floor(Math.random() * 10000),
    rank: 'adept',
    prerequisites: prerequisites.map(p => ({ id: p })),
    unlocks: [],
    perks: [],
    xpSources: [],
    invocations: Math.floor(Math.random() * 500),
    successRate: 0.85 + Math.random() * 0.14,
    lastUsed: new Date().toISOString(),
    position: pos,
  };
}

export const MOCK_CONSTELLATION: ConstellationNode[] = [
  // FIRE COURT
  createMockNode('fire.ignition', 'Ignition', 'fire', 'fire', firePoints[0]),
  createMockNode('fire.combustion', 'Combustion', 'fire', 'fire', firePoints[1], ['fire.ignition']),
  createMockNode('fire.forge', 'Forge', 'fire', 'fire', firePoints[2], ['fire.ignition']),
  createMockNode('fire.plasma', 'Plasma', 'fire', 'fire', firePoints[3], ['fire.combustion', 'fire.forge']),
  
  // WATER COURT
  createMockNode('water.flow', 'Flow', 'water', 'flow', waterPoints[0]),
  createMockNode('water.tide', 'Tide', 'water', 'flow', waterPoints[1], ['water.flow']),
  createMockNode('water.depths', 'Depths', 'water', 'flow', waterPoints[2], ['water.flow']),
  createMockNode('water.tsunami', 'Tsunami', 'water', 'flow', waterPoints[3], ['water.tide', 'water.depths']),

  // EARTH COURT
  createMockNode('earth.foundation', 'Foundation', 'earth', 'foundation', earthPoints[0]),
  createMockNode('earth.structure', 'Structure', 'earth', 'foundation', earthPoints[1], ['earth.foundation']),
  createMockNode('earth.crystal', 'Crystal', 'earth', 'foundation', earthPoints[2], ['earth.structure']),
  createMockNode('earth.mountain', 'Mountain', 'earth', 'foundation', earthPoints[3], ['earth.crystal']),

  // WIND COURT
  createMockNode('wind.breeze', 'Breeze', 'wind', 'voice', windPoints[0]),
  createMockNode('wind.gale', 'Gale', 'wind', 'voice', windPoints[1], ['wind.breeze']),
  createMockNode('wind.storm', 'Storm', 'wind', 'voice', windPoints[2], ['wind.gale']),
  createMockNode('wind.hurricane', 'Hurricane', 'wind', 'voice', windPoints[3], ['wind.storm']),

  // VOID COURT
  createMockNode('void.emptiness', 'Emptiness', 'void', 'source', voidPoints[0]),
  createMockNode('void.singularity', 'Singularity', 'void', 'source', voidPoints[1], ['void.emptiness']),
  createMockNode('void.creation', 'Creation', 'void', 'source', voidPoints[2], ['void.singularity']),
  createMockNode('void.oblivion', 'Oblivion', 'void', 'source', voidPoints[3], ['void.creation']),
];
