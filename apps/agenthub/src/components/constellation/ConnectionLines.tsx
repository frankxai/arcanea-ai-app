"use client";

import { Line } from "@react-three/drei";
import { type ConstellationNode } from "@/data/mock-constellation";

interface ConnectionLinesProps {
  nodes: ConstellationNode[];
  activeNodeId: string | null;
}

export function ConnectionLines({ nodes, activeNodeId }: ConnectionLinesProps) {
  const lines: { start: [number, number, number]; end: [number, number, number]; active: boolean }[] = [];

  nodes.forEach(node => {
    node.prerequisites.forEach(prereq => {
      const target = nodes.find(n => n.id === prereq.id);
      if (target) {
        const active = activeNodeId === node.id || activeNodeId === target.id;
        lines.push({
          start: node.position,
          end: target.position,
          active,
        });
      }
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#ffffff"
          opacity={line.active ? 0.8 : 0.15}
          transparent
          lineWidth={line.active ? 2 : 1}
        />
      ))}
    </group>
  );
}
