import { strict as assert } from 'node:assert';
import { countChapterWords, isChapterMarkdown } from '../chapter-files';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

function main() {
  test('chapter policy includes numbered chapters and real prologues', () => {
    for (const filename of [
      '01-arrival.md',
      'chapter-01-before-the-name.md',
      '00-prolog.md',
      '00-prologue.md',
      '00-prologo-de-luz.md',
    ]) {
      assert.equal(isChapterMarkdown(filename), true, filename);
    }
  });

  test('chapter policy excludes companion and non-chapter markdown', () => {
    for (const filename of [
      'README.md',
      'PITCH.md',
      'CLAUDE.md',
      'AUTHORS_NOTE.md',
      'GLOSSARY.md',
      '00-outline.md',
      'cover.png',
    ]) {
      assert.equal(isChapterMarkdown(filename), false, filename);
    }
  });

  test('chapter policy rejects uppercase extensions the routes cannot strip', () => {
    assert.equal(isChapterMarkdown('CHAPTER-02.MD'), false);
  });

  test('word counts ignore YAML frontmatter', () => {
    const body = 'One two\n\nthree four.';
    const withFrontmatter = [
      '---',
      'title: A title that must not change the count',
      'gate: All Ten',
      '---',
      body,
    ].join('\n');

    assert.equal(countChapterWords(body), 4);
    assert.equal(countChapterWords(withFrontmatter), 4);
  });

  test('frontmatter-only documents contain no chapter words', () => {
    assert.equal(countChapterWords('---\ntitle: Empty\n---\n'), 0);
  });

  if (failed > 0) {
    console.error(`\n${failed} chapter file policy test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} chapter file policy test(s) passed`);
}

main();
