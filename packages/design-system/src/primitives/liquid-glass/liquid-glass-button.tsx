'use client';

import { useEffect, useRef, useState } from 'react';

export interface LiquidGlassButtonProps {
  text?: string;
  size?: number;
  type?: 'rounded' | 'circle' | 'pill';
  warp?: boolean;
  tintOpacity?: number;
  onClick?: () => void;
  /** Where vendor/container.js, vendor/button.js, bridge.js, vendor/glass.css are served from. */
  basePath?: string;
  className?: string;
}

type LiquidGlassLib = {
  Button: new (options: Record<string, unknown>) => { element: HTMLElement };
};

declare global {
  interface Window {
    __LiquidGlassJS?: LiquidGlassLib;
  }
}

let loadPromise: Promise<LiquidGlassLib> | null = null;

function loadLiquidGlass(basePath: string): Promise<LiquidGlassLib> {
  if (typeof window === 'undefined') return Promise.reject(new Error('server-side'));
  if (window.__LiquidGlassJS) return Promise.resolve(window.__LiquidGlassJS);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<LiquidGlassLib>((resolve, reject) => {
    const loadScript = (src: string) =>
      new Promise<void>((res, rej) => {
        const el = document.createElement('script');
        el.src = src;
        el.onload = () => res();
        el.onerror = () => rej(new Error(`design-system/liquid-glass: failed to load ${src}`));
        document.head.appendChild(el);
      });

    const loadCss = (href: string) => {
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
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
        await loadScript(`${basePath}/container.js`);
        await loadScript(`${basePath}/button.js`);
        await loadScript(`${basePath}/bridge.js`);
        if (!window.__LiquidGlassJS) throw new Error('bridge.js did not expose __LiquidGlassJS');
        resolve(window.__LiquidGlassJS);
      } catch (err) {
        reject(err);
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
}: LiquidGlassButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadLiquidGlass(basePath)
      .then((lib) => {
        if (cancelled || !containerRef.current) return;
        const button = new lib.Button({ text, size, type, warp, tintOpacity, onClick });
        containerRef.current.appendChild(button.element);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
      // No upstream destroy()/teardown API — see docstring above.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, text, size, type, warp, tintOpacity]);

  if (error) return null;

  return <div ref={containerRef} className={className} />;
}
