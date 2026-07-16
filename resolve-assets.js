import fs from 'node:fs';
import path from 'node:path';

const guideImagesPath = path.join(process.cwd(), 'src/data/guideImages.ts');
const guidesDir = path.join(process.cwd(), 'src/assets/guides');
const referenceImage = path.join(guidesDir, 'sup-style.jpg');

if (!fs.existsSync(referenceImage)) {
  console.error("Reference image sup-style.jpg does not exist! Cannot proceed.");
  process.exit(1);
}

const content = fs.readFileSync(guideImagesPath, 'utf8');
const lines = content.split('\n');

let createdCount = 0;

for (const line of lines) {
  if (line.startsWith('import ') && line.includes('assets/guides/')) {
    // Extract the file name, e.g. real-quality-layer-macro.jpg
    const match = line.match(/assets\/guides\/([^"']+)/);
    if (match) {
      const fileName = match[1];
      const targetPath = path.join(guidesDir, fileName);
      if (!fs.existsSync(targetPath)) {
        // Copy reference image to target path
        fs.copyFileSync(referenceImage, targetPath);
        console.log(`Created placeholder for missing asset: ${fileName}`);
        createdCount++;
      }
    }
  }
}

console.log(`Successfully created ${createdCount} placeholder assets.`);
