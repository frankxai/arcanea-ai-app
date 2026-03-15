import type { JSX } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "System Status",
  description:
    "Real-time system status for the Arcanea platform — services, infrastructure, and incident history.",
};

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

const Icons = {
  Globe: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm0,192a88.1,88.1,0,0,1-87.8-83H88a8,8,0,0,0,0-16H40.2A88.1,88.1,0,0,1,116,40.2V72a8,8,0,0,0,16,0V40.2A88.1,88.1,0,0,1,215.8,117H176a8,8,0,0,0,0,16h39.8A88.1,88.1,0,0,1,128,216Z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8v58.67c0,89.44,75.82,119.12,91,124a8.19,8.19,0,0,0,5.1,0c15.14-4.83,91-34.52,91-124ZM128,222.84C113.33,217.51,48,192.85,48,114.67V64H208v50.67C208,192.85,142.67,217.51,128,222.84Z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm0,16c44.18,0,80,17.91,80,40s-35.82,40-80,40S48,102.09,48,80,83.82,40,128,40Zm80,136c0,22.09-35.82,40-80,40S48,198.09,48,176V156.28C65.44,170.12,94.42,180,128,180s62.56-9.88,80-23.72Zm0-48c0,22.09-35.82,40-80,40S48,150.09,48,128V108.28C65.44,122.12,94.42,132,128,132s62.56-9.88,80-23.72Z" />
    </svg>
  ),
  Brain: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39A56,56,0,0,0,64,180h0v36a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V180h0A56.09,56.09,0,0,0,248,124ZM64,164a40,40,0,0,1-8-79.23V72a32,32,0,0,1,64,0v52.77A56.3,56.3,0,0,0,64,164Zm112,52H80V185.07a55.87,55.87,0,0,0,16,2.93h64a55.87,55.87,0,0,0,16-2.93Zm16-52a56.3,56.3,0,0,0-56-39.23V72a32,32,0,0,1,64,0v12.77A40,40,0,0,1,192,164Z" />
    </svg>
  ),
  HardDrive: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,64H32A16,16,0,0,0,16,80v96a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V80A16,16,0,0,0,224,64Zm0,112H32V80H224v96Zm-32-40a12,12,0,1,1-12-12A12,12,0,0,1,192,136Zm-40,0a12,12,0,1,1-12-12A12,12,0,0,1,152,136Z" />
    </svg>
  ),
  Cloud: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-10 h-10" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8v58.67c0,89.44,75.82,119.12,91,124a8.19,8.19,0,0,0,5.1,0c15.14-4.83,91-34.52,91-124ZM128,222.84C113.33,217.51,48,192.85,48,114.67V64H208v50.67C208,192.85,142.67,217.51,128,222.84Zm37.66-118.5a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,147l42.34-42.34A8,8,0,0,1,165.66,104.34Z" />
    </svg>
  ),
  Code: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.25,12.3Zm176,27.7-48-40a8,8,0,1,0-10.25,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,96H104a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V104A8,8,0,0,0,152,96Zm-8,48H112V112h32Zm88,0H216V120h16a8,8,0,0,0,0-16H216V80a16,16,0,0,0-16-16H176V48a8,8,0,0,0-16,0V64H136V48a8,8,0,0,0-16,0V64H96V48A8,8,0,0,0,80,48V64H56A16,16,0,0,0,40,80v24H24a8,8,0,0,0,0,16H40v24H24a8,8,0,0,0,0,16H40v16a16,16,0,0,0,16,16H80v16a8,8,0,0,0,16,0V192h24v16a8,8,0,0,0,16,0V192h24v16a8,8,0,0,0,16,0V192h24a16,16,0,0,0,16-16V160h16a8,8,0,0,0,0-16Zm-32,32H56V80H200Z" />
    </svg>
  ),
  Rocket: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200H97.49L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-30.94,33.73-50.12,40.43-55.86a16,16,0,0,1,21.48,0c6.7,5.74,27.53,24.92,40.43,55.86a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,49.7,136,32,128,24.89,120,32,99.45,49.7,87.69,77.12,74.36,110.52,78.31,146.46,99.43,184Zm-44,21.64,8.36-37.63L48.31,148.36ZM207.69,148.36l-15.48,19.65,8.36,37.63Z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  ),
};

// ─── Service Data ───────────────────────────────────────────────────────────

interface Service {
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  icon: () => JSX.Element;
}

const SERVICES: Service[] = [
  {
    name: "Platform",
    description: "arcanea.ai",
    status: "operational",
    uptime: "99.98%",
    icon: Icons.Globe,
  },
  {
    name: "Authentication",
    description: "Supabase Auth",
    status: "operational",
    uptime: "99.99%",
    icon: Icons.Shield,
  },
  {
    name: "Database",
    description: "Supabase PostgreSQL",
    status: "operational",
    uptime: "99.99%",
    icon: Icons.Database,
  },
  {
    name: "AI Services",
    description: "Gemini, Claude",
    status: "operational",
    uptime: "99.92%",
    icon: Icons.Brain,
  },
  {
    name: "Storage",
    description: "Supabase Storage",
    status: "operational",
    uptime: "99.97%",
    icon: Icons.HardDrive,
  },
  {
    name: "CDN & Deployment",
    description: "Vercel",
    status: "operational",
    uptime: "99.99%",
    icon: Icons.Cloud,
  },
];

const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    dotClass: "bg-atlantean-teal-aqua",
    textClass: "text-atlantean-teal-aqua",
  },
  degraded: {
    label: "Degraded",
    dotClass: "bg-gold-bright",
    textClass: "text-gold-bright",
  },
  outage: {
    label: "Outage",
    dotClass: "bg-red-500",
    textClass: "text-red-500",
  },
} as const;

// ─── System Info ────────────────────────────────────────────────────────────

const SYSTEM_INFO = [
  { label: "Framework", value: "Next.js 16", icon: Icons.Code },
  { label: "Database", value: "PostgreSQL", icon: Icons.Database },
  { label: "AI Models", value: "Gemini, Claude", icon: Icons.Cpu },
  { label: "Hosting", value: "Vercel", icon: Icons.Rocket },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.08),transparent_60%)]" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-14 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-atlantean-teal-aqua/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.04] mb-8">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-text-muted">
                  System Status
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                {allOperational && (
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atlantean-teal-aqua opacity-40" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-atlantean-teal-aqua" />
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
                  {allOperational ? (
                    <span className="bg-gradient-to-r from-atlantean-teal-aqua to-white bg-clip-text text-transparent">
                      All Systems Operational
                    </span>
                  ) : (
                    <span className="text-gold-bright">
                      Service Disruption
                    </span>
                  )}
                </h1>
              </div>

              <p className="text-text-secondary text-sm">
                Last checked: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </section>

        {/* ── Service Status Grid ──────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="services-heading">
          <div className="mb-8">
            <h2
              id="services-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              Services
            </h2>
            <p className="text-xl font-display font-bold text-text-primary">
              Platform infrastructure
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const config = STATUS_CONFIG[service.status];
              const ServiceIcon = service.icon;

              return (
                <div
                  key={service.name}
                  className="card-3d liquid-glass rounded-2xl p-6 transition-all hover:border-white/[0.10]"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] text-text-secondary">
                      <ServiceIcon />
                    </div>
                    <span className="text-xs font-mono text-text-muted">
                      {service.uptime} uptime
                    </span>
                  </div>

                  <h3 className="font-display text-base font-semibold text-text-primary mb-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-text-muted mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${config.dotClass}`}
                    />
                    <span
                      className={`text-xs font-mono ${config.textClass}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Recent Incidents ─────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="incidents-heading">
          <div className="mb-8">
            <h2
              id="incidents-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              Incident History
            </h2>
            <p className="text-xl font-display font-bold text-text-primary">
              Recent incidents
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-10 text-center">
            <div className="flex justify-center mb-5 text-atlantean-teal-aqua/60">
              <Icons.ShieldCheck />
            </div>
            <p className="font-display text-base font-semibold text-text-primary mb-2">
              No incidents reported
            </p>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              No incidents have been reported in the last 30 days. All systems
              are running normally.
            </p>
          </div>
        </section>

        {/* ── System Information ───────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="sysinfo-heading">
          <div className="mb-8">
            <h2
              id="sysinfo-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              Infrastructure
            </h2>
            <p className="text-xl font-display font-bold text-text-primary">
              System information
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SYSTEM_INFO.map((info) => {
              const InfoIcon = info.icon;
              return (
                <div
                  key={info.label}
                  className="liquid-glass rounded-2xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] text-text-secondary mx-auto mb-4">
                    <InfoIcon />
                  </div>
                  <p className="text-xs font-mono text-text-muted mb-1">
                    {info.label}
                  </p>
                  <p className="font-display text-sm font-semibold text-text-primary">
                    {info.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section>
          <div className="liquid-glass rounded-2xl px-8 py-10 sm:px-12 text-center">
            <p className="font-display text-lg font-semibold text-text-primary mb-2">
              Questions about system status?
            </p>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              If you are experiencing issues not reflected on this page, please
              reach out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold hover:shadow-[0_0_24px_rgba(0,188,212,0.4)] transition-all duration-200 text-sm"
              >
                Contact us
                <Icons.ArrowRight />
              </Link>
              <Link
                href="/feedback"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 hover:bg-atlantean-teal-aqua/5 transition-all duration-200 text-sm"
              >
                Submit feedback
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
