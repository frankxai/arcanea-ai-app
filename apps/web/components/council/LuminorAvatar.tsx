/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";

interface LuminorAvatarProps {
  name: string;
  frequency: number;
  color: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: "w-10 h-10", inner: "w-7 h-7", text: "text-xs" },
  md: { outer: "w-14 h-14", inner: "w-10 h-10", text: "text-sm" },
  lg: { outer: "w-20 h-20", inner: "w-14 h-14", text: "text-base" },
};

export function LuminorAvatar({
  name,
  frequency,
  color,
  size = "md",
  isActive = false,
  className = "",
}: LuminorAvatarProps) {
  const { outer, inner, text } = SIZE_MAP[size];
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <m.div
      className={`relative flex items-center justify-center ${outer} ${className}`}
      animate={
        isActive
          ? {
              filter: [
                `drop-shadow(0 0 8px ${color}60)`,
                `drop-shadow(0 0 18px ${color}90)`,
                `drop-shadow(0 0 8px ${color}60)`,
              ],
            }
          : {}
      }
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow ring */}
      <m.div
        className={`absolute inset-0 rounded-full`}
        style={{
          background: `conic-gradient(from 0deg, ${color}80, ${color}20, ${color}80)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      {/* Inner avatar circle */}
      <div
        className={`relative ${inner} rounded-full flex items-center justify-center font-display font-bold text-white ${text}`}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}70, ${color}25 60%, ${color}08)`,
          border: `1px solid ${color}40`,
        }}
      >
        {initial}
      </div>

      {/* Frequency badge */}
      {size !== "sm" && (
        <div
          className="absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 font-mono text-[8px] text-white/70 border"
          style={{
            background: `${color}22`,
            borderColor: `${color}40`,
          }}
        >
          {frequency}
        </div>
      )}
    </m.div>
  );
}
