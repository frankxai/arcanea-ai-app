'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Sparkles } from 'lucide-react'
import { mobileMenuExpand, mobileMenuItem, staggerContainerFast } from '@/lib/animations'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'features', label: 'Features', href: '/#features' },
  { id: 'guardians', label: 'Guardians', href: '/#guardians' },
  { id: 'pricing', label: 'Pricing', href: '/#pricing' },
  { id: 'chat', label: 'AI Chat', href: '/chat' },
  { id: 'imagine', label: 'Create', href: '/imagine' },
  { id: 'studio', label: 'Studio', href: '/studio' },
  { id: 'design-lab', label: 'Design Lab', href: '/design-lab' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500',
        isScrolled
          ? 'glass-strong shadow-cosmic'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-9 h-9 bg-gradient-to-br from-arcane-crystal to-arcane-fire rounded-xl flex items-center justify-center shadow-glow-sm"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-display text-white group-hover:text-arcane-crystal transition-colors duration-300">
              Arcanea
            </span>
            <Badge
              variant="crystal"
              className="text-[10px] ml-1 px-1.5 py-0.5 border-arcane-crystal/20 text-arcane-crystal/70 font-sans"
            >
              AI
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]))
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-sans font-medium transition-colors duration-200 rounded-lg',
                    isActive
                      ? 'text-arcane-crystal'
                      : 'text-text-secondary hover:text-white'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-arcane-crystal/10 rounded-lg border border-arcane-crystal/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-text-secondary hover:text-white font-sans text-sm"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold rounded-xl shadow-glow-sm hover:shadow-glow-md transition-shadow"
            >
              Start Creating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-arcane-crystal transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuExpand}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden glass-strong border-t border-arcane-crystal/10 overflow-hidden"
          >
            <motion.div
              variants={staggerContainerFast}
              initial="hidden"
              animate="visible"
              className="px-4 py-6 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.div key={item.id} variants={mobileMenuItem}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-xl font-sans font-medium transition-all duration-200',
                        isActive
                          ? 'text-arcane-crystal bg-arcane-crystal/10'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}

              <motion.div variants={mobileMenuItem}>
                <div className="pt-4 mt-4 border-t border-arcane-crystal/10 space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full text-text-secondary hover:text-white font-sans rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold rounded-xl shadow-glow-sm">
                    Start Creating
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
