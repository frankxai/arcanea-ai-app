'use client';

import { useEffect, useState } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { brand } from '../tokens';

export interface ShaderGradientBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  type?: 'plane' | 'sphere' | 'waterPlane';
  animate?: 'on' | 'off';
  cDistance?: number;
  cPolarAngle?: number;
  cAzimuthAngle?: number;
  brightness?: number;
  className?: string;
}

/**
 * ShaderGradientBackground — animated 3D gradient mesh, brand-tokenized.
 * Wraps @shadergradient/react (ruucm/shadergradient), intake logged in
 * registries/design-assets.json. Defaults feed cosmic teal/blue/gold instead
 * of the library's own palette.
 *
 * One hero moment per page — this is a heavy WebGL layer, not a general-purpose
 * background. Respects prefers-reduced-motion (disables animation on request).
 * Route through design-verifier before shipping in a real page.
 */
export function ShaderGradientBackground({
  color1 = brand.atlanteanTeal,
  color2 = brand.cosmicBlue,
  color3 = brand.arcaneanGold,
  type = 'waterPlane',
  animate = 'on',
  cDistance = 5.7,
  cPolarAngle = 90,
  cAzimuthAngle = 180,
  brightness = 1.1,
  className,
}: ShaderGradientBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={1.5}
      fov={45}
      className={className}
    >
      <ShaderGradient
        control="props"
        type={type}
        color1={color1}
        color2={color2}
        color3={color3}
        animate={reducedMotion ? 'off' : animate}
        cDistance={cDistance}
        cPolarAngle={cPolarAngle}
        cAzimuthAngle={cAzimuthAngle}
        brightness={brightness}
      />
    </ShaderGradientCanvas>
  );
}
