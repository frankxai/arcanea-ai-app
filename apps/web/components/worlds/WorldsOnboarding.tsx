/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "arcanea-worlds-onboarded";

const STEPS = [
  {
    title: "Welcome to the Multiverse",
    body: "Worlds are living universes built by creators. Each has its own characters, locations, and rules.",
  },
  {
    title: "Create or Explore",
    body: "Build your own world with AI, or fork someone else\u2019s and make it yours.",
  },
  {
    title: "Talk to Characters",
    body: "Every character in a world is an AI you can chat with. They know their world\u2019s lore.",
  },
] as const;

export function WorldsOnboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const activeElement = document.activeElement;
        returnFocusRef.current =
          activeElement instanceof HTMLElement &&
          activeElement !== document.body
            ? activeElement
            : document.getElementById("worlds-heading");
        setShow(true);
      }
    } catch {
      /* SSR or private browsing */
    }
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  }, [step, dismiss]);

  const current = STEPS[step];

  return (
    <LazyMotion features={domAnimation}>
      <Dialog.Root
        open={show}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
          </Dialog.Overlay>

          <Dialog.Content
            asChild
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              nextButtonRef.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const returnTarget = returnFocusRef.current?.isConnected
                ? returnFocusRef.current
                : document.getElementById("worlds-heading");
              returnTarget?.focus({ preventScroll: true });
            }}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 z-50 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.08] p-6 text-center outline-none"
              style={{
                x: "-50%",
                y: "-50%",
                background: "rgba(12, 12, 20, 0.85)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 60px rgba(0,188,212,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                <m.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Dialog.Title asChild>
                    <h3 className="mb-2 text-lg font-display font-semibold text-white">
                      {current.title}
                    </h3>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <p className="text-sm leading-relaxed text-white/50">
                      {current.body}
                    </p>
                  </Dialog.Description>
                </m.div>
              </AnimatePresence>

              <p className="sr-only" aria-live="polite">
                Step {step + 1} of {STEPS.length}
              </p>

              <div
                className="mt-5 mb-4 flex items-center justify-center gap-2"
                aria-hidden="true"
              >
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-transform duration-200 ${
                      i === step
                        ? "scale-110 bg-[var(--arc-brand-atlantean-teal)]"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-lg px-4 py-2 text-xs text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/70"
                >
                  Skip
                </button>
                <button
                  ref={nextButtonRef}
                  type="button"
                  onClick={next}
                  className="rounded-lg border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/15 px-5 py-2 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] transition-colors hover:bg-[var(--arc-brand-atlantean-teal)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/70"
                >
                  {step < STEPS.length - 1 ? "Next" : "Get Started"}
                </button>
              </div>
            </m.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </LazyMotion>
  );
}
