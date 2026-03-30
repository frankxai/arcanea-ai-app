// ---------------------------------------------------------------------------
// ReasoningBank — Feedback loop storage for agent evaluation
// Stores evaluations and enables agent improvement over time
// ---------------------------------------------------------------------------

import type { AgentEvaluation, AgentPerformanceRecord } from "./evaluation-framework";
import { aggregatePerformance } from "./evaluation-framework";

const STORAGE_KEY = "arcanea:reasoning-bank";

export interface ReasoningBankEntry {
  evaluation: AgentEvaluation;
  storedAt: string;
  tags: string[];
}

function loadEntries(): ReasoningBankEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: ReasoningBankEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function storeEvaluation(
  evaluation: AgentEvaluation,
  tags: string[] = []
): ReasoningBankEntry {
  const entry: ReasoningBankEntry = {
    evaluation,
    storedAt: new Date().toISOString(),
    tags,
  };

  const entries = loadEntries();
  entries.push(entry);

  // Keep last 500 evaluations to prevent storage bloat
  const trimmed = entries.slice(-500);
  saveEntries(trimmed);

  return entry;
}

export function getAgentHistory(
  agentId: string,
  limit: number = 20
): AgentEvaluation[] {
  return loadEntries()
    .filter((e) => e.evaluation.agentId === agentId)
    .map((e) => e.evaluation)
    .slice(-limit);
}

export function getAllPerformanceRecords(): AgentPerformanceRecord[] {
  const entries = loadEntries();
  const evaluations = entries.map((e) => e.evaluation);

  const agentIds = [...new Set(evaluations.map((e) => e.agentId))];

  return agentIds.map((id) => {
    const agentEvals = evaluations.filter((e) => e.agentId === id);
    const agentType = agentEvals[0]?.agentType ?? "unknown";
    return aggregatePerformance(id, agentType, agentEvals);
  });
}

export function getTopPerformers(limit: number = 10): AgentPerformanceRecord[] {
  return getAllPerformanceRecords()
    .filter((r) => r.totalEvaluations >= 2)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, limit);
}

export function getImprovementSuggestions(agentId: string): string[] {
  const history = getAgentHistory(agentId, 10);
  if (history.length === 0) return ["No evaluation data yet."];

  const suggestions: string[] = [];
  const latest = history[history.length - 1];
  const rubric = latest.rubric;

  const weakDims = (
    Object.entries(rubric) as [string, { score: number; name: string }][]
  )
    .filter(([, dim]) => dim.score < 70)
    .sort((a, b) => a[1].score - b[1].score);

  for (const [, dim] of weakDims) {
    suggestions.push(`Improve ${dim.name}: scored ${dim.score}/100 in last evaluation.`);
  }

  if (latest.overallScore < 55) {
    suggestions.push("Consider rewriting the agent definition with clearer role boundaries.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Performance is strong across all dimensions.");
  }

  return suggestions;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getEvaluationCount(): number {
  return loadEntries().length;
}
