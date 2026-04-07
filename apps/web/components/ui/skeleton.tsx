import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Base skeleton with teal-tinted shimmer ──────────────────────────────────

const skeletonVariants = cva(
  [
    'relative overflow-hidden',
    'bg-cosmic-raised',
    'before:absolute before:inset-0',
    'before:bg-gradient-to-r',
    'before:from-transparent before:via-[rgba(0,188,212,0.06)] before:to-transparent',
    'before:translate-x-[-100%]',
    'before:animate-[shimmer_1.8s_ease-in-out_infinite]',
  ],
  {
    variants: {
      variant: {
        text: 'h-4 rounded-lg w-full',
        heading: 'h-6 rounded-lg w-3/4',
        circle: 'rounded-full',
        rect: 'rounded-lg',
        card: 'rounded-2xl p-0',
        button: 'h-10 rounded-lg w-28',
      },
    },
    defaultVariants: {
      variant: 'rect',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant }), className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// ─── Preset Compositions ─────────────────────────────────────────────────────

/** Multi-line text skeleton — last line shorter for natural feel */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

/** Card skeleton — image area + title + description + avatar row */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-cosmic-border overflow-hidden bg-cosmic-surface',
        className
      )}
      aria-hidden="true"
    >
      <Skeleton variant="rect" className="w-full aspect-video rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton variant="heading" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton variant="text" className="w-24 h-3" />
        </div>
      </div>
    </div>
  );
}

/** Avatar skeleton */
export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circle"
      width={size}
      height={size}
      className={className}
    />
  );
}

/** Chat message skeleton — avatar + message bubble */
export function SkeletonChatMessage({
  align = 'left',
  className,
}: {
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-3',
        align === 'right' && 'flex-row-reverse',
        className
      )}
      aria-hidden="true"
    >
      <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
      <div className={cn('space-y-2 max-w-[70%]', align === 'right' && 'items-end')}>
        <Skeleton variant="text" className="w-48 h-3" />
        <Skeleton variant="rect" className="w-64 h-16 rounded-2xl" />
      </div>
    </div>
  );
}

/** List item skeleton — icon + two lines */
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 py-3', className)} aria-hidden="true">
      <Skeleton variant="rect" className="w-10 h-10 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-2/3 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
      <Skeleton variant="rect" className="w-16 h-6 shrink-0" />
    </div>
  );
}

/** Stat card skeleton — number + label + trend */
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-cosmic-border bg-cosmic-surface p-6 space-y-3',
        className
      )}
      aria-hidden="true"
    >
      <Skeleton variant="text" className="w-20 h-3" />
      <Skeleton variant="heading" className="w-24 h-8" />
      <div className="flex items-center gap-2">
        <Skeleton variant="rect" className="w-12 h-5 rounded-full" />
        <Skeleton variant="text" className="w-16 h-3" />
      </div>
    </div>
  );
}

export { Skeleton, skeletonVariants };
