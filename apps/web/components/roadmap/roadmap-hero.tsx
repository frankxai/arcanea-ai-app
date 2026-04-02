/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- R3F JSX elements (mesh, points, ambientLight, etc.) require @types/three symlinked; suppressed per project convention
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Floating orb geometry ───────────────────────────────────────────────────

function FloatingOrb({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
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
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geo;
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(buildParticleGeo());

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.018;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.006) * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geoRef.current}>
      <pointsMaterial
        size={0.045}
        color="#7fffd4"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 4]} color="#7fffd4" intensity={1.2} />
      <pointLight position={[-6, -4, 2]} color="#78a6ff" intensity={0.8} />

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

      <FloatingOrb position={[4.5, 1.5, -4]} color="#7fffd4" scale={1.8} />
      <FloatingOrb position={[-5, -2, -6]} color="#78a6ff" scale={2.4} />
      <FloatingOrb position={[0, 3, -8]} color="#c084fc" scale={1.2} />
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
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js canvas — non-interactive background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <HeroScene />
        </Canvas>
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, hsl(240 6% 4%) 100%)',
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
          The Journey{' '}
          <span
            style={{
              background:
                'linear-gradient(135deg, hsl(160 100% 75%), hsl(195 80% 55%), hsl(265 60% 65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
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
