/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { m, LazyMotion, domAnimation, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { PhBookOpen, PhMagnifyingGlass, PhFunnel, PhArrowRight, PhHeart } from '@/lib/phosphor-icons';
import Link from 'next/link';
import { COLLECTIONS, CATEGORIES } from './collections-data';

export default function LibraryPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const isCollectionsInView = useInView(collectionsRef, { once: true, margin: '-100px' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = COLLECTIONS.filter((collection) => {
    const matchesCategory = selectedCategory === 'All' || collection.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalTexts = COLLECTIONS.reduce((sum, c) => sum + c.texts, 0);

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="relative min-h-screen bg-cosmic-deep">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-8"
      >
        {/* Book spines decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="flex gap-1">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-4 bg-white rounded-sm"
                style={{ height: `${100 + Math.random() * 100}px` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-draconic-crimson/10 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-draconic-crimson/10 border border-draconic-crimson/20 mb-6"
          >
            <PhBookOpen className="w-4 h-4 text-draconic-crimson" />
            <span className="text-sm font-medium text-draconic-crimson">The Collected Wisdom</span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-draconic-crimson via-gold-bright to-atlantean-teal-aqua bg-clip-text text-transparent">
              The Library of Arcanea
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-3xl mx-auto font-body italic mb-8"
          >
            "These books are not entertainment. They are equipment for living. Use them."
          </m.p>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold-bright">17</div>
              <div className="text-sm text-text-muted">Collections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold-bright">{totalTexts}+</div>
              <div className="text-sm text-text-muted">Texts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold-bright">190K+</div>
              <div className="text-sm text-text-muted">Words</div>
            </div>
          </m.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-y border-white/[0.04] sticky top-16 bg-cosmic-deep/95 backdrop-blur-sm z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <PhMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-cosmic-surface/50 border border-white/[0.06] text-white placeholder:text-text-muted focus:outline-none focus:border-atlantean-teal-aqua/50 focus:ring-2 focus:ring-atlantean-teal-aqua/20"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-atlantean-teal-aqua text-cosmic-deep'
                      : 'bg-cosmic-surface/50 text-text-secondary hover:bg-cosmic-surface hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section ref={collectionsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection, i) => {
              const Icon = collection.icon;
              return (
                <m.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isCollectionsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/lore/library/${collection.id}`}
                    className="block h-full p-6 rounded-2xl liquid-glass hover:border-white/[0.12] transition-all group hover-lift"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          collection.color === 'gold-bright'
                            ? 'bg-gold-bright/20 text-gold-bright'
                            : collection.color === 'atlantean-teal-aqua'
                            ? 'bg-atlantean-teal-aqua/20 text-atlantean-teal-aqua'
                            : collection.color === 'creation-prism-purple'
                            ? 'bg-creation-prism-purple/20 text-creation-prism-purple'
                            : 'bg-draconic-crimson/20 text-draconic-crimson'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wider">
                          {collection.category}
                        </span>
                        <h3 className="font-display font-semibold text-lg group-hover:text-gold-bright transition-colors">
                          {collection.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-4">{collection.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">{collection.texts} texts</span>
                      <span className="text-atlantean-teal-aqua">{collection.situation}</span>
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No collections match your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promise */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PhHeart className="w-12 h-12 mx-auto text-draconic-crimson mb-6" />
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">The Library's Promise</h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            If you read these texts honestly—
            <br />
            If you let them question you as you question them—
            <br />
            If you apply what resonates and release what doesn't—
            <br />
            <span className="text-white font-semibold">You will change.</span>
          </p>
          <p className="text-sm text-text-muted italic">
            "Enter seeking, leave transformed, return whenever needed."
          </p>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}
