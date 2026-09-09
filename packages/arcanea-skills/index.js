"use strict";

const path = require("node:path");
const { name, version } = require("./package.json");
const { availableSkills } = require("./lib/installer.js");
const skills = Object.freeze(availableSkills());
const definitions = {
  creative: {
    label: "Creative writing",
    skills: [
      "story-weave",
      "character-forge",
      "world-build",
      "scene-craft",
      "dialogue-mastery",
      "voice-alchemy",
      "bestiary-nav",
    ],
  },
  development: {
    label: "Software development",
    skills: [
      "code-review",
      "tdd",
      "systematic-debug",
      "api-design",
      "architecture-patterns",
      "refactoring-ritual",
      "performance-tuning",
    ],
  },
  arcanea: {
    label: "Arcanea framework",
    skills: [
      "centaur-mode",
      "prompt-craft",
      "luminor-wisdom",
      "arcanea-creator-academy",
      "creative-flow",
      "deep-work",
    ],
  },
};
const categories = Object.fromEntries(
  Object.entries(definitions).map(([key, category]) => [
    key,
    Object.freeze({
      label: category.label,
      skills: Object.freeze(
        category.skills.filter((skill) => skills.includes(skill)),
      ),
    }),
  ]),
);
const classified = new Set(
  Object.values(categories).flatMap((category) => category.skills),
);
const others = skills.filter((skill) => !classified.has(skill));
if (others.length)
  categories.other = Object.freeze({
    label: "Other bundled skills",
    skills: Object.freeze(others),
  });
Object.freeze(categories);

module.exports = Object.freeze({
  name,
  version,
  skillCount: skills.length,
  bundledCount: skills.length,
  categories,
  skills,
  skillsDir: path.join(__dirname, "skills"),
  getSkillPath(skillName) {
    if (!skills.includes(skillName))
      throw new Error(`Unknown bundled skill: ${skillName}`);
    return path.join(__dirname, "skills", skillName);
  },
  getByCategory(category) {
    if (!Object.hasOwn(categories, category))
      throw new Error(`Unknown category: ${category}`);
    return [...categories[category].skills];
  },
});
