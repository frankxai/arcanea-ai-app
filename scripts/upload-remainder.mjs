/**
 * GitHub Asset Uploader for Arcanea
 * Uploads remaining 2 images
 */

import { readFileSync } from "fs";
import { join, basename } from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "frankxai";
const REPO_NAME = "Arcanea";
const BRANCH = "main";

// Fixed filenames
const REMAINING = [
  {
    file: "lyssandria-lyssandria-vibrant-colorful-blonde-ameri-001.webp",
    guardian: "lyssandria",
    name: "Lyssandria hero",
  },
  {
    file: "aiyami-devora-ultra-detailed-high-resolution-ep-001.webp",
    guardian: "aiyami",
    name: "Aiyami hero",
  },
];

const PROCESSED_DIR = "/mnt/c/Users/frank/arcanea-processed";
const GITHUB_PATH = "public/images/guardians";

async function uploadToGitHub(filePath, githubPath) {
  const content = readFileSync(filePath);
  const base64 = content.toString("base64");

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${githubPath}`;

  let sha = null;
  try {
    const checkRes = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });
    if (checkRes.ok) sha = (await checkRes.json()).sha;
  } catch (e) {}

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Upload ${basename(filePath)}`,
      content: base64,
      branch: BRANCH,
      sha,
    }),
  });

  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  return (await response.json()).content.download_url;
}

async function main() {
  console.log("════════════════════════════════════");
  console.log("  UPLOADING REMAINING 2");
  console.log("════════════════════════════════════");

  for (const img of REMAINING) {
    const filePath = join(PROCESSED_DIR, img.guardian, img.file);
    console.log(`\n📤 ${img.name}`);
    try {
      const url = await uploadToGitHub(filePath, `${GITHUB_PATH}/${img.file}`);
      console.log(`   ✅ ${url}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  console.log("\n✓ Done!");
}

main().catch(console.error);
