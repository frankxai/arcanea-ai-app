'use client'

import { useState } from 'react'
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
  Menu,
  X,
  ArrowLeft,
  Gem,
} from 'lucide-react'

const labVersions = [
  { id: 'v1', label: 'Foundation', desc: 'Colors & Typography', icon: Palette, color: 'text-arcane-crystal' },
  { id: 'v2', label: 'Components', desc: 'Buttons, Badges, Cards', icon: Component, color: 'text-arcane-water' },
  { id: 'v3', label: 'Motion', desc: 'Animations & Transitions', icon: Sparkles, color: 'text-arcane-void-bright' },
  { id: 'v4', label: 'Effects', desc: 'Glass & Glow Systems', icon: Layers, color: 'text-arcane-fire-bright' },
  { id: 'v5', label: 'Layout', desc: 'Spatial Grid & Spacing', icon: Layout, color: 'text-arcane-wind' },
  { id: 'v6', label: 'Guardians', desc: 'Elemental Design Language', icon: Shield, color: 'text-arcane-gold' },
  { id: 'v7', label: 'Responsive', desc: 'Accessibility & Mobile', icon: Smartphone, color: 'text-arcane-earth-bright' },
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentVersion = labVersions.find(v => pathname.includes(`/design-lab/${v.id}`))

  return (
    <div className="min-h-[100dvh] bg-cosmic-void bg-cosmic-mesh">
      {/* Top bar */}
      <header className="fixed top-0 w-full z-50 glass-strong border-b border-arcane-crystal/10">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-sans hidden sm:inline">arcanea.ai</span>
            </Link>

            <div className="h-4 w-px bg-arcane-crystal/20" />

            <Link href="/design-lab" className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-arcane-crystal" />
              <span className="font-display text-white text-lg">Design Lab</span>
              <Badge variant="crystal" className="text-[10px] px-1.5 py-0 font-sans">
                v2.0
              </Badge>
            </Link>
          </div>

          {currentVersion && (
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="void" className="font-sans text-xs">
                {currentVersion.id.toUpperCase()}
              </Badge>
              <span className="text-sm text-text-secondary font-sans">{currentVersion.label}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-14 left-0 z-40 h-[calc(100dvh-3.5rem)] w-72 glass-strong border-r border-arcane-crystal/10 overflow-y-auto transition-transform duration-300 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="p-4 space-y-1">
            {/* Hub link */}
            <Link
              href="/design-lab"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all duration-200',
                pathname === '/design-lab'
                  ? 'text-arcane-crystal bg-arcane-crystal/10 border border-arcane-crystal/20'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              )}
            >
              <Gem className="w-4 h-4" />
              <div>
                <div className="font-medium">Overview</div>
                <div className="text-xs text-text-muted">Design System Hub</div>
              </div>
            </Link>

            <div className="h-px bg-arcane-crystal/10 my-3" />

            <p className="px-3 text-[10px] font-sans font-semibold text-text-muted tracking-widest uppercase mb-2">
              Evolution Stages
            </p>

            {labVersions.map((version) => {
              const Icon = version.icon
              const isActive = pathname.includes(`/design-lab/${version.id}`)
              return (
                <Link
                  key={version.id}
                  href={`/design-lab/${version.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all duration-200 group',
                    isActive
                      ? 'text-white bg-white/5 border border-arcane-crystal/20'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? version.color : 'text-text-muted group-hover:text-text-secondary')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{version.label}</span>
                      <span className={cn('text-[10px] font-mono', isActive ? version.color : 'text-text-disabled')}>
                        {version.id}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted truncate">{version.desc}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 min-w-0 lg:ml-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
