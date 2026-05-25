/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

/**
 * Radix-based accordion for the /contribute FAQ. Keyboard accessible out of
 * the box — arrow keys, home/end, enter/space, and focus trapping handled by
 * Radix. We only layer on Arcanea's glass surface styling.
 */
export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn('space-y-3', className)}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className={cn(
            'overflow-hidden rounded-xl border border-white/[0.06]',
            'bg-gradient-to-br from-white/[0.035] to-white/[0.01]',
            'data-[state=open]:border-[var(--arc-brand-atlantean-teal)]/25',
            'data-[state=open]:shadow-[0_0_32px_rgba(0,188,212,0.06)]',
            'transition-all',
          )}
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger
              className={cn(
                'group flex w-full items-center justify-between gap-4 px-5 py-4 text-left',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40',
              )}
            >
              <span className="font-display text-[15px] font-medium text-white/85 group-data-[state=open]:text-white">
                {item.question}
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[var(--arc-brand-atlantean-teal)]"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              'overflow-hidden text-sm leading-relaxed text-white/55',
              'data-[state=open]:animate-accordion-down',
              'data-[state=closed]:animate-accordion-up',
            )}
          >
            <div className="border-t border-white/[0.05] px-5 py-4">{item.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
