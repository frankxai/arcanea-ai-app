import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createBookSchema,
  createPersonSchema,
  escapeJsonForScript,
  stringifyJsonLdSafe,
  STARLIGHT_JSONLD_CONTEXT,
} from '../src/schema';

describe('escapeJsonForScript (XSS defense)', () => {
  it('escapes </script> case-insensitively', () => {
    const out = escapeJsonForScript('"</script>"');
    assert.equal(out.includes('</script>'), false);
    assert.match(out, /<\\\/script/);
  });

  it('escapes </SCRIPT> in any case', () => {
    const out = escapeJsonForScript('"</SCRIPT >"');
    assert.equal(out.includes('</SCRIPT'), false);
  });

  it('escapes <!-- HTML comment opener', () => {
    const out = escapeJsonForScript('{"x":"<!--"}');
    assert.match(out, /<\\!--/);
  });

  it('escapes U+2028 LINE SEPARATOR', () => {
    const ls = String.fromCharCode(0x2028);
    const out = escapeJsonForScript(`"hello${ls}world"`);
    assert.match(out, /\\u2028/);
    assert.equal(out.includes(ls), false);
  });

  it('escapes U+2029 PARAGRAPH SEPARATOR', () => {
    const ps = String.fromCharCode(0x2029);
    const out = escapeJsonForScript(`"hello${ps}world"`);
    assert.match(out, /\\u2029/);
    assert.equal(out.includes(ps), false);
  });

  it('passes through normal JSON unchanged', () => {
    const json = '{"name":"Forge of Ruin","price":29.99}';
    assert.equal(escapeJsonForScript(json), json);
  });
});

describe('stringifyJsonLdSafe', () => {
  it('safely stringifies a Book schema with </script> in description', () => {
    const schema = createBookSchema({
      id: 'urn:test:1',
      url: 'https://example.com/book',
      name: 'Test',
      description: 'XSS attempt: </script><script>alert(1)</script>',
      inLanguage: 'en',
      authors: [{ name: 'Test Author' }],
    });
    const out = stringifyJsonLdSafe(schema);
    assert.equal(out.includes('</script>'), false);
    assert.match(out, /<\\\/script/);
  });
});

describe('createBookSchema', () => {
  it('uses STARLIGHT_JSONLD_CONTEXT (vocab + arcanea prefix mapped)', () => {
    const schema = createBookSchema({
      id: 'urn:test:1',
      url: 'https://example.com/book',
      name: 'Test',
      inLanguage: 'en',
      authors: [{ name: 'A' }],
    });
    assert.deepEqual(schema['@context'], STARLIGHT_JSONLD_CONTEXT);
    // Verify arcanea prefix is mapped (so arcanea:aiInvolvement isn't discarded)
    assert.equal(
      (STARLIGHT_JSONLD_CONTEXT as { arcanea: string }).arcanea,
      'https://arcanea.ai/schema/',
    );
  });

  it('omits translator when none provided', () => {
    const schema = createBookSchema({
      id: 'urn:test:1',
      url: 'https://example.com/book',
      name: 'Test',
      inLanguage: 'en',
      authors: [{ name: 'A' }],
    });
    assert.equal('translator' in schema, false);
  });

  it('omits translationOfWork when no originalWorkUrl', () => {
    const schema = createBookSchema({
      id: 'urn:test:1',
      url: 'https://example.com/book',
      name: 'Test',
      inLanguage: 'en',
      authors: [{ name: 'A' }],
    });
    assert.equal('translationOfWork' in schema, false);
  });

  it('builds translationOfWork chain when translation', () => {
    const schema = createBookSchema({
      id: 'urn:test:1:de',
      url: 'https://example.com/de/book',
      name: 'Test DE',
      inLanguage: 'de',
      authors: [{ name: 'A' }],
      translators: [{ name: 'T', isAi: true }],
      originalWorkUrl: 'https://example.com/book',
      originalLanguage: 'en',
    });
    assert.deepEqual(schema.translationOfWork, {
      '@type': 'Book',
      url: 'https://example.com/book',
      inLanguage: 'en',
    });
    const translators = schema.translator as Array<Record<string, unknown>>;
    assert.equal(translators[0].additionalType, 'https://arcanea.ai/schema/AiPersona');
  });

  it('emits arcanea:aiInvolvement when supplied', () => {
    const schema = createBookSchema({
      id: 'urn:test:1',
      url: 'https://example.com/book',
      name: 'Test',
      inLanguage: 'en',
      authors: [{ name: 'A' }],
      aiInvolvement: 'human-authored-ai-edited',
    });
    assert.equal(schema['arcanea:aiInvolvement'], 'human-authored-ai-edited');
  });
});

describe('createPersonSchema', () => {
  it('marks AI persona with additionalType', () => {
    const schema = createPersonSchema({ name: 'Lumina', isAi: true });
    assert.equal(schema.additionalType, 'https://arcanea.ai/schema/AiPersona');
  });

  it('does not mark human persona', () => {
    const schema = createPersonSchema({ name: 'Frank' });
    assert.equal('additionalType' in schema, false);
  });
});
