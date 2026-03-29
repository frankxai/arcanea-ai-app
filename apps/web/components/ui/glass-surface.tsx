import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassSurface — Static cosmic-metal glass panel for sidebars,
 * navigation, and non-interactive surfaces. No mouse tracking.
 */

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'neutral' | 'warm' | 'cool';
}

const TONE_BORDER: Record<string, string> = {
  neutral: 'rgba(255,255,255,0.06)',
  warm: 'rgba(255,215,0,0.06)',
  cool: 'rgba(100,255,218,0.06)',
};

const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, tone = 'neutral', children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl', className)}
      style={{
        background: 'linear-gradient(145deg, rgba(18,18,24,0.88) 0%, rgba(12,12,18,0.94) 100%)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        border: `1px solid ${TONE_BORDER[tone]}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.25)',
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  ),
);

GlassSurface.displayName = 'GlassSurface';
export { GlassSurface };
