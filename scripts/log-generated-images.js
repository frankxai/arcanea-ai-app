const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\frank\\.gemini\\antigravity\\brain\\988e9668-0e4b-4836-be16-db0d5b56d779';
const assetsDir = 'c:\\Users\\frank\\starlight\\repos\\arcanea-ai-app\\assets\\arcanea-universe';
const logCsv = 'c:\\Users\\frank\\starlight\\repos\\arcanea-ai-app\\data\\arcanea-visual-log.csv';
const logHtml = 'c:\\Users\\frank\\starlight\\repos\\arcanea-ai-app\\data\\arcanea-visual-gallery.html';

// Initialize logs if they don't exist
if (!fs.existsSync(logCsv)) {
  fs.writeFileSync(logCsv, 'timestamp,filename,category,aspectRatio,sizeKB,prompt\n');
}
if (!fs.existsSync(logHtml)) {
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
  fs.writeFileSync(logHtml, htmlStart);
}

function appendToHtml(filename) {
  const relPath = `../assets/arcanea-universe/${filename}`;
  const htmlEntry = `
<div class="card">
  <img src="${relPath}" alt="${filename}" loading="lazy" />
  <h3>${filename}</h3>
  <p><span class="tag">Generated</span></p>
</div>
`;
  fs.appendFileSync(logHtml, htmlEntry);
}

const files = fs.readdirSync(brainDir);
files.forEach(file => {
  if (file.endsWith('.png')) {
    const srcPath = path.join(brainDir, file);
    const destPath = path.join(assetsDir, file);
    
    // Copy file
    fs.copyFileSync(srcPath, destPath);
    
    // Delete original from brain to keep it clean (optional, let's keep it just in case, or delete it? Let's delete it so it doesn't get processed again)
    fs.unlinkSync(srcPath);

    const stats = fs.statSync(destPath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    // Log to CSV
    const csvLine = `"${new Date().toISOString()}","${file}","Character/Env","Auto","${sizeKB}","See generated artifact"\n`;
    fs.appendFileSync(logCsv, csvLine);

    // Log to HTML
    appendToHtml(file);
    
    console.log(`Processed ${file}`);
  }
});
console.log('Done organizing images.');
