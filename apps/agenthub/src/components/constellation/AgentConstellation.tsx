"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { MOCK_CONSTELLATION } from "@/data/mock-constellation";
import { StarNode } from "./StarNode";
import { ConnectionLines } from "./ConnectionLines";

export function AgentConstellation() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-black/90 rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      
      {activeNodeId && (
        <div className="absolute top-4 right-4 z-10 w-64 glass-panel p-4 animate-in slide-in-from-right-4 fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white">Skill Details</h3>
            <button 
              onClick={() => setActiveNodeId(null)}
              className="text-white/50 hover:text-white"
            >
              ×
            </button>
          </div>
          {MOCK_CONSTELLATION.filter(n => n.id === activeNodeId).map(node => (
            <div key={node.id} className="space-y-3">
              <div>
                <div className="text-lg text-brand-primary">{node.name}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{node.element} • {node.gate} Gate</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-white/50">Level</div>
                  <div className="text-white font-mono">{node.level}</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-white/50">Rank</div>
                  <div className="text-white capitalize">{node.rank}</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-white/50">Invocations</div>
                  <div className="text-white font-mono">{node.invocations}</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-white/50">Success</div>
                  <div className="text-white font-mono">{(node.successRate * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ConnectionLines 
            nodes={MOCK_CONSTELLATION} 
            activeNodeId={activeNodeId} 
          />
          
          {MOCK_CONSTELLATION.map((node) => (
            <StarNode 
              key={node.id} 
              node={node} 
              isHovered={activeNodeId === node.id}
              onClick={(n) => setActiveNodeId(n.id === activeNodeId ? null : n.id)} 
            />
          ))}

          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Suspense>

        <OrbitControls 
          makeDefault
          enableDamping 
          dampingFactor={0.05}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
