// A source bundle, not a claim that standalone HTML is already React code.
export function registryItem(template, html, brief) {
  const folder = `creator-starters/${template.id}`;
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `arcanea-${template.id}`,
    type: "registry:block",
    title: template.name,
    description: template.detail,
    categories: [template.category, "landing-page"],
    files: [
      {
        path: `${folder}/index.html`,
        type: "registry:file",
        target: `~/${folder}/index.html`,
        content: html,
      },
      {
        path: `${folder}/BRIEF.md`,
        type: "registry:file",
        target: `~/${folder}/BRIEF.md`,
        content: brief,
      },
    ],
    docs: "Standalone HTML reference and adaptation brief. Open index.html to preview. Adapt with the destination project's stack; this does not install a Next.js route, provider or backend. Review existing files before importing. Fictional content needs replacement before release.",
  };
}
