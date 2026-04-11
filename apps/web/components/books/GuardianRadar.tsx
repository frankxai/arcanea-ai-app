'use client';

/**
 * GuardianRadar — Recharts-powered radar of the 5 Guardian scores.
 * Replaces ~200 lines of hand-rolled SVG with a tuned RadarChart.
 */

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export type GuardianGrade = 'luminor' | 'master' | 'apprentice' | 'none';

export interface GuardianRadarProps {
  scores: { voice: number; craft: number; originality: number; depth: number; resonance: number };
  size?: number;
  showLabels?: boolean;
  grade?: GuardianGrade;
  className?: string;
}

const GRADE_COLORS: Record<GuardianGrade, { stroke: string; fill: string; label: string }> = {
  luminor: { stroke: '#ffd700', fill: 'rgba(255,215,0,0.22)', label: 'Luminor Grade' },
  master: { stroke: '#c0c0c0', fill: 'rgba(192,192,192,0.18)', label: 'Master Grade' },
  apprentice: { stroke: '#cd7f32', fill: 'rgba(205,127,50,0.18)', label: 'Apprentice Grade' },
  none: { stroke: '#00bcd4', fill: 'rgba(0,188,212,0.16)', label: 'Unrated' },
};

const clamp = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0);

export function GuardianRadar({
  scores,
  size = 300,
  showLabels = true,
  grade = 'none',
  className,
}: GuardianRadarProps) {
  const colors = GRADE_COLORS[grade];
  const data = [
    { dimension: 'Voice', value: clamp(scores.voice) },
    { dimension: 'Craft', value: clamp(scores.craft) },
    { dimension: 'Originality', value: clamp(scores.originality) },
    { dimension: 'Depth', value: clamp(scores.depth) },
    { dimension: 'Resonance', value: clamp(scores.resonance) },
  ];
  const summary = `Guardian radar. Grade: ${colors.label}. ${data
    .map((d) => `${d.dimension}: ${d.value.toFixed(1)} of 10.`)
    .join(' ')}`;

  return (
    <figure className={className} role="img" aria-label={summary} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
          {showLabels && (
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}
            />
          )}
          <PolarRadiusAxis domain={[0, 10]} axisLine={false} tick={false} tickCount={6} />
          <Radar
            name="Guardian scores"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={colors.fill}
            fillOpacity={1}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}

export default GuardianRadar;
