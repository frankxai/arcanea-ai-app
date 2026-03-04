"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function StarField({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      pts[i * 3] = (Math.random() - 0.5) * 24;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return pts;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#8fd8ff"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
}

function EvolutionCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.18;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.08;
      haloRef.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={1.25} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.18, 1]} />
          <meshPhysicalMaterial
            color="#b8f4ff"
            roughness={0.08}
            metalness={0.12}
            transmission={0.88}
            thickness={1.3}
            ior={1.42}
            clearcoat={1}
            clearcoatRoughness={0.06}
            emissive="#45c9ff"
            emissiveIntensity={0.18}
          />
        </mesh>
      </Float>

      <mesh ref={haloRef} scale={2.2} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[1.22, 0.024, 20, 180]} />
        <meshStandardMaterial color="#8ad2ff" emissive="#66d0ff" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

export function EvolutionScene() {
  return (
    <div className="absolute inset-0 -z-20">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6.2], fov: 48 }}
      >
        <color attach="background" args={["#070b16"]} />
        <fog attach="fog" args={["#070b16", 6, 20]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 3, 4]} intensity={1.35} color="#7bd8ff" />
        <directionalLight position={[-3, -2, -3]} intensity={0.52} color="#6f7cff" />
        <StarField />
        <EvolutionCore />
      </Canvas>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(65,158,255,0.16),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(94,255,204,0.12),transparent_44%),radial-gradient(circle_at_50%_88%,rgba(140,88,255,0.16),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,22,0.2)_0%,rgba(7,11,22,0.78)_70%,rgba(7,11,22,0.98)_100%)]" />
    </div>
  );
}
