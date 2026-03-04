/**
 * GitHub Asset Uploader for Arcanea
 * Uploads images to Arcanea GitHub repo
 */

import { readFileSync } from "fs";
import { join, basename } from "path";
import { existsSync } from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "frankxai";
const REPO_NAME = "Arcanea";
const BRANCH = "main";

// Actual filenames from processed folder - use WSL paths
const HERO_IMAGES = [
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-074.webp",
    guardian: "draconia",
    name: "Draconia hero",
  },
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-001.webp",
    guardian: "alera",
    name: "Alera hero",
  },
  {
    file: "elara-lelara-and-her-unicorn-spirit-animal-arc-001.webp",
    guardian: "elara",
    name: "Elara hero",
  },
  {
    file: "lyssandria-lyssandria-vibrant-colorful-blonde-tree-goddess-001.webp",
    guardian: "lyssandria",
    name: "Lyssandria hero",
  },
  {
    file: "aiyami-devora-ultra-detailed-high-resolution-001.webp",
    guardian: "aiyami",
    name: "Aiyami hero",
  },
];

// Use WSL path
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
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      sha = checkData.sha;
    }
  } catch (e) {
    /* create new */
  }

  const body = {
    message: `Upload ${basename(filePath)} - Arcanea Guardian`,
    content: base64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  const data = await response.json();
  return data.content.download_url;
}

async function main() {
  console.log("═".repeat(40));
  console.log("  GITHUB UPLOADER");
  console.log("═".repeat(40));

  for (const img of HERO_IMAGES) {
    const filePath = join(PROCESSED_DIR, img.guardian, img.file);
    const githubPath = `${GITHUB_PATH}/${img.file}`;

    console.log(`\n📤 ${img.name}`);
    console.log(`   File: ${img.file}`);
    console.log(`   Path: ${filePath}`);
    console.log(`   Exists: ${existsSync(filePath)}`);

    if (!existsSync(filePath)) {
      // Try case-insensitive search
      const dirPath = join(PROCESSED_DIR, img.guardian);
      console.log(`   Looking in: ${dirPath}`);
      continue;
    }

    try {
      const url = await uploadToGitHub(filePath, githubPath);
      console.log(`   ✅ ${url}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  console.log("\n" + "═".repeat(40));
}

main().catch(console.error);
