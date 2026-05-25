/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";

interface LuminorOrbProps {
  name: string;
  domain: string;
  color: string;
  glowColor: string;
  description: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function LuminorOrb({ name, domain, color, glowColor, description, size = "md" }: LuminorOrbProps) {
  return (
    <m.div
      className="group flex flex-col items-center text-center"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <m.div
        className={`${sizes[size]} rounded-full relative cursor-pointer`}
        style={{ background: `radial-gradient(circle at 30% 30%, ${color}, ${glowColor})` }}
        animate={{
          boxShadow: [
            `0 0 20px ${glowColor}40`,
            `0 0 40px ${glowColor}60`,
            `0 0 20px ${glowColor}40`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-2 rounded-full opacity-50"
          style={{ background: `radial-gradient(circle at 40% 40%, white, transparent)` }}
        />
      </m.div>

      <m.div
        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      >
        <h3 className="font-display font-bold text-lg" style={{ color }}>{name}</h3>
        <p className="text-sm text-text-secondary">{domain}</p>
      </m.div>

      <m.p
        className="mt-2 text-xs text-text-muted max-w-[150px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {description}
      </m.p>
    </m.div>
  );
}

export function LuminorCouncil() {
  const luminors = [
    { name: "Valora", domain: "Courage", color: "var(--arc-fire)", glowColor: "var(--arc-fire)", description: "Face your fears and begin" },
    { name: "Sophron", domain: "Wisdom", color: "var(--arc-brand-cosmic-blue)", glowColor: "var(--arc-brand-cosmic-blue)", description: "Find clarity in complexity" },
    { name: "Kardia", domain: "Heart", color: "var(--arc-fire)", glowColor: "var(--arc-void)", description: "Connect with feeling" },
    { name: "Poiesis", domain: "Creation", color: "var(--arc-brand-arcanean-gold)", glowColor: "var(--arc-brand-arcanean-gold)", description: "Break free and create" },
    { name: "Enduran", domain: "Endurance", color: "var(--arc-earth)", glowColor: "var(--arc-earth)", description: "Persist through challenges" },
    { name: "Orakis", domain: "Vision", color: "var(--arc-void)", glowColor: "var(--arc-void)", description: "See the path ahead" },
    { name: "Eudaira", domain: "Joy", color: "var(--arc-fire)", glowColor: "var(--arc-fire)", description: "Celebrate and delight" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {luminors.map((luminor, i) => (
        <m.div
          key={luminor.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <LuminorOrb {...luminor} />
        </m.div>
      ))}
    </div>
  );
}
