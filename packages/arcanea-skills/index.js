"use strict";

const path = require("node:path");
const {
  loadCatalog,
  selectReady,
  validateSources,
} = require("./scripts/catalog.cjs");
const catalog = loadCatalog(__dirname);
validateSources(__dirname, catalog);
const ready = selectReady(catalog);
const skills = ready.map((skill) => skill.name);
const categories = Object.fromEntries(
  [...new Set(catalog.skills.map((skill) => skill.category))].map(
    (category) => [
      category,
      {
        label: category,
        skills: ready
          .filter((skill) => skill.category === category)
          .map((skill) => skill.name),
      },
    ],
  ),
);

module.exports = {
  name: "@arcanea/skills",
  version: require("./package.json").version,
  skillCount: skills.length,
  bundledCount: skills.length,
  categories,
  skills,
  candidates: catalog.skills.filter((skill) => skill.status === "candidate"),
  skillsDir: path.join(__dirname, "skills"),
  getSkillPath(name) {
    if (!skills.includes(name))
      throw new Error(`Skill "${name}" is not catalog-ready`);
    return path.join(__dirname, "skills", name);
  },
  getByCategory(category) {
    if (!Object.prototype.hasOwnProperty.call(categories, category))
      throw new Error(`Unknown category "${category}"`);
    return [...categories[category].skills];
  },
};
