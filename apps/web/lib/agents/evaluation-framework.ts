// ---------------------------------------------------------------------------
// Agent Evaluation Framework — Arcanea
// Scores agent outputs against rubrics for continuous improvement
// ---------------------------------------------------------------------------

export interface EvaluationDimension {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1, weights sum to 1
  notes: string;
}

export interface AgentEvaluationRubric {
  correctness: EvaluationDimension;
  completeness: EvaluationDimension;
  quality: EvaluationDimension;
  efficiency: EvaluationDimension;
  safety: EvaluationDimension;
}

export interface AgentEvaluation {
  id: string;
  agentId: string;
  agentType: string;
  taskId: string;
  timestamp: string;
  rubric: AgentEvaluationRubric;
  overallScore: number;
  grade: EvaluationGrade;
  feedback: string;
  metadata: Record<string, string | number>;
}

export type EvaluationGrade = "S" | "A" | "B" | "C" | "D" | "F";

export interface AgentPerformanceRecord {
  agentId: string;
  agentType: string;
  totalEvaluations: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  gradeDistribution: Record<EvaluationGrade, number>;
  dimensionAverages: {
    correctness: number;
    completeness: number;
    quality: number;
    efficiency: number;
    safety: number;
  };
  trend: "improving" | "stable" | "declining";
  lastEvaluated: string;
}

function scoreToGrade(score: number): EvaluationGrade {
  if (score >= 95) return "S";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function computeOverallScore(rubric: AgentEvaluationRubric): number {
  const dimensions = [
    rubric.correctness,
    rubric.completeness,
    rubric.quality,
    rubric.efficiency,
    rubric.safety,
  ];

  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = dimensions.reduce(
    (sum, d) => sum + d.score * d.weight,
    0
  );

  return Math.round(weightedSum / totalWeight);
}

export function createDefaultRubric(): AgentEvaluationRubric {
  const defaultDimension = (name: string, weight: number): EvaluationDimension => ({
    name,
    score: 0,
    weight,
    notes: "",
  });

  return {
    correctness: defaultDimension("Correctness", 0.3),
    completeness: defaultDimension("Completeness", 0.25),
    quality: defaultDimension("Quality", 0.2),
    efficiency: defaultDimension("Efficiency", 0.15),
    safety: defaultDimension("Safety", 0.1),
  };
}

export function evaluateAgentOutput(
  agentId: string,
  agentType: string,
  taskId: string,
  rubric: AgentEvaluationRubric,
  feedback: string = "",
  metadata: Record<string, string | number> = {}
): AgentEvaluation {
  const overallScore = computeOverallScore(rubric);

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    agentId,
    agentType,
    taskId,
    timestamp: new Date().toISOString(),
    rubric,
    overallScore,
    grade: scoreToGrade(overallScore),
    feedback,
    metadata,
  };
}

function determineTrend(scores: number[]): "improving" | "stable" | "declining" {
  if (scores.length < 3) return "stable";
  const recent = scores.slice(-3);
  const earlier = scores.slice(-6, -3);
  if (earlier.length === 0) return "stable";

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const delta = recentAvg - earlierAvg;

  if (delta > 5) return "improving";
  if (delta < -5) return "declining";
  return "stable";
}

export function aggregatePerformance(
  agentId: string,
  agentType: string,
  evaluations: AgentEvaluation[]
): AgentPerformanceRecord {
  const agentEvals = evaluations.filter((e) => e.agentId === agentId);

  if (agentEvals.length === 0) {
    return {
      agentId,
      agentType,
      totalEvaluations: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      gradeDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 },
      dimensionAverages: {
        correctness: 0,
        completeness: 0,
        quality: 0,
        efficiency: 0,
        safety: 0,
      },
      trend: "stable",
      lastEvaluated: "",
    };
  }

  const scores = agentEvals.map((e) => e.overallScore);
  const gradeDistribution: Record<EvaluationGrade, number> = {
    S: 0, A: 0, B: 0, C: 0, D: 0, F: 0,
  };
  for (const e of agentEvals) {
    gradeDistribution[e.grade]++;
  }

  const dimKeys = ["correctness", "completeness", "quality", "efficiency", "safety"] as const;
  const dimensionAverages = {} as AgentPerformanceRecord["dimensionAverages"];
  for (const key of dimKeys) {
    const dimScores = agentEvals.map((e) => e.rubric[key].score);
    dimensionAverages[key] = Math.round(
      dimScores.reduce((a, b) => a + b, 0) / dimScores.length
    );
  }

  return {
    agentId,
    agentType,
    totalEvaluations: agentEvals.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    gradeDistribution,
    dimensionAverages,
    trend: determineTrend(scores),
    lastEvaluated: agentEvals[agentEvals.length - 1].timestamp,
  };
}
