import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');

const sharedConfig = {
  bundle: true,
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  target: 'chrome114',
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  alias: {
    'react': 'preact/compat',
    'react-dom': 'preact/compat',
  },
};

const configs = [
  {
    ...sharedConfig,
    entryPoints: ['src/background/service-worker.ts'],
    outfile: 'dist/background.js',
    format: 'esm',
  },
  {
    ...sharedConfig,
    entryPoints: ['src/content/index.ts'],
    outfile: 'dist/content.js',
    format: 'iife',
  },
  {
    ...sharedConfig,
    entryPoints: ['src/sidepanel/app.tsx'],
    outfile: 'dist/sidepanel.js',
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  {
    ...sharedConfig,
    entryPoints: ['src/popup/popup.ts'],
    outfile: 'dist/popup.js',
    format: 'iife',
  },
  {
    ...sharedConfig,
    entryPoints: ['src/content/content.css'],
    outfile: 'dist/content.css',
    loader: { '.css': 'css' },
  },
];

/** Copy static files (HTML, manifest, icons) to dist/ */
function copyStaticFiles() {
  const distDir = join(__dirname, 'dist');
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

  // HTML files → dist/ (flat, so script src="popup.js" resolves correctly)
  const staticFiles = [
    ['src/popup/popup.html', 'dist/popup.html'],
    ['src/sidepanel/index.html', 'dist/sidepanel.html'],
  ];

  for (const [src, dest] of staticFiles) {
    const srcPath = join(__dirname, src);
    const destPath = join(__dirname, dest);
    if (existsSync(srcPath)) {
      cpSync(srcPath, destPath);
    }
  }

  // Copy icons if they exist
  const iconsDir = join(__dirname, 'assets', 'icons');
  const distIconsDir = join(distDir, 'icons');
  if (existsSync(iconsDir)) {
    if (!existsSync(distIconsDir)) mkdirSync(distIconsDir, { recursive: true });
    cpSync(iconsDir, distIconsDir, { recursive: true });
  }
}

async function build() {
  copyStaticFiles();

  if (isWatch) {
    const contexts = await Promise.all(configs.map(c => esbuild.context(c)));
    await Promise.all(contexts.map(ctx => ctx.watch()));
    console.log('[grok-media] Watching for changes...');
  } else {
    await Promise.all(configs.map(c => esbuild.build(c)));
    console.log('[grok-media] Build complete.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
