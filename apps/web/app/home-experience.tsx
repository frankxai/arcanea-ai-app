import Link from "next/link";
import Image from "next/image";
import { WorldWorkbench } from "@/components/worlds/world-workbench";
import styles from "./home.module.css";
function DirectionArrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function HomeExperience() {
  return (
    <div className={styles.home}>
      <WorldWorkbench />
      <section className={styles.workflow} aria-labelledby="workflow-title">
        <div>
          <p className={styles.eyebrow}>From a sentence to a world</p>
          <h2 id="workflow-title">
            Something you can <br />
            build on.
          </h2>
          <p>
            Start with a draft. Make the decisions that give it a life of its
            own.
          </p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Describe the idea</h3>
              <p>
                A strange rule, a place, a conflict. Bring your concept, then
                sign in to generate a world draft.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Inspect what takes shape</h3>
              <p>
                Read the world, its characters and locations. Treat every
                generated detail as a draft.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Keep the world you chose</h3>
              <p>
                Save the exact draft to your account. Reopen its world page or
                export a copy to continue elsewhere.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className={styles.explore} aria-labelledby="explore-title">
        <div className={styles.exploreImage}>
          <Image
            src="/brand/arcanea-dashboard-hero-premium.png"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div>
            <p className={styles.eyebrow}>The Arcanea multiverse</p>
            <h2 id="explore-title">
              Enter a world <br />
              already in motion.
            </h2>
            <Link href="/worlds">
              Explore the worlds <DirectionArrow />
            </Link>
          </div>
        </div>
        <div className={styles.destinations}>
          <Link href="/library">
            <span>Read</span>
            <h3>
              The library <DirectionArrow />
            </h3>
            <p>Stories, philosophy and the written foundations of Arcanea.</p>
          </Link>
          <Link href="/studio">
            <span>Create</span>
            <h3>
              The studio <DirectionArrow />
            </h3>
            <p>
              Continue into the creative workspace. Sign in to work with your
              account.
            </p>
          </Link>
          <Link href="/install">
            <span>Build locally</span>
            <h3>
              Tools for your own setup <DirectionArrow />
            </h3>
            <p>
              Explore Arcanea&apos;s open-source tools and provider
              configuration.
            </p>
          </Link>
        </div>
      </section>
      <section className={styles.storage} aria-labelledby="storage-title">
        <div>
          <p className={styles.eyebrow}>Know where your work lives</p>
          <h2 id="storage-title">Your draft. Your next move.</h2>
        </div>
        <div>
          <p>
            The web world creator requires sign-in and uses hosted AI. Unsaved
            drafts stay in this browser tab; saving stores the world privately
            in your Arcanea account. Export a copy whenever you need one.
          </p>
          <Link href="/privacy">
            Read the privacy policy <DirectionArrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
