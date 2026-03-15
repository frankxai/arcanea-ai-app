/**
 * @arcanea/ai-provider
 *
 * Vercel AI SDK provider for the Arcanea Intelligence Gateway.
 * Curated AI models with intelligent routing.
 *
 * @example
 * ```typescript
 * import { arcanea } from '@arcanea/ai-provider';
 * import { generateText } from 'ai';
 *
 * const { text } = await generateText({
 *   model: arcanea('arcanea-opus'),
 *   prompt: 'Write a creation myth for a new universe',
 * });
 * ```
 *
 * @example Smart routing (auto-select best model)
 * ```typescript
 * const { text } = await generateText({
 *   model: arcanea('arcanea-auto'),
 *   prompt: 'Analyze this code for security vulnerabilities',
 * });
 * ```
 *
 * @example With BYOK (Bring Your Own Key)
 * ```typescript
 * import { createArcanea } from '@arcanea/ai-provider';
 *
 * const arcanea = createArcanea({
 *   baseURL: 'https://arcanea.ai/api/v1',
 *   apiKey: 'arc_your_key',
 *   headers: {
 *     'X-Anthropic-Key': 'sk-ant-xxx',
 *     'X-Groq-Key': 'gsk_xxx',
 *   },
 * });
 * ```
 */

export { createArcanea, arcanea } from './arcanea-provider';
export type { ArcaneaProvider, ArcaneaProviderSettings } from './arcanea-provider';
export type { ArcaneaModelId } from './arcanea-models';
export { ARCANEA_MODELS } from './arcanea-models';

// Default export for convenience
export { arcanea as default } from './arcanea-provider';
