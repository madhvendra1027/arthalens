import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// 1. Generate icon.png (512x512)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#141416" />
  <rect x="16" y="16" width="480" height="480" rx="96" stroke="#26262B" stroke-width="4" />
  
  <!-- Optics Crosshairs -->
  <line x1="220" y1="90" x2="220" y2="350" stroke="#60a5fa" stroke-width="6" stroke-dasharray="16 16" opacity="0.4" />
  <line x1="90" y1="220" x2="350" y2="220" stroke="#60a5fa" stroke-width="6" stroke-dasharray="16 16" opacity="0.4" />

  <!-- Lens Body -->
  <circle cx="220" cy="220" r="130" fill="url(#lensGlassGrad)" stroke="url(#lensRimGrad)" stroke-width="24" />

  <!-- Glare Arc -->
  <path d="M130 170 A 110 110 0 0 1 265 110" stroke="#bae6fd" stroke-width="12" stroke-linecap="round" opacity="0.85" />

  <!-- Rupee Symbol -->
  <g stroke="url(#rupeeGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
    <path d="M160 160 h115" />
    <path d="M160 205 h90" />
    <path d="M160 160 v100 c24 0 52 -3 64 -22 14 -17 12 -52 -2 -67" />
    <path d="M196 260 l64 74" />
  </g>

  <!-- Handle Bracket -->
  <path d="M315 315 L345 345" stroke="#93c5fd" stroke-width="32" stroke-linecap="round" />
  <!-- Handle -->
  <path d="M345 345 L435 435" stroke="url(#handleGrad)" stroke-width="42" stroke-linecap="round" />
  <circle cx="435" cy="435" r="16" fill="#f59e0b" />

  <defs>
    <radialGradient id="lensGlassGrad" cx="38%" cy="38%" r="62%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#1e3a8a" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.85" />
    </radialGradient>
    <linearGradient id="lensRimGrad" x1="90" y1="90" x2="350" y2="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#93c5fd" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="rupeeGrad" x1="160" y1="150" x2="280" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="handleGrad" x1="340" y1="340" x2="435" y2="435" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="40%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
</svg>
`;

// 2. Generate og-image.png (1200x630)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark Editorial Canvas Background -->
  <rect width="1200" height="630" fill="#0B0F19" />

  <!-- Technical Grid -->
  <g opacity="0.12" stroke="#60a5fa" stroke-width="1">
    <line x1="0" y1="90" x2="1200" y2="90" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="330" x2="1200" y2="330" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="570" x2="1200" y2="570" />
    <line x1="150" y1="0" x2="150" y2="630" />
    <line x1="350" y1="0" x2="350" y2="630" />
    <line x1="550" y1="0" x2="550" y2="630" />
    <line x1="750" y1="0" x2="750" y2="630" />
    <line x1="950" y1="0" x2="950" y2="630" />
  </g>

  <!-- Ambient Glow -->
  <circle cx="200" cy="180" r="320" fill="#3b82f6" opacity="0.1" filter="blur(80px)" />
  <circle cx="980" cy="300" r="300" fill="#d97706" opacity="0.08" filter="blur(80px)" />

  <!-- Top Status Bar -->
  <rect x="80" y="50" width="380" height="34" rx="17" fill="#141E33" stroke="#253554" stroke-width="1.5" />
  <circle cx="102" cy="67" r="5" fill="#10B981" />
  <text x="118" y="72" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">
    SOVEREIGN OBSERVATORY • OFFICIAL MOSPI &amp; RBI
  </text>

  <!-- ArthaLens Wordmark -->
  <text x="80" y="160" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5">
    Artha<tspan fill="#38BDF8">Lens</tspan>
  </text>
  <text x="80" y="210" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500">
    National Macroeconomic Accounts &amp; Sovereign Intelligence
  </text>

  <text x="80" y="270" fill="#CBD5E1" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" max-width="650">
    Transparent, provenance-first synthesis of India's National Accounts Statistics.
  </text>
  <text x="80" y="300" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400">
    UN SNA 2008 Double Deflation • 28 States &amp; 3 UTs GVA • SHA-256 Gazette Ledger
  </text>

  <!-- Metric Telemetry Cards Grid -->
  <!-- Card 1: Real GDP -->
  <rect x="80" y="340" width="230" height="135" rx="16" fill="#131B2E" stroke="#1E293B" stroke-width="1.5" />
  <text x="105" y="375" fill="#94A3B8" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.5">REAL GDP GROWTH (YoY)</text>
  <text x="105" y="425" fill="#10B981" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="800">+8.2%</text>
  <text x="105" y="455" fill="#64748B" font-family="monospace" font-size="11">FY 2023-24 • MOSPI NAS</text>

  <!-- Card 2: Nominal GDP -->
  <rect x="330" y="340" width="230" height="135" rx="16" fill="#131B2E" stroke="#1E293B" stroke-width="1.5" />
  <text x="355" y="375" fill="#94A3B8" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.5">NOMINAL GDP SIZE</text>
  <text x="355" y="425" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="800">₹295.4L Cr</text>
  <text x="355" y="455" fill="#64748B" font-family="monospace" font-size="11">+9.6% NOMINAL EXPANSION</text>

  <!-- Card 3: GVA -->
  <rect x="580" y="340" width="230" height="135" rx="16" fill="#131B2E" stroke="#1E293B" stroke-width="1.5" />
  <text x="605" y="375" fill="#94A3B8" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.5">REAL GVA GROWTH</text>
  <text x="605" y="425" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="800">+7.2%</text>
  <text x="605" y="455" fill="#64748B" font-family="monospace" font-size="11">8 SECTORS BASIC PRICES</text>

  <!-- Card 4: Ratings -->
  <rect x="830" y="340" width="290" height="135" rx="16" fill="#131B2E" stroke="#1E293B" stroke-width="1.5" />
  <text x="855" y="375" fill="#94A3B8" font-family="monospace" font-size="12" font-weight="600" letter-spacing="0.5">SOVEREIGN RATING MATRIX</text>
  <text x="855" y="425" fill="#F59E0B" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="800">BBB- / Baa3</text>
  <text x="855" y="455" fill="#64748B" font-family="monospace" font-size="11">FITCH • MOODY'S • S&amp;P (STABLE)</text>

  <!-- Bottom Provenance Footer Bar -->
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#1E293B" stroke-width="1.5" />
  <text x="80" y="560" fill="#64748B" font-family="monospace" font-size="13">
    SOURCE PROTOCOL: MOSPI PROVISIONAL ESTIMATES • RBI DBIE • UN SNA 2008 §15
  </text>
  <text x="1120" y="560" text-anchor="end" fill="#38BDF8" font-family="monospace" font-size="13">
    https://arthalens-production.up.railway.app
  </text>
</svg>
`;

async function main() {
  console.log('Generating brand icons and Open Graph assets...');

  // 1. icon.png
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('✓ Created public/icon.png (512x512)');

  // 2. apple-touch-icon.png
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  // 3. og-image.png
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ Created public/og-image.png (1200x630)');
}

main().catch(console.error);
