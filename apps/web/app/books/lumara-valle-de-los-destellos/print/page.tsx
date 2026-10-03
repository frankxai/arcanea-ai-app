/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { isBookPublic } from '@/lib/content/book-visibility';
import { notFound } from 'next/navigation';
import { getBookRoot } from '@/lib/content/book-path';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lumara — Versión impresa",
  description:
    "Versión para imprimir o guardar como PDF del libro Lumara: todos los capítulos en una sola página.",
  robots: { index: false, follow: false },
};

const BOOK_DIR = join(getBookRoot(), "lumara-valle-de-los-destellos");
const BOOK_ROOT = join(BOOK_DIR, "chapters");
const COVER_PATH = "/images/books/lumara-valle-de-los-destellos-cover-v2.png";

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
  if (!(await isBookPublic(BOOK_DIR))) notFound();

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
          color: var(--arc-earth);
        }
        .print-book h3 {
          font-family: 'Geist', system-ui, sans-serif;
          font-weight: 600;
          font-size: 11pt;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 36px 0 14px;
          color: var(--arc-earth);
        }
        .print-book p { margin: 0 0 14px; orphans: 3; widows: 3; }
        .print-book em { color: var(--arc-earth); }
        .print-book strong { font-weight: 700; color: var(--arc-earth); }
        .print-book blockquote {
          margin: 18px 0;
          padding: 4px 18px;
          border-left: 2px solid var(--arc-fire);
          color: var(--arc-earth);
          font-style: italic;
        }
        .print-book hr {
          border: none;
          border-top: 1px solid var(--arc-text-primary);
          margin: 24px auto;
          width: 40%;
        }
        .print-book table {
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 11.5pt;
          font-family: 'Geist', system-ui, sans-serif;
          width: 100%;
        }
        .print-book th {
          text-align: left;
          padding: 8px 12px;
          font-weight: 600;
          border-bottom: 2px solid var(--arc-earth);
          color: var(--arc-earth);
          background: var(--arc-text-primary);
        }
        .print-book td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--arc-text-primary);
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
          color: var(--arc-cosmic-void);
          margin: 0 0 12px;
        }
        .print-book .cover-page .subtitle {
          font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
          font-style: italic;
          font-size: 16pt;
          color: var(--arc-earth);
          margin: 0 0 36px;
        }
        .print-book .cover-page .langs {
          font-family: 'Geist', system-ui, sans-serif;
          font-size: 11pt;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--arc-earth);
        }
        .print-book .toolbar {
          background: var(--arc-text-primary);
          border: 1px solid var(--arc-text-primary);
          padding: 16px 20px;
          margin: 0 0 32px;
          font-family: 'Geist', system-ui, sans-serif;
          font-size: 13pt;
          color: var(--arc-earth);
          border-radius: 4px;
        }
        .print-book .toolbar button {
          background: var(--arc-fire);
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
          border-top: 1px solid var(--arc-text-primary);
          font-size: 12pt;
          color: var(--arc-cosmic-void);
        }
      `}</style>

      <div className="toolbar no-print">
        Listo para imprimir. Presiona <strong>Ctrl+P</strong> (Windows) o <strong>Cmd+P</strong> (Mac) y selecciona <em>Guardar como PDF</em>.
      </div>

      <section className="cover-page">
        <Image
          src={COVER_PATH}
          alt="Portada: Lumara"
          width={440}
          height={660}
          priority
          unoptimized
        />
        <p className="title">Lumara</p>
        <p className="subtitle">La historia de Lila y la flor que guarda los nombres verdaderos</p>
        <p className="langs">Español · English</p>
      </section>

      {chapters.map((ch) => (
        <article key={ch.filename} className="chapter-break">
          <ReactMarkdown
            components={{
              img: (props) => (
                <Image
                  src={(props as { src?: string }).src ?? ""}
                  alt={(props as { alt?: string }).alt ?? ""}
                  width={1200}
                  height={800}
                  style={{ height: "auto" }}
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
        <h3>Sobre este libro</h3>
        <p style={{ fontStyle: "italic", color: "var(--arc-earth)" }}>
          Escrito como un cuento de buenas noches para niños de 5 a 8 años. Con un lenguaje poético y lleno de diálogo que sigue la tradición de El Principito de Saint-Exupéry y la calidez de las películas de Studio Ghibli. Una historia de ensueño sobre el poder de prestar atención a las pequeñas luces del mundo.
        </p>
        <p style={{ marginTop: 18, color: "var(--arc-earth)", fontFamily: "Geist, system-ui, sans-serif", fontSize: "10pt" }}>
          Arcanea Open Library · arcanea.ai/books/lumara-valle-de-los-destellos
        </p>
      </section>
    </div>
  );
}
