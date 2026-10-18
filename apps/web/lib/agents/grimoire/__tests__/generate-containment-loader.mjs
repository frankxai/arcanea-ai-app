// Offline fixture: real route, orchestrator and executor; SDK/data leaves only.
import { registerHooks } from 'node:module';
import {pathToFileURL} from 'node:url';
const web = process.env.GRIMOIRE_WEB_ROOT
  ? pathToFileURL(process.env.GRIMOIRE_WEB_ROOT + '/')
  : new URL('../../../../', import.meta.url);
const stub = (source) => 'data:text/javascript,' + encodeURIComponent(source);
const fixtures = {
  'next/server': 'export class NextRequest extends Request {}',
  'ai': `export function streamText(options) {
    globalThis.__audit.calls.push({model: options.model, maxOutputTokens: options.maxOutputTokens});
    return {text: Promise.resolve('Fixture section'), finishReason: Promise.resolve('stop')};
  }`,
  '@ai-sdk/google': "export const createGoogleGenerativeAI = () => id => ({provider:'google', id});",
  '@ai-sdk/anthropic': "export const createAnthropic = () => id => ({provider:'anthropic', id});",
  '@ai-sdk/openai': "export const createOpenAI = () => id => ({provider:'openai', id});",
  '@/lib/agents/marketplace/catalog': `export const CATALOG_BY_ID = new Proxy({}, {
    get: (_, id) => ({id, spec:{systemPrompt:'Fixture system', temperature:0.7}})
  });`,
  '@/lib/gateway/catalog': `export const GATEWAY_MODELS = {
    'arcanea-gemini-flash': {provider:'google',modelId:'fixture-google',label:'Google'},
    'arcanea-sonnet': {provider:'anthropic',modelId:'fixture-anthropic',label:'Anthropic'}
  };
  export const EXTENDED_PROVIDERS = {};
  export const claudeRejectsSamplingParams = () => false;`,
  '@/lib/ai/claude-safeguards': `export const REFUSAL_NOTICE = 'Refused';
    export const claudeFallbackOptions = () => ({});
    export const isRefusal = () => false;
    export const refusalNoticeTransform = () => undefined;`,
  '@/lib/agents/grimoire/formatter': "export const formatGrimoire = () => 'Fixture document';",
};
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (Object.hasOwn(fixtures, specifier)) {
      globalThis.__audit.imports.push(specifier);
      return {url:stub(fixtures[specifier]),shortCircuit:true};
    }
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(specifier.slice(2) + '.ts', web).href, context);
    }
    return nextResolve(specifier, context);
  },
});
