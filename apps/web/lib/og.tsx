/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

const COLORS = {
  background: 'var(--arc-cosmic-void)',
  backgroundAlt: 'var(--arc-cosmic-void)',
  text: 'var(--arc-text-primary)',
  textMuted: 'var(--arc-void)',
  textDim: 'var(--arc-earth)',
  teal: 'var(--arc-brand-atlantean-teal)',
  tealDim: 'rgba(127,255,212,0.12)',
  gold: 'var(--arc-brand-arcanean-gold)',
  goldDim: 'rgba(255,215,0,0.08)',
  blue: 'var(--arc-brand-cosmic-blue)',
  border: 'rgba(127,255,212,0.15)',
}

interface OGImageOptions {
  title: string
  subtitle?: string
  icon?: string
  stats?: string[]
  accentColor?: string
  glowPositions?: Array<{
    top?: string
    bottom?: string
    left?: string
    right?: string
    color: string
    size: number
  }>
}

export function createOGImage(options: OGImageOptions) {
  const {
    title,
    subtitle,
    icon,
    stats,
    accentColor = COLORS.teal,
    glowPositions = [
      { top: '20%', left: '15%', color: COLORS.tealDim, size: 400 },
      { bottom: '10%', right: '20%', color: COLORS.goldDim, size: 350 },
    ],
  } = options

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(145deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 50%, ${COLORS.background} 100%)`,
          position: 'relative',
        }}
      >
        {/* Ambient glows */}
        {glowPositions.map((glow, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: glow.top,
              bottom: glow.bottom,
              left: glow.left,
              right: glow.right,
              width: glow.size,
              height: glow.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
            }}
          />
        ))}

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: 0.4,
          }}
        />

        {/* Icon */}
        {icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 18,
              background: `linear-gradient(135deg, rgba(127,255,212,0.1), rgba(120,166,255,0.1))`,
              border: `1px solid ${COLORS.border}`,
              marginBottom: 32,
              fontSize: 36,
            }}
          >
            {icon}
          </div>
        )}

        {/* "Arcanea" brand label */}
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            marginBottom: 16,
          }}
        >
          ARCANEA
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: '-0.02em',
            marginBottom: subtitle ? 16 : 0,
            textAlign: 'center',
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: COLORS.textMuted,
              letterSpacing: '0.03em',
              marginBottom: stats ? 32 : 0,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginTop: 12,
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {i > 0 && (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: COLORS.textDim,
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: 18,
                    color: COLORS.textMuted,
                    letterSpacing: '0.04em',
                  }}
                >
                  {stat}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            display: 'flex',
            fontSize: 15,
            color: COLORS.textDim,
            letterSpacing: '0.06em',
          }}
        >
          arcanea.ai
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
