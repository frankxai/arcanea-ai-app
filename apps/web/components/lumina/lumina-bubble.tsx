"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";
import styles from "@arcanea/design-system/companion.module.css";
import markSrc from "@/assets/brand/arcanea-mark.jpg";
import { useAuth } from "@/lib/auth/context";
import { PhX } from "@/lib/phosphor-icons";

const CompanionChat = dynamic(
  () => import("./companion-chat").then((module) => module.CompanionChat),
  { ssr: false, loading: () => <p role="status">Opening your companion…</p> },
);

function AccountCompanion() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  return (
    <>
      <button
        ref={trigger}
        className={styles.bubble}
        type="button"
        hidden={open}
        aria-label="Open Arcanea companion"
        aria-expanded={open}
        aria-controls={opened ? panelId : undefined}
        aria-haspopup="dialog"
        onClick={() => {
          setOpened(true);
          setOpen(true);
        }}
      >
        <Image src={markSrc} alt="" width={56} height={56} />
      </button>
      {opened && (
        <section
          id={panelId}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-label="Arcanea companion"
          hidden={!open}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              close();
            }
          }}
        >
          <header className={styles.header}>
            <div>
              <h2>Arcanea companion</h2>
              <p className={styles.caption}>
                A thought, a scene, a place to begin.
              </p>
            </div>
            <button
              className={styles.close}
              type="button"
              onClick={close}
              aria-label="Close companion"
            >
              <PhX aria-hidden="true" />
            </button>
          </header>
          <CompanionChat open={open} />
          <footer className={styles.footer}>
            <span>Replies stay in this page.</span>
            <Link href="/chat">Open full chat</Link>
          </footer>
        </section>
      )}
    </>
  );
}

export function LuminaBubble() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  if (
    isLoading ||
    pathname === "/" ||
    /^\/[a-z]{2}\/?$/.test(pathname) ||
    /^\/(chat|room)(\/|$)/.test(pathname)
  )
    return null;
  // A different account gets a fresh component and aborts the previous request.
  return <AccountCompanion key={user?.id ?? "anonymous"} />;
}
