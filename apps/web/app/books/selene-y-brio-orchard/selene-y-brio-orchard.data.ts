import { readdir, readFile } from "fs/promises";
import { join } from "path";
import grayMatter from "gray-matter";
import type { NovellaChapter } from "@/components/books/illustrated-novella-reader";
import { getBookRoot } from "@/lib/content/book-path";

const CHAPTER_DIR = join(getBookRoot(), "selene-y-brio-orchard", "chapters");

type ChapterFrontmatter = Partial<Omit<NovellaChapter, "paragraphs">>;

function isImageList(value: unknown): value is NovellaChapter["images"] {
  return (
    Array.isArray(value) &&
    value.length <= 2 &&
    value.every(
      (image) =>
        typeof image === "object" &&
        image !== null &&
        ["src", "alt", "caption"].every((key) => {
          const field = (image as Record<string, unknown>)[key];
          return typeof field === "string" && field.trim().length > 0;
        }),
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
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(chapter.id) ||
    typeof chapter.number !== "number" ||
    typeof chapter.title !== "string" ||
    chapter.title.trim().length === 0 ||
    typeof chapter.subtitle !== "string" ||
    chapter.subtitle.trim().length === 0 ||
    !isImageList(chapter.images) ||
    chapter.images.some(
      (image) =>
        !image.src.startsWith("/images/books/") || image.src.includes(".."),
    ) ||
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

export async function loadOrchardChapters(): Promise<NovellaChapter[]> {
  const files = (await readdir(CHAPTER_DIR))
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .sort();
  const chapters = await Promise.all(
    files.map(async (name) => {
      const path = join(CHAPTER_DIR, name);
      const chapter = parseChapter(path, await readFile(path, "utf8"));
      const fileNumber = Number(name.slice(0, 2));
      if (chapter.number !== fileNumber) {
        throw new Error(`Chapter number does not match filename: ${path}`);
      }
      return chapter;
    }),
  );

  const ids = new Set(chapters.map((chapter) => chapter.id));
  if (
    chapters.length !== 14 ||
    ids.size !== chapters.length ||
    chapters.some((chapter, index) => chapter.number !== index + 1)
  ) {
    throw new Error(
      "The Orchard of Unspoken Names requires 14 contiguous chapters with unique IDs",
    );
  }

  return chapters;
}
