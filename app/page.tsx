'use client'

import Navigation from '@/components/layout/navigation'
import HeroSection from '@/components/landing/hero-section'
import FeaturesSection from '@/components/landing/features-section'
import GuardiansSection from '@/components/landing/guardians-section'
import PricingSection from '@/components/landing/pricing-section'
import TestimonialsSection from '@/components/landing/testimonials-section'
import CTASection from '@/components/landing/cta-section'
import Footer from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-cosmic-void bg-cosmic-mesh">
      <Navigation />

      <main>
        <HeroSection />
        <FeaturesSection />
        <GuardiansSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
