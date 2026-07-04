'use client';

import { useEffect, useRef, useState, type ReactElement } from 'react';

export interface LiquidGlassButtonProps {
  text?: string;
  size?: number;
  type?: 'rounded' | 'circle' | 'pill';
  warp?: boolean;
  tintOpacity?: number;
  onClick?: () => void;
  /** Where vendor/container.js, vendor/button.js, bridge.js, vendor/glass.css, vendor/html2canvas.min.js are served from. */
  basePath?: string;
  className?: string;
}

interface LiquidGlassLib {
  Button: new (options: Record<string, unknown>) => { element: HTMLElement };
}

declare global {
  interface Window {
    __LiquidGlassJS?: LiquidGlassLib;
  }
}

function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

let loadPromise: Promise<LiquidGlassLib> | null = null;

function loadLiquidGlass(basePath: string): Promise<LiquidGlassLib> {
  if (typeof window === 'undefined') return Promise.reject(new Error('server-side'));
  if (window.__LiquidGlassJS) return Promise.resolve(window.__LiquidGlassJS);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<LiquidGlassLib>((resolve, reject) => {
    const loadScript = (src: string): Promise<void> =>
      new Promise<void>((res, rej) => {
        const el = document.createElement('script');
        el.src = src;
        el.onload = () => res();
        el.onerror = () => rej(new Error(`design-system/liquid-glass: failed to load ${src}`));
        document.head.appendChild(el);
      });

    const loadCss = (href: string): void => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    (async () => {
      try {
        loadCss(`${basePath}/glass.css`);
        // container.js's capturePageSnapshot() calls the global `html2canvas`
        // unconditionally -- it is a hard runtime dependency, not optional.
        // Vendored locally (not a public CDN) to avoid an unpinned third-party
        // script origin without Subresource Integrity.
        await loadScript(`${basePath}/html2canvas.min.js`);
        await loadScript(`${basePath}/container.js`);
        await loadScript(`${basePath}/button.js`);
        await loadScript(`${basePath}/bridge.js`);
        if (!window.__LiquidGlassJS) throw new Error('bridge.js did not expose __LiquidGlassJS');
        resolve(window.__LiquidGlassJS);
      } catch (err) {
        reject(err as Error);
      }
    })();
  });

  return loadPromise;
}

/**
 * LiquidGlassButton — WebGL glass-morphism button.
 * Vendors dashersw/liquid-glass-js (MIT), intake logged in
 * registries/design-assets.json. OPT-IN alongside the standard CSS glass-card
 * recipe (bg-white/[0.03] border-white/[0.06] backdrop-blur-sm), which stays
 * the default everywhere per TASTE.md — use this for one deliberate hero
 * moment per page, not as a general replacement.
 *
 * Falls back to a plain CSS glass button (same visual recipe as the rest of
 * the site) when WebGL is unsupported or the vendored assets fail to load —
 * the CTA never silently disappears.
 *
 * Known upstream limitation: the vendored Container/Button classes register a
 * permanent `window` scroll listener and expose no teardown/destroy method.
 * Mount this once for the life of the page (a persistent hero CTA, not
 * something conditionally shown/hidden) — each mount leaks one listener.
 *
 * Requires the vendored assets served at `basePath` (default
 * '/vendor/liquid-glass-js'): see ./vendor/ + ./bridge.js in this folder, and
 * copy them into the consuming app's public/vendor/liquid-glass-js/.
 */
export function LiquidGlassButton({
  text = 'Button',
  size = 48,
  type = 'rounded',
  warp = false,
  tintOpacity = 0.2,
  onClick,
  basePath = '/vendor/liquid-glass-js',
  className,
}: LiquidGlassButtonProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const onClickRef = useRef(onClick);
  const [error, setError] = useState<string | null>(null);
  const [webGLSupported] = useState(supportsWebGL);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!webGLSupported) return;
    let cancelled = false;

    loadLiquidGlass(basePath)
      .then((lib) => {
        if (cancelled || !containerRef.current) return;
        const button = new lib.Button({
          text,
          size,
          type,
          warp,
          tintOpacity,
          onClick: () => onClickRef.current?.(),
        });
        containerRef.current.appendChild(button.element);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
      // No upstream destroy()/teardown API — see docstring above.
    };
    // onClick intentionally excluded — routed through onClickRef so it never
    // re-triggers this effect (each run mounts a new WebGL button + listener).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, text, size, type, warp, tintOpacity, webGLSupported]);

  if (!webGLSupported || error) {
    return (
      <button
        onClick={onClick}
        className={['rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm text-white font-medium transition-colors hover:bg-white/[0.08]', className || '']
          .filter(Boolean)
          .join(' ')}
        style={{ fontSize: `${size / 2}px`, padding: `${size / 4}px ${size / 2}px` }}
      >
        {text}
      </button>
    );
  }

  return <div ref={containerRef} className={className} />;
}
