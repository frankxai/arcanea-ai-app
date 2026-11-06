import test from 'node:test'
import assert from 'node:assert/strict'
import { createPublicCatalogTools } from '../../lib/public-catalog.mjs'
import { registerWebTools } from '../../lib/webmcp.mjs'
const entries = [{ id: 'public:a', title: 'Tool authority', summary: 'Review permissions before execution.', url: '/path/a', evidence: { state: 'reference' } }]
test('search and inspect return bounded public snapshots and honest misses', () => {
  const [search, read] = createPublicCatalogTools('example', entries)
  const result = search.execute({ query: 'authority', limit: 1 })
  assert.equal(result.total, 1)
  result.results[0].evidence.state = 'changed'
  assert.equal(read.execute({ id: 'public:a' }).record.evidence.state, 'reference')
  assert.deepEqual(read.execute({ id: 'private:a' }), { found: false })
  assert.deepEqual(search.execute({ query: 'missing' }), { results: [], total: 0 })
})
test('malformed and oversized input never expands retrieval', () => {
  const [search, read] = createPublicCatalogTools('example', entries)
  for (const value of [null, [], {}, { query: '' }, { query: 'x'.repeat(201) }, { query: 'authority', limit: 21 }, { query: 'authority', limit: 1.5 }, { query: 'authority', tenant: 'other' }]) assert.throws(() => search.execute(value))
  for (const value of [null, [], {}, { id: '../private' , extra: true }, { id: 2 }]) assert.throws(() => read.execute(value))
})
test('cleanup revokes tools and subsequent reads without a network request', async () => {
  const exposed = []
  const registration = registerWebTools({ registerTool: tool => exposed.push(tool) }, createPublicCatalogTools('example', entries))
  assert.equal(await registration.ready, true)
  assert.equal((await exposed[0].execute({ query: 'authority' })).total, 1)
  registration.stop()
  await assert.rejects(() => exposed[0].execute({ query: 'authority' }))
})

