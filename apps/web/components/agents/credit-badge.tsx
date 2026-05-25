/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

interface CreditBadgeProps {
  balance: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CreditBadge({ balance, className = "", size = "md" }: CreditBadgeProps) {
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-[var(--arc-brand-arcanean-gold)]/30 bg-[var(--arc-brand-arcanean-gold)]/10 font-medium text-[var(--arc-brand-arcanean-gold)] backdrop-blur-sm ${sizeStyles[size]} ${className}`}
      aria-label={`${balance} credits`}
      style={{ textShadow: "0 0 12px rgba(255, 215, 0, 0.4)" }}
    >
      <svg
        className={iconSize[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span>{balance.toLocaleString()} credits</span>
    </div>
  );
}
