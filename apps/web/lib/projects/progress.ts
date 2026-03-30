import type { ProjectWorkspaceSnapshot } from './server';

export interface ProjectProgressStep {
  id: 'frame' | 'chat' | 'creation' | 'memory' | 'source';
  title: string;
  completed: boolean;
  detail: string;
}

export interface ProjectProgressState {
  currentStep: number;
  totalSteps: number;
  completionPercent: number;
  completedCount: number;
  steps: ProjectProgressStep[];
  nextRecommendedAction: string;
  status: 'not_started' | 'in_progress' | 'ready_to_complete' | 'complete';
}

function hasProjectFrame(workspace: ProjectWorkspaceSnapshot): boolean {
  return Boolean(workspace.project.title && (workspace.project.description || workspace.project.goal));
}

function hasSourceLinks(workspace: ProjectWorkspaceSnapshot): boolean {
  return workspace.creations.some((creation) => Boolean(creation.sourceSessionId));
}

export function deriveProjectProgress(workspace: ProjectWorkspaceSnapshot): ProjectProgressState {
  const steps: ProjectProgressStep[] = [
    {
      id: 'frame',
      title: 'Define the project frame',
      completed: hasProjectFrame(workspace),
      detail: hasProjectFrame(workspace)
        ? 'Project has a title and a defined description or goal.'
        : 'Add a clear description or goal so the workspace has intent.',
    },
    {
      id: 'chat',
      title: 'Build chat continuity',
      completed: workspace.stats.sessionCount > 0,
      detail: workspace.stats.sessionCount > 0
        ? `Project has ${workspace.stats.sessionCount} linked chat session(s).`
        : 'Start or link a chat session to this project.',
    },
    {
      id: 'creation',
      title: 'Create an artifact',
      completed: workspace.stats.creationCount > 0,
      detail: workspace.stats.creationCount > 0
        ? `Project has ${workspace.stats.creationCount} saved creation(s).`
        : 'Save at least one creation into this project.',
    },
    {
      id: 'memory',
      title: 'Capture durable memory',
      completed: workspace.stats.memoryCount > 0,
      detail: workspace.stats.memoryCount > 0
        ? `Project has ${workspace.stats.memoryCount} linked memory item(s).`
        : 'Persist a useful memory or fact linked to this project.',
    },
    {
      id: 'source',
      title: 'Link artifacts to source sessions',
      completed: hasSourceLinks(workspace),
      detail: hasSourceLinks(workspace)
        ? 'At least one creation points back to an originating chat session.'
        : 'Save or relink a creation with its source session for stronger provenance.',
    },
  ];

  const totalSteps = steps.length;
  const completedCount = steps.filter((step) => step.completed).length;
  const currentStep = Math.min(completedCount + 1, totalSteps);
  const completionPercent = Math.round((completedCount / totalSteps) * 100);
  const nextStep = steps.find((step) => !step.completed);

  const status: ProjectProgressState['status'] =
    completedCount === 0
      ? 'not_started'
      : completedCount === totalSteps
        ? 'complete'
        : completedCount >= totalSteps - 1
          ? 'ready_to_complete'
          : 'in_progress';

  return {
    currentStep,
    totalSteps,
    completionPercent,
    completedCount,
    steps,
    nextRecommendedAction: nextStep?.detail ?? 'Project workspace is complete and ready to ship.',
    status,
  };
}

export function buildProjectStepGuidance(
  workspace: ProjectWorkspaceSnapshot,
  userInput?: string | null,
): {
  status: ProjectProgressState['status'];
  message: string;
  currentStep: number;
  totalSteps: number;
  nextAction: string;
  progress: ProjectProgressState;
} {
  const progress = deriveProjectProgress(workspace);
  const normalizedInput = userInput?.trim();

  const message = normalizedInput
    ? `Project step guidance generated for "${normalizedInput}". ${progress.nextRecommendedAction}`
    : progress.nextRecommendedAction;

  return {
    status: progress.status,
    message,
    currentStep: progress.currentStep,
    totalSteps: progress.totalSteps,
    nextAction: progress.nextRecommendedAction,
    progress,
  };
}

export function buildProjectCompletionSummary(workspace: ProjectWorkspaceSnapshot): {
  status: 'completed' | 'in_progress';
  summary: string;
  progress: ProjectProgressState;
  ready: boolean;
} {
  const progress = deriveProjectProgress(workspace);
  const ready = progress.completedCount === progress.totalSteps;

  const summary = ready
    ? `${workspace.project.title} is complete: the workspace has frame, sessions, creations, memory, and source provenance.`
    : `${workspace.project.title} is not complete yet. Remaining work: ${progress.steps
        .filter((step) => !step.completed)
        .map((step) => step.title.toLowerCase())
        .join(', ')}.`;

  return {
    status: ready ? 'completed' : 'in_progress',
    summary,
    progress,
    ready,
  };
}
