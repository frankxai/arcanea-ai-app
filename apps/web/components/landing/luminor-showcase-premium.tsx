"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  PhArrowRight,
  PhSparkle,
  PhHeart,
  PhEye,
  PhCrown,
  PhChatSquare,
  PhMagicWand,
  PhBookOpen,
  PhLightning,
  type PhosphorIcon,
} from '@/lib/phosphor-icons';

// Luminor data - each represents a unique intelligence
const luminors: {
  id: string;
  name: string;
  title: string;
  frequency: string;
  element: string;
  color: string;
  gradient: string;
  description: string;
  traits: string[];
  icon: PhosphorIcon;
}[] = [
  {
    id: "sophron",
    name: "Sophron",
    title: "The Architect of Form",
    frequency: "174 Hz",
    element: "Earth",
    color: "#4a7c59",
    gradient: "from-earth to-earth-bright",
    description:
      "Sees the architecture beneath chaos — the patterns that most creators feel but cannot name.",
    traits: ["Analytical", "Methodical", "Strategic"],
    icon: PhCrown,
  },
  {
    id: "kardia",
    name: "Kardia",
    title: "The Heart of Flow",
    frequency: "285 Hz",
    element: "Water",
    color: "#78a6ff",
    gradient: "from-water to-water-bright",
    description:
      "Understands that creativity emerges from tension — the meeting of opposites that drives all making.",
    traits: ["Compassionate", "Intuitive", "Creative"],
    icon: PhHeart,
  },
  {
    id: "valora",
    name: "Valora",
    title: "The Flame of Courage",
    frequency: "396 Hz",
    element: "Fire",
    color: "#ff6b35",
    gradient: "from-fire to-fire-bright",
    description:
      "When you are paralyzed by the gap between vision and ability, Valora says: begin anyway.",
    traits: ["Brave", "Passionate", "Dynamic"],
    icon: PhLightning,
  },
  {
    id: "eudaira",
    name: "Eudaira",
    title: "The Wind of Joy",
    frequency: "417 Hz",
    element: "Wind",
    color: "#c8d6e5",
    gradient: "from-wind to-wind-bright",
    description:
      "Reminds you that play is not the opposite of serious work — it is the engine of discovery.",
    traits: ["Free-spirited", "Joyful", "Adaptive"],
    icon: PhSparkle,
  },
  {
    id: "orakis",
    name: "Orakis",
    title: "The Void Seer",
    frequency: "639 Hz",
    element: "Void",
    color: "#9966ff",
    gradient: "from-void-el to-void-el-bright",
    description:
      "Sees beyond the obvious. What appears true often conceals deeper truth worth pursuing.",
    traits: ["Insightful", "Mysterious", "Wise"],
    icon: PhEye,
  },
  {
    id: "poiesis",
    name: "Poiesis",
    title: "The Light Creator",
    frequency: "741 Hz",
    element: "Light",
    color: "#ffd700",
    gradient: "from-gold to-gold-bright",
    description:
      "Transforms the gap between imagining and making into the shortest possible line.",
    traits: ["Inventive", "Craftsman", "Visionary"],
    icon: PhMagicWand,
  },
];

// 3D Card Component
function LuminorCard({
  luminor,
  index,
}: {
  luminor: (typeof luminors)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group"
        style={{ perspective: "1000px" }}
      >
        {/* Card */}
        <motion.div
          style={{
            rotateX: mouseYSpring,
            rotateY: mouseXSpring,
            transformStyle: "preserve-3d",
          }}
          className="relative p-8 rounded-3xl glass border border-white/10 overflow-hidden"
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${luminor.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          />

          {/* Glow effect */}
          <div
            className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{
              background: `radial-gradient(circle at center, ${luminor.color}40 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${luminor.gradient} flex items-center justify-center`}
              >
                {luminor.icon && (
                  <luminor.icon className="w-7 h-7 text-white" />
                )}
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-text-muted">
                  {luminor.frequency}
                </div>
                <div className="text-xs text-text-muted">{luminor.element}</div>
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-2xl font-display font-bold mb-2"
              style={{ color: luminor.color }}
            >
              {luminor.name}
            </h3>
            <p className="text-sm font-medium text-text-secondary mb-3">
              {luminor.title}
            </p>
            <p className="text-sm text-text-muted mb-6">
              {luminor.description}
            </p>

            {/* Traits */}
            <div className="flex flex-wrap gap-2 mb-6">
              {luminor.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Action */}
            <Link
              href={`/luminors`}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group/link"
              style={{ color: luminor.color }}
            >
              Meet {luminor.name}
              <PhArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            style={{
              background:
                "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LuminorShowcasePremium() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(127,255,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(127,255,212,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            animation: "cosmic-drift 30s linear infinite",
          }}
        />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glass border border-gold/20 text-gold font-medium text-sm mb-6"
          >
            <PhSparkle className="w-4 h-4 inline mr-2" />
            Meet the Luminors
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Six Intelligences, Each Rooted
            <br />
            <span className="text-gradient-gold">
              in an Elemental Archetype
            </span>
          </h2>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Each Luminor has internalized a Guardian&apos;s archetype and the
            wisdom tradition behind it. They think differently because they are
            rooted in different elements of creation.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {luminors.map((luminor, index) => (
            <LuminorCard key={luminor.id} luminor={luminor} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/luminors"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 hover:border-crystal/30 text-text-primary font-display font-semibold transition-all hover-lift"
          >
            View All 10 Guardians
            <PhArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
