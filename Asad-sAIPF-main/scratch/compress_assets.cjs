const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressAll() {
  try {
    const publicDir = path.join(__dirname, '../public');
    const files = ['logo.png', 'portrait.png'];

    for (const file of files) {
      const inputPath = path.join(publicDir, file);
      if (!fs.existsSync(inputPath)) continue;

      const baseName = path.parse(file).name;
      const webpPath = path.join(publicDir, `${baseName}.webp`);
      const tempPngPath = path.join(publicDir, `${baseName}_opt.png`);

      const meta = await sharp(inputPath).metadata();
      const origSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
      console.log(`Processing ${file} (${meta.width}x${meta.height}, ${origSize} MB)...`);

      // High clarity max width 800px for portrait, 600px for logo
      const targetWidth = baseName === 'portrait' ? 800 : 600;

      // WebP
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 90, effort: 6 })
        .toFile(webpPath);
      console.log(` -> ${baseName}.webp: ${(fs.statSync(webpPath).size / 1024).toFixed(1)} KB`);

      // Compressed PNG
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 90 })
        .toFile(tempPngPath);

      fs.renameSync(tempPngPath, inputPath);
      console.log(` -> ${file} optimized: ${(fs.statSync(inputPath).size / 1024).toFixed(1)} KB`);
    }
    console.log('ALL ASSETS OPTIMIZED!');
  } catch (err) {
    console.error('Error compressing assets:', err);
  }
}

compressAll();
