"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./illustrated-novella-reader.module.css";

export interface NovellaImage {
  src: string;
  alt: string;
  caption: string;
}

export interface NovellaChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  paragraphs: string[];
  images: NovellaImage[];
}

export interface IllustratedNovellaReaderProps {
  title: string;
  subtitle: string;
  author: string;
  cover: NovellaImage;
  chapters: NovellaChapter[];
  storageKey?: string;
}

interface GalleryImage extends NovellaImage {
  chapterTitle: string;
}

function ChapterImage({
  image,
  chapterTitle,
  onOpen,
}: {
  image: NovellaImage;
  chapterTitle: string;
  onOpen: (image: GalleryImage) => void;
}) {
  return (
    <figure className={styles.figure}>
      <button
        className={styles.imageButton}
        type="button"
        onClick={() => onOpen({ ...image, chapterTitle })}
        aria-label={`Open full image: ${image.alt}`}
      >
        <Image
          className={styles.image}
          src={image.src}
          alt={image.alt}
          width={941}
          height={1672}
          sizes="(max-width: 768px) 100vw, 44rem"
        />
      </button>
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

export function IllustratedNovellaReader({
  title,
  subtitle,
  author,
  cover,
  chapters,
  storageKey = "arcanea:reader:selene-y-brio",
}: IllustratedNovellaReaderProps) {
  const [activeChapter, setActiveChapter] = useState(chapters[0]?.id ?? "");
  const [resumeChapter, setResumeChapter] = useState("");
  const [progress, setProgress] = useState(0);
  const [galleryImage, setGalleryImage] = useState<GalleryImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && chapters.some((chapter) => chapter.id === saved))
        setResumeChapter(saved);
    } catch {
      // Reading remains fully usable when storage is unavailable.
    }
  }, [chapters, storageKey]);

  useEffect(() => {
    const updateProgress = () => {
      const maximum =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        maximum > 0
          ? Math.min(100, Math.max(0, (window.scrollY / maximum) * 100))
          : 100,
      );
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.getAttribute("data-chapter-id");
        if (!id) return;
        setActiveChapter(id);
        try {
          window.localStorage.setItem(storageKey, id);
        } catch {
          /* optional enhancement */
        }
      },
      { rootMargin: "-15% 0px -75%", threshold: 0 },
    );
    chapters.forEach((chapter) => {
      const element = document.querySelector(
        `[data-chapter-id="${chapter.id}"]`,
      );
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [chapters, storageKey]);

  useEffect(() => {
    if (!galleryImage || !dialogRef.current) return;
    dialogRef.current.showModal();
  }, [galleryImage]);

  const closeGallery = () => {
    dialogRef.current?.close();
    setGalleryImage(null);
  };

  return (
    <main className={styles.reader}>
      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <Link className={styles.skipLink} href="#story">
        Skip to story
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>An illustrated Arcanea novella</p>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.byline}>By {author}</p>
          <a
            className={styles.readAction}
            href={resumeChapter ? `#${resumeChapter}` : "#story"}
          >
            {resumeChapter ? "Resume reading" : "Start reading"}
          </a>
        </div>
        <Image
          className={styles.cover}
          src={cover.src}
          alt={cover.alt}
          width={941}
          height={1672}
          sizes="(max-width: 768px) 100vw, 44rem"
          priority
        />
      </header>

      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="Chapters">
          <p>Contents</p>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={
                    activeChapter === chapter.id ? "location" : undefined
                  }
                >
                  <span>{String(chapter.number).padStart(2, "0")}</span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article id="story" className={styles.story} aria-label={title}>
          {chapters.map((chapter) => {
            const firstImageAfter = Math.max(
              1,
              Math.ceil(chapter.paragraphs.length / 3),
            );
            const secondImageAfter = Math.min(
              chapter.paragraphs.length,
              Math.max(
                firstImageAfter,
                Math.ceil(chapter.paragraphs.length * 0.72),
              ),
            );
            return (
              <section
                className={styles.chapter}
                id={chapter.id}
                key={chapter.id}
                tabIndex={-1}
              >
                <header
                  className={styles.chapterHeader}
                  data-chapter-id={chapter.id}
                >
                  <p>Chapter {chapter.number}</p>
                  <h2>{chapter.title}</h2>
                  {chapter.subtitle ? <p>{chapter.subtitle}</p> : null}
                </header>
                {chapter.paragraphs.map((paragraph, index) => (
                  <div key={`${chapter.id}-paragraph-${index}`}>
                    <p>{paragraph}</p>
                    {index + 1 === firstImageAfter && chapter.images[0] ? (
                      <ChapterImage
                        image={chapter.images[0]}
                        chapterTitle={chapter.title}
                        onOpen={setGalleryImage}
                      />
                    ) : null}
                    {index + 1 === secondImageAfter && chapter.images[1] ? (
                      <ChapterImage
                        image={chapter.images[1]}
                        chapterTitle={chapter.title}
                        onOpen={setGalleryImage}
                      />
                    ) : null}
                  </div>
                ))}
              </section>
            );
          })}
        </article>
      </div>

      <dialog
        aria-label="Full illustration"
        ref={dialogRef}
        className={styles.gallery}
        onClose={() => setGalleryImage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeGallery();
        }}
      >
        {galleryImage ? (
          <div className={styles.galleryPanel}>
            <button
              className={styles.closeButton}
              type="button"
              onClick={closeGallery}
              aria-label="Close full image"
            >
              Close
            </button>
            <Image
              src={galleryImage.src}
              alt={galleryImage.alt}
              width={941}
              height={1672}
              sizes="90vw"
            />
            <p>
              <strong>{galleryImage.chapterTitle}</strong>
              {galleryImage.caption ? ` — ${galleryImage.caption}` : ""}
            </p>
          </div>
        ) : null}
      </dialog>
    </main>
  );
}
