import { extractVariables } from "./context-engine";
import type { TemplateVariable } from "./types";

// Content can refresh while a dialog/save is pending. Keep edits for surviving
// names, initialize new placeholders, and omit names no longer in the content.
export function templateVariablesForContent(
  content: string,
  edited: TemplateVariable[],
): TemplateVariable[] {
  const existing = new Map(edited.map((variable) => [variable.name, variable]));
  return extractVariables(content).map((name) => ({
    ...(existing.get(name) ?? {
      name,
      label: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: "text" as const,
      default: "",
      required: false,
    }),
  }));
}
