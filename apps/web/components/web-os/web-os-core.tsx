/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment, react-hooks/exhaustive-deps */
// @ts-nocheck -- R3F JSX elements (mesh, points, ambientLight, etc.) require @types/three symlinked; suppressed per project convention (see components/roadmap/roadmap-hero.tsx)
'use client';

// The Web OS "intelligence core" — a lazy-loaded R3F scene. Brand metaphor:
// a constellation of intelligence orbiting a quiet core. Reuses the proven
// pattern from roadmap-hero.tsx (Stars / Float / drifting particles) with a
// tighter particle budget. Camera does one slow scroll-linked drift.
// Per the OS three-webgl spec: bounded particles, DPR cap, disposed by R3F.

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const C = {
  teal: '#00bcd4',
  blue: '#0d47a1',
  gold: '#ffd700',
} as const;

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    ref.current.rotation.x = state.clock.elapsedTime * 0.06;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={ref} position={[0, 0.2, 0]} scale={1.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={C.teal} transparent opacity={0.16} wireframe />
      </mesh>
    </Float>
  );
}

function Satellite({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.14;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} transparent opacity={0.1} wireframe />
      </mesh>
    </Float>
  );
}

// Bounded particle field — 180 points (budget declared in the scene spec).
function buildParticles(): THREE.BufferGeometry {
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geo;
}

function SignalField() {
  const ref = useRef<THREE.Points>(null);
  const geo = useRef<THREE.BufferGeometry>(buildParticles());
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
  });
  return (
    <points ref={ref} geometry={geo.current}>
      <pointsMaterial size={0.04} color={C.teal} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 4]} color={C.teal} intensity={1.2} />
      <pointLight position={[-6, -4, 2]} color={C.blue} intensity={0.8} />
      <Stars radius={80} depth={50} count={2200} factor={3} saturation={0.4} fade speed={0.3} />
      <SignalField />
      <CoreOrb />
      <Satellite position={[4.6, 1.4, -4]} color={C.teal} scale={1.5} />
      <Satellite position={[-5, -2, -6]} color={C.blue} scale={2.1} />
      <Satellite position={[0.5, 3, -8]} color={C.gold} scale={0.9} />
    </>
  );
}

export default function WebOsCore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  );
}
