import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_SCENE } from "@/lib/shop/sample";

export const metadata: Metadata = {
  title: "Free World Starter — an editable worldbuilding example",
  description:
    "Read a complete original example scene and download an editable world brief, character and continuity record. No account required.",
  alternates: { canonical: "/shop/sample" },
};

export default function SamplePage() {
  return (
    <article className="shop-reading">
      <p className="shop-eyebrow">Free World Starter / Version 1</p>
      <h1>
        One rule.
        <br />A real cost.
        <br />
        <em>A scene that holds.</em>
      </h1>
      <p className="shop-intro">
        Begin with something you can read, adapt and carry into your own tools.
        This example is an AI-assisted original proposal outside official
        Arcanea canon.
      </p>
      <Link
        className="shop-button"
        href="/downloads/arcanea-world-starter.md"
        download
      >
        Download the Markdown starter
      </Link>
      <Link
        className="shop-text-link"
        href="/downloads/arcanea-world-starter.json"
        download
      >
        Download the JSON brief
      </Link>
      <h2>The world in five signals</h2>
      <ul>
        <li>
          <strong>Promise:</strong> a coastal mystery about what people choose
          to remember.
        </li>
        <li>
          <strong>Rule:</strong> a damaged memory can be repaired only with an
          equally specific memory.
        </li>
        <li>
          <strong>Cost:</strong> the repairer loses their lived connection to
          what they give.
        </li>
        <li>
          <strong>Pressure:</strong> an archivist wants to preserve her father
          for a younger brother.
        </li>
        <li>
          <strong>Visual direction:</strong> salt-clouded glass, copper repairs,
          narrow tide stairs and low morning light.
        </li>
      </ul>
      <h2>The repair</h2>
      <div className="shop-sample-scene">
        {SAMPLE_SCENE.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h2>What the scene demonstrates</h2>
      <p>
        The rule becomes visible through an exchange. Mara achieves her
        immediate goal, but loses an experience she valued. Her brother keeps a
        memory she can now receive only as a story. The cost changes their
        relationship and creates a next scene.
      </p>
      <h2>Make the method your own.</h2>
      <ol>
        <li>Replace the promise and rule with an original idea.</li>
        <li>
          Name the character who wants something the rule makes difficult.
        </li>
        <li>Write the decision and its observable consequence.</li>
        <li>
          Record accepted details and keep new suggestions marked as proposals.
        </li>
        <li>
          Export the brief with the scene and ask another person what they
          understood.
        </li>
      </ol>
      <p>
        The downloaded starter includes editable records and a
        personal/commercial adaptation permission for this sample text. It does
        not grant rights to official Arcanea characters, artwork or trademarks.
        Model/API use, when you choose it, has its own cost and provider terms.
      </p>
      <Link
        href="/shop/worldbuilder-production-edition"
        className="shop-button"
      >
        Inspect the full edition specification
      </Link>
    </article>
  );
}
