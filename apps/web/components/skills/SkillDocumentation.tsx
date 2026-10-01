import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import type { Skill } from "../../lib/skills/loader";

export function resolveSkillMarkdownUrl(
  skill: Skill,
  url: string,
  key: string = "href",
): string {
  const safe = defaultUrlTransform(url);
  if (!safe) return "";
  if (/^https?:\/\//i.test(safe)) return safe;
  if (/^mailto:/i.test(safe)) return key === "href" ? safe : "";
  // Headings are on the source document; the web renderer does not assign IDs.
  if (safe.startsWith("#"))
    return key === "href" ? `${skill.sourceUrl}${safe}` : "";

  const suffixAt = safe.search(/[?#]/);
  const path = suffixAt === -1 ? safe : safe.slice(0, suffixAt);
  const suffix = suffixAt === -1 ? "" : safe.slice(suffixAt);
  let decoded: string;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    return "";
  }
  if (/^[\/\\]|[\u0000-\u001f\u007f\\]/.test(decoded)) return "";
  const segments = decoded.split("/");
  if (segments.includes("..")) return "";
  const file =
    segments.filter((segment) => segment !== ".").join("/") || "SKILL.md";
  if (!skill.sourceFiles.includes(file)) return "";
  const base = skill.sourceUrl.slice(0, skill.sourceUrl.lastIndexOf("/") + 1);
  const pinned = `${base}${file.split("/").map(encodeURIComponent).join("/")}${suffix}`;
  return key === "src"
    ? pinned
        .replace("https://github.com/", "https://raw.githubusercontent.com/")
        .replace("/blob/", "/")
    : pinned;
}

export default function SkillDocumentation({ skill }: { skill: Skill }) {
  return (
    <ReactMarkdown
      urlTransform={(url, key) => resolveSkillMarkdownUrl(skill, url, key)}
      components={{
        a: ({ href, title, children }) =>
          href ? (
            <a href={href} title={title}>
              {children}
            </a>
          ) : (
            <span>{children}</span>
          ),
      }}
    >
      {skill.readmeContent}
    </ReactMarkdown>
  );
}
