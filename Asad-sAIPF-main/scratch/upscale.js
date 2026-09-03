const fs = require('fs');
const path = require('path');

async function upscale() {
  try {
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.log('Installing sharp for HD image processing...');
      require('child_process').execSync('npm install sharp --no-save', { stdio: 'inherit' });
      sharp = require('sharp');
    }
    
    const imgPath = path.join(__dirname, '../public/portrait.png');
    const tempPath = path.join(__dirname, '../public/portrait_temp.png');
    
    if (!fs.existsSync(imgPath)) {
      console.log('Image not found at:', imgPath);
      return;
    }
    
    console.log('Reading portrait.png...');
    const metadata = await sharp(imgPath).metadata();
    console.log(`Original resolution: ${metadata.width}x${metadata.height}`);
    
    // Upscale by 3x using Lanczos3 high-definition resampling kernel
    const newWidth = Math.round(metadata.width * 3);
    const newHeight = Math.round(metadata.height * 3);
    console.log(`Upscaling to: ${newWidth}x${newHeight} using Lanczos3 and Unsharp Masking...`);
    
    await sharp(imgPath)
      .resize({
        width: newWidth,
        height: newHeight,
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false
      })
      .sharpen({
        sigma: 2.0,
        m1: 1.8,
        m2: 0.8,
        x1: 2,
        y2: 10,
        y3: 20
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.08
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(tempPath);
      
    // Overwrite original with HD version
    fs.renameSync(tempPath, imgPath);
    console.log('✨ SUCCESS! Your portrait image has been 3x upscaled and sharpened to ultra-HD studio quality!');
  } catch (err) {
    console.error('Error upscaling:', err.message);
  }
}

upscale();
