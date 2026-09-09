import Image from "next/image";
import Link from "next/link";
import { join } from "path";
import { getBookRoot } from "@/lib/content/book-path";
import { isBookPublic } from "@/lib/content/book-visibility";

const volumes = [
  {
    id: "selene-y-brio",
    number: "I",
    title: "The Light She Could Not See",
    image: "/images/books/selene-y-brio/24.webp",
    alt: "Selene and Brío beneath enormous violet orchids above a sunlit river.",
    description:
      "She can see the light in every living thing except herself. Beyond the Ávila, a horse who refuses to obey becomes the companion she needs.",
    detail: "Twelve chapters · Twenty-four illustrations",
    action: "Begin the journey",
  },
  {
    id: "selene-y-brio-orchard",
    number: "II",
    title: "The Orchard of Unspoken Names",
    image: "/images/books/selene-y-brio-orchard/cover.webp",
    alt: "Selene and Damián lead their horses into a hidden orchard beneath enormous amber membranes.",
    description:
      "Six couriers vanish. A hidden orchard offers sanctuary. When Selene calls for help, she brings the danger to its door.",
    detail: "Fourteen chapters · Four new illustrations",
    action: "Continue the journey",
  },
];

export async function SeleneBookFeature() {
  const visibility = await Promise.all(
    volumes.map((volume) => isBookPublic(join(getBookRoot(), volume.id))),
  );

  return (
    <>
      {volumes.map((volume, index) =>
        visibility[index] ? (
          <section
            key={volume.id}
            aria-labelledby={`${volume.id}-title`}
            className="relative mx-auto max-w-6xl px-6 py-16"
          >
            <Link
              href={`/books/${volume.id}`}
              className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-teal-300 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-[9/12]">
                <Image
                  src={volume.image}
                  alt={volume.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-14">
                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-teal-200">
                  Selene &amp; Brío · Book {volume.number}
                </p>
                <h2
                  id={`${volume.id}-title`}
                  className="font-display text-3xl leading-tight text-white md:text-5xl"
                >
                  {volume.title}
                </h2>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
                  {volume.description}
                </p>
                <p className="mt-5 text-sm text-white/50">{volume.detail}</p>
                <span className="mt-8 text-sm font-medium text-teal-200 underline-offset-4 group-hover:underline">
                  {volume.action} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </section>
        ) : null,
      )}
    </>
  );
}
