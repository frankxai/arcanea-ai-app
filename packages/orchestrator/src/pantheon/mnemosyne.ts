import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import type { MnemosyneAgent, MemoryResult } from "../types/pantheon";

export class Mnemosyne implements MnemosyneAgent {
  id = "mnemosyne";
  name = "Mnemosyne";
  role = "Semantic Memory Interface";
  description =
    "Handles embedding-based storage and retrieval across the Starlight memory vaults.";

  private pipeline: any = null;
  private starlightHome: string;

  constructor() {
    this.starlightHome =
      process.env.STARLIGHT_HOME || path.join(homedir(), ".starlight");
  }

  /**
   * Generates a normalized local embedding vector using bge-m3 dimension (1024).
   * Dynamically loads transformers if available, otherwise falls back to a deterministic,
   * high-entropy vector approximation based on string hash values.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // @ts-ignore
      const transformers = await import("@xenova/transformers");
      if (!this.pipeline) {
        this.pipeline = await transformers.pipeline(
          "feature-extraction",
          "Xenova/bge-m3",
        );
      }
      const output = await this.pipeline(text, {
        pooling: "mean",
        normalize: true,
      });
      return Array.from(output.data);
    } catch {
      // Fallback: stable, high-quality hash-based normalized vector of size 1024
      const size = 1024;
      const vector = new Array(size).fill(0);
      const cleanText = text.toLowerCase().trim();

      for (let i = 0; i < cleanText.length; i++) {
        const charCode = cleanText.charCodeAt(i);
        const index = (charCode * (i + 17)) % size;
        vector[index] = (vector[index] + charCode) / 255;
      }

      // Add a secondary hash pass to increase entropy
      let hash = 5381;
      for (let i = 0; i < cleanText.length; i++) {
        hash = (hash * 33) ^ cleanText.charCodeAt(i);
      }
      for (let i = 0; i < size; i++) {
        const offset = Math.abs((hash + i) % size);
        vector[i] += (offset / size) * 0.1;
      }

      // Compute magnitude for normalization
      const sumSq = vector.reduce((sum, val) => sum + val * val, 0);
      const magnitude = Math.sqrt(sumSq);

      return vector.map((val) => (magnitude > 0 ? val / magnitude : 0));
    }
  }

  /**
   * Computes cosine similarity between two normalized vectors.
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Queries all Starlight vaults, calculates similarity, and returns best matches.
   */
  async queryMemory(query: string, limit = 5): Promise<MemoryResult[]> {
    const queryVector = await this.generateEmbedding(query);
    const results: MemoryResult[] = [];
    const vaultsDir = path.join(this.starlightHome, "vaults");

    if (!fs.existsSync(vaultsDir)) {
      return [];
    }

    const files = fs.readdirSync(vaultsDir).filter((f) => f.endsWith(".jsonl"));

    for (const file of files) {
      const vaultName = path.basename(file, ".jsonl");
      const filePath = path.join(vaultsDir, file);

      try {
        const content = fs.readFileSync(filePath, "utf8").trim();
        if (!content) continue;

        const lines = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            // Extract the core text to match on
            const textToMatch =
              entry.insight || entry.wish || entry.content || "";
            const entryVector = await this.generateEmbedding(textToMatch);
            const similarity = this.cosineSimilarity(queryVector, entryVector);

            results.push({
              id: entry.id || String(Math.random()),
              vault: vaultName,
              content: textToMatch,
              similarity,
              tags: Array.isArray(entry.tags) ? entry.tags : [],
              createdAt: entry.createdAt || new Date().toISOString(),
            });
          } catch {
            // Ignore line parse errors
          }
        }
      } catch {
        // Ignore file read errors
      }
    }

    // Sort by descending similarity and apply limit
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  /**
   * Stores a new memory entry to the specified Starlight vault.
   */
  async storeMemory(
    vault: string,
    content: string,
    tags: string[],
  ): Promise<boolean> {
    const vaultsDir = path.join(this.starlightHome, "vaults");
    if (!fs.existsSync(vaultsDir)) {
      fs.mkdirSync(vaultsDir, { recursive: true });
    }

    const filePath = path.join(vaultsDir, `${vault}.jsonl`);
    const entry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      tags,
      confidence: "high",
      source: "pantheon-mnemosyne",
      category: "agent-memory",
      [vault === "horizon" ? "wish" : "insight"]: content,
    };

    try {
      fs.appendFileSync(filePath, `${JSON.stringify(entry)}\n`, "utf8");
      return true;
    } catch {
      return false;
    }
  }
}
