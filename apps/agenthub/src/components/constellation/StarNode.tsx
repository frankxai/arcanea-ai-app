"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { type ConstellationNode } from "@/data/mock-constellation";
import { type Element } from "@arcanea/core";

interface StarNodeProps {
  node: ConstellationNode;
  onClick?: (node: ConstellationNode) => void;
  isHovered?: boolean;
}

const ELEMENT_COLORS: Record<Element, string> = {
  fire: "#ef4444",   // Red
  water: "#3b82f6",  // Blue
  earth: "#10b981",  // Emerald
  wind: "#06b6d4",   // Cyan
  void: "#8b5cf6",   // Violet
};

export function StarNode({ node, onClick, isHovered }: StarNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      const time = clock.getElapsedTime();
      const speed = 2.0; 
      const scale = 1 + Math.sin(time * speed) * 0.1;
      
      if (!isHovered) {
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1.5, 1.5, 1.5);
      }
    }
    
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isHovered ? 2.0 : 1.0 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }
  });

  const color = ELEMENT_COLORS[node.element] || "#ffffff";

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(node);
        }}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={color} 
          emissive={color}
          emissiveIntensity={1}
          toneMapped={false} 
        />
      </mesh>
      
      <Html distanceFactor={15} center>
        <div 
          className={`px-2 py-1 rounded border backdrop-blur-md text-xs font-mono whitespace-nowrap transition-all duration-300 pointer-events-none
            ${isHovered 
              ? 'bg-black/80 border-white/40 text-white opacity-100 z-10' 
              : 'bg-black/40 border-white/10 text-white/70 opacity-60'}`}
          style={{ transform: 'translate3d(0, -30px, 0)' }}
        >
          {node.name}
        </div>
      </Html>
    </group>
  );
}
