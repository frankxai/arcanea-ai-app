import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Arcanea',
  description:
    'Terms governing your use of the Arcanea creative intelligence platform. You own what you create.',
  openGraph: {
    title: 'Terms of Service | Arcanea',
    description:
      'Terms governing your use of the Arcanea creative intelligence platform. You own what you create.',
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

export default function TermsPage() {
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
              <path d="M200,24H72A16,16,0,0,0,56,40V64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V176h16a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM184,200H40V80H184ZM216,160H200V80a16,16,0,0,0-16-16H72V40H200Z" />
            </svg>
            <span className="text-xs font-medium text-atlantean-teal-aqua tracking-wide uppercase">
              Legal
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-atlantean-teal-aqua via-white to-atlantean-teal-aqua bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>

          <p className="text-lg text-text-secondary font-body italic">
            You own what you create. These terms exist to protect that principle.
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
            Welcome to Arcanea. By accessing or using the Arcanea platform
            (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
            (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Service.
          </Paragraph>

          {/* 1. Acceptance */}
          <SectionHeading>1. Acceptance of Terms</SectionHeading>
          <Paragraph>
            By creating an account, accessing the platform, or using any Arcanea
            feature, you confirm that you are at least 13 years of age and that you
            accept these Terms in full. If you are using Arcanea on behalf of an
            organization, you represent that you have the authority to bind that
            organization to these Terms.
          </Paragraph>
          <Paragraph>
            We may update these Terms from time to time. Continued use of the Service
            after changes are posted constitutes acceptance of the revised Terms. We
            will notify you of material changes via email or a prominent notice on the
            platform.
          </Paragraph>

          {/* 2. Account */}
          <SectionHeading>2. Account Creation and Responsibilities</SectionHeading>
          <Paragraph>
            To use most features of Arcanea, you must create an account. When you do,
            you agree to:
          </Paragraph>
          <BulletList
            items={[
              'Provide accurate and complete information during registration',
              'Maintain the security of your account credentials — your password, session tokens, and authentication methods are your responsibility',
              'Notify us immediately if you suspect unauthorized access to your account',
              'Not create accounts for the purpose of impersonating another person or entity',
              'Not create multiple accounts to circumvent restrictions or abuse platform features',
            ]}
          />
          <Paragraph>
            You are responsible for all activity that occurs under your account. Arcanea
            is not liable for any loss or damage arising from your failure to secure
            your credentials.
          </Paragraph>

          {/* 3. Content Ownership */}
          <SectionHeading>3. Content Ownership</SectionHeading>

          <div className="rounded-xl bg-atlantean-teal-aqua/5 border border-atlantean-teal-aqua/20 p-6 mb-6">
            <p className="text-white font-display font-semibold mb-2">
              The Creator&apos;s Covenant
            </p>
            <p className="text-text-secondary italic">
              &ldquo;What you create on Arcanea belongs to you. We provide the forge;
              the fire is yours.&rdquo;
            </p>
          </div>

          <Paragraph>
            You retain full ownership of all original content you create using Arcanea,
            including but not limited to text, images, video, audio, code, and
            mixed-media works (&ldquo;Your Content&rdquo;). Arcanea does not claim
            ownership over Your Content.
          </Paragraph>
          <Paragraph>
            By posting or sharing Your Content on Arcanea, you grant us a limited,
            non-exclusive, worldwide, royalty-free license to host, display, and
            distribute Your Content solely for the purpose of operating and improving
            the Service. This license terminates when you delete Your Content or your
            account.
          </Paragraph>
          <Paragraph>
            You represent that you have the right to share any content you upload and
            that it does not infringe on any third party&apos;s intellectual property
            rights.
          </Paragraph>

          {/* 4. AI-Generated Content */}
          <SectionHeading>4. AI-Generated Content</SectionHeading>
          <Paragraph>
            Arcanea provides AI-powered tools for creative assistance. Regarding content
            generated through these tools:
          </Paragraph>
          <BulletList
            items={[
              'AI-assisted creations that you direct, prompt, and curate are considered your work — you may use them freely',
              'AI outputs are generated probabilistically and may occasionally produce similar results for different users. Arcanea does not guarantee the uniqueness of AI-generated content',
              'You are responsible for reviewing AI-generated content before publishing or using it commercially',
              'AI-generated content should not be represented as solely human-created when disclosure is relevant or required',
              'We do not use your prompts or creations to train AI models without your explicit consent',
            ]}
          />

          {/* 5. Acceptable Use */}
          <SectionHeading>5. Acceptable Use</SectionHeading>
          <Paragraph>
            Arcanea is a space for creation, learning, and community. You agree not to
            use the Service to:
          </Paragraph>
          <BulletList
            items={[
              'Create, upload, or distribute content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable',
              'Generate content that exploits, harms, or endangers minors',
              'Infringe upon intellectual property rights, including copyright, trademark, or patent rights of others',
              'Distribute malware, viruses, or any code designed to disrupt or damage the Service or other systems',
              'Attempt to gain unauthorized access to other users\' accounts, data, or any Arcanea systems',
              'Use the Service for spam, phishing, or unsolicited commercial messaging',
              'Circumvent rate limits, access controls, or security measures',
              'Scrape, crawl, or harvest data from the platform without written permission',
              'Use the platform in any way that violates applicable local, national, or international law',
            ]}
          />
          <Paragraph>
            We reserve the right to suspend or terminate accounts that violate these
            guidelines. Where possible, we will provide notice and an opportunity to
            address the issue before taking action.
          </Paragraph>

          {/* 6. Subscriptions & Payment */}
          <SectionHeading>6. Subscriptions and Payment</SectionHeading>
          <Paragraph>
            Arcanea may offer free and paid tiers of service. If you subscribe to a paid
            plan:
          </Paragraph>
          <BulletList
            items={[
              'You agree to pay all applicable fees as described at the time of purchase',
              'Subscriptions renew automatically unless cancelled before the renewal date',
              'You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period',
              'Refunds are handled on a case-by-case basis. Contact us if you believe a refund is warranted',
              'We reserve the right to change pricing with 30 days\' notice before the change takes effect',
            ]}
          />

          {/* 7. Intellectual Property */}
          <SectionHeading>7. Arcanea Intellectual Property</SectionHeading>
          <Paragraph>
            The Arcanea platform, including its mythology, lore, design system, brand
            elements, code, documentation, and original creative works (the
            &ldquo;Arcanea IP&rdquo;), is owned by Arcanea and protected by
            intellectual property laws. This includes but is not limited to:
          </Paragraph>
          <BulletList
            items={[
              'The Arcanea name, logo, and visual identity',
              'The Ten Gates system, Guardian characters, Godbeast designs, and mythology',
              'The Library of Arcanea texts and content',
              'The Academy system, magic rank structure, and game mechanics',
              'Platform source code and proprietary technology',
            ]}
          />
          <Paragraph>
            You may not reproduce, modify, or distribute Arcanea IP without written
            permission, except as necessary for normal use of the Service (such as
            sharing links or embedding permitted content).
          </Paragraph>

          {/* 8. Disclaimers */}
          <SectionHeading>8. Disclaimers</SectionHeading>
          <Paragraph>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, whether express or
            implied, including but not limited to warranties of merchantability,
            fitness for a particular purpose, and non-infringement.
          </Paragraph>
          <BulletList
            items={[
              'We do not guarantee that the Service will be uninterrupted, error-free, or secure at all times',
              'AI-generated content is provided as creative assistance, not professional advice. Do not rely on it for legal, medical, financial, or other critical decisions',
              'We are not responsible for content created or shared by users',
              'Features may change, be deprecated, or be removed as the platform evolves',
            ]}
          />

          {/* 9. Limitation of Liability */}
          <SectionHeading>9. Limitation of Liability</SectionHeading>
          <Paragraph>
            To the maximum extent permitted by applicable law, Arcanea and its
            officers, directors, employees, and agents shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including but not limited to loss of profits, data, use, or goodwill,
            arising out of or related to your use of the Service.
          </Paragraph>
          <Paragraph>
            Our total liability for any claim arising from the Service shall not
            exceed the amount you paid to Arcanea in the twelve (12) months preceding
            the claim, or fifty US dollars ($50), whichever is greater.
          </Paragraph>
          <Paragraph>
            Some jurisdictions do not allow the exclusion or limitation of certain
            damages. In those jurisdictions, the limitations above apply to the
            fullest extent permitted by law.
          </Paragraph>

          {/* 10. Indemnification */}
          <SectionHeading>10. Indemnification</SectionHeading>
          <Paragraph>
            You agree to indemnify and hold harmless Arcanea, its affiliates, and
            their respective officers, directors, employees, and agents from any
            claims, damages, losses, or expenses (including reasonable
            attorneys&apos; fees) arising from your use of the Service, your
            violation of these Terms, or your infringement of any third party&apos;s
            rights.
          </Paragraph>

          {/* 11. Termination */}
          <SectionHeading>11. Termination</SectionHeading>
          <Paragraph>
            You may close your account at any time through your account settings or
            by contacting us. Upon termination:
          </Paragraph>
          <BulletList
            items={[
              'Your right to access the Service ceases immediately',
              'We will delete your personal data and creations within 30 days, subject to legal retention requirements',
              'Any outstanding payment obligations remain enforceable',
              'Provisions that by their nature should survive (such as liability limitations and indemnification) will continue in effect',
            ]}
          />
          <Paragraph>
            We may suspend or terminate your access to the Service if you violate
            these Terms, if required by law, or if we discontinue the Service. Where
            reasonably possible, we will provide advance notice.
          </Paragraph>

          {/* 12. Governing Law */}
          <SectionHeading>12. Governing Law and Disputes</SectionHeading>
          <Paragraph>
            These Terms are governed by the laws of the State of Delaware, United
            States, without regard to its conflict of laws principles. Any disputes
            arising from these Terms or the Service shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration
            Association, except where prohibited by law.
          </Paragraph>
          <Paragraph>
            You retain the right to bring claims in small claims court if your claim
            qualifies. Nothing in these Terms waives your rights under applicable
            consumer protection laws.
          </Paragraph>

          {/* 13. General */}
          <SectionHeading>13. General Provisions</SectionHeading>
          <BulletList
            items={[
              'Severability — If any provision of these Terms is found unenforceable, the remaining provisions continue in full force and effect',
              'Waiver — Our failure to enforce any provision does not constitute a waiver of that provision',
              'Entire Agreement — These Terms, together with the Privacy Policy, constitute the entire agreement between you and Arcanea regarding the Service',
              'Assignment — You may not assign your rights under these Terms without our consent. We may assign our rights to a successor or affiliate',
            ]}
          />

          {/* 14. Changes */}
          <SectionHeading>14. Changes to These Terms</SectionHeading>
          <Paragraph>
            We reserve the right to modify these Terms at any time. When we make
            material changes, we will update the &ldquo;Last updated&rdquo; date and
            notify you via email or a prominent in-app notice at least 14 days before
            the changes take effect. Your continued use of the Service after that
            period constitutes acceptance of the revised Terms.
          </Paragraph>

          {/* 15. Contact */}
          <SectionHeading>15. Contact Us</SectionHeading>
          <Paragraph>
            Questions about these Terms? We are here to help.
          </Paragraph>
          <div className="rounded-xl liquid-glass p-6 mb-8">
            <p className="text-text-secondary mb-2">
              <span className="text-white font-semibold">Email:</span>{' '}
              <a
                href="mailto:legal@arcanea.ai"
                className="text-atlantean-teal-aqua hover:underline"
              >
                legal@arcanea.ai
              </a>
            </p>
            <p className="text-text-secondary">
              <span className="text-white font-semibold">Platform:</span>{' '}
              <Link href="/feedback" className="text-atlantean-teal-aqua hover:underline">
                Feedback &amp; Support
              </Link>
            </p>
          </div>
        </article>

        {/* Footer divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-12 mb-8" />

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>Arcanea &mdash; Build Your Universe</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-atlantean-teal-aqua transition-colors">
              Privacy Policy
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
