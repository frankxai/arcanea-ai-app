import { Metadata } from "next";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Das Mädchen, das drei Sprachen hörte — Druckversion",
  description:
    "Druck-Version des kompletten Buches: alle 10 Kapitel auf einer Seite, optimiert zum Ausdrucken oder als PDF speichern (Browser → Drucken → Als PDF speichern).",
  robots: { index: false, follow: false },
};

const BOOK_ROOT = join(process.cwd(), "..", "..", "book", "das-maedchen-drei-sprachen", "chapters");
const COVER_PATH = "/images/books/das-maedchen-drei-sprachen-cover-v2.png";

async function loadChapters() {
  const files = (await readdir(BOOK_ROOT)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(
    files.map(async (filename) => {
      const raw = await readFile(join(BOOK_ROOT, filename), "utf-8");
      return { filename, content: raw };
    }),
  );
}

export default async function PrintPage() {
  const chapters = await loadChapters();

  return (
    <div className="print-book bg-white text-stone-900">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 22mm 18mm;
        }
        @media print {
          .print-book { font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
          .chapter-break { page-break-before: always; }
          .no-print { display: none !important; }
          a { color: inherit; text-decoration: none; }
        }
        .print-book {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          line-height: 1.65;
          font-size: 14.5pt;
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 32px 96px;
        }
        .print-book h1 {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          font-size: 36pt;
          line-height: 1.15;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        .print-book h2 {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          font-size: 22pt;
          line-height: 1.2;
          margin: 0 0 6px;
          color: #5a4423;
        }
        .print-book h3 {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          font-size: 11pt;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 36px 0 14px;
          color: #6b5535;
        }
        .print-book p { margin: 0 0 14px; orphans: 3; widows: 3; }
        .print-book em { color: #5a4423; }
        .print-book strong { font-weight: 700; color: #6b5535; }
        .print-book blockquote {
          margin: 18px 0;
          padding: 4px 18px;
          border-left: 2px solid #d8a73a;
          color: #5a4423;
          font-style: italic;
        }
        .print-book hr {
          border: none;
          border-top: 1px solid #d6c8a8;
          margin: 24px auto;
          width: 40%;
        }
        .print-book table {
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 11.5pt;
          font-family: 'Inter', system-ui, sans-serif;
          width: 100%;
        }
        .print-book th {
          text-align: left;
          padding: 8px 12px;
          font-weight: 600;
          border-bottom: 2px solid #6b5535;
          color: #6b5535;
          background: #faf6ec;
        }
        .print-book td {
          padding: 8px 12px;
          border-bottom: 1px solid #ece2c8;
        }
        .print-book img.chapter-art {
          width: 100%;
          max-width: 600px;
          margin: 18px auto 24px;
          display: block;
          break-inside: avoid;
        }
        .print-book .cover-page {
          text-align: center;
          padding-top: 40mm;
          page-break-after: always;
        }
        .print-book .cover-page img {
          width: 220px;
          margin: 0 auto 32px;
          display: block;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        .print-book .cover-page .title {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          font-style: italic;
          font-size: 32pt;
          font-weight: 400;
          line-height: 1.1;
          color: #2a1f0f;
          margin: 0 0 12px;
        }
        .print-book .cover-page .subtitle {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          font-style: italic;
          font-size: 16pt;
          color: #6b5535;
          margin: 0 0 36px;
        }
        .print-book .cover-page .langs {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11pt;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b6b3e;
        }
        .print-book .toolbar {
          background: #faf6ec;
          border: 1px solid #d6c8a8;
          padding: 16px 20px;
          margin: 0 0 32px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13pt;
          color: #5a4423;
          border-radius: 4px;
        }
        .print-book .toolbar button {
          background: #d8a73a;
          color: white;
          border: none;
          padding: 8px 16px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          border-radius: 4px;
          margin-left: 12px;
          font-size: 12pt;
        }
        .print-book .nachwort {
          page-break-before: always;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid #d6c8a8;
          font-size: 12pt;
          color: #4a3a1f;
        }
      `}</style>

      <div className="toolbar no-print">
        Druckbereit. Drücke <strong>Strg+P</strong> (Windows) oder <strong>Cmd+P</strong> (Mac), dann <em>Als PDF speichern</em>.
      </div>

      <section className="cover-page">
        <Image
          src={COVER_PATH}
          alt="Cover: Das Mädchen, das drei Sprachen hörte"
          width={440}
          height={660}
          unoptimized
        />
        <p className="title">Das Mädchen,<br />das drei Sprachen hörte</p>
        <p className="subtitle">Die Geschichte von Mila und der Blume, die niemals stirbt</p>
        <p className="langs">Deutsch · Hrvatski · English</p>
      </section>

      {chapters.map((ch) => (
        <article key={ch.filename} className="chapter-break">
          <ReactMarkdown
            components={{
              img: (props) => (
                <img
                  src={(props as { src?: string }).src ?? ""}
                  alt={(props as { alt?: string }).alt ?? ""}
                  className="chapter-art"
                />
              ),
              h1: () => null,
            }}
          >
            {ch.content}
          </ReactMarkdown>
        </article>
      ))}

      <section className="nachwort">
        <h3>Über dieses Buch</h3>
        <p style={{ fontStyle: "italic", color: "#6b5535" }}>
          Geschrieben für Mila und alle Kinder, die zwischen zwei Sprachen leben.
          Das Smilje (<em>Helichrysum italicum</em>) ist eine echte Pflanze, die auf
          Kroatiens Inseln wirklich gold bleibt, auch wenn man sie pflückt. Die Delfine
          vor Mali Lošinj werden seit 1987 vom <em>Plavi Svijet Institute</em>
          (Blue World Institute) erforscht. Echte Delfine haben echte Namen.
        </p>
        <p style={{ marginTop: 18, color: "#8b6b3e", fontFamily: "Inter, system-ui, sans-serif", fontSize: "10pt" }}>
          Arcanea Open Library · arcanea.ai/books/das-maedchen-drei-sprachen
        </p>
      </section>
    </div>
  );
}
