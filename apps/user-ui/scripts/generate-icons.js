const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG content for the wine icon
const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#8b5cf6"/>
  <path d="M256 80c-44.2 0-80 35.8-80 80v64c0 44.2 35.8 80 80 80s80-35.8 80-80v-64c0-44.2-35.8-80-80-80z" fill="#ffffff"/>
  <path d="M176 224c0 44.2 35.8 80 80 80s80-35.8 80-80" stroke="#8b5cf6" stroke-width="16" stroke-linecap="round"/>
  <path d="M256 304v128" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
  <path d="M200 432h112" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
  <circle cx="256" cy="160" r="16" fill="#8b5cf6"/>
</svg>
`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    for (const size of sizes) {
      const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(iconPath);
      
      console.log(`Generated icon: ${iconPath}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 