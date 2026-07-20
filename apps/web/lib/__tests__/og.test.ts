/**
 * OG image regression tests.
 *
 * Guards two production failures that only surface in NODE_ENV=production
 * (in dev, Satori wraps them in a friendlier error):
 *
 *  1. `TypeError: Cannot read properties of undefined (reading 'trim')`
 *     Satori enumerates style objects with `for...in`, which includes keys
 *     whose value is `undefined`, then calls `.trim()` on the value. Optional
 *     style props must be omitted, not set to `undefined`.
 *
 *  2. CSS custom properties (`var(--arc-*)`) do not resolve in Satori — it
 *     renders outside the DOM. A `var(...)` in `background` throws.
 *
 * Run with: npx tsx apps/web/lib/__tests__/og.test.ts
 */

export {};

// Satori only throws the raw `.trim()` TypeError outside development, where it
// otherwise wraps failures in a friendlier message. Force production here.
(process.env as Record<string, string>).NODE_ENV = 'production';

let passed = 0;
let failed = 0;

function check(name: string, fn: () => Promise<void> | void) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
      console.log(`  PASS  ${name}`);
    })
    .catch((err: unknown) => {
      failed++;
      console.log(`  FAIL  ${name}`);
      console.log(`        ${err instanceof Error ? err.message : String(err)}`);
    });
}

async function renderToPng(response: Response): Promise<Buffer> {
  const buf = Buffer.from(await response.arrayBuffer());
  // PNG magic bytes — proves Satori actually rasterized rather than throwing.
  const isPng =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) throw new Error('output is not a PNG');
  if (buf.length < 1000) throw new Error(`suspiciously small PNG: ${buf.length}b`);
  return buf;
}

async function main() {
  const { createOGImage } = await import('../og');

  // The default glowPositions supply only two of {top,bottom,left,right} each,
  // leaving the other two `undefined` — this is what crashed in production.
  await check('renders with default glowPositions (undefined offsets)', async () => {
    await renderToPng(createOGImage({ title: 'Arcanea' }) as unknown as Response);
  });

  await check('renders with subtitle, icon and stats', async () => {
    await renderToPng(
      createOGImage({
        title: 'Living Lore',
        subtitle: 'A serialized narrative',
        icon: '✦',
        stats: ['7 characters', '12 episodes'],
      }) as unknown as Response
    );
  });

  await check('renders with explicit partial glow offsets', async () => {
    await renderToPng(
      createOGImage({
        title: 'Research',
        glowPositions: [
          { top: '10%', color: 'rgba(0,188,212,0.12)', size: 300 },
          { right: '5%', color: 'rgba(255,215,0,0.08)', size: 200 },
        ],
      }) as unknown as Response
    );
  });

  await check('COLORS contain no unresolvable CSS custom properties', async () => {
    const source = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../og.tsx', import.meta.url), 'utf8')
    );
    // Ignore the explanatory comments; check only code lines.
    const offending = source
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('*') && !l.trimStart().startsWith('//'))
      .filter((l) => l.includes('var(--'));
    if (offending.length > 0) {
      throw new Error(`var(--*) found in og.tsx:\n${offending.join('\n')}`);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

void main();
