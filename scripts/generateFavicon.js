#!/usr/bin/env node
/**
 * Script to generate ICO favicon from SVG
 * Requires: npm install --save-dev sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [16, 32, 64, 128];
const inputSvg = path.join(__dirname, "../public/favicon.svg");
const outputDir = path.join(__dirname, "../public");

async function generateFavicons() {
  try {
    console.log("🎨 Generating favicons from SVG...");

    // Read SVG file
    const svgBuffer = fs.readFileSync(inputSvg);

    // Generate ICO from SVG for all sizes
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
      console.log(`✅ Generated favicon-${size}x${size}.png`);
    }

    // Generate the main favicon.ico (using 32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat("ico")
      .toFile(path.join(outputDir, "favicon.ico"));
    console.log("✅ Generated favicon.ico");

    // Generate apple-touch-icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFile(path.join(outputDir, "apple-touch-icon.png"));
    console.log("✅ Generated apple-touch-icon.png");

    console.log("\n✨ Favicon generation complete!");
  } catch (error) {
    console.error("❌ Error generating favicons:", error);
    process.exit(1);
  }
}

generateFavicons();
