// build-spa.cjs — Build a static SPA for GitHub Pages (no SSR server needed)
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.resolve(__dirname);
const distDir = path.join(root, 'dist');

async function main() {
  console.log('[spa-build] Building static SPA for GitHub Pages...');

  // Step 1: Run vite build with the SPA config
  console.log('[spa-build] Step 1: Vite client build...');
  const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  execSync(
    `node "${viteBin}" build --config vite.config.spa.ts`,
    { stdio: 'inherit', cwd: root, env: { ...process.env } }
  );

  // Step 2: Rename spa-index.html to index.html
  console.log('[spa-build] Step 2: Renaming spa-index.html to index.html...');
  const spaIndex = path.join(distDir, 'spa-index.html');
  const indexFile = path.join(distDir, 'index.html');
  if (fs.existsSync(spaIndex)) {
    fs.renameSync(spaIndex, indexFile);
  }

  // Step 3: Copy public assets (guides, images)
  console.log('[spa-build] Step 3: Copying public assets...');
  copyDirRecursive(
    path.join(root, 'public'),
    distDir,
    ['index.html', '404.html', 'spa-index.html']
  );

  // Step 4: Create 404.html for SPA routing on GitHub Pages
  console.log('[spa-build] Step 4: Creating 404.html...');
  const indexHtml = fs.readFileSync(indexFile, 'utf-8');
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);

  // Step 4: Create .nojekyll file
  console.log('[spa-build] Step 4: Creating .nojekyll...');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  // Summary
  const files = countFiles(distDir);
  console.log(`[spa-build] ✅ SPA build complete! ${files} files in "${distDir}"`);
  console.log('[spa-build] Deploy the "dist" folder to GitHub Pages.');
}

function copyDirRecursive(src, dest, skipFiles = []) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath);
    } else if (!skipFiles.includes(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

main().catch((err) => {
  console.error('[spa-build] ❌ Build failed:', err);
  process.exit(1);
});
