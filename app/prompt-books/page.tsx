'use client'

import Navigation from '@/components/layout/navigation'
import Footer from '@/components/landing/footer'
import PremiumPromptBooks from '@/components/prompt-books/PremiumPromptBooks'

export default function PromptBooksPage() {
  return (
    <div className="min-h-screen bg-cosmic-void">
      <Navigation />

      <main className="pt-20">
        <PremiumPromptBooks />
      </main>

      <Footer />
    </div>
  )
}
