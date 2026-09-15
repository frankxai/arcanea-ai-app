"use client";

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

interface ProofNode {
  label: string;
  state: string;
  position: Vec3;
  color: string;
  scale: number;
}

const proofNodes: ProofNode[] = [
  { label: "Genesis", state: "live", position: [-2.55, 0.82, 0.04], color: "#ffd700", scale: 0.13 },
  { label: "World", state: "staged", position: [-1.35, -1.18, 0.2], color: "#00bcd4", scale: 0.105 },
  { label: "Author", state: "staged", position: [0.96, -1.28, -0.02], color: "#f1f3f9", scale: 0.095 },
  { label: "Visual", state: "review", position: [2.38, 0.52, 0.14], color: "#c5a26f", scale: 0.112 },
  { label: "Canon", state: "draft", position: [0.22, 1.78, -0.1], color: "#a78bfa", scale: 0.1 },
  { label: "Rights", state: "closed", position: [1.62, 1.14, -0.16], color: "#fda4af", scale: 0.092 },
];

const ringRotations: Vec3[] = [
  [Math.PI / 2, 0, 0],
  [Math.PI / 2.28, 0.62, 0.18],
  [Math.PI / 2.08, -0.54, -0.32],
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ProofCoreScene() {
  const systemRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);

  const paperLeaves = useMemo(() => [-1.2, -0.6, 0, 0.6, 1.2], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (systemRef.current) {
      systemRef.current.rotation.y = Math.sin(t * 0.18) * 0.12;
      systemRef.current.rotation.x = -0.04 + Math.sin(t * 0.14) * 0.03;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.18;
      coreRef.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.16;
      innerRef.current.rotation.y = t * 0.22;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.07;
    }

    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const pulse = 1 + Math.sin(t * 1.05 + index * 0.72) * 0.06;
      node.scale.setScalar(pulse);
    });
  });

  return (
    <>
      <ambientLight intensity={0.48} />
      <directionalLight position={[3.4, 3.8, 4.8]} intensity={2.1} color="#f8ecd4" />
      <pointLight position={[-3.8, 1.2, 2.4]} intensity={14} color="#00bcd4" distance={7} />
      <pointLight position={[2.6, -1.7, 2.2]} intensity={8} color="#ffd700" distance={6} />
      <fog attach="fog" args={["#05070f", 7.2, 12.6]} />

      <group ref={systemRef} position={[0, 0.12, 0]}>
        <group ref={ringGroupRef}>
          {ringRotations.map((rotation, index) => (
            <mesh key={rotation.join("-")} rotation={rotation}>
              <torusGeometry args={[1.65 + index * 0.36, 0.012, 18, 180]} />
              <meshStandardMaterial
                color={index === 0 ? "#ffd700" : index === 1 ? "#00bcd4" : "#f1f3f9"}
                emissive={index === 0 ? "#6d4e12" : index === 1 ? "#004b55" : "#242a3b"}
                emissiveIntensity={0.34}
                metalness={0.82}
                roughness={0.24}
              />
            </mesh>
          ))}
        </group>

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.98, 1]} />
          <meshPhysicalMaterial
            color="#dcecff"
            flatShading
            roughness={0.045}
            metalness={0}
            transmission={0.68}
            thickness={1.24}
            ior={1.46}
            clearcoat={1}
            clearcoatRoughness={0.08}
            attenuationColor="#00bcd4"
            attenuationDistance={2.8}
            emissive="#00bcd4"
            emissiveIntensity={0.1}
          />
        </mesh>

        <mesh scale={1.014}>
          <icosahedronGeometry args={[0.98, 1]} />
          <meshBasicMaterial color="#f8e6ae" transparent opacity={0.2} wireframe />
        </mesh>

        <mesh ref={innerRef} scale={0.46}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#7b5313"
            emissiveIntensity={0.22}
            metalness={0.86}
            roughness={0.28}
          />
        </mesh>

        <group position={[0, -1.76, -0.42]} rotation={[-0.72, 0, 0]}>
          {paperLeaves.map((x, index) => (
            <mesh key={x} position={[x, 0, index * -0.018]} rotation={[0, 0, (index - 2) * 0.025]}>
              <boxGeometry args={[0.46, 1.72, 0.024]} />
              <meshStandardMaterial
                color={index === 2 ? "#d3b982" : "#927849"}
                emissive="#2c2314"
                emissiveIntensity={0.14}
                metalness={0.18}
                roughness={0.55}
                transparent
                opacity={0.68}
              />
            </mesh>
          ))}
        </group>

        {proofNodes.map((node, index) => (
          <group key={node.label} position={node.position}>
            <mesh
              ref={(mesh) => {
                nodeRefs.current[index] = mesh;
              }}
            >
              <sphereGeometry args={[node.scale, 28, 28]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.44}
                metalness={0.42}
                roughness={0.22}
              />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 8]}>
              <ringGeometry args={[node.scale * 1.65, node.scale * 2.2, 52]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.22} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

function ProofCorePoster({ reduced }: { reduced?: boolean }) {
  return (
    <div
      className="relative h-[520px] w-full overflow-hidden md:h-[640px]"
      data-arcanea-proof-core={reduced ? "reduced-motion" : "static-poster"}
    >
      <Image
        src="/brand/arcanea-genesis-proof-relic.png"
        alt="Arcanea Genesis proof relic material poster."
        fill
        priority
        sizes="(min-width: 1024px) 48vw, 100vw"
        className="object-cover opacity-72"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.1),rgba(5,7,15,0.68)_78%,rgba(5,7,15,0.95))]" />
      <div className="absolute left-0 top-6 max-w-[15rem] border-l border-[var(--arc-brand-arcanean-gold)]/50 bg-black/38 px-4 py-3 backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--arc-brand-arcanean-gold)]">
          Proof Core
        </p>
        <p className="mt-2 text-sm leading-5 text-white/68">
          {reduced ? "Static material proof for reduced motion." : "Static proof poster while the core initializes."}
        </p>
      </div>
    </div>
  );
}

export function ArcaneaProofCore() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reducedMotion) {
    return <ProofCorePoster reduced={reducedMotion} />;
  }

  return (
    <div
      aria-label="Arcanea Genesis proof core, a WebGL material system connecting Genesis, world graph, author, visual, canon, and rights review."
      className="relative h-[560px] w-full overflow-hidden md:h-[700px]"
      data-arcanea-proof-core="webgl"
    >
      <div className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(0,188,212,0.56),rgba(255,215,0,0.42),transparent)]" />
      <div className="absolute inset-y-8 left-1/2 w-px bg-[linear-gradient(180deg,transparent,rgba(255,215,0,0.34),rgba(0,188,212,0.4),transparent)]" />

      <Canvas
        camera={{ position: [0, 0.16, 6.7], fov: 38 }}
        className="absolute inset-0 h-full w-full"
        dpr={[1, 1.55]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ height: "100%", width: "100%" }}
      >
        <Suspense fallback={null}>
          <ProofCoreScene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-0 top-6 max-w-[14.8rem] border-l border-[var(--arc-brand-arcanean-gold)]/48 bg-black/34 px-4 py-3 backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--arc-brand-arcanean-gold)]">
          Genesis Core
        </p>
        <p className="mt-2 text-sm leading-5 text-white/68">Glass proof object with a gold provenance seal.</p>
      </div>

      <div className="pointer-events-none absolute right-0 top-10 hidden max-w-[13.8rem] border-r border-[var(--arc-brand-atlantean-teal)]/48 bg-black/30 px-4 py-3 text-right backdrop-blur-md sm:block">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--arc-brand-atlantean-teal)]">
          Orbit Lanes
        </p>
        <p className="mt-2 text-sm leading-5 text-white/62">World, author, visual, canon, and rights stay in view.</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 grid gap-2 sm:grid-cols-3">
        {proofNodes.slice(0, 3).map((node) => (
          <div key={node.label} className="border border-white/[0.08] bg-black/42 px-3 py-2 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/42">{node.label}</span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/64">{node.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
