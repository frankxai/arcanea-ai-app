'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Guardian } from './step3-guardian'

const GATES = [
  { id: 1, name: 'Foundation', active: true },
  { id: 2, name: 'Flow', active: false },
  { id: 3, name: 'Fire', active: false },
  { id: 4, name: 'Heart', active: false },
  { id: 5, name: 'Voice', active: false },
  { id: 6, name: 'Sight', active: false },
  { id: 7, name: 'Crown', active: false },
  { id: 8, name: 'Starweave', active: false },
  { id: 9, name: 'Unity', active: false },
  { id: 10, name: 'Source', active: false },
]

const CREATOR_LABELS: Record<string, string> = {
  writer: 'Writer',
  'visual-artist': 'Visual Artist',
  musician: 'Musician',
  developer: 'Developer',
  storyteller: 'Storyteller',
  polymath: 'Polymath',
}

const CREATOR_COLORS: Record<string, string> = {
  writer: '#a78bfa',
  'visual-artist': '#00bcd4',
  musician: '#ffd700',
  developer: '#60a5fa',
  storyteller: '#f472b6',
  polymath: '#ffd700',
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  maxLife: number
  gravity: number
}

interface Step5Props {
  creatorTypes: string[]
  guardian: Guardian | null
  firstCreationPrompt: string
  firstCreationResponse: string
  onEnter: () => void
}

export default function Step5YourUniverse({
  creatorTypes,
  guardian,
  firstCreationPrompt,
  firstCreationResponse,
  onEnter,
}: Step5Props) {
  const [visible, setVisible] = useState(false)
  const [burstActive, setBurstActive] = useState(false)
  const [entered, setEntered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const burstRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Canvas confetti engine
  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    burstRef.current = true

    const cx = canvas.width / 2
    const cy = canvas.height * 0.55
    const colors = [
      '#ffd700', '#ff9500', '#0d47a1', '#a78bfa',
      '#00bcd4', '#22d3ee', '#f472b6', '#ffffff',
    ]

    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = Math.random() * 8 + 3
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
        life: 0,
        maxLife: Math.random() * 80 + 50,
        gravity: 0.18 + Math.random() * 0.1,
      })
    }

    const drawConfetti = () => {
      if (!burstRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      particlesRef.current.forEach((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.99

        const alpha = 1 - p.life / p.maxLife
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        // Alternate shapes: square or circle
        if (p.size > 5) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.life * 0.08)
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        } else {
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(drawConfetti)
      } else {
        burstRef.current = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    cancelAnimationFrame(animRef.current)
    drawConfetti()
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current)
      burstRef.current = false
    }
  }, [])

  const handleEnter = () => {
    setBurstActive(true)
    launchConfetti()
    setTimeout(() => {
      setEntered(true)
      onEnter()
    }, 1400)
  }

  const guardianColor = guardian?.color || '#0d47a1'
  const guardianGlow = guardian?.glowColor || 'rgba(13,71,161,0.3)'

  // Gate ring math — 10 gates around a circle
  const RING_R = 88
  const RING_CX = 120
  const RING_CY = 120
  const STROKE_WIDTH = 6
  const circumference = 2 * Math.PI * RING_R
  // Gate 1 active = 1/10 filled
  const fillRatio = 1 / 10
  const dashArray = `${circumference * fillRatio} ${circumference * (1 - fillRatio)}`
  // Rotate so fill starts from top
  const rotateOffset = -90

  return (
    <div className="flex flex-col relative">
      {/* Confetti canvas — full bleed overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 20 }}
      />

      {/* Header */}
      <div
        className="text-center mb-6 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
      >
        <div className="text-xs tracking-[0.3em] uppercase text-[#0d47a1] font-semibold mb-3 font-sans">
          Step 5 of 5
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
          Your{' '}
          <span className="text-gold-gradient">Universe</span>
        </h2>
        <p className="text-[#7c7c9a] text-sm font-sans">
          The foundations of your Arcanea have been laid
        </p>
      </div>

      {/* Summary card */}
      <div
        className="glass rounded-2xl p-5 mb-4 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transitionDelay: '0.1s',
        }}
      >
        <div className="flex gap-5 items-start">
          {/* Gate Progress Ring */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <svg width="80" height="80" viewBox="0 0 240 240">
              {/* Dimmed background ring */}
              <circle
                cx={RING_CX}
                cy={RING_CY}
                r={RING_R}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={STROKE_WIDTH}
              />
              {/* Dimmed gate segments */}
              {GATES.slice(1).map((_, i) => {
                const angle = ((i + 1) / 10) * 360 - 90
                const rad = (angle * Math.PI) / 180
                const dotR = RING_R
                const x = RING_CX + dotR * Math.cos(rad)
                const y = RING_CY + dotR * Math.sin(rad)
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="rgba(255,255,255,0.08)"
                  />
                )
              })}
              {/* Active fill arc — Gate 1 */}
              <circle
                cx={RING_CX}
                cy={RING_CY}
                r={RING_R}
                fill="none"
                stroke={guardianColor}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={dashArray}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform={`rotate(${rotateOffset}, ${RING_CX}, ${RING_CY})`}
                style={{
                  filter: `drop-shadow(0 0 6px ${guardianColor})`,
                  transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
              {/* Gate 1 dot at top */}
              <circle
                cx={RING_CX}
                cy={RING_CY - RING_R}
                r="5"
                fill={guardianColor}
                style={{ filter: `drop-shadow(0 0 8px ${guardianColor})` }}
              />
              {/* Center label */}
              <text
                x={RING_CX}
                y={RING_CY - 8}
                textAnchor="middle"
                fill="#ffd700"
                fontSize="22"
                fontWeight="bold"
                fontFamily="Georgia, serif"
              >
                1
              </text>
              <text
                x={RING_CX}
                y={RING_CY + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                of 10
              </text>
            </svg>
            <div className="text-[10px] text-[#6b6485] font-sans text-center leading-tight">
              Gate 1<br />
              <span style={{ color: guardianColor }}>Foundation</span>
            </div>
          </div>

          {/* Identity summary */}
          <div className="flex-1 min-w-0">
            {/* Creator types */}
            {creatorTypes.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] tracking-widest uppercase text-[#4a4a6a] font-sans mb-1.5">
                  Creator Identity
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {creatorTypes.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold font-sans"
                      style={{
                        background: (CREATOR_COLORS[id] || '#0d47a1') + '18',
                        border: `1px solid ${(CREATOR_COLORS[id] || '#0d47a1')}35`,
                        color: CREATOR_COLORS[id] || '#0d47a1',
                      }}
                    >
                      {CREATOR_LABELS[id] || id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guardian */}
            {guardian && (
              <div className="mb-3">
                <div className="text-[10px] tracking-widest uppercase text-[#4a4a6a] font-sans mb-1.5">
                  Creative Partner
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-serif flex-shrink-0"
                    style={{
                      background: guardianColor + '20',
                      border: `1px solid ${guardianColor}40`,
                      color: guardianColor,
                      boxShadow: `0 0 10px ${guardianGlow}`,
                    }}
                  >
                    {guardian.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-semibold font-sans text-white">
                      {guardian.name}
                    </div>
                    <div className="text-[11px] font-sans" style={{ color: guardianColor }}>
                      {guardian.element} · {guardian.trait}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Magic rank badge */}
            <div className="flex items-center gap-1.5">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-sans"
                style={{
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  color: '#ffd700',
                  boxShadow: '0 0 10px rgba(255,215,0,0.12)',
                }}
              >
                <StarIcon />
                Apprentice
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First creation preview */}
      {firstCreationResponse && (
        <div
          className="glass rounded-2xl p-4 mb-5 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transitionDelay: '0.18s',
            borderColor: guardianColor + '25',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 256 256" fill={guardianColor}>
              <path d="M197.58,129.06l-51.61-19.63L126.34,58.2a8,8,0,0,0-14.86,0L91.94,109.43,40.33,129.06a8,8,0,0,0,0,14.91l51.61,19.63,19.59,51.23a8,8,0,0,0,14.86,0l19.63-51.23,51.56-19.63a8,8,0,0,0,0-14.91Z" />
            </svg>
            <span className="text-[10px] tracking-widest uppercase font-sans font-semibold" style={{ color: guardianColor }}>
              First Creation
            </span>
          </div>
          {firstCreationPrompt && (
            <p className="text-[#6b6485] text-xs font-sans mb-1.5 italic">
              &ldquo;{firstCreationPrompt}&rdquo;
            </p>
          )}
          <p className="text-[#c4b5fd] text-xs font-sans leading-relaxed line-clamp-3 font-serif italic">
            {firstCreationResponse}
          </p>
        </div>
      )}

      {/* Enter Arcanea CTA */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transitionDelay: '0.26s',
        }}
      >
        <button
          onClick={handleEnter}
          disabled={entered || burstActive}
          className="group relative w-full py-4 rounded-2xl font-semibold text-base font-sans overflow-hidden transition-all duration-300 disabled:cursor-not-allowed"
          style={{
            background: entered
              ? 'linear-gradient(135deg, #ffd700, #ff9500)'
              : 'linear-gradient(135deg, #0d47a1, #6d28d9)',
            boxShadow: burstActive
              ? '0 0 60px rgba(255,215,0,0.6), 0 0 120px rgba(13,71,161,0.3)'
              : '0 0 28px rgba(13,71,161,0.45)',
            transform: burstActive ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          {/* Shimmer sweep on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Cosmic burst ring on click */}
          {burstActive && (
            <>
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                  animation: 'cosmic-burst 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
                }}
              />
              <div
                className="absolute -inset-2 rounded-3xl border-2 border-[#ffd700]/50"
                style={{ animation: 'cosmic-burst 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}
              />
            </>
          )}

          <span className="relative flex items-center justify-center gap-3 text-white">
            {burstActive ? (
              <>
                <RocketIcon />
                Entering Arcanea...
              </>
            ) : (
              <>
                <RocketIcon />
                Enter Arcanea
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
              </>
            )}
          </span>
        </button>

        <p className="text-center text-[11px] text-[#4a4465] font-sans mt-2">
          Your realm awaits. Gate 1: Foundation is now unlocked.
        </p>
      </div>
    </div>
  )
}

/* ── Icons ── */

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor">
      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.07,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1-8-8V200.94A104.79,104.79,0,0,1,67.81,186.08,8,8,0,0,1,69,173.41a91.66,91.66,0,0,0,60.42,22.59H127A88.08,88.08,0,0,0,195.45,71.16l-4.55-4.54L167,89.47A16,16,0,0,0,164,80V24a8,8,0,0,0-8-8H100a8,8,0,0,0-8,8V80a16,16,0,0,0-3,9.47L65.1,66.62l-4.55,4.54A88.2,88.2,0,0,0,40,128a88.13,88.13,0,0,0,11.84,44.53,8,8,0,1,1-13.88,8A104.14,104.14,0,0,1,24,128,104.21,104.21,0,0,1,62.82,46.41l4.55-4.55a16,16,0,0,1,22.63,0L104,55.86V24h48V55.86l14,14a16,16,0,0,1,22.63,0l4.55,4.55A104.09,104.09,0,0,1,232,128,104.55,104.55,0,0,1,152,224Z" />
    </svg>
  )
}
