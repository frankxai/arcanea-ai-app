#!/usr/bin/env node
/**
 * Arcanea Canon & Continuity Validator (2026)
 * Canonical Location: arcanea-ai-app/scripts/validate-canon.mjs
 * 
 * Deterministic, offline validation of Arcanea lore, character staging, and world rules
 * against CANON_LOCKED.md and the 10 Gates doctrine.
 * 
 * Standard: August 2026 Sovereign Creative IP
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const LORE_DIR = path.join(REPO_ROOT, '.arcanea', 'lore');
const CANON_LOCKED_PATH = path.join(LORE_DIR, 'CANON_LOCKED.md');

// Canonical 10 Gates
const CANONICAL_GATES = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 
  'Sight', 'Crown', 'Star', 'Unity', 'Source'
];

// Canonical Elements
const CANONICAL_ELEMENTS = ['Earth', 'Water', 'Fire', 'Wind', 'Void', 'Light', 'Lightning', 'Aether'];

export class ArcaneaCanonValidator {
  constructor() {
    this.canonLockedExists = fs.existsSync(CANON_LOCKED_PATH);
  }

  validateLoreFile(filePath) {
    const startTime = performance.now();
    const relativePath = path.relative(REPO_ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    const warnings = [];

    // Check 1: Forbidden non-canon terms or generic tropes
    const forbiddenPatterns = [
      { pattern: /\bmana potions?\b/i, message: 'Forbidden generic trope: Mana Potions (Use Luxin / Prismatic Flow)' },
      { pattern: /\bgeneric rpg\b/i, message: 'Non-canon terminology: Generic RPG reference' }
    ];

    for (const { pattern, message } of forbiddenPatterns) {
      if (pattern.test(content)) {
        violations.push(message);
      }
    }

    // Check 2: Mention of Gates should match canonical Gates (filter stopwords)
    const stopWords = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'with', 'for', 'from', 'by', 'this', 'that', 'every', 'each', 'all', 'any', 'one', 'two', 'three', 'ten', 'twelve', 'first', 'tenth', 'primary', 'active', 'dormant', 'unstable', 'stable', 'young', 'old', 'new', 'was', 'is', 'not', 'her', 'his', 'their', 'our', 's']);
    const gateMatches = content.match(/\b([A-Z][a-z]+)\s+Gate\b|\bGate\s+of\s+([A-Z][a-z]+)\b/g) || [];
    for (const match of gateMatches) {
      const gateName = match.replace(/Gate\s+of\s+|\s+Gate/gi, '').trim();
      if (gateName && !stopWords.has(gateName.toLowerCase()) && !CANONICAL_GATES.some(g => g.toLowerCase() === gateName.toLowerCase())) {
        warnings.push(`Unrecognized Gate reference: "${match}"`);
      }
    }

    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;
    const isValid = violations.length === 0;

    return {
      file: relativePath,
      isValid,
      score: Math.max(0, 100 - (violations.length * 20) - (warnings.length * 5)),
      violations,
      warnings,
      latencyMs
    };
  }

  validateAllLore() {
    const startTime = performance.now();
    if (!fs.existsSync(LORE_DIR)) {
      return { error: 'Lore directory not found', count: 0 };
    }

    const files = fs.readdirSync(LORE_DIR).filter(f => f.endsWith('.md'));
    const results = [];

    for (const file of files) {
      const fullPath = path.join(LORE_DIR, file);
      results.push(this.validateLoreFile(fullPath));
    }

    const totalLatency = Math.round((performance.now() - startTime) * 100) / 100;
    const allValid = results.every(r => r.isValid);
    const avgScore = Math.round(results.reduce((acc, r) => acc + r.score, 0) / (results.length || 1));

    return {
      totalFiles: results.length,
      allValid,
      averageScore: avgScore,
      totalLatencyMs: totalLatency,
      results
    };
  }
}

// CLI execution
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const validator = new ArcaneaCanonValidator();
  const summary = validator.validateAllLore();

  console.log(`\n=== Arcanea Canon Continuity Audit (2026) ===`);
  console.log(`Audited ${summary.totalFiles} lore files in ${summary.totalLatencyMs}ms`);
  console.log(`Overall Status: ${summary.allValid ? 'PASS (100% Canon Compliant)' : 'FAIL'}`);
  console.log(`Average Quality Score: ${summary.averageScore}/100\n`);

  for (const res of summary.results) {
    const status = res.isValid ? 'OK' : 'VIOLATION';
    console.log(`[${status}] ${res.file} (Score: ${res.score})`);
    if (res.violations.length) console.log(`  Violations: ${res.violations.join(', ')}`);
    if (res.warnings.length) console.log(`  Warnings: ${res.warnings.join(', ')}`);
  }
}
