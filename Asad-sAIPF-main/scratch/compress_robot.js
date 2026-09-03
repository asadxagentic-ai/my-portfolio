const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressRobot() {
  try {
    const inputPath = path.join(__dirname, '../public/robot.png');
    const webpPath = path.join(__dirname, '../public/robot.webp');
    const pngPath = path.join(__dirname, '../public/robot_opt.png');

    const meta = await sharp(inputPath).metadata();
    console.log(`Original robot.png: ${meta.width}x${meta.height}, size: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB`);

    // Target 450px width for 2x Retina clarity (displayed at 190px max)
    const targetWidth = 450;

    // Generate WebP (Ultra lightweight & fast decode)
    await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toFile(webpPath);

    console.log(`Created robot.webp: ${(fs.statSync(webpPath).size / 1024).toFixed(1)} KB`);

    // Generate compressed PNG fallback
    await sharp(inputPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(pngPath);

    // Replace original robot.png with optimized PNG
    fs.renameSync(pngPath, inputPath);
    console.log(`Optimized robot.png: ${(fs.statSync(inputPath).size / 1024).toFixed(1)} KB`);
    console.log('SUCCESS!');
  } catch (err) {
    console.error('Error compressing robot:', err);
  }
}

compressRobot();
