import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../../apps/web/components/chat/image-lightbox.tsx', import.meta.url), 'utf8')

test('lightbox fallback sets noopener', () => {
  assert.equal(source.includes("window.open(current.src, '_blank', 'noopener,noreferrer');"), true)
  assert.equal(source.includes("window.open(current.src, '_blank');"), false)
})
