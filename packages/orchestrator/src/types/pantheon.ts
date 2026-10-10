export interface StoryOutline {
  title: string;
  chapters: Array<{
    number: number;
    title: string;
    synopsis: string;
    povCharacter: string;
    setting: string;
    keyConflict: string;
  }>;
  metadata?: Record<string, any>;
}

export interface MemoryResult {
  id: string;
  vault: string;
  content: string;
  similarity: number;
  tags: string[];
  createdAt: string;
}

export interface VoiceProfile {
  characterName: string;
  tone: string;
  vocabulary: string[];
  speechPatterns: string[];
}

export interface PantheonAgent {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface HephaestusAgent extends PantheonAgent {
  generateOutline(prompt: string, context?: any): Promise<StoryOutline>;
  validateStructure(outline: StoryOutline): Promise<{ valid: boolean; issues: string[] }>;
}

export interface CalliopeAgent extends PantheonAgent {
  generateDialogue(characters: string[], context: string, profile?: VoiceProfile[]): Promise<string>;
  checkVoiceConsistency(text: string, voiceSpec: string): Promise<{ score: number; suggestions: string[] }>;
}

export interface ApolloAgent extends PantheonAgent {
  editProse(text: string, constraints: string[]): Promise<string>;
  auditNamesAndPronouns(text: string, registry: Record<string, string>): Promise<{ corrected: string; changes: string[] }>;
}

export interface MnemosyneAgent extends PantheonAgent {
  queryMemory(query: string, limit?: number): Promise<MemoryResult[]>;
  storeMemory(vault: string, content: string, tags: string[]): Promise<boolean>;
  generateEmbedding(text: string): Promise<number[]>;
}
