'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

function StaticCosmicGradient() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.7,
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(13,71,161,0.15), transparent 50%),' +
          'radial-gradient(ellipse at 70% 80%, rgba(0,188,212,0.1), transparent 50%),' +
          'radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.08), transparent 60%)',
      }}
    />
  );
}

export default function CosmicParticles({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const effectiveCount = isMobile ? Math.min(count, 20) : count;

    const colors = ['#0d47a1', '#a78bfa', '#00bcd4', '#ffd700', '#c4b5fd', '#ffffff'];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.6 + 0.1),
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 150,
    });

    particlesRef.current = Array.from({ length: effectiveCount }, createParticle);

    // Pause animation when tab is hidden
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (!isVisibleRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        const alpha =
          lifeRatio < 0.1
            ? (lifeRatio / 0.1) * p.opacity
            : lifeRatio > 0.8
              ? ((1 - lifeRatio) / 0.2) * p.opacity
              : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(
          0,
          p.color + Math.round(alpha * 255).toString(16).padStart(2, '0'),
        );
        gradient.addColorStop(1, p.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particlesRef.current[i] = createParticle();
          particlesRef.current[i].y = canvas.height + 10;
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [count, prefersReduced]);

  if (prefersReduced) {
    return <StaticCosmicGradient />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7, willChange: 'transform' }}
    />
  );
}
