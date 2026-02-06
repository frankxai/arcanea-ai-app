'use client'

import Navigation from '@/components/layout/navigation'
import Footer from '@/components/landing/footer'
import WorldBuilderSystem from '@/components/world-builder/WorldBuilderSystem'

export default function WorldBuilderPage() {
  return (
    <div className="min-h-screen bg-cosmic-void">
      <Navigation />

      <main className="pt-20">
        <WorldBuilderSystem />
      </main>

      <Footer />
    </div>
  )
}
