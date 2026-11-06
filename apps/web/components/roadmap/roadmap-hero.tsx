/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// @ts-nocheck -- R3F JSX elements (mesh, points, ambientLight, etc.) require @types/three symlinked; suppressed per project convention
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { brand, elements } from "@arcanea/design-system/tokens";
import { ErrorBoundary } from "@/components/error-boundary";

const THREE_COLORS = {
  atlanteanTeal: brand.atlanteanTeal,
  cosmicBlue: brand.cosmicBlue,
  void: elements.void.base,
} as const;

// Scene time (seconds) shown under reduced motion, and where the animation starts.
// Picked by eye: at 5.25s the star twinkle, 3 + sin(0.4t + 100), peaks; at 0 it is near its low.
const STILL_TIME = 5.25;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// three.js renders through WebGL2 only. Checking first skips the Canvas, and the
// renderer error it would log, on devices without it.
function hasWebGL2() {
  const gl = document.createElement("canvas").getContext("webgl2");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return Boolean(gl);
}

// ─── Scene clock ─────────────────────────────────────────────────────────────

// R3F's own loop keeps rendering off-screen, and changing `frameloop` resets the
// clock to 0, which would snap every orb back to its first pose. The canvas runs
// frameloop="never" and this advances the clock by hand: one frame for the still,
// a rAF loop only while `playing`, resuming from the time it stopped at.
function SceneClock({ playing }: { playing: boolean }) {
  const advance = useThree((state) => state.advance);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const gl = useThree((state) => state.gl);
  const time = useRef(STILL_TIME);

  // A resize clears the drawing buffer, and frameloop="never" does not repaint on its own.
  useEffect(() => {
    advance(time.current);
  }, [advance, size, dpr]);

  // three.js rebuilds its GPU state on restore (its listener was added first), but
  // with no loop running the canvas stays blank until something draws a frame.
  useEffect(() => {
    const canvas = gl.domElement;
    const repaint = () => advance(time.current);
    canvas.addEventListener("webglcontextrestored", repaint);
    return () => canvas.removeEventListener("webglcontextrestored", repaint);
  }, [advance, gl]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = -1;
    const tick = (now: number) => {
      // Capped so a tab returning from the background resumes instead of jumping ahead.
      if (last >= 0) time.current += Math.min((now - last) / 1000, 0.25);
      last = now;
      advance(time.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [advance, playing]);

  return null;
}

// ─── Floating orb geometry ───────────────────────────────────────────────────

function FloatingOrb({
  position,
  color,
  scale,
  still,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  still: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    // Float starts from a random offset; disabled, the orb rests at its declared position.
    <Float
      enabled={!still}
      speed={1.2}
      rotationIntensity={0.4}
      floatIntensity={0.8}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// ─── Drifting particle field ──────────────────────────────────────────────────

function buildParticleGeo(): THREE.BufferGeometry {
  const count = 280;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(buildParticleGeo());

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.018;
    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.006) * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geoRef.current}>
      <pointsMaterial
        size={0.045}
        color={THREE_COLORS.atlanteanTeal}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function HeroScene({ still }: { still: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        position={[6, 6, 4]}
        color={THREE_COLORS.atlanteanTeal}
        intensity={1.2}
      />
      <pointLight
        position={[-6, -4, 2]}
        color={THREE_COLORS.cosmicBlue}
        intensity={0.8}
      />

      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.4}
        fade
        speed={0.4}
      />

      <ParticleField />

      <FloatingOrb
        position={[4.5, 1.5, -4]}
        color={THREE_COLORS.atlanteanTeal}
        scale={1.8}
        still={still}
      />
      <FloatingOrb
        position={[-5, -2, -6]}
        color={THREE_COLORS.cosmicBlue}
        scale={2.4}
        still={still}
      />
      <FloatingOrb
        position={[0, 3, -8]}
        color={THREE_COLORS.void}
        scale={1.2}
        still={still}
      />
    </>
  );
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-xs tracking-widest uppercase text-text-muted font-body">
        Scroll
      </span>
      <svg
        className="w-5 h-5 text-aquamarine"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─── Hero component ───────────────────────────────────────────────────────────

export function RoadmapHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
  const [webgl, setWebgl] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => setWebgl(hasWebGL2()), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js canvas — non-interactive background. Without WebGL2 the page background and vignette carry the section. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {webgl && (
          // The probe can pass while three.js still fails to create its renderer; the
          // boundary keeps that failure inside this layer. The fallback is an empty
          // fragment because the boundary shows its error card for a falsy one.
          <ErrorBoundary fallback={<></>}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
              frameloop="never"
              style={{ background: "transparent" }}
            >
              <SceneClock playing={inView && !reduced} />
              <HeroScene still={reduced} />
            </Canvas>
          </ErrorBoundary>
        )}
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, hsl(240 6% 4%) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-aquamarine/20 bg-aquamarine/[0.06] mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-aquamarine animate-pulse"
            aria-hidden="true"
          />
          <span className="text-xs font-mono tracking-widest uppercase text-aquamarine">
            Product Roadmap
          </span>
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-6 leading-[1.05]">
          The Journey{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, hsl(160 100% 75%), hsl(195 80% 55%), hsl(265 60% 65%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ahead
          </span>
        </h1>

        <p className="font-body text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
          Six phases from foundation to expansion. Every feature feeding the
          same creative graph.
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
