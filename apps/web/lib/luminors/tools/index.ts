/**
 * buildLuminorTools — canonical factory for every tool the system exposes.
 *
 * Chat route calls it via `createChatTools()` (adapter in `lib/chat/tools.ts`).
 * Per-Luminor executor calls it via `resolveToolsForLuminor()` (adapter in
 * `lib/luminors/tool-resolver.ts`). Swarm engine calls it directly with
 * per-contributor context.
 *
 * Contract:
 *   - Universal tools (handoff, vault, memory, web, image) gate on auth.
 *   - Letta block editor only appears when both `luminorId` and `userId` are
 *     supplied and `authenticated` is true.
 *   - `include` lets callers request a subset; omitted = everything the
 *     context supports.
 *   - `domain` activates the domain-specific tools from `domain.ts`.
 */

import { buildHandoffTool } from './handoff';
import { buildSearchVaultTool, buildSaveToVaultTool } from './vault';
import { buildMemoryStoreTool, buildMemoryBlockTool } from './memory';
import { buildWebSearchTool, buildDeepResearchTool } from './web';
import { buildImageGenerateTool } from './image';
import { buildDomainTools, teamToDomain } from './domain';
import type { LuminorToolContext, LuminorToolSet, UniversalToolName } from './types';

export type { LuminorToolContext, LuminorToolSet, UniversalToolName } from './types';
export { UNIVERSAL_TOOL_NAMES } from './types';
export { LUMINOR_IDS } from './handoff';
export { VAULT_CLASSIFICATIONS } from './vault';
export { MEMORY_CATEGORIES } from './memory';
export { teamToDomain };

/** Should the tool with this name be built under the given context + include filter? */
function shouldInclude(
  name: UniversalToolName,
  include: LuminorToolContext['include'] | undefined,
): boolean {
  if (!include || include === 'all') return true;
  return include.includes(name);
}

/**
 * Build the complete tool set for a Luminor invocation.
 *
 * @example Chat route — everything the user is authed for
 *   buildLuminorTools({ userId, supabaseClient, authenticated: true })
 *
 * @example Opt-in subset from chat (enabledTools: ['image', 'handoff'])
 *   buildLuminorTools({ userId, supabaseClient, authenticated: true,
 *                       include: ['image_generate', 'handoff_to_luminor'] })
 *
 * @example Per-Luminor executor with domain tools
 *   buildLuminorTools({ luminorId: 'code-crafter', domain: 'code',
 *                       userId, authenticated: true })
 */
export function buildLuminorTools(ctx: LuminorToolContext): LuminorToolSet {
  const tools: LuminorToolSet = {};

  // Universal — handoff always present (stateless, always valid)
  if (shouldInclude('handoff_to_luminor', ctx.include)) {
    tools.handoff_to_luminor = buildHandoffTool();
  }

  // Universal — vault tools only fire when we have a session
  if (ctx.supabaseClient && ctx.userId) {
    if (shouldInclude('search_vault', ctx.include)) {
      tools.search_vault = buildSearchVaultTool(ctx.supabaseClient, ctx.userId);
    }
    if (shouldInclude('save_to_vault', ctx.include)) {
      tools.save_to_vault = buildSaveToVaultTool(ctx.supabaseClient, ctx.userId);
    }
  }

  // Universal — cross-Luminor memory_store (gates on auth, degrades gracefully)
  if (shouldInclude('memory_store', ctx.include)) {
    tools.memory_store = buildMemoryStoreTool(ctx.supabaseClient ?? null, ctx.userId ?? null);
  }

  // Universal — web search + deep research (BYOK compatible)
  if (shouldInclude('web_search', ctx.include)) {
    tools.web_search = buildWebSearchTool(ctx.searchApiKey);
  }
  if (shouldInclude('deep_research', ctx.include)) {
    tools.deep_research = buildDeepResearchTool();
  }

  // Universal — image generate
  if (shouldInclude('image_generate', ctx.include)) {
    tools.image_generate = buildImageGenerateTool();
  }

  // Per-Luminor — Letta block, only when the caller knows both IDs
  if (
    ctx.authenticated &&
    ctx.luminorId &&
    ctx.userId &&
    shouldInclude('update_memory', ctx.include)
  ) {
    tools.update_memory = buildMemoryBlockTool(ctx.luminorId, ctx.userId);
  }

  // Domain-specific tools layered on top (executor path)
  if (ctx.domain) {
    const domainTools = buildDomainTools(ctx.domain);
    for (const [name, t] of Object.entries(domainTools)) {
      tools[name] = t;
    }
  }

  return tools;
}
