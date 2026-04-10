'use client';

import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { VaultEntry } from '@/lib/vault-data';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';

// 3D positions for vault regions (scattered around origin)
const REGION_POSITIONS: Record<VaultCategory, [number, number, number]> = {
  strategic:   [-5, 2, -2],
  technical:   [0, 3, -1],
  creative:    [5, 2, -2],
  operational: [-4, -2, 1],
  wisdom:      [1, -3, 2],
  horizon:     [5, -2, 0],
};

interface StarData {
  position: [number, number, number];
  color: THREE.Color;
  scale: number;
  entry: VaultEntry;
  region: VaultCategory;
  phase: number;
}

function buildStars(entries: VaultEntry[]): StarData[] {
  const stars: StarData[] = [];
  const regionCounts: Record<string, number> = {};

  for (const entry of entries) {
    const cat = entry.vault as VaultCategory;
    const config = VAULT_CONFIG[cat];
    if (!config) continue;

    const pos = REGION_POSITIONS[cat];
    const idx = regionCounts[cat] ?? 0;
    regionCounts[cat] = idx + 1;

    // Golden angle scattering in 3D
    const angle = idx * 2.399963;
    const dist = 0.4 + Math.sqrt(idx) * 0.3;
    const phi = idx * 1.11;

    const x = pos[0] + Math.cos(angle) * dist;
    const y = pos[1] + Math.sin(angle) * dist * 0.6;
    const z = pos[2] + Math.sin(phi) * 0.4;

    const confidence = entry.confidence === 'high' ? 1 : entry.confidence === 'medium' ? 0.7 : 0.4;

    stars.push({
      position: [x, y, z],
      color: new THREE.Color(config.color),
      scale: 0.04 + confidence * 0.06,
      entry,
      region: cat,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return stars;
}

function Stars({ stars, onHover, hoveredIdx }: {
  stars: StarData[];
  onHover: (idx: number, screen?: { x: number; y: number }) => void;
  hoveredIdx: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const revealProgress = useRef(0);
  const { camera, size } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    revealProgress.current = Math.min(1, revealProgress.current + 0.008);
    const t = state.clock.elapsedTime;

    stars.forEach((star, i) => {
      // Staggered reveal
      const staggerDelay = i * 0.01;
      const progress = Math.max(0, Math.min(1, (revealProgress.current - staggerDelay) * 2));
      if (progress <= 0) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        return;
      }

      // Ambient Brownian drift
      const driftX = Math.sin(t * 0.3 + star.phase) * 0.02;
      const driftY = Math.cos(t * 0.4 + star.phase) * 0.02;
      const driftZ = Math.sin(t * 0.5 + star.phase * 1.3) * 0.02;

      dummy.position.set(
        star.position[0] + driftX,
        star.position[1] + driftY,
        star.position[2] + driftZ,
      );

      const hoverScale = hoveredIdx === i ? 2.2 : 1;
      const finalScale = star.scale * progress * hoverScale;
      dummy.scale.setScalar(finalScale);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, star.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  function handlePointerMove(e: THREE.Event & { instanceId?: number; clientX?: number; clientY?: number }) {
    if (e.instanceId !== undefined && e.clientX !== undefined && e.clientY !== undefined) {
      const rect = (e as unknown as { target: HTMLElement }).target?.getBoundingClientRect?.();
      if (rect) {
        onHover(e.instanceId, { x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        onHover(e.instanceId);
      }
    }
  }

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, stars.length]}
        onPointerMove={handlePointerMove as unknown as (e: unknown) => void}
        onPointerOut={() => onHover(-1)}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} transparent blending={THREE.AdditiveBlending} />
      </instancedMesh>
      {/* Glow halos — second pass, larger, lower opacity, additive blending for bloom effect */}
      <GlowHalos stars={stars} hoveredIdx={hoveredIdx} />
    </>
  );
}

function GlowHalos({ stars, hoveredIdx }: { stars: StarData[]; hoveredIdx: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    stars.forEach((star, i) => {
      const driftX = Math.sin(t * 0.3 + star.phase) * 0.02;
      const driftY = Math.cos(t * 0.4 + star.phase) * 0.02;
      const driftZ = Math.sin(t * 0.5 + star.phase * 1.3) * 0.02;

      dummy.position.set(
        star.position[0] + driftX,
        star.position[1] + driftY,
        star.position[2] + driftZ,
      );

      const pulse = 1 + Math.sin(t * 1.5 + star.phase) * 0.1;
      const hoverBoost = hoveredIdx === i ? 1.8 : 1;
      dummy.scale.setScalar(star.scale * 6 * pulse * hoverBoost);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      const haloColor = star.color.clone().multiplyScalar(hoveredIdx === i ? 0.5 : 0.2);
      meshRef.current!.setColorAt(i, haloColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh args={[undefined, undefined, stars.length]} ref={meshRef}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial toneMapped={false} transparent blending={THREE.AdditiveBlending} opacity={0.3} depthWrite={false} />
    </instancedMesh>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    // Parallax camera based on mouse
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function VaultConstellation3D({ entries }: { entries: VaultEntry[] }) {
  const stars = useMemo(() => buildStars(entries), [entries]);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; entry: VaultEntry } | null>(null);

  if (entries.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-[#708094] text-sm">No insights yet.</p>
      </div>
    );
  }

  function handleHover(idx: number, screen?: { x: number; y: number }) {
    setHoveredIdx(idx);
    if (idx >= 0 && screen) {
      setTooltip({ x: screen.x, y: screen.y, entry: stars[idx].entry });
    } else {
      setTooltip(null);
    }
  }

  function handleClick() {
    if (hoveredIdx >= 0) {
      const el = document.getElementById(`entry-${stars[hoveredIdx].entry.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return (
    <div className="relative h-[65vh] min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onClick={handleClick}
      >
        <Suspense fallback={null}>
          <Stars stars={stars} onHover={handleHover} hoveredIdx={hoveredIdx} />
          <CameraRig />
        </Suspense>
      </Canvas>

      {/* Region labels as HTML overlay */}
      <div className="pointer-events-none absolute inset-0">
        {(Object.entries(REGION_POSITIONS) as [VaultCategory, [number, number, number]][]).map(([cat, pos]) => {
          const config = VAULT_CONFIG[cat];
          const count = entries.filter((e) => e.vault === cat).length;
          // Project 3D to 2D roughly for label positioning
          const xPct = 50 + (pos[0] / 10) * 40;
          const yPct = 50 - (pos[1] / 8) * 30;
          return (
            <div
              key={cat}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${xPct}%`, top: `${yPct - 12}%` }}
            >
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: `${config.color}80` }}>
                {config.label}
              </p>
              {count > 0 && (
                <p className="text-[9px] font-mono" style={{ color: `${config.color}50` }}>
                  {count}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 max-w-xs px-4 py-2.5 rounded-lg bg-[#0d1220]/95 border border-white/[0.08] backdrop-blur-xl text-xs text-[#e6eefc] leading-relaxed shadow-2xl"
          style={{
            left: Math.min(tooltip.x + 16, 400),
            top: tooltip.y - 12,
            transform: 'translateY(-100%)',
            animation: 'tooltipIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {tooltip.entry.content.slice(0, 140)}{tooltip.entry.content.length > 140 ? '…' : ''}
        </div>
      )}

      <style jsx>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(-100%) scale(0.95); filter: blur(8px); }
          to { opacity: 1; transform: translateY(-100%) scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
