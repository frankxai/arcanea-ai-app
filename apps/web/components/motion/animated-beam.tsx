'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';

interface Props {
  /** Container ref — should be position:relative ancestor */
  containerRef: RefObject<HTMLElement | null>;
  /** Source DOM node ref */
  fromRef: RefObject<HTMLElement | null>;
  /** Destination DOM node ref */
  toRef: RefObject<HTMLElement | null>;
  /** Curve intensity: 0 = straight, higher = more curve */
  curvature?: number;
  /** Gradient start color */
  fromColor?: string;
  /** Gradient end color */
  toColor?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Path stroke width */
  strokeWidth?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Reverse animation direction */
  reverse?: boolean;
}

/**
 * AnimatedBeam — April 2026 SVG beam connecting two DOM nodes.
 *
 * Measures bounding rects of `fromRef` and `toRef` relative to `containerRef`,
 * draws a cubic bezier path between them, and animates a gradient sweep along
 * the path. Updates on resize via ResizeObserver.
 *
 * Use for:
 * - Architecture diagrams (connect layer cards)
 * - Data flow visualizations (source → agent → output)
 * - Relationship maps between entities
 *
 * Container must be position:relative. Source + destination must exist before
 * mount. Uses pointer-events-none so it doesn't block card interactions.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  fromColor = '#00bcd4',
  toColor = '#a78bfa',
  duration = 3,
  strokeWidth = 1.5,
  delay = 0,
  reverse = false,
}: Props) {
  const id = useId();
  const [path, setPath] = useState('');
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function compute() {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const from = fromRef.current.getBoundingClientRect();
      const to = toRef.current.getBoundingClientRect();

      setBox({ width: container.width, height: container.height });

      const fromX = from.left - container.left + from.width / 2;
      const fromY = from.top - container.top + from.height / 2;
      const toX = to.left - container.left + to.width / 2;
      const toY = to.top - container.top + to.height / 2;

      const midX = (fromX + toX) / 2;
      const controlY = (fromY + toY) / 2 - curvature;

      setPath(`M ${fromX},${fromY} Q ${midX},${controlY} ${toX},${toY}`);
    }

    compute();
    const resizeObserver = new ResizeObserver(compute);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', compute);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  if (!path) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={box.width}
      height={box.height}
      viewBox={`0 0 ${box.width} ${box.height}`}
      fill="none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id={`beam-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fromColor} stopOpacity="0">
            <animate
              attributeName="offset"
              from={reverse ? '1' : '-0.5'}
              to={reverse ? '-0.5' : '1'}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor={fromColor} stopOpacity="0.8">
            <animate
              attributeName="offset"
              from={reverse ? '1.25' : '-0.25'}
              to={reverse ? '-0.25' : '1.25'}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={toColor} stopOpacity="0">
            <animate
              attributeName="offset"
              from={reverse ? '1.5' : '0'}
              to={reverse ? '0' : '1.5'}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
      {/* Static dim path */}
      <path d={path} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
      {/* Animated gradient path */}
      <path d={path} stroke={`url(#beam-gradient-${id})`} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    </svg>
  );
}
