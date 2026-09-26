import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const bgPath = 'C:\\Users\\mhdsi\\.gemini\\antigravity-ide\\brain\\c18ca03a-219f-4ae9-b1a6-1ba43ad0294f\\palace_resort_gwalior_1790390807407.jpg';
const outputPath = 'c:\\invitestory\\week4\\shivani-weds-sarma\\public\\og-image.jpg';

async function generateOgImage() {
  const width = 1200;
  const height = 675;

  // Resize background image to exact 1200x675
  const resizedBg = await sharp(bgPath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  // Create SVG overlay with gold typography and ornate borders
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gold Gradient -->
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF8E7"/>
        <stop offset="30%" stop-color="#F5D77F"/>
        <stop offset="70%" stop-color="#E5C158"/>
        <stop offset="100%" stop-color="#B88E28"/>
      </linearGradient>

      <!-- Soft Gold Glow Filter -->
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.95"/>
        <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#E5C158" flood-opacity="0.4"/>
      </filter>

      <!-- Dark Shadow for Readability -->
      <filter id="darkGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.95"/>
      </filter>

      <!-- Vignette and Top Gradient for pristine text readability without dimming the palace -->
      <radialGradient id="titleGlowBackdrop" cx="50%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#05050A" stop-opacity="0.75"/>
        <stop offset="60%" stop-color="#05050A" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#05050A" stop-opacity="0"/>
      </radialGradient>
      
      <linearGradient id="softTopShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05050A" stop-opacity="0.65"/>
        <stop offset="45%" stop-color="#05050A" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#05050A" stop-opacity="0"/>
      </linearGradient>

      <!-- Bottom subtle bar shadow -->
      <linearGradient id="softBottomShadow" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#05050A" stop-opacity="0.7"/>
        <stop offset="25%" stop-color="#05050A" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Gentle targeted darkening only where text sits, keeping palace architecture & lights vivid -->
    <rect x="0" y="0" width="${width}" height="420" fill="url(#softTopShadow)" />
    <circle cx="600" cy="220" r="420" fill="url(#titleGlowBackdrop)" />
    <rect x="0" y="550" width="${width}" height="125" fill="url(#softBottomShadow)" />

    <!-- Ornate Double Gold Border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.85"/>
    <rect x="32" y="32" width="${width - 64}" height="${height - 64}" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="8,5" opacity="0.65"/>

    <!-- Corner Filigree Accents -->
    <!-- Top Left -->
    <path d="M 28 50 L 50 28 M 28 60 L 60 28 M 45 45 L 35 45 L 45 35 Z" fill="url(#goldGrad)" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.85"/>
    <!-- Top Right -->
    <path d="M ${width - 28} 50 L ${width - 50} 28 M ${width - 28} 60 L ${width - 60} 28 M ${width - 45} 45 L ${width - 35} 45 L ${width - 45} 35 Z" fill="url(#goldGrad)" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.85"/>
    <!-- Bottom Left -->
    <path d="M 28 ${height - 50} L 50 ${height - 28} M 28 ${height - 60} L 60 ${height - 28} M 45 ${height - 45} L 35 ${height - 45} L 45 ${height - 35} Z" fill="url(#goldGrad)" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.85"/>
    <!-- Bottom Right -->
    <path d="M ${width - 28} ${height - 50} L ${width - 50} ${height - 28} M ${width - 28} ${height - 60} L ${width - 60} ${height - 28} M ${width - 45} ${height - 45} L ${width - 35} ${height - 45} L ${width - 45} ${height - 35} Z" fill="url(#goldGrad)" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.85"/>

    <!-- Invocation -->
    <text x="600" y="90" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-weight="600" fill="url(#goldGrad)" letter-spacing="3" filter="url(#goldGlow)">
      || SHREE GANESHAY NAMAH ||
    </text>

    <!-- Subtitle -->
    <text x="600" y="128" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="15" font-weight="600" fill="#E5C158" letter-spacing="6" opacity="0.9" filter="url(#darkGlow)">
      ROYAL WEDDING INVITATION
    </text>

    <!-- Couple Names with Gold Foil Effect -->
    <text x="600" y="210" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="bold" font-style="italic" fill="url(#goldGrad)" filter="url(#goldGlow)" letter-spacing="2">
      Shivani &amp; Prajjual
    </text>

    <!-- Elegant Center Divider with Diamond -->
    <g transform="translate(600, 240)" filter="url(#goldGlow)">
      <line x1="-180" y1="0" x2="-25" y2="0" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.75"/>
      <polygon points="0,-7 7,0 0,7 -7,0" fill="url(#goldGrad)"/>
      <circle cx="-14" cy="0" r="2.5" fill="#FFF4D0"/>
      <circle cx="14" cy="0" r="2.5" fill="#FFF4D0"/>
      <line x1="25" y1="0" x2="180" y2="0" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.75"/>
    </g>

    <!-- Wedding Dates -->
    <text x="600" y="280" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="24" font-weight="bold" fill="#FFFFFF" letter-spacing="4" filter="url(#darkGlow)">
      19TH &amp; 20TH NOVEMBER 2026
    </text>

    <!-- Venue & Location -->
    <text x="600" y="318" text-anchor="middle" font-family="Georgia, serif" font-size="19" font-weight="500" fill="url(#goldGrad)" letter-spacing="2" filter="url(#darkGlow)">
      DEVALAYA RESORT, GWALIOR
    </text>

    <!-- Bottom Ceremony Ribbon -->
    <g transform="translate(600, 615)" filter="url(#darkGlow)">
      <rect x="-240" y="-18" width="480" height="34" rx="17" fill="rgba(10, 10, 15, 0.75)" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <text x="0" y="4" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="12" font-weight="600" fill="#FFF4D0" letter-spacing="2.5">
        ✦ TAP TO OPEN CINEMATIC INVITATION ✦
      </text>
    </g>
  </svg>
  `;

  await sharp(resizedBg)
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 95 })
    .toFile(outputPath);

  console.log('Successfully generated og-image.jpg at', outputPath);
}

generateOgImage().catch(console.error);
