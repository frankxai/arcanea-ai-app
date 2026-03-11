'use client';

import * as React from 'react';
import Link from 'next/link';
import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMouseStore } from '@/hooks/use-mouse-store';
import { springs } from '@/lib/design/motion';

/**
 * GlowButton — Premium interactive CTA with cursor-following glow,
 * spring physics, and tap feedback. Respects prefers-reduced-motion.
 */

export type GlowButtonColor = 'cyan' | 'gold' | 'purple' | 'white';
export type GlowButtonVariant = 'primary' | 'secondary' | 'ghost';
export type GlowButtonSize = 'sm' | 'md' | 'lg';

export interface GlowButtonProps {
  children: React.ReactNode;
  variant?: GlowButtonVariant;
  size?: GlowButtonSize;
  color?: GlowButtonColor;
  href?: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const glowColors: Record<GlowButtonColor, string> = {
  cyan: '0, 188, 212',
  gold: '255, 215, 0',
  purple: '139, 92, 246',
  white: '255, 255, 255',
};

const sizeClasses: Record<GlowButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm rounded-full min-h-[40px]',
  md: 'px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base rounded-full min-h-[44px]',
  lg: 'px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg rounded-full min-h-[48px]',
};

const variantClasses: Record<GlowButtonVariant, string> = {
  primary:
    'bg-white text-black font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]',
  secondary:
    'bg-transparent text-white/70 border border-white/10 hover:bg-white/5 hover:border-white/20 font-medium',
  ghost:
    'bg-transparent text-white/60 hover:text-white hover:bg-white/5 font-medium',
};

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  color = 'cyan',
  href,
  external = false,
  className,
  onClick,
  disabled = false,
  type = 'button',
}: GlowButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const btnRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);
  const rafId = React.useRef<number>(0);
  const globalMouse = useMouseStore();

  const rgb = glowColors[color];
  const glowOpacity = variant === 'primary' ? 0.12 : 0.2;

  // RAF-batched cursor tracking
  const positionGlow = React.useCallback(
    (clientX: number, clientY: number) => {
      if (shouldReduceMotion || !btnRef.current || !glowRef.current) return;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect || !glowRef.current) return;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const inside =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        glowRef.current.style.background = inside
          ? `radial-gradient(180px circle at ${x}px ${y}px, rgba(${rgb}, ${glowOpacity}), transparent 40%)`
          : 'transparent';
      });
    },
    [shouldReduceMotion, rgb, glowOpacity]
  );

  React.useEffect(() => {
    positionGlow(globalMouse.x, globalMouse.y);
  }, [globalMouse.x, globalMouse.y, positionGlow]);

  const motionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.03, y: -1 },
        whileTap: { scale: 0.97 },
        transition: springs.interactive,
      };

  const sharedClasses = cn(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant],
    disabled && 'pointer-events-none opacity-50',
    className
  );

  const inner = (
    <>
      {/* Cursor glow overlay */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-full"
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  const wrapper = (content: React.ReactNode) => (
    <m.div ref={btnRef} className="inline-block" {...motionProps}>
      {content}
    </m.div>
  );

  if (href) {
    const linkProps = external
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {};

    return wrapper(
      <Link href={href} className={sharedClasses} {...linkProps}>
        {inner}
      </Link>
    );
  }

  return wrapper(
    <button
      type={type}
      className={sharedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {inner}
    </button>
  );
}
