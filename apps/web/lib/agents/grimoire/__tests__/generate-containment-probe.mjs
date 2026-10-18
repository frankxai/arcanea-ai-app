// Runs in a child process with an explicit synthetic environment, never host keys.
import {pathToFileURL} from 'node:url';
const inputCase = JSON.parse(process.env.GRIMOIRE_CASE || '{}');
globalThis.__audit = {calls:[], imports:[], jsonReads:0, networkAttempts:0};
globalThis.fetch = async () => {
  globalThis.__audit.networkAttempts += 1;
  throw new Error('Network forbidden in containment fixture');
};
const route = process.env.GRIMOIRE_WEB_ROOT
  ? pathToFileURL(process.env.GRIMOIRE_WEB_ROOT + '/app/api/agents/grimoire/generate/route.ts').href
  : new URL('../../../../app/api/agents/grimoire/generate/route.ts', import.meta.url).href;
const {POST} = await import(route);
const controller = new AbortController();
if (inputCase.aborted) controller.abort();
const request = {
  headers: new Headers(inputCase.headers || {}),
  signal: controller.signal,
  async json() {
    globalThis.__audit.jsonReads += 1;
    if (inputCase.jsonThrows) throw new Error('Body must not be read');
    return inputCase.body ?? {answers:{worldName:'Fixture world'},tier:'apprentice',email:'fixture@example.invalid'};
  },
};
const response = await POST(inputCase.noAccess
  ? new Proxy({}, {get() {throw new Error('Request must not be inspected');}})
  : request);
const body = await response.text();
console.log(JSON.stringify({
  status:response.status,body,headers:Object.fromEntries(response.headers),
  ...globalThis.__audit,
}));
