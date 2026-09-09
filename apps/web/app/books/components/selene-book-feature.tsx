import Image from "next/image";
import Link from "next/link";
import { join } from "path";
import { getBookRoot } from "@/lib/content/book-path";
import { isBookPublic } from "@/lib/content/book-visibility";

export async function SeleneBookFeature() {
  if (!(await isBookPublic(join(getBookRoot(), "selene-y-brio")))) return null;

  return (
    <section
      aria-labelledby="selene-book-title"
      className="relative mx-auto max-w-6xl px-6 py-16"
    >
      <Link
        href="/books/selene-y-brio"
        className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-teal-300 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-[9/12]">
          <Image
            src="/images/books/selene-y-brio/24.webp"
            alt="Selene and Brío beneath enormous violet orchids above a sunlit river."
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-14">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-teal-200">
            Selene &amp; Brío · An illustrated journey
          </p>
          <h2
            id="selene-book-title"
            className="font-display text-3xl leading-tight text-white md:text-5xl"
          >
            The Light She Could Not See
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
            She can see the light in every living thing except herself. Beyond
            the Ávila, a horse who refuses to obey becomes the companion she
            needs.
          </p>
          <p className="mt-5 text-sm text-white/50">
            Twelve chapters · Twenty-four illustrations
          </p>
          <span className="mt-8 text-sm font-medium text-teal-200 underline-offset-4 group-hover:underline">
            Begin the journey <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
