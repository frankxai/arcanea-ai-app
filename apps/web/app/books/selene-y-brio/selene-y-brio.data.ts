import { readdir, readFile } from "fs/promises";
import { join } from "path";
import grayMatter from "gray-matter";
import type { NovellaChapter } from "@/components/books/illustrated-novella-reader";
import { getBookRoot } from "@/lib/content/book-path";

const CHAPTER_DIR = join(getBookRoot(), "selene-y-brio", "chapters");

type ChapterFrontmatter = Partial<Omit<NovellaChapter, "paragraphs">>;

function isImageList(value: unknown): value is NovellaChapter["images"] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (image) =>
        typeof image === "object" &&
        image !== null &&
        ["src", "alt", "caption"].every(
          (key) => typeof (image as Record<string, unknown>)[key] === "string",
        ),
    )
  );
}

function parseChapter(path: string, source: string): NovellaChapter {
  const { data, content } = grayMatter(source);
  const chapter = data as ChapterFrontmatter;
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (
    typeof chapter.id !== "string" ||
    typeof chapter.number !== "number" ||
    typeof chapter.title !== "string" ||
    typeof chapter.subtitle !== "string" ||
    !isImageList(chapter.images) ||
    paragraphs.length === 0
  ) {
    throw new Error(`Invalid illustrated chapter source: ${path}`);
  }

  return {
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    paragraphs,
    images: chapter.images,
  };
}

export async function loadSeleneYBrioChapters(): Promise<NovellaChapter[]> {
  const files = (await readdir(CHAPTER_DIR))
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .sort();
  const chapters = await Promise.all(
    files.map(async (name) => {
      const path = join(CHAPTER_DIR, name);
      return parseChapter(path, await readFile(path, "utf8"));
    }),
  );

  if (
    chapters.length !== 12 ||
    chapters.some((chapter, index) => chapter.number !== index + 1)
  ) {
    throw new Error("Selene & Brío requires 12 contiguous chapters");
  }

  return chapters;
}
