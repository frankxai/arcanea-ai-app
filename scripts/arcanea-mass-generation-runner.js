/**
 * Arcanea Mass Generation Runner
 * Executes large batches of image generation prompts for the 8-hour loop.
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || (() => { throw new Error('Set GEMINI_API_KEY env var'); })();
const MODEL = 'gemini-3-pro-image-preview';

const BATCH_FILE = process.argv[2];
if (!BATCH_FILE) {
  console.error("Usage: node arcanea-mass-generation-runner.js <batch-file.json>");
  process.exit(1);
}

const batchData = JSON.parse(fs.readFileSync(BATCH_FILE, 'utf8'));
const imagesToGenerate = batchData.images || [];

const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'arcanea-universe');
const LOG_CSV = path.join(__dirname, '..', 'data', 'arcanea-visual-log.csv');
const LOG_HTML = path.join(__dirname, '..', 'data', 'arcanea-visual-gallery.html');

// Initialize logs if they don't exist
if (!fs.existsSync(LOG_CSV)) {
  fs.writeFileSync(LOG_CSV, 'timestamp,filename,category,aspectRatio,sizeKB,prompt\n');
}
if (!fs.existsSync(LOG_HTML)) {
  const htmlStart = `<!DOCTYPE html>
<html>
<head>
<title>Arcanea Visual Universe Gallery</title>
<style>
  body { background: #0a0a0f; color: #fff; font-family: sans-serif; padding: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .card { background: #1a1a24; padding: 10px; border-radius: 8px; }
  .card img { max-width: 100%; border-radius: 4px; }
  .tag { background: #7fffd4; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
</style>
</head>
<body>
<h1>Arcanea Visual Universe Gallery</h1>
<div class="grid" id="gallery">
`;
  fs.writeFileSync(LOG_HTML, htmlStart);
}

function appendToHtml(imageRecord) {
  const relPath = `../assets/arcanea-universe/${imageRecord.filename}`;
  const htmlEntry = `
<div class="card">
  <img src="${relPath}" alt="${imageRecord.filename}" loading="lazy" />
  <h3>${imageRecord.name}</h3>
  <p><span class="tag">${imageRecord.category}</span> <span class="tag">${imageRecord.aspectRatio}</span></p>
  <p style="font-size: 12px; color: #aaa; max-height: 100px; overflow-y: auto;">${imageRecord.prompt.substring(0, 150)}...</p>
</div>
`;
  fs.appendFileSync(LOG_HTML, htmlEntry);
}

async function generateImage(config, index) {
  const { name, filename, category, aspectRatio, prompt } = config;

  console.log(`\n[${index + 1}/${imagesToGenerate.length}] Generating: ${name}`);
  console.log(`    Category: ${category} | Aspect: ${aspectRatio}`);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE'],
            temperature: 0.9
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(`    ❌ API Error: ${response.status}`);
      console.error(`    ${JSON.stringify(result.error?.message || result).substring(0, 200)}`);
      return null;
    }

    const candidates = result.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });

          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
          const ext = path.extname(filename) || '.png';
          const base = path.basename(filename, ext);
          const finalFilename = `${base}-${timestamp}${ext}`;
          
          const outputPath = path.join(OUTPUT_DIR, finalFilename);
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(outputPath, imageBuffer);

          const sizeKB = (imageBuffer.length / 1024).toFixed(1);
          console.log(`    ✅ SUCCESS! Saved: ${finalFilename} (${sizeKB} KB)`);

          // Log to CSV
          const csvLine = `"${new Date().toISOString()}","${finalFilename}","${category}","${aspectRatio}","${sizeKB}","${prompt.replace(/"/g, '""')}"\n`;
          fs.appendFileSync(LOG_CSV, csvLine);

          // Log to HTML
          appendToHtml({ name, filename: finalFilename, category, aspectRatio, prompt });

          return { name, filename: finalFilename, path: outputPath, size: imageBuffer.length };
        }
      }
    }

    console.error('    ❌ No image found in response');
    return null;

  } catch (error) {
    console.error(`    ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log(`Starting Batch Generation from ${BATCH_FILE}`);
  console.log(`Targeting ${imagesToGenerate.length} images.`);
  
  let successCount = 0;
  for (let i = 0; i < imagesToGenerate.length; i++) {
    const result = await generateImage(imagesToGenerate[i], i);
    if (result) successCount++;

    if (i < imagesToGenerate.length - 1) {
      console.log('    ⏳ Waiting 8s to respect rate limits...');
      await new Promise(r => setTimeout(r, 8000));
    }
  }

  console.log(`\nBatch Complete! ${successCount}/${imagesToGenerate.length} succeeded.`);
}

main().catch(console.error);
