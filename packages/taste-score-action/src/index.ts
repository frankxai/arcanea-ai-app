/**
 * Arcanea TASTE Score — GitHub Action Entry Point
 *
 * Runs the TASTE 5D quality gate on markdown files and reports results
 * as GitHub Action annotations and job summary.
 */

import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { scoreTASTE } from './taste-gate.js';

interface FileResult {
  file: string;
  total: number;
  tier: string;
  technical: number;
  aesthetic: number;
  canon: number;
  impact: number;
  uniqueness: number;
  feedback: string[];
  passesGate: boolean;
}

async function run(): Promise<void> {
  try {
    const path = core.getInput('path', { required: true });
    const minScore = parseInt(core.getInput('min-score') || '60', 10);
    const characters = (core.getInput('characters') || '').split(',').map(s => s.trim()).filter(Boolean);
    const factions = (core.getInput('factions') || '').split(',').map(s => s.trim()).filter(Boolean);
    const locations = (core.getInput('locations') || '').split(',').map(s => s.trim()).filter(Boolean);

    // Find markdown files
    const pattern = path.endsWith('.md') ? path : `${path}/**/*.md`;
    const globber = await glob.create(pattern);
    const files = await globber.glob();

    if (files.length === 0) {
      core.setFailed('No markdown files found');
      return;
    }

    core.info(`Found ${files.length} markdown file(s) to score`);

    let totalScore = 0;
    let scoredCount = 0;
    let allPassed = true;
    const results: FileResult[] = [];

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      if (content.length < 100) {
        core.info(`Skipping ${basename(file)} (too short: ${content.length} chars)`);
        continue;
      }

      const hasWorldContext = characters.length > 0 || factions.length > 0 || locations.length > 0;

      const result = await scoreTASTE({
        content,
        metadata: {
          title: basename(file, '.md'),
          author: 'unknown',
          language: 'en',
        },
        worldContext: hasWorldContext
          ? { characters, factions, locations }
          : undefined,
      });

      totalScore += result.total;
      scoredCount++;
      if (result.total < minScore) allPassed = false;

      results.push({
        file: basename(file),
        ...result,
      });

      // Annotate in PR
      if (result.total < minScore) {
        core.error(`TASTE ${result.total}/100 (${result.tier}) — below ${minScore} threshold`, {
          file,
          title: `TASTE: ${result.tier.toUpperCase()}`,
        });
      } else {
        core.notice(`TASTE ${result.total}/100 (${result.tier})`, {
          file,
          title: `TASTE: ${result.tier.toUpperCase()}`,
        });
      }
    }

    if (scoredCount === 0) {
      core.setFailed('No markdown files with sufficient content found (minimum 100 characters)');
      return;
    }

    const avgScore = Math.round(totalScore / scoredCount);
    const avgTier = avgScore >= 80 ? 'hero' : avgScore >= 60 ? 'gallery' : avgScore >= 40 ? 'thumbnail' : 'reject';

    // Set outputs
    core.setOutput('score', avgScore.toString());
    core.setOutput('tier', avgTier);
    core.setOutput('passes', allPassed.toString());
    core.setOutput('report', JSON.stringify(results));

    // Write job summary
    await core.summary
      .addHeading('TASTE 5D Quality Report')
      .addTable([
        [
          { data: 'File', header: true },
          { data: 'T', header: true },
          { data: 'A', header: true },
          { data: 'S', header: true },
          { data: 'T', header: true },
          { data: 'E', header: true },
          { data: 'Score', header: true },
          { data: 'Tier', header: true },
        ],
        ...results.map(r => [
          r.file,
          r.technical.toString(),
          r.aesthetic.toString(),
          r.canon.toString(),
          r.impact.toString(),
          r.uniqueness.toString(),
          `${r.total}/100`,
          r.tier.toUpperCase(),
        ]),
      ])
      .addRaw(`\n**Average: ${avgScore}/100** | **${allPassed ? 'PASSED' : 'FAILED'}** (min: ${minScore})`)
      .write();

    core.info(`TASTE complete: avg ${avgScore}/100 (${avgTier}) — ${allPassed ? 'PASSED' : 'FAILED'}`);

    if (!allPassed) {
      core.setFailed(`Content below TASTE ${minScore} threshold`);
    }
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();
