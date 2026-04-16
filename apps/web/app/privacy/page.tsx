import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Arcanea collects, uses, and protects your data. Your creative process is sacred — we treat it that way.',
  openGraph: {
    title: 'Privacy Policy',
    description:
      'How Arcanea collects, uses, and protects your data. Your creative process is sacred — we treat it that way.',
  },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-display font-bold text-white mt-12 mb-4">
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-text-secondary leading-relaxed mb-4">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6 ml-1">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-text-secondary leading-relaxed">
          <span className="text-atlantean-teal-aqua mt-1.5 flex-shrink-0">&#x2022;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-atlantean-teal-aqua/5 to-transparent pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 md:py-32">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-atlantean-teal-aqua transition-colors mb-12"
        >
          <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </svg>
          Back to Arcanea
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 mb-6">
            <svg className="w-4 h-4 text-atlantean-teal-aqua" viewBox="0 0 256 256" fill="currentColor">
              <path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40ZM48,56H208V200H48ZM136,112a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h40A8,8,0,0,1,136,112Zm32,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h72A8,8,0,0,1,168,144Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h72A8,8,0,0,1,168,176Z" />
            </svg>
            <span className="text-xs font-medium text-atlantean-teal-aqua tracking-wide uppercase">
              Legal
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-atlantean-teal-aqua via-white to-atlantean-teal-aqua bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>

          <p className="text-lg text-text-secondary font-body italic">
            Your creative process is sacred — we treat it that way.
          </p>

          <div className="mt-6 text-sm text-text-muted">
            Last updated: February 27, 2026
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        {/* Content */}
        <article className="font-body">
          <Paragraph>
            Arcanea is a creative intelligence platform built on the principle that your
            imagination and the works it produces belong to you. This Privacy Policy
            describes what information we collect, why we collect it, and how you can
            control it. We believe transparency is the foundation of trust, and trust is
            the foundation of creation.
          </Paragraph>

          {/* 1. Information We Collect */}
          <SectionHeading>1. Information We Collect</SectionHeading>

          <h3 className="text-lg font-display font-semibold text-white/[0.70] mt-6 mb-3">
            Account Information
          </h3>
          <Paragraph>
            When you create an Arcanea profile, we collect the information you provide
            directly:
          </Paragraph>
          <BulletList
            items={[
              'Display name and avatar image',
              'Email address (used for authentication and account recovery)',
              'Academy House selection and Gate progress (your chosen creative path)',
              'Profile preferences such as magic rank and guardian affinity',
            ]}
          />

          <h3 className="text-lg font-display font-semibold text-white/[0.70] mt-6 mb-3">
            Creations and Content
          </h3>
          <Paragraph>
            Everything you create on Arcanea — text, images, video, audio, code, and
            mixed-media works — is stored in your account. We also store metadata
            associated with each creation, including its element, gate, guardian
            association, and tags you apply.
          </Paragraph>

          <h3 className="text-lg font-display font-semibold text-white/[0.70] mt-6 mb-3">
            Activity and Usage Data
          </h3>
          <Paragraph>
            We record activity such as likes, follows, collection curation, and session
            timestamps to power your personalized experience. We also collect standard
            technical data:
          </Paragraph>
          <BulletList
            items={[
              'Browser type and version',
              'Device type and screen resolution',
              'Pages visited and time spent',
              'Referral source',
            ]}
          />

          {/* 2. How We Use Your Data */}
          <SectionHeading>2. How We Use Your Data</SectionHeading>
          <Paragraph>
            We use the information we collect to operate, maintain, and improve the
            Arcanea platform. Specifically:
          </Paragraph>
          <BulletList
            items={[
              'Authenticate your identity and secure your account',
              'Store, display, and organize your creations',
              'Track your progress through the Ten Gates and magic rank system',
              'Personalize AI interactions — your Guardian, element affinities, and creative preferences shape how the platform responds to you',
              'Improve the platform through aggregated, anonymized usage analytics',
              'Send important account notifications (you can opt out of marketing emails at any time)',
            ]}
          />
          <Paragraph>
            We do not sell your personal data to third parties. We do not use your
            creations to train AI models without your explicit, informed consent.
          </Paragraph>

          {/* 3. AI Interactions */}
          <SectionHeading>3. AI-Powered Features</SectionHeading>
          <Paragraph>
            Arcanea integrates AI services to power creative tools, Luminor
            conversations, and content generation. When you use these features:
          </Paragraph>
          <BulletList
            items={[
              'Your prompts and contextual data (such as your active gate or creative history) are sent to our AI providers to generate responses',
              'AI providers process your data according to their own privacy policies (see Third-Party Services below)',
              'We do not store complete AI conversation logs beyond what is needed for your session history',
              'You can delete your AI interaction history at any time from your account settings',
            ]}
          />

          {/* 4. Data Storage & Security */}
          <SectionHeading>4. Data Storage and Security</SectionHeading>
          <Paragraph>
            Your data is stored on Supabase, a PostgreSQL-based platform with
            enterprise-grade security:
          </Paragraph>
          <BulletList
            items={[
              'All data is encrypted at rest and in transit (TLS 1.2+)',
              'Row-Level Security (RLS) policies ensure you can only access your own data',
              'Authentication is handled via Supabase Auth with secure token management',
              'Storage buckets for avatars, creations, and thumbnails enforce user-scoped access paths',
              'Database backups are performed regularly',
            ]}
          />
          <Paragraph>
            While no system is perfectly immune to breach, we follow industry best
            practices and continuously review our security posture. If a data breach
            occurs that affects your account, we will notify you within 72 hours.
          </Paragraph>

          {/* 5. Your Rights */}
          <SectionHeading>5. Your Rights</SectionHeading>
          <Paragraph>
            You have full sovereignty over your creative identity. At any time, you may:
          </Paragraph>
          <BulletList
            items={[
              'Access — View all personal data we hold about you from your profile and settings pages',
              'Export — Download your creations and profile data in standard formats',
              'Correct — Update or correct any personal information in your account settings',
              'Delete — Request complete deletion of your account and all associated data. This action is irreversible and will be processed within 30 days',
              'Restrict — Opt out of non-essential data processing, including analytics and marketing communications',
              'Portability — Receive your data in a machine-readable format for transfer to another service',
            ]}
          />
          <Paragraph>
            To exercise any of these rights, contact us at the address listed below or
            use the controls in your account settings.
          </Paragraph>

          {/* 6. Cookies */}
          <SectionHeading>6. Cookies and Local Storage</SectionHeading>
          <Paragraph>
            Arcanea uses cookies and browser local storage for the following purposes:
          </Paragraph>
          <BulletList
            items={[
              'Authentication — Session tokens that keep you signed in (essential, cannot be disabled)',
              'Preferences — Your theme, layout, and UI preferences',
              'Analytics — Anonymous usage data to understand how the platform is used (can be disabled)',
            ]}
          />
          <Paragraph>
            We do not use third-party advertising cookies. We do not participate in
            cross-site tracking networks.
          </Paragraph>

          {/* 7. Third-Party Services */}
          <SectionHeading>7. Third-Party Services</SectionHeading>
          <Paragraph>
            Arcanea integrates with the following third-party services that may process
            your data:
          </Paragraph>

          <div className="space-y-4 mb-6">
            <div className="rounded-xl liquid-glass p-5">
              <h4 className="font-display font-semibold text-white mb-1">
                Google Gemini
              </h4>
              <p className="text-sm text-text-secondary">
                Powers AI-assisted creative tools and content generation. Prompts you
                submit are processed by Google&apos;s API. See{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-atlantean-teal-aqua hover:underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl liquid-glass p-5">
              <h4 className="font-display font-semibold text-white mb-1">
                Anthropic Claude
              </h4>
              <p className="text-sm text-text-secondary">
                Powers Luminor intelligence and advanced reasoning features. See{' '}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-atlantean-teal-aqua hover:underline"
                >
                  Anthropic&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl liquid-glass p-5">
              <h4 className="font-display font-semibold text-white mb-1">
                Supabase
              </h4>
              <p className="text-sm text-text-secondary">
                Provides database hosting, authentication, and file storage. See{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-atlantean-teal-aqua hover:underline"
                >
                  Supabase&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl liquid-glass p-5">
              <h4 className="font-display font-semibold text-white mb-1">
                Vercel
              </h4>
              <p className="text-sm text-text-secondary">
                Hosts the Arcanea web application and processes incoming requests. See{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-atlantean-teal-aqua hover:underline"
                >
                  Vercel&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* 8. Children */}
          <SectionHeading>8. Children&apos;s Privacy</SectionHeading>
          <Paragraph>
            Arcanea is not directed at children under 13 years of age. We do not
            knowingly collect personal information from children under 13. If you
            believe a child under 13 has provided us with personal data, please contact
            us and we will delete it promptly.
          </Paragraph>

          {/* 9. Data Retention */}
          <SectionHeading>9. Data Retention</SectionHeading>
          <Paragraph>
            We retain your data for as long as your account is active. If you delete
            your account, we will remove your personal data and creations within 30
            days, except where retention is required by law. Anonymized, aggregated
            analytics data may be retained indefinitely as it cannot be linked back to
            you.
          </Paragraph>

          {/* 10. International Transfers */}
          <SectionHeading>10. International Data Transfers</SectionHeading>
          <Paragraph>
            Arcanea&apos;s infrastructure is hosted in the United States. If you access
            the platform from outside the US, your data will be transferred to and
            processed in the US. We ensure appropriate safeguards are in place for
            international transfers in compliance with applicable data protection laws.
          </Paragraph>

          {/* 11. Changes */}
          <SectionHeading>11. Changes to This Policy</SectionHeading>
          <Paragraph>
            We may update this Privacy Policy from time to time. When we make material
            changes, we will notify you via email or through a prominent notice on the
            platform. The &ldquo;Last updated&rdquo; date at the top of this page
            reflects the most recent revision.
          </Paragraph>

          {/* 12. Contact */}
          <SectionHeading>12. Contact Us</SectionHeading>
          <Paragraph>
            If you have questions about this Privacy Policy, your data, or your rights,
            reach out to us:
          </Paragraph>
          <div className="rounded-xl liquid-glass p-6 mb-8">
            <p className="text-text-secondary mb-2">
              <span className="text-white font-semibold">Email:</span>{' '}
              <a
                href="mailto:privacy@arcanea.ai"
                className="text-atlantean-teal-aqua hover:underline"
              >
                privacy@arcanea.ai
              </a>
            </p>
            <p className="text-text-secondary">
              <span className="text-white font-semibold">Platform:</span>{' '}
              <Link href="/feedback" className="text-atlantean-teal-aqua hover:underline">
                Feedback &amp; Support
              </Link>
            </p>
          </div>

          <Paragraph>
            We will respond to all privacy-related inquiries within 30 days.
          </Paragraph>
        </article>

        {/* Footer divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-12 mb-8" />

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>Arcanea™ &mdash; Build Your Universe</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-atlantean-teal-aqua transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-atlantean-teal-aqua transition-colors">
              Home
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
