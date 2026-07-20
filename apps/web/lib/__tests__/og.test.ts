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

  // The repo's lint rule offers `var(--arc-*)` as an accepted alternative to raw
  // hex, so a future OG route can legitimately pass one in. Satori cannot resolve
  // custom properties, so createOGImage must map them back to literal values
  // rather than forwarding them to the renderer.
  await check('resolves a var(--arc-*) accentColor instead of forwarding it', async () => {
    await renderToPng(
      createOGImage({
        title: 'Tokens',
        accentColor: 'var(--arc-brand-arcanean-gold)',
      }) as unknown as Response
    );
  });

  await check('resolves var(--arc-*) glow colours', async () => {
    await renderToPng(
      createOGImage({
        title: 'Tokens',
        glowPositions: [
          { top: '10%', left: '10%', color: 'var(--arc-brand-atlantean-teal)', size: 300 },
          { bottom: '10%', color: 'var(--arc-fire)', size: 200 },
        ],
      }) as unknown as Response
    );
  });

  await check('falls back for an unrecognised custom property', async () => {
    await renderToPng(
      createOGImage({
        title: 'Unknown token',
        accentColor: 'var(--arc-does-not-exist)',
      }) as unknown as Response
    );
  });

  // Rendering without throwing is not proof the mapping happened — assert the
  // var() form produces byte-identical output to the literal token.
  await check('var() accent renders identically to the literal token', async () => {
    const { brand } = await import('@arcanea/design-system');
    const [viaVar, viaLiteral] = await Promise.all([
      renderToPng(
        createOGImage({
          title: 'Equivalence',
          accentColor: 'var(--arc-brand-arcanean-gold)',
        }) as unknown as Response
      ),
      renderToPng(
        createOGImage({
          title: 'Equivalence',
          accentColor: brand.arcaneanGold,
        }) as unknown as Response
      ),
    ]);
    if (!viaVar.equals(viaLiteral)) {
      throw new Error(
        `var() form did not resolve to the token (${viaVar.length}b vs ${viaLiteral.length}b)`
      );
    }
  });

  await check('degrades a blank title to a valid card', async () => {
    await renderToPng(createOGImage({ title: '   ' }) as unknown as Response);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

void main();
