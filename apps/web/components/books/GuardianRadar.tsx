'use client';

/**
 * GuardianRadar — pure-SVG pentagon radar chart for the 5 Guardian scores.
 *
 * No external charting library. Hand-rolled so we can tune the aesthetic
 * to the Arcanea design system (glass / gold / teal) and stay bundle-light.
 *
 * The radar:
 *   - 5 axes, one per Guardian dimension
 *   - 5 concentric gridlines at score levels 2/4/6/8/10
 *   - Filled polygon connecting the plotted scores
 *   - Axis labels and numeric score at each vertex
 *   - Color keyed to composite grade (luminor/master/apprentice/none)
 *   - Animates in on mount (polygon scale from 0 to 1)
 *   - ARIA-labeled with a text fallback
 */

import { useEffect, useState } from 'react';

export type GuardianGrade = 'luminor' | 'master' | 'apprentice' | 'none';

export interface GuardianRadarProps {
  scores: {
    voice: number;
    craft: number;
    originality: number;
    depth: number;
    resonance: number;
  };
  size?: number;
  showLabels?: boolean;
  grade?: GuardianGrade;
  className?: string;
}

interface AxisMeta {
  key: keyof GuardianRadarProps['scores'];
  label: string;
  /** angle in radians, with 0 = straight up */
  angle: number;
}

// Pentagon vertices starting from the top and going clockwise
const AXES: AxisMeta[] = [
  { key: 'voice', label: 'Voice', angle: 0 },
  { key: 'craft', label: 'Craft', angle: (2 * Math.PI) / 5 },
  { key: 'originality', label: 'Originality', angle: (4 * Math.PI) / 5 },
  { key: 'depth', label: 'Depth', angle: (6 * Math.PI) / 5 },
  { key: 'resonance', label: 'Resonance', angle: (8 * Math.PI) / 5 },
];

const GRADE_COLORS: Record<GuardianGrade, { stroke: string; fill: string; text: string; label: string }> = {
  luminor: {
    stroke: '#ffd700',
    fill: 'rgba(255, 215, 0, 0.18)',
    text: '#ffd700',
    label: 'Luminor Grade',
  },
  master: {
    stroke: '#c0c0c0',
    fill: 'rgba(192, 192, 192, 0.15)',
    text: '#d4d4d4',
    label: 'Master Grade',
  },
  apprentice: {
    stroke: '#cd7f32',
    fill: 'rgba(205, 127, 50, 0.15)',
    text: '#cd7f32',
    label: 'Apprentice Grade',
  },
  none: {
    stroke: '#00bcd4',
    fill: 'rgba(0, 188, 212, 0.12)',
    text: '#00bcd4',
    label: 'Unrated',
  },
};

function polar(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  // angle 0 = straight up (north); clockwise positive
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

function clampScore(s: number): number {
  if (!Number.isFinite(s)) return 0;
  return Math.max(0, Math.min(10, s));
}

export function GuardianRadar({
  scores,
  size = 300,
  showLabels = true,
  grade = 'none',
  className,
}: GuardianRadarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Kick the animation on next paint
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const padding = showLabels ? 56 : 24;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - padding;

  const colors = GRADE_COLORS[grade];

  // Gridline rings: score = 2, 4, 6, 8, 10
  const rings = [2, 4, 6, 8, 10].map((level) => {
    const r = (level / 10) * radius;
    const points = AXES.map((axis) => {
      const p = polar(cx, cy, r, axis.angle);
      return `${p.x},${p.y}`;
    }).join(' ');
    return { level, points };
  });

  // Axis lines from center to outer vertex
  const axisLines = AXES.map((axis) => {
    const outer = polar(cx, cy, radius, axis.angle);
    return { x: outer.x, y: outer.y };
  });

  // Plotted polygon for actual scores
  const plottedPoints = AXES.map((axis) => {
    const score = clampScore(scores[axis.key]);
    const r = (score / 10) * radius;
    const p = polar(cx, cy, r, axis.angle);
    return { ...p, score };
  });
  const polygonPoints = plottedPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Labels placed just outside outer ring
  const labelRadius = radius + 22;
  const labelPositions = AXES.map((axis) => polar(cx, cy, labelRadius, axis.angle));

  // Accessible text summary
  const summaryText = [
    `Guardian radar. Grade: ${colors.label}.`,
    ...AXES.map(
      (axis) => `${axis.label}: ${clampScore(scores[axis.key]).toFixed(1)} of 10.`,
    ),
  ].join(' ');

  return (
    <figure
      className={className}
      role="img"
      aria-label={summaryText}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
        aria-hidden="true"
      >
        {/* Gridline rings */}
        {rings.map((ring) => (
          <polygon
            key={ring.level}
            points={ring.points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((end, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Plotted polygon (animated) */}
        <g
          style={{
            transform: mounted ? 'scale(1)' : 'scale(0)',
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <polygon
            points={polygonPoints}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* Vertex dots */}
          {plottedPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={colors.stroke}
              stroke="#09090b"
              strokeWidth={1.5}
            />
          ))}
        </g>

        {/* Score numbers at each vertex */}
        {showLabels &&
          plottedPoints.map((p, i) => {
            const axis = AXES[i];
            // Nudge score text slightly toward center so it sits on the polygon
            const inward = polar(cx, cy, (p.score / 10) * radius - 10, axis.angle);
            return (
              <text
                key={`score-${i}`}
                x={inward.x}
                y={inward.y + 4}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={colors.text}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 600ms 400ms ease-out',
                }}
              >
                {p.score.toFixed(1)}
              </text>
            );
          })}

        {/* Axis labels */}
        {showLabels &&
          labelPositions.map((pos, i) => {
            const axis = AXES[i];
            // Choose text-anchor based on x-position relative to center
            const anchor =
              Math.abs(pos.x - cx) < 8
                ? 'middle'
                : pos.x < cx
                  ? 'end'
                  : 'start';
            return (
              <text
                key={`label-${i}`}
                x={pos.x}
                y={pos.y + 4}
                textAnchor={anchor}
                fontSize={12}
                fontFamily="Space Grotesk, sans-serif"
                fontWeight={500}
                fill="rgba(255, 255, 255, 0.65)"
              >
                {axis.label}
              </text>
            );
          })}
      </svg>
      <figcaption className="sr-only">{summaryText}</figcaption>
    </figure>
  );
}

export default GuardianRadar;
