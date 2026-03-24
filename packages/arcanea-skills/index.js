'use strict';

const path = require('path');

const SKILL_CATEGORIES = {
  creative: {
    label: 'Creative Writing',
    skills: [
      'story-weave',
      'character-forge',
      'world-build',
      'scene-craft',
      'dialogue-mastery',
      'voice-alchemy',
      'bestiary-nav',
    ],
  },
  development: {
    label: 'Software Development',
    skills: [
      'code-review',
      'tdd',
      'systematic-debug',
      'api-design',
      'architecture-patterns',
      'refactoring-ritual',
      'performance-tuning',
    ],
  },
  arcanea: {
    label: 'Arcanea Framework',
    skills: [
      'centaur-mode',
      'prompt-craft',
      'luminor-wisdom',
      'arcanea-creator-academy',
      'creative-flow',
      'deep-work',
    ],
  },
};

const TOP_20_SKILLS = [
  'story-weave',
  'character-forge',
  'world-build',
  'code-review',
  'tdd',
  'systematic-debug',
  'centaur-mode',
  'prompt-craft',
  'bestiary-nav',
  'scene-craft',
  'dialogue-mastery',
  'voice-alchemy',
  'luminor-wisdom',
  'api-design',
  'architecture-patterns',
  'refactoring-ritual',
  'performance-tuning',
  'deep-work',
  'creative-flow',
  'arcanea-creator-academy',
];

module.exports = {
  name: '@arcanea/skills',
  version: '1.0.0',
  skillCount: 97,
  bundledCount: TOP_20_SKILLS.length,
  categories: SKILL_CATEGORIES,
  skills: TOP_20_SKILLS,
  skillsDir: path.join(__dirname, 'skills'),

  /**
   * Returns the absolute path to a specific skill directory.
   * @param {string} skillName - Name of the skill
   * @returns {string} Absolute path to the skill directory
   */
  getSkillPath(skillName) {
    if (!TOP_20_SKILLS.includes(skillName)) {
      throw new Error(
        `Skill "${skillName}" is not in the bundled top-20 set. ` +
        `Available: ${TOP_20_SKILLS.join(', ')}`
      );
    }
    return path.join(__dirname, 'skills', skillName);
  },

  /**
   * Returns skills filtered by category.
   * @param {string} category - Category key (creative, development, arcanea)
   * @returns {string[]} Array of skill names
   */
  getByCategory(category) {
    const cat = SKILL_CATEGORIES[category];
    if (!cat) {
      throw new Error(
        `Unknown category "${category}". ` +
        `Available: ${Object.keys(SKILL_CATEGORIES).join(', ')}`
      );
    }
    return cat.skills;
  },
};
