
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Stars(props: any) {
    const ref = useRef<THREE.Points>(null);

    // Custom sphere generation logic
    const sphere = useMemo(() => {
        const points = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const r = 1.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            points[i * 3] = x;
            points[i * 3 + 1] = y;
            points[i * 3 + 2] = z;
        }
        return points;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#8b5cf6"
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}


function NeuralSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={[2, 0, 0]} scale={1.5}>
            <icosahedronGeometry args={[1, 15]} />
            <meshStandardMaterial
                color="#000"
                emissive="#7c3aed"
                emissiveIntensity={0.8}
                wireframe
                transparent
                opacity={0.3}
            />
        </mesh>
    )
}


export default function Scene() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
                {/* <NeuralSphere />  Maybe enable later for complexity */}
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
}
