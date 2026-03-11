/**
 * Arcanea Intelligence Gateway — Smart Router
 *
 * Classifies tasks and routes to the optimal model.
 * When user says "arcanea-auto", this picks the best model for their task.
 */

import type { ChatMessage, CuratedModel, GatewayConfig, ProviderId } from './types';
import { CURATED_MODELS, getModelById, PROVIDERS } from './models';

// ─── Task Classification ─────────────────────────────────────────────

type TaskType = 'reasoning' | 'creative' | 'code' | 'chat' | 'vision' | 'image-gen' | 'video-gen' | 'audio' | 'translation';

interface ClassificationResult {
  taskType: TaskType;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  needsVision: boolean;
  estimatedTokens: number;
}

/** Classify the task from the messages to determine optimal routing */
export function classifyTask(messages: ChatMessage[]): ClassificationResult {
  const lastMessage = messages[messages.length - 1];
  const content = typeof lastMessage?.content === 'string'
    ? lastMessage.content
    : Array.isArray(lastMessage?.content)
      ? lastMessage.content.map((p) => p.text || '').join(' ')
      : '';

  const lower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;

  // Vision detection
  const hasImages = Array.isArray(lastMessage?.content) &&
    lastMessage.content.some((p) => p.type === 'image_url');

  // Task type classification
  let taskType: TaskType = 'chat';

  const codeSignals = ['code', 'function', 'bug', 'debug', 'implement', 'refactor', 'class', 'api', 'typescript', 'python', 'javascript', 'sql', 'css', 'html', 'regex', 'algorithm', 'data structure', 'compile', 'runtime'];
  const reasoningSignals = ['analyze', 'compare', 'evaluate', 'explain why', 'pros and cons', 'trade-off', 'strategy', 'architecture', 'design', 'plan', 'reasoning', 'logic', 'proof', 'derive', 'calculate', 'math'];
  const creativeSignals = ['write', 'story', 'poem', 'creative', 'imagine', 'narrative', 'character', 'dialogue', 'scene', 'fiction', 'essay', 'blog', 'article', 'copy', 'script', 'lyrics'];
  const imageSignals = ['generate image', 'create image', 'draw', 'illustration', 'picture of', 'photo of', 'design a logo', 'make an image'];
  const videoSignals = ['generate video', 'create video', 'animate', 'motion', 'clip of'];
  const translationSignals = ['translate', 'translation', 'in german', 'in french', 'in spanish', 'in japanese', 'in chinese'];

  if (hasImages) taskType = 'vision';
  else if (imageSignals.some((s) => lower.includes(s))) taskType = 'image-gen';
  else if (videoSignals.some((s) => lower.includes(s))) taskType = 'video-gen';
  else if (codeSignals.filter((s) => lower.includes(s)).length >= 2) taskType = 'code';
  else if (reasoningSignals.filter((s) => lower.includes(s)).length >= 2) taskType = 'reasoning';
  else if (creativeSignals.filter((s) => lower.includes(s)).length >= 2) taskType = 'creative';
  else if (translationSignals.some((s) => lower.includes(s))) taskType = 'translation';

  // Complexity estimation
  const totalContent = messages.map((m) =>
    typeof m.content === 'string' ? m.content : ''
  ).join(' ');
  const totalWords = totalContent.split(/\s+/).length;

  let complexity: ClassificationResult['complexity'] = 'simple';
  if (totalWords > 2000 || messages.length > 10) complexity = 'expert';
  else if (totalWords > 500 || messages.length > 5) complexity = 'complex';
  else if (totalWords > 100 || messages.length > 2) complexity = 'moderate';

  return {
    taskType,
    complexity,
    needsVision: hasImages,
    estimatedTokens: Math.ceil(totalWords * 1.3),
  };
}

// ─── Model Selection ─────────────────────────────────────────────────

interface RoutingDecision {
  model: CuratedModel;
  reason: string;
  alternatives: CuratedModel[];
}

/** Pick the optimal model based on task classification and available provider keys */
export function selectModel(
  classification: ClassificationResult,
  config: GatewayConfig,
): RoutingDecision | null {
  const available = CURATED_MODELS.filter((m) => {
    // Only models whose provider the user has a key for
    return config.providerKeys[m.provider] != null;
  });

  if (available.length === 0) return null;

  // Filter by capability
  let candidates = available;

  if (classification.needsVision) {
    candidates = candidates.filter((m) => m.supportsVision);
  }

  if (classification.taskType === 'image-gen') {
    candidates = candidates.filter((m) => m.supportsImageOutput);
  }

  if (classification.taskType === 'video-gen') {
    candidates = candidates.filter((m) => m.supportsVideoOutput);
  }

  // Fallback to all available if filters removed everything
  if (candidates.length === 0) candidates = available;

  // Score each candidate
  const scored = candidates.map((model) => {
    let score = 0;

    // Task type alignment
    if (model.category.includes(classification.taskType as any)) score += 30;

    // Tier bonus
    if (classification.complexity === 'expert' && model.tier === 'frontier') score += 25;
    if (classification.complexity === 'complex' && model.tier !== 'speed') score += 15;
    if (classification.complexity === 'simple' && model.tier === 'speed') score += 20;
    if (classification.complexity === 'simple' && model.tier === 'performance') score += 10;

    // Speed bonus for simple tasks
    if (classification.complexity === 'simple' && model.tokensPerSecond && model.tokensPerSecond > 500) {
      score += 15;
    }

    // Cost efficiency for non-expert tasks
    if (classification.complexity !== 'expert') {
      const costScore = Math.max(0, 20 - model.outputPrice);
      score += costScore;
    }

    // Vision capability when needed
    if (classification.needsVision && model.supportsVision) score += 20;

    // Tool support bonus
    if (model.supportsTools) score += 5;

    return { model, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const winner = scored[0];
  const alternatives = scored.slice(1, 4).map((s) => s.model);

  let reason = `Selected for ${classification.taskType} task (${classification.complexity} complexity)`;
  if (classification.needsVision) reason += ' with vision capability';
  if (winner.model.tokensPerSecond) reason += ` at ${winner.model.tokensPerSecond} tok/s`;

  return {
    model: winner.model,
    reason,
    alternatives,
  };
}

// ─── Request Routing ─────────────────────────────────────────────────

interface RouteResult {
  targetUrl: string;
  headers: Record<string, string>;
  providerModelId: string;
  model: CuratedModel;
  reason: string;
}

/** Full routing pipeline: classify → select → prepare request */
export function routeRequest(
  modelId: string,
  messages: ChatMessage[],
  config: GatewayConfig,
): RouteResult | null {
  let selectedModel: CuratedModel | undefined;
  let reason = '';

  if (modelId === 'arcanea-auto' || modelId === 'auto') {
    // Smart routing — auto-select best model
    const classification = classifyTask(messages);
    const decision = selectModel(classification, config);
    if (!decision) return null;
    selectedModel = decision.model;
    reason = decision.reason;
  } else {
    // Direct model selection
    selectedModel = getModelById(modelId);
    if (!selectedModel) {
      // Try matching by provider model ID (passthrough)
      selectedModel = CURATED_MODELS.find((m) => m.providerModelId === modelId);
    }
    reason = 'Direct model selection';
  }

  if (!selectedModel) return null;

  const provider = PROVIDERS[selectedModel.provider];
  if (!provider) return null;

  const apiKey = config.providerKeys[selectedModel.provider];
  if (!apiKey) return null;

  // Build target URL
  const targetUrl = `${provider.baseUrl}/chat/completions`;

  // Build auth headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (provider.authHeader === 'Authorization') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers[provider.authHeader] = apiKey;
  }

  // Anthropic-specific headers
  if (provider.id === 'anthropic') {
    headers['anthropic-version'] = '2024-10-22';
  }

  return {
    targetUrl,
    headers,
    providerModelId: selectedModel.providerModelId,
    model: selectedModel,
    reason,
  };
}
