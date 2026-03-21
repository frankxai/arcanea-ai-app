/**
 * GitHub Gallery Image Uploader for Arcanea
 * Uploads gallery images to Arcanea GitHub repo
 */

import { readFileSync } from "fs";
import { basename } from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "frankxai";
const REPO_NAME = "Arcanea";
const BRANCH = "main";

const GALLERY_IMAGES = [
  // Alera gallery (3 uploaded, adding 2 more)
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-002.webp",
    guardian: "alera",
  },
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-003.webp",
    guardian: "alera",
  },
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-004.webp",
    guardian: "alera",
  },
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-005.webp",
    guardian: "alera",
  },
  {
    file: "alera-alera-and-her-musical-spirit-animal-arca-006.webp",
    guardian: "alera",
  },

  // Elara gallery
  {
    file: "elara-lelara-and-her-unicorn-spirit-animal-arc-002.webp",
    guardian: "elara",
  },
  {
    file: "elara-lelara-and-her-unicorn-spirit-animal-arc-003.webp",
    guardian: "elara",
  },
  {
    file: "elara-elara-the-consciousness-architect-mergin-038.webp",
    guardian: "elara",
  },
  {
    file: "elara-elara-in-battle-armor-warrior-scholar-de-036.webp",
    guardian: "elara",
  },
  {
    file: "elara-elara-the-consciousness-architect-mergin-039.webp",
    guardian: "elara",
  },

  // Draconia gallery
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-075.webp",
    guardian: "draconia",
  },
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-077.webp",
    guardian: "draconia",
  },
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-078.webp",
    guardian: "draconia",
  },
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-079.webp",
    guardian: "draconia",
  },
  {
    file: "draconia-ahra-beautiful-korean-dragon-rider-lovin-074.webp",
    guardian: "draconia",
  },

  // Lyssandria gallery
  {
    file: "lyssandria-lyssandria-vibrant-colorful-blonde-ameri-001.webp",
    guardian: "lyssandria",
  },
  {
    file: "lyssandria-lyssandria-arcanean-guardian-of-the-star-002.webp",
    guardian: "lyssandria",
  },

  // Aiyami gallery
  {
    file: "aiyami-devora-ultra-detailed-high-resolution-ep-001.webp",
    guardian: "aiyami",
  },
  {
    file: "aiyami-devora-ultra-detailed-high-resolution-ep-002.webp",
    guardian: "aiyami",
  },
  {
    file: "aiyami-the-great-choice-corporate-identity-diss-003.webp",
    guardian: "aiyami",
  },

  // Ino gallery
  {
    file: "ino-20250606-0147-arcanea-luminor-beauty-sim-001.webp",
    guardian: "ino",
  },
  {
    file: "ino-20250606-0147-arcanea-luminor-beauty-sim-003.webp",
    guardian: "ino",
  },
  {
    file: "ino-become-a-luminor-quantum-consciousness-i-009.webp",
    guardian: "ino",
  },
];

const PROCESSED_DIR = "/mnt/c/Users/frank/arcanea-processed";
const GITHUB_PATH = "public/images/guardians";

async function uploadToGitHub(filePath, githubFileName) {
  const content = readFileSync(filePath);
  const base64 = content.toString("base64");

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${GITHUB_PATH}/${githubFileName}`;

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
    message: `Upload gallery ${githubFileName} - Arcanea Guardian`,
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

  if (response.ok) {
    const data = await response.json();
    console.log(`✓ Uploaded: ${githubFileName}`);
    return data.content.download_url;
  } else {
    const error = await response.text();
    console.error(`✗ Failed: ${githubFileName}`, error);
    return null;
  }
}

async function main() {
  console.log("Starting gallery image upload...\n");

  const uploaded = [];

  for (const img of GALLERY_IMAGES) {
    const filePath = `${PROCESSED_DIR}/${img.guardian}/${img.file}`;
    console.log(`Uploading: ${img.file}`);
    const url = await uploadToGitHub(filePath, img.file);
    if (url) {
      uploaded.push({ guardian: img.guardian, file: img.file, url });
    }
  }

  console.log("\n=== Uploaded Gallery Images ===");
  for (const u of uploaded) {
    console.log(`${u.guardian}: ${u.url}`);
  }
}

main().catch(console.error);
