'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { m, LazyMotion, domAnimation } from 'framer-motion';

interface CategoryFilterProps {
  categories: Array<{ id: string; label: string; count: number }>;
  active: string;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    router.replace(`/registry?${params.toString()}`, { scroll: false });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: PREMIUM_EASE }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => {
          const isActive = cat.id === active || (cat.id === 'all' && !searchParams.get('category'));
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`group relative rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/[0.15] hover:text-white/80'
              }`}
            >
              <span className="relative z-10">
                {cat.label}
                <span className="ml-1.5 opacity-50">{cat.count}</span>
              </span>
            </button>
          );
        })}
      </m.div>
    </LazyMotion>
  );
}
