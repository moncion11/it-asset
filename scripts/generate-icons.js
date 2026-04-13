const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
const outDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svg = fs.readFileSync(svgPath);

// Icon with transparent corners (any purpose)
const sizes = [192, 512];

// Maskable icon: needs safe zone, so we add padding with the background color
async function generate() {
  for (const size of sizes) {
    // Regular icon
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`Created icon-${size}.png`);

    // Maskable icon (add 20% padding with background color for safe zone)
    const padding = Math.round(size * 0.1);
    const innerSize = size - padding * 2;
    const inner = await sharp(svg)
      .resize(innerSize, innerSize)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
      }
    })
      .composite([{ input: inner, left: padding, top: padding }])
      .png()
      .toFile(path.join(outDir, `icon-maskable-${size}.png`));
    console.log(`Created icon-maskable-${size}.png`);
  }

  // Apple touch icon (180x180)
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, `apple-touch-icon.png`));
  console.log('Created apple-touch-icon.png');
}

generate().catch(console.error);
