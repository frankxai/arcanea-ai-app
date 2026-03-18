'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ----------------------------------------------------------------
 *  Floating elemental orb that pulses and distorts
 * ---------------------------------------------------------------- */
function ElementalOrb({
  position,
  color,
  speed = 1,
  distort = 0.3,
  size = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.3) * 0.2;
    meshRef.current.rotation.y = clock.elapsedTime * speed * 0.15;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={speed * 2}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

/* ----------------------------------------------------------------
 *  Mana particle ring orbiting the scene
 * ---------------------------------------------------------------- */
function ManaRing({ color, radius = 4, count = 80 }: { color: string; radius?: number; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3;
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.1;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ----------------------------------------------------------------
 *  Exported 3D Arena Scene
 * ---------------------------------------------------------------- */
export function ArenaScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffd700" />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#7c3aed" />
        <pointLight position={[0, -8, 5]} intensity={0.2} color="#06b6d4" />

        {/* Five Elemental Orbs */}
        <ElementalOrb position={[-3, 1.5, -2]} color="#ff6b35" speed={0.8} distort={0.4} size={0.6} />
        <ElementalOrb position={[3, 0.5, -1]} color="#60a5fa" speed={1.2} distort={0.25} size={0.5} />
        <ElementalOrb position={[0, -1, -3]} color="#34d399" speed={0.6} distort={0.35} size={0.55} />
        <ElementalOrb position={[-2, -0.5, 1]} color="#c4b5fd" speed={1.5} distort={0.2} size={0.45} />
        <ElementalOrb position={[2, 2, 0]} color="#a78bfa" speed={1} distort={0.5} size={0.7} />

        {/* Central golden nexus */}
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <Sphere args={[0.3, 32, 32]} position={[0, 0.5, 0]}>
            <MeshDistortMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={1}
              roughness={0}
              metalness={1}
              distort={0.6}
              speed={3}
              transparent
              opacity={0.9}
            />
          </Sphere>
        </Float>

        {/* Mana rings */}
        <ManaRing color="#ffd700" radius={3} count={60} />
        <ManaRing color="#7c3aed" radius={5} count={100} />
        <ManaRing color="#06b6d4" radius={4} count={80} />

        {/* Starfield backdrop */}
        <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
