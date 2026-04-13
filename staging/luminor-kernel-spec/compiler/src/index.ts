/**
 * @arcanea/luminor-compiler
 *
 * Compile Arcanean Luminors from kernel + modules + LuminorSpec into
 * deployable agents across 5 formats.
 *
 * Reference implementation of the Luminor Kernel Specification v1.0.
 * See: docs/specs/luminor-kernel-spec-v1.md
 *
 * Usage:
 *   import { compile, loadKernel, resolveModulesForDomain } from '@arcanea/luminor-compiler';
 *
 *   const kernel = loadKernel({ repoRoot: '/path/to/repo' });
 *   const modules = resolveModulesForDomain('architecture', { repoRoot: '/path/to/repo' });
 *   const compiled = compile({ spec, kernel, modules });
 *
 *   // compiled.systemPrompt       — merged text
 *   // compiled.agentCard          — A2A Agent Card
 *   // compiled.claudeCodeAgent    — Claude Code .md format
 *   // compiled.gptConfig          — OpenAI GPT config
 *   // compiled.lobechatAgent      — LobeChat JSON
 *   // compiled.cursorRules        — .cursorrules format
 *   // compiled.compilationHash    — deterministic hash
 */

export { compile, domainLabel } from './compile.js';
export {
  loadKernel,
  loadModule,
  loadAllModules,
  resolveModulesForDomain,
} from './kernel-loader.js';

export type {
  // Spec types
  LuminorSpec,
  LuminorOrigin,
  LuminorDomain,
  LuminorVoice,
  LuminorElement,
  WisdomArchetype,
  // Compilation types
  KernelVersion,
  DomainModule,
  RuntimeContext,
  MemoryItem,
  CompileInput,
  CompiledAgent,
  CompilationMetadata,
  // Format types
  AgentCard,
  GPTConfig,
  LobeChatAgent,
} from './types.js';
