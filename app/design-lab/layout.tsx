'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Palette,
  Component,
  Sparkles,
  Layers,
  Layout,
  Shield,
  Smartphone,
  Box,
  Brain,
  Telescope,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Gem,
} from 'lucide-react'

const labVersions = [
  { id: 'v1', label: 'Foundation', desc: 'Colors & Typography', icon: Palette, color: 'text-arcane-crystal' },
  { id: 'v2', label: 'Components', desc: 'Buttons, Badges, Cards', icon: Component, color: 'text-arcane-water' },
  { id: 'v3', label: 'Motion', desc: 'Animations & Transitions', icon: Sparkles, color: 'text-arcane-void-bright' },
  { id: 'v4', label: 'Effects', desc: 'Glass & Glow Systems', icon: Layers, color: 'text-arcane-fire-bright' },
  { id: 'v5', label: 'Layout', desc: 'Grid & Spatial System', icon: Layout, color: 'text-arcane-earth-bright' },
  { id: 'v6', label: 'Guardians', desc: 'Elemental Design Language', icon: Shield, color: 'text-arcane-gold' },
  { id: 'v7', label: 'Responsive', desc: 'Accessibility & Mobile', icon: Smartphone, color: 'text-arcane-crystal' },
  { id: 'v8', label: '3D & Spatial', desc: 'Three.js & XR Patterns', icon: Box, color: 'text-arcane-crystal' },
  { id: 'v9', label: 'AI Patterns', desc: 'Integration & Intelligence', icon: Brain, color: 'text-arcane-void-bright' },
  { id: 'v10', label: 'Future Vision', desc: 'Roadmap & Evolution', icon: Telescope, color: 'text-arcane-gold' },
]

export default function DesignLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHub = pathname === '/design-lab'
  const currentIdx = labVersions.findIndex(v => pathname.includes(`/design-lab/${v.id}`))
  const current = currentIdx >= 0 ? labVersions[currentIdx] : null
  const prev = currentIdx > 0 ? labVersions[currentIdx - 1] : null
  const next = currentIdx >= 0 && currentIdx < labVersions.length - 1 ? labVersions[currentIdx + 1] : null
  const [navOpen, setNavOpen] = useState(false)

  // Close dropdown on route change
  useEffect(() => { setNavOpen(false) }, [pathname])

  // Hub page — zero chrome, full immersion
  if (isHub) {
    return <>{children}</>
  }

  return (
    <>
      {/* Floating navigation pill */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <nav className="flex items-center justify-between h-12 px-4 rounded-2xl glass border border-white/[0.08] pointer-events-auto shadow-lg shadow-black/20">
            {/* Left: Back to hub */}
            <Link
              href="/design-lab"
              className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <Gem className="w-4 h-4 text-arcane-crystal" />
              <span className="text-sm font-sans hidden sm:inline">Design Lab</span>
            </Link>

            {/* Center: Version switcher */}
            <div className="relative">
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                {current && (
                  <>
                    <current.icon className={cn('w-4 h-4', current.color)} />
                    <span className="text-sm font-sans font-medium text-white">{current.label}</span>
                    <Badge variant="void" className="text-[10px] px-1.5 py-0 font-mono hidden sm:inline-flex">
                      {current.id.toUpperCase()}
                    </Badge>
                    <ChevronDown className={cn('w-3 h-3 text-text-muted transition-transform duration-200', navOpen && 'rotate-180')} />
                  </>
                )}
              </button>

              <AnimatePresence>
                {navOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 glass-strong rounded-2xl border border-white/[0.08] p-2 shadow-2xl shadow-black/40"
                  >
                    {labVersions.map((v) => {
                      const Icon = v.icon
                      const isActive = currentIdx >= 0 && labVersions[currentIdx].id === v.id
                      return (
                        <Link
                          key={v.id}
                          href={`/design-lab/${v.id}`}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                            isActive
                              ? 'bg-arcane-crystal/10 text-white'
                              : 'text-text-secondary hover:text-white hover:bg-white/5'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? v.color : 'text-text-muted')} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{v.label}</span>
                              <span className={cn('text-[10px] font-mono', isActive ? 'text-text-secondary' : 'text-text-disabled')}>
                                {v.id}
                              </span>
                            </div>
                            <div className="text-xs text-text-muted truncate">{v.desc}</div>
                          </div>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-arcane-crystal flex-shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Prev / Next */}
            <div className="flex items-center gap-1">
              {prev ? (
                <Link
                  href={`/design-lab/${prev.id}`}
                  className="p-2 rounded-lg text-text-secondary hover:text-white transition-colors"
                  title={`← ${prev.label}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-8" />
              )}
              {next ? (
                <Link
                  href={`/design-lab/${next.id}`}
                  className="p-2 rounded-lg text-text-secondary hover:text-white transition-colors"
                  title={`${next.label} →`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-8" />
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Click-outside overlay for dropdown */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNavOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>

      {/* Full-bleed content */}
      <main className="relative">
        {children}
      </main>
    </>
  )
}
