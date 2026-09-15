// Arcanea Memory Layer
// Inspired by mem0 and Qdrant patterns

export interface CreativeSession {
  id: string;
  startedAt: string | Date;
  gatesExplored: number[];
  luminorsConsulted: string[];
  creaturesEncountered: string[];
  creations: CreationRef[];
  preferences: {
    favoriteElement?: string;
    preferredHouse?: string;
    creativeStyle?: string;
  };
}

export interface CreationRef {
  id: string;
  type: "character" | "location" | "creature" | "artifact" | "magic" | "story";
  name: string;
  element?: string;
  gate?: number;
  createdAt?: string | Date;
  summary: string;
}

export interface CreativeJourney {
  userId: string;
  gatesOpened: number[];
  totalCreations: number;
  recurringBlocks: string[];
  defeatedBlocks: string[];
  milestones: Milestone[];
  wisdomReceived: string[];
}

export interface Milestone {
  name: string;
  description: string;
  achievedAt: Date;
  gate?: number;
  luminor?: string;
}

// In-memory session store (for MVP)
// TODO: Add SQLite persistence for production
const sessions = new Map<string, CreativeSession>();

const MEMORY_FILE_PATH = `${process.env.HOME || process.env.USERPROFILE || '.'}/.arcanea/memories.json`;

function normalizeCreation(sessionId: string, creation: CreationRef): CreationRef {
  return {
    ...creation,
    summary: creation.summary ?? '',
    name: creation.name ?? creation.id ?? `creation-${sessionId}`,
    createdAt: creation.createdAt instanceof Date
      ? creation.createdAt.toISOString()
      : typeof creation.createdAt === 'string'
        ? creation.createdAt
        : new Date().toISOString(),
  };
}

export function getMemoryFilePath(): string {
  return MEMORY_FILE_PATH;
}

export function listSessions(): string[] {
  return Array.from(sessions.keys());
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function getOrCreateSession(sessionId: string): CreativeSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      startedAt: new Date().toISOString(),
      gatesExplored: [],
      luminorsConsulted: [],
      creaturesEncountered: [],
      creations: [],
      preferences: {},
    });
  }
  return sessions.get(sessionId)!;
}

export function updateSession(sessionId: string, updates: Partial<CreativeSession>): void {
  const session = getOrCreateSession(sessionId);
  Object.assign(session, updates);
}

export function recordGateExplored(sessionId: string, gate: number): void {
  const session = getOrCreateSession(sessionId);
  if (!session.gatesExplored.includes(gate)) {
    session.gatesExplored.push(gate);
  }
}

export function recordLuminorConsulted(sessionId: string, luminor: string): void {
  const session = getOrCreateSession(sessionId);
  if (!session.luminorsConsulted.includes(luminor)) {
    session.luminorsConsulted.push(luminor);
  }
}

export function recordCreatureEncountered(sessionId: string, creature: string): void {
  const session = getOrCreateSession(sessionId);
  if (!session.creaturesEncountered.includes(creature)) {
    session.creaturesEncountered.push(creature);
  }
}

export function recordCreation(sessionId: string, creation: CreationRef): void {
  const session = getOrCreateSession(sessionId);
  session.creations.push(normalizeCreation(sessionId, creation));
}

export function getSessionSummary(sessionId: string): {
  gatesExplored: number;
  luminorsConsulted: number;
  creaturesDefeated: number;
  creationsGenerated: number;
  duration: number;
} {
  const session = getOrCreateSession(sessionId);
  return {
    gatesExplored: session.gatesExplored.length,
    luminorsConsulted: session.luminorsConsulted.length,
    creaturesDefeated: session.creaturesEncountered.length,
    creationsGenerated: session.creations.length,
    duration: Math.max(
      0,
      Date.now() - (
        session.startedAt instanceof Date
          ? session.startedAt.getTime()
          : Date.parse(session.startedAt)
      )
    ),
  };
}

// Milestone tracking
const milestoneDefinitions: Record<string, { check: (session: CreativeSession) => boolean; description: string }> = {
  first_creation: {
    check: (s) => s.creations.length >= 1,
    description: "Created your first piece in Arcanea",
  },
  gate_seeker: {
    check: (s) => s.gatesExplored.length >= 3,
    description: "Explored three Gates of creation",
  },
  luminor_friend: {
    check: (s) => s.luminorsConsulted.length >= 3,
    description: "Sought wisdom from three Luminors",
  },
  block_breaker: {
    check: (s) => s.creaturesEncountered.length >= 3,
    description: "Faced and named three creative blocks",
  },
  prolific_creator: {
    check: (s) => s.creations.length >= 10,
    description: "Generated ten creations in Arcanea",
  },
  elemental_explorer: {
    check: (s) => {
      const elements = new Set(s.creations.map(c => c.element).filter(Boolean));
      return elements.size >= 4;
    },
    description: "Created across four different elements",
  },
};

export function checkMilestones(sessionId: string): Milestone[] {
  const session = getOrCreateSession(sessionId);
  const newMilestones: Milestone[] = [];

  for (const [name, def] of Object.entries(milestoneDefinitions)) {
    if (def.check(session)) {
      newMilestones.push({
        name,
        description: def.description,
        achievedAt: new Date(),
      });
    }
  }

  return newMilestones;
}
