"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Stars({ count = 1100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      pts[i * 3] = (Math.random() - 0.5) * 20;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pts;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#9fe5ff"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function CoreCrystal() {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={1} floatIntensity={0.7}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshPhysicalMaterial
            color="#c3f6ff"
            transmission={0.9}
            roughness={0.08}
            thickness={1.2}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#44bfff"
            emissiveIntensity={0.18}
          />
        </mesh>
      </Float>
      <mesh ref={ringRef} scale={2.1} rotation={[Math.PI / 2.4, 0, 0.4]}>
        <torusGeometry args={[1.2, 0.022, 20, 180]} />
        <meshStandardMaterial color="#8ed8ff" emissive="#72c9ff" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export function V4Scene() {
  return (
    <div className="absolute inset-0 -z-20">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6.2], fov: 48 }}
      >
        <color attach="background" args={["#060b17"]} />
        <fog attach="fog" args={["#060b17", 5.5, 19]} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[3, 2.5, 4]} intensity={1.2} color="#76d8ff" />
        <directionalLight position={[-3, -2, -3]} intensity={0.5} color="#8086ff" />
        <Stars />
        <CoreCrystal />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(61,166,255,0.14),transparent_44%),radial-gradient(circle_at_74%_28%,rgba(94,255,206,0.11),transparent_43%),radial-gradient(circle_at_56%_86%,rgba(128,94,255,0.14),transparent_46%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,23,0.25)_0%,rgba(6,11,23,0.78)_68%,rgba(6,11,23,0.98)_100%)]" />
    </div>
  );
}
