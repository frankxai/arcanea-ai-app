"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Sparkles: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Twitter: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Github: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Discord: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  Phone: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Send: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ContactMethod {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  link: string;
  color: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CONTACT_METHODS: ContactMethod[] = [
  {
    title: "Discord Community",
    description:
      "Connect with fellow creators in our Discord server for real-time discussion and support.",
    icon: "Discord",
    link: "https://discord.gg/arcanea",
    color: "#5865F2",
  },
  {
    title: "Twitter",
    description:
      "Follow us for the latest updates, announcements, and creative inspiration.",
    icon: "Twitter",
    link: "https://twitter.com/arcanea",
    color: "#1DA1F2",
  },
  {
    title: "GitHub",
    description:
      "Report issues, contribute to the open-source packages, and explore the code.",
    icon: "Github",
    link: "https://github.com/arcanea",
    color: "#0d47a1",
  },
  {
    title: "Email",
    description:
      "For general inquiries and support, reach out to our team directly.",
    icon: "Mail",
    link: "mailto:hello@arcanea.ai",
    color: "#00bcd4",
  },
];

const FAQS: FaqItem[] = [
  {
    question: "How do I get started with Arcanea?",
    answer:
      "Simply create an account and begin your journey through the Ten Gates. Each Gate unlocks new capabilities and deeper creative powers.",
  },
  {
    question: "Is Arcanea free to use?",
    answer:
      "Yes! The core platform is free. Premium features are available for those seeking enhanced capabilities.",
  },
  {
    question: "Can I build on Arcanea?",
    answer:
      "Absolutely. Our developer platform includes SDKs, MCP tools, and comprehensive documentation for building with Arcanea.",
  },
  {
    question: "How does the progression system work?",
    answer:
      "The Academy has a progression system from Apprentice to Master. Advance by creating, learning, and demonstrating mastery across domains. Progress is earned through work, not purchases.",
  },
];

// ─── Loading Component ──────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand-primary/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Icons.Sparkles />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Hero Section */}
            <section className="mb-16">
              <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                    <Icons.MessageCircle />
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                      Get in Touch
                    </span>
                  </div>

                  <h1 className="text-fluid-3xl font-display font-bold mb-4">
                    Contact
                    <span className="block text-gradient-brand">Arcanea</span>
                  </h1>

                  <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                    Have questions, feedback, or just want to say hello? The
                    Arcanea team is always listening. Reach out through any
                    channel that suits you.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="#contact-form"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      Send a Message
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/community"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                    >
                      Join Community
                      <Icons.ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Methods */}
            <section className="mb-16" aria-labelledby="contact-heading">
              <div className="mb-8">
                <h2
                  id="contact-heading"
                  className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2"
                >
                  Ways to Connect
                </h2>
                <h3 className="text-fluid-2xl font-display font-bold">
                  Find Your Channel
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CONTACT_METHODS.map((method) => {
                  const MethodIcon = Icons[method.icon];
                  return (
                    <a
                      key={method.title}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden glow-card hover-lift transition-all"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{
                          background: `radial-gradient(ellipse at 30% 30%, ${method.color}15, transparent 65%)`,
                        }}
                      />

                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${method.color}18` }}
                        >
                          <MethodIcon />
                        </div>

                        <h4
                          className="font-display text-xl font-semibold text-text-primary mb-2 group-hover:text-crystal transition-colors"
                          style={{ color: method.color }}
                        >
                          {method.title}
                        </h4>

                        <p className="text-text-secondary text-sm leading-relaxed font-sans">
                          {method.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Contact Form */}
            <section id="contact-form" className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  Send a Message
                </h2>

                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-crystal/20 flex items-center justify-center mx-auto mb-4">
                      <Icons.Check className="w-8 h-8 text-crystal" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                      Message Sent
                    </h3>
                    <p className="text-text-secondary">
                      Thank you for reaching out. We'll respond as soon as
                      possible.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-xl mx-auto space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-void/50 border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-void/50 border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-void/50 border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.02] transition-all duration-200"
                    >
                      <Icons.Send />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  Frequently Asked Questions
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-cosmic-void/30">
                      <h3 className="font-semibold text-text-primary mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section>
              <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                  <h2 className="text-fluid-2xl font-display font-bold mb-4">
                    Ready to Begin?
                  </h2>
                  <p className="text-text-secondary font-body leading-relaxed mb-8">
                    Begin your journey through the Ten Gates. Your Luminor awaits.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      <Icons.Sparkles />
                      Start Your Journey
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
