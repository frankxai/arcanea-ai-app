import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Das Mädchen, das drei Sprachen hörte | Arcanea Library",
  description:
    "Ein zauberhaftes Buch in zehn Kapiteln für ein sechsjähriges Kind, das von Deutschland nach Kroatien zieht. Geschrieben in Deutsch, mit Kroatisch und Englisch eingewoben. Schauplatz: Mali Lošinj.",
  openGraph: {
    title: "Das Mädchen, das drei Sprachen hörte",
    description:
      "Die Geschichte von Mila und der Blume, die niemals stirbt — ein dreisprachiges Vorlesebuch von der Adriaküste.",
  },
};

const manuscript = readFileSync(
  join(process.cwd(), "..", "..", "book", "das-maedchen-mila", "manuscript.de.md"),
  "utf-8",
);

const TOC = [
  { num: 1, title: "Das Meer riecht anders als alles andere", hr: "More miriši drugačije od svega" },
  { num: 2, title: "Das Haus mit den grünen Fensterläden", hr: "Kuća sa zelenim kapcima" },
  { num: 3, title: "Die Blume, die niemals stirbt", hr: "Smilje koje nikada ne umire" },
  { num: 4, title: "Luna, die einen Mond auf dem Auge trägt", hr: "Luna koja nosi mjesec na oku" },
  { num: 5, title: "Der Mann, der Tintenfische verkauft", hr: "Čovjek koji prodaje hobotnice" },
  { num: 6, title: "Das erste Mal Delfine", hr: "Prvi put dupini" },
  { num: 7, title: "Der Junge, der zwei Häuser hat", hr: "Dječak s dvije kuće" },
  { num: 8, title: "Die Nacht, in der sie auf Kroatisch träumte", hr: "Noć u kojoj je sanjala na hrvatskom" },
  { num: 9, title: "Als Nona Marica den Weg verlor", hr: "Kad je Nona Marica izgubila put" },
  { num: 10, title: "Beide Zuhause", hr: "Oba doma" },
];

export default function MilaBookPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#00bcd4]/10 blur-[120px]" />
        <div className="absolute top-[40%] -left-40 h-[500px] w-[600px] rounded-full bg-[#0d47a1]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#ffd700]/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
          <Link href="/library" className="transition-colors hover:text-[#00bcd4]">
            Library
          </Link>
          <span>/</span>
          <span className="text-white/70">Mila</span>
        </nav>

        {/* Hero */}
        <header className="mb-16 border-b border-white/[0.06] pb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#00bcd4]/80">
            Ein dreisprachiges Vorlesebuch · Mali Lošinj · 10 Kapitel
          </p>
          <h1 className="mb-4 font-serif text-5xl font-light leading-tight tracking-tight text-white md:text-6xl">
            Das Mädchen, das drei Sprachen hörte
          </h1>
          <p className="mb-8 font-serif text-2xl italic leading-snug text-white/60 md:text-3xl">
            Die Geschichte von Mila und der Blume, die niemals stirbt
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-white/70">
            Geschrieben in Deutsch für ein sechsjähriges Kind, das von Deutschland nach
            Kroatien zieht. Kroatisch und Englisch sind eingewoben — du lernst sie nicht
            durch Vokabellisten, sondern weil Nona Marica, Rela, Luna und ein junger Delfin
            namens Val sie dir Wort für Wort schenken. Zwölf bis vierzehn Minuten pro
            Kapitel, ein Kapitel pro Abend, zehn Abende lang.
          </p>
        </header>

        {/* TOC */}
        <section className="mb-16 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
          <h2 className="mb-6 font-serif text-2xl font-light text-white">Inhalt</h2>
          <ol className="space-y-3">
            {TOC.map((c) => (
              <li key={c.num} className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#ffd700]/70 tabular-nums">
                  {c.num.toString().padStart(2, "0")}
                </span>
                <a
                  href={`#kapitel-${c.num}`}
                  className="group flex flex-col text-base text-white/85 transition-colors hover:text-[#00bcd4]"
                >
                  <span>{c.title}</span>
                  <span className="font-serif text-sm italic text-white/40 group-hover:text-[#00bcd4]/70">
                    {c.hr}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Refrain card */}
        <div className="mb-16 rounded-xl border border-[#ffd700]/20 bg-gradient-to-br from-[#ffd700]/[0.04] to-transparent p-6 text-center">
          <p className="font-serif text-xl italic text-[#ffd700]/90">
            Sada znam tvoje tajno ime.
          </p>
          <p className="mt-2 text-sm text-white/60">Jetzt kenne ich deinen geheimen Namen.</p>
        </div>

        {/* Manuscript */}
        <article
          className="
            prose prose-invert max-w-none
            prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight
            prose-h1:mt-16 prose-h1:mb-2 prose-h1:text-4xl prose-h1:text-white
            prose-h2:mt-2 prose-h2:mb-8 prose-h2:text-2xl prose-h2:font-normal prose-h2:italic prose-h2:text-white/70
            prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-lg prose-h3:font-normal prose-h3:not-italic prose-h3:tracking-wide prose-h3:text-[#00bcd4]
            prose-p:text-[1.06rem] prose-p:leading-[1.85] prose-p:text-white/85
            prose-strong:text-[#ffd700] prose-strong:font-medium
            prose-em:text-white/95
            prose-blockquote:border-l-2 prose-blockquote:border-[#00bcd4]/50
            prose-blockquote:bg-[#00bcd4]/[0.03] prose-blockquote:px-6 prose-blockquote:py-4
            prose-blockquote:font-serif prose-blockquote:not-italic prose-blockquote:text-white/80
            prose-blockquote:text-base
            prose-hr:my-12 prose-hr:border-white/10
            prose-table:my-8 prose-table:border-separate prose-table:border-spacing-0
            prose-table:rounded-xl prose-table:border prose-table:border-white/[0.08]
            prose-table:bg-white/[0.02] prose-table:overflow-hidden
            prose-th:bg-white/[0.04] prose-th:px-4 prose-th:py-3 prose-th:text-left
            prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:text-[#00bcd4]/80
            prose-th:font-medium prose-th:border-b prose-th:border-white/[0.08]
            prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-white/85
            prose-td:border-b prose-td:border-white/[0.04]
            prose-li:my-1 prose-li:text-white/85
          "
        >
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => {
                const text = children?.toString() ?? "";
                const match = text.match(/Kapitel (\d+)/);
                const id = match ? `kapitel-${match[1]}` : undefined;
                return (
                  <h1 id={id} {...props}>
                    {children}
                  </h1>
                );
              },
            }}
          >
            {manuscript}
          </ReactMarkdown>
        </article>

        {/* Closing card */}
        <footer className="mt-24 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#ffd700]/70">
            Für Eltern und Vorleser
          </p>
          <p className="text-base leading-relaxed text-white/75">
            Das <em>Smilje</em> (Strohblume,{" "}
            <em className="text-white/60">Helichrysum italicum</em>) ist eine echte
            Pflanze, die auf Kroatiens Inseln wirklich gold bleibt, auch wenn man sie
            pflückt. Vor Mali Lošinj gibt es einen echten Pod von Großen Tümmlern, die
            seit 1987 vom <em>Plavi Svijet Institute</em> erforscht werden. Die Magie
            dieses Buches ist nicht erfunden — sie ist nur ungesehen, bis man die geheimen
            Namen lernt.
          </p>
          <p className="mt-4 font-serif text-lg italic text-[#00bcd4]/80">Volim te.</p>
        </footer>
      </div>
    </div>
  );
}
