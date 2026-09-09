import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrtheaEncounter } from "./encounter";
import styles from "./encounter.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Orthea playtest",
  description:
    "A playable study of a walking reservoir, twelve units of water and a costly passage.",
  robots: { index: false, follow: false },
};

export default function OrtheaPlaytestPage() {
  // Source proposals are restricted. Only an actual Vercel preview or a local
  // development session may render this study; unset production envs fail closed.
  const preview = process.env.VERCEL_ENV === "preview";
  const development = process.env.NODE_ENV === "development";
  if (!preview && !development) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/gallery">Gallery</Link>
          <span>/</span>
          <span aria-current="page">Orthea playtest</span>
        </nav>
        <header className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>
              Experimental playtest · preview only
            </p>
            <h1>
              An entire harbor.
              <br />
              <em>Twelve units of water.</em>
            </h1>
          </div>
          <div className={styles.premise}>
            <p>
              A walking reservoir is drowning its harbor. Balance three cisterns
              and open Mara’s family dock to bring Orthea to its knees.
            </p>
          </div>
        </header>
        <noscript>
          <p className={styles.notice}>
            This encounter needs JavaScript. Its rule: conserve twelve units,
            balance three cisterns, and open the family passage to lower Orthea.{" "}
            <Link href="/gallery">Return to the gallery.</Link>
          </p>
        </noscript>
        <OrtheaEncounter />
        <section className={styles.notes} aria-labelledby="orthea-notes">
          <h2 id="orthea-notes">One rule, a world around it.</h2>
          <div>
            <p>
              This study makes Orthea’s reservoir rule playable. Its capacities
              and timing are prototype choices. One announced footfall tests the
              route; a missed cue preserves your progress.
            </p>
            <p>
              The source is the restricted World Atlas proposal. The snapshot
              preserves that source and status. It can also reopen in the
              standalone encounter or pass through the local worldbuilding MCP
              adapter.
            </p>
            <p>
              Play state and chosen files stay in this browser session unless
              you download a snapshot. This encounter makes no generation call
              and does not upload your file.
            </p>
            <Link href="/gallery/weight-of-wonders">
              Explore the published concept collection
            </Link>
          </div>
        </section>
        <footer className={styles.footer}>
          Orthea interaction study · Proposed lore · Public release and canon
          approval remain separate.
        </footer>
      </div>
    </div>
  );
}
