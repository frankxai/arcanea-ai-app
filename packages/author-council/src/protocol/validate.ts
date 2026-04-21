import type { RosterManifest, AuthorAgent } from "./types.js";

export class RosterValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
  ) {
    super(message);
    this.name = "RosterValidationError";
  }
}

export function validateRoster(
  manifest: RosterManifest,
  availableAuthors: Set<string>,
): void {
  if (!manifest.id || typeof manifest.id !== "string") {
    throw new RosterValidationError("manifest.id required", "id");
  }
  if (!manifest.authors || manifest.authors.length === 0) {
    throw new RosterValidationError("roster must have ≥1 author", "authors");
  }
  if (manifest.authors.length > 12) {
    throw new RosterValidationError(
      "roster >12 authors: synthesis quality collapses beyond this bound",
      "authors",
    );
  }
  for (const slug of manifest.authors) {
    if (!availableAuthors.has(slug)) {
      throw new RosterValidationError(
        `author "${slug}" not in registry`,
        "authors",
      );
    }
  }
  if (manifest.license === "Arcanea-Locked" && manifest.pluggable) {
    throw new RosterValidationError(
      "Arcanea-Locked rosters cannot be pluggable",
      "license",
    );
  }
}

export function validateAuthor(author: AuthorAgent): string[] {
  const issues: string[] = [];
  if (!author.soul || author.soul.length < 200) {
    issues.push("SOUL.md too thin (<200 chars)");
  }
  if (!author.craft || author.craft.length < 200) {
    issues.push("craft.md too thin");
  }
  if (!author.patterns || author.patterns.length < 150) {
    issues.push("PATTERNS.md too thin");
  }
  if (!author.sources || author.sources.length < 100) {
    issues.push("sources.md missing or too thin — every author must cite sources");
  }
  if (author.systems.length === 0 && author.role === "systems") {
    issues.push("systems-seat author must have ≥1 formalized system");
  }
  return issues;
}
