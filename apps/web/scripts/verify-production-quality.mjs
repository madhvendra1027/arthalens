import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(webRoot, 'public');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testUrl(urlPath, options = {}) {
  const url = `${BASE_URL}${urlPath}`;
  try {
    const res = await fetch(url, { redirect: 'manual', ...options });
    const text = await res.text();
    return { status: res.status, text, headers: res.headers };
  } catch (err) {
    return { error: err.message };
  }
}

async function runAudit() {
  console.log('====================================================');
  console.log('   ArthaLens 21-Point Production Readiness Audit     ');
  console.log('====================================================');
  console.log(`Target: ${BASE_URL}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] ${testName}`);
    } else {
      failedTests++;
      console.error(`  [FAIL] ${testName} ${details ? `(${details})` : ''}`);
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: Brand Assets & Favicons (Item 2 & 6)
  // ----------------------------------------------------
  console.log('--- 1. Brand Assets, Icons & Social Media Previews ---');
  assert(fs.existsSync(path.join(publicDir, 'favicon.svg')), 'public/favicon.svg exists');
  assert(fs.existsSync(path.join(publicDir, 'icon.png')), 'public/icon.png (512x512) exists');
  assert(fs.existsSync(path.join(publicDir, 'apple-touch-icon.png')), 'public/apple-touch-icon.png (180x180) exists');
  assert(fs.existsSync(path.join(publicDir, 'og-image.png')), 'public/og-image.png (1200x630) exists');
  assert(fs.existsSync(path.join(publicDir, 'site.webmanifest')), 'public/site.webmanifest exists');

  if (fs.existsSync(path.join(publicDir, 'site.webmanifest'))) {
    try {
      const manifest = JSON.parse(fs.readFileSync(path.join(publicDir, 'site.webmanifest'), 'utf8'));
      assert(manifest.name && manifest.icons?.length >= 2, 'site.webmanifest is valid JSON with app icons');
    } catch (e) {
      assert(false, 'site.webmanifest is valid JSON', e.message);
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 2: Robots.txt and XML Sitemap (Items 13 & 14)
  // ----------------------------------------------------
  console.log('\n--- 2. Robots.txt and XML Sitemap Verification ---');
  const robotsRes = await testUrl('/robots.txt');
  assert(robotsRes.status === 200, '/robots.txt returns HTTP 200');
  assert(robotsRes.text?.includes('sitemap.xml'), '/robots.txt contains sitemap directive');
  assert(robotsRes.text?.includes('Disallow: /analytics'), '/robots.txt disallows /analytics');
  assert(robotsRes.text?.includes('Disallow: /login'), '/robots.txt disallows /login');
  assert(!robotsRes.text?.includes('Disallow: /gdp'), '/robots.txt permits public /gdp');

  const sitemapRes = await testUrl('/sitemap.xml');
  assert(sitemapRes.status === 200, '/sitemap.xml returns HTTP 200');
  assert(sitemapRes.text?.includes('<urlset') && sitemapRes.text?.includes('</urlset>'), '/sitemap.xml is valid XML format');
  assert(sitemapRes.text?.includes('https://arthalens-production.up.railway.app/terms'), '/sitemap.xml includes /terms');
  assert(sitemapRes.text?.includes('https://arthalens-production.up.railway.app/privacy'), '/sitemap.xml includes /privacy');
  assert(sitemapRes.text?.includes('https://arthalens-production.up.railway.app/contact'), '/sitemap.xml includes /contact');
  assert(sitemapRes.text?.includes('https://arthalens-production.up.railway.app/how-it-works'), '/sitemap.xml includes /how-it-works');
  assert(!sitemapRes.text?.includes('/login'), '/sitemap.xml correctly excludes /login');
  assert(!sitemapRes.text?.includes('/analytics'), '/sitemap.xml correctly excludes /analytics');

  // ----------------------------------------------------
  // TEST GROUP 3: Custom 404 Page (Item 1)
  // ----------------------------------------------------
  console.log('\n--- 3. Custom 404 Page Verification ---');
  const notFoundRes = await testUrl('/deliberately-nonexistent-series-coordinate');
  assert(notFoundRes.status === 404, 'Non-existent route returns HTTP 404');
  assert(
    notFoundRes.text?.includes('Series coordinate not found') || notFoundRes.text?.includes('404'),
    '404 page displays branded series coordinate message'
  );
  assert(
    notFoundRes.text?.includes('Return to Observatory Home') || notFoundRes.text?.includes('Launch Macro Accounts'),
    '404 page provides functioning navigation recovery links'
  );

  // ----------------------------------------------------
  // TEST GROUP 4: Security Headers (Item 9)
  // ----------------------------------------------------
  console.log('\n--- 4. HTTP Security Headers Verification ---');
  const secHome = await testUrl('/');
  const secHeaders = secHome.headers || new Map();
  const getHeader = (name) => {
    if (typeof secHeaders.get === 'function') {
      return secHeaders.get(name) || secHeaders.get(name.toLowerCase());
    }
    return secHeaders[name] || secHeaders[name.toLowerCase()];
  };

  const csp = getHeader('content-security-policy');
  assert(!!csp, 'Content-Security-Policy (CSP) is set', csp);
  assert(csp?.includes("default-src 'self'"), "CSP contains default-src 'self'");
  assert(csp?.includes("frame-ancestors 'none'"), "CSP enforces frame-ancestors 'none'");

  const xContentType = getHeader('x-content-type-options');
  assert(xContentType === 'nosniff', 'X-Content-Type-Options is nosniff');

  const xFrame = getHeader('x-frame-options');
  assert(xFrame === 'DENY', 'X-Frame-Options is DENY');

  const referrerPolicy = getHeader('referrer-policy');
  assert(referrerPolicy === 'strict-origin-when-cross-origin', 'Referrer-Policy is strict-origin-when-cross-origin');

  const permPolicy = getHeader('permissions-policy');
  assert(permPolicy?.includes('camera=()') && permPolicy?.includes('microphone=()'), 'Permissions-Policy disables camera & microphone');

  // ----------------------------------------------------
  // TEST GROUP 5: Contact Form & API (Item 10)
  // ----------------------------------------------------
  console.log('\n--- 5. Contact Form Page & API Validation ---');
  const contactPageRes = await testUrl('/contact');
  assert(contactPageRes.status === 200, '/contact page renders HTTP 200');
  assert(contactPageRes.text?.includes('Institutional &amp; Research Inquiries') || contactPageRes.text?.includes('Institutional & Research Inquiries'), '/contact renders heading');
  assert(contactPageRes.text?.includes('name="website"') || contactPageRes.text?.includes('id="website-hp"'), '/contact includes anti-bot honeypot field');
  assert(contactPageRes.text?.includes('ContactPage'), '/contact includes Schema.org ContactPage JSON-LD');

  // API Test 1: Empty payload rejection
  const apiEmptyRes = await testUrl('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert(apiEmptyRes.status === 400, 'POST /api/contact rejects empty body with HTTP 400');

  // API Test 2: Invalid email rejection
  const apiInvalidEmailRes = await testUrl('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Analyst',
      email: 'not-an-email',
      subject: 'Inquiry',
      message: 'Testing message',
    }),
  });
  assert(apiInvalidEmailRes.status === 400, 'POST /api/contact rejects malformed email with HTTP 400');

  // API Test 3: Honeypot rejection
  const apiHoneypotRes = await testUrl('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Spam Bot',
      email: 'bot@spam.com',
      subject: 'Buy cheap stocks',
      message: 'Spam contents',
      website: 'http://spambot-link.com',
    }),
  });
  assert(apiHoneypotRes.status === 400, 'POST /api/contact rejects bot with honeypot triggered');

  // API Test 4: Valid submission
  const apiValidRes = await testUrl('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Anand Verma',
      email: 'anand.verma@rbi.org.in',
      organization: 'Reserve Bank of India',
      inquiryType: 'research',
      subject: 'Sovereign Telemetry Access Verification',
      message: 'Automated verification test of ArthaLens contact telemetry pipeline.',
    }),
  });
  assert(apiValidRes.status === 200, 'POST /api/contact accepts valid submission with HTTP 200');

  // ----------------------------------------------------
  // TEST GROUP 6: Public Routes Metadata & OpenGraph (Items 11, 12, 15)
  // ----------------------------------------------------
  console.log('\n--- 6. Unique Titles, Descriptions, OG & Canonical URLs ---');
  const routesToTest = [
    { path: '/', expectedTitlePart: 'India GDP' },
    { path: '/gdp', expectedTitlePart: 'GDP' },
    { path: '/gdp/why', expectedTitlePart: 'GDP Drivers' },
    { path: '/deflator', expectedTitlePart: 'Deflator' },
    { path: '/methodology', expectedTitlePart: 'Methodology' },
    { path: '/how-it-works', expectedTitlePart: 'How ArthaLens Works' },
    { path: '/consistency', expectedTitlePart: 'Consistency' },
    { path: '/revisions', expectedTitlePart: 'Revision' },
    { path: '/ratings', expectedTitlePart: 'Sovereign' },
    { path: '/global', expectedTitlePart: 'Global' },
    { path: '/sources', expectedTitlePart: 'Data Sources' },
    { path: '/sources/mospi-nas', expectedTitlePart: 'MoSPI NAS' },
    { path: '/ai', expectedTitlePart: 'AI' },
    { path: '/about', expectedTitlePart: 'About' },
    { path: '/contact', expectedTitlePart: 'Contact' },
    { path: '/privacy', expectedTitlePart: 'Privacy Policy' },
    { path: '/terms', expectedTitlePart: 'Terms' },
  ];

  const observedTitles = new Set();
  const observedDescriptions = new Set();

  for (const route of routesToTest) {
    const res = await testUrl(route.path);
    assert(res.status === 200, `${route.path} returns HTTP 200`);

    const titleMatch = res.text?.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    const descMatch = res.text?.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
    const description = descMatch ? descMatch[1] : '';

    assert(
      title.length > 0 && title.includes(route.expectedTitlePart),
      `${route.path} has relevant title: "${title.slice(0, 50)}..."`
    );

    assert(
      !observedTitles.has(title),
      `${route.path} title is unique across pages`
    );
    observedTitles.add(title);

    assert(
      description.length > 20,
      `${route.path} has substantive description (${description.length} chars)`
    );

    assert(
      !observedDescriptions.has(description),
      `${route.path} description is unique across pages`
    );
    observedDescriptions.add(description);

    // OpenGraph image verification
    const ogImageMatch = res.text?.match(/<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/i);
    assert(
      ogImageMatch && ogImageMatch[1].includes('og-image.png'),
      `${route.path} contains og:image tag`
    );
  }

  // ----------------------------------------------------
  // TEST GROUP 7: Schema.org Structured Data & Breadcrumbs (Items 16 & 17)
  // ----------------------------------------------------
  console.log('\n--- 7. Schema.org Structured Data & Breadcrumb Navigation ---');
  const homeRes = secHome;
  assert(homeRes.text?.includes('WebSite'), 'Homepage includes Schema.org WebSite');
  assert(homeRes.text?.includes('Organization'), 'Homepage includes Schema.org Organization');
  assert(homeRes.text?.includes('Dataset'), 'Homepage includes Schema.org Dataset');
  assert(homeRes.text?.includes('FAQPage'), 'Homepage includes Schema.org FAQPage');

  const gdpWhyRes = await testUrl('/gdp/why');
  assert(gdpWhyRes.text?.includes('BreadcrumbList'), '/gdp/why includes Schema.org BreadcrumbList');
  assert(gdpWhyRes.text?.includes('aria-label="Breadcrumb"'), '/gdp/why renders semantic breadcrumb navigation');

  const sourcesRes = await testUrl('/sources/mospi-nas');
  assert(sourcesRes.text?.includes('BreadcrumbList'), '/sources/mospi-nas includes BreadcrumbList');

  // ----------------------------------------------------
  // TEST GROUP 8: Reduced Motion Support (Item 5)
  // ----------------------------------------------------
  console.log('\n--- 8. Accessibility: Reduced Motion Support ---');
  const cssPath = path.join(webRoot, 'src', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(
    cssContent.includes('@media (prefers-reduced-motion: reduce)'),
    'globals.css defines prefers-reduced-motion rules'
  );
  assert(
    cssContent.includes('animation-duration: 0.01ms') || cssContent.includes('transition-duration: 0.01ms'),
    'globals.css neutralizes non-essential animations when reduced motion is preferred'
  );

  // ----------------------------------------------------
  // TEST GROUP 9: WebP Images & Lazy Loading (Items 19 & 20)
  // ----------------------------------------------------
  console.log('\n--- 9. WebP Image Optimization & Lazy Loading ---');
  assert(fs.existsSync(path.join(publicDir, 'photos', 'macro', '1.webp')), '1.webp exists');
  assert(fs.existsSync(path.join(publicDir, 'photos', 'macro', '2.webp')), '2.webp exists');
  assert(fs.existsSync(path.join(publicDir, 'photos', 'macro', '3.webp')), '3.webp exists');

  const stat1 = fs.statSync(path.join(publicDir, 'photos', 'macro', '1.webp'));
  assert(stat1.size < 300000, `1.webp is highly optimized (<300KB down from 1.1MB, actual: ${(stat1.size/1024).toFixed(1)}KB)`);

  // ----------------------------------------------------
  // TEST GROUP 10: Cookie Consent & Event Tracking (Items 7 & 8)
  // ----------------------------------------------------
  console.log('\n--- 10. Cookie Consent & Telemetry Event Tracking ---');
  const consentFileExists = fs.existsSync(path.join(webRoot, 'src', 'components', 'analytics', 'CookieConsentBanner.tsx'));
  assert(consentFileExists, 'CookieConsentBanner.tsx component exists');

  const analyticsFileExists = fs.existsSync(path.join(webRoot, 'src', 'lib', 'analytics.ts'));
  assert(analyticsFileExists, 'analytics.ts tracking library exists');

  const analyticsContent = fs.readFileSync(path.join(webRoot, 'src', 'lib', 'analytics.ts'), 'utf8');
  assert(analyticsContent.includes('trackEvent'), 'analytics.ts exposes trackEvent function');

  const providerPath = path.join(webRoot, 'src', 'components', 'analytics', 'AnalyticsProvider.tsx');
  const providerContent = fs.readFileSync(providerPath, 'utf8');
  assert(providerContent.includes('analytics_storage'), 'AnalyticsProvider.tsx supports Google Consent Mode v2');

  // ----------------------------------------------------
  // TEST GROUP 11: Faster Font Loading (Item 21)
  // ----------------------------------------------------
  console.log('\n--- 11. Self-Hosted Font Loading Verification ---');
  const layoutContent = fs.readFileSync(path.join(webRoot, 'src', 'app', 'layout.tsx'), 'utf8');
  assert(layoutContent.includes('next/font/google'), 'layout.tsx uses next/font/google self-hosted zero-CLS fonts');
  assert(layoutContent.includes('display: "swap"'), 'fonts specify display: swap to eliminate FOIT');

  // ----------------------------------------------------
  // TEST GROUP 12: Internal Links & Footer (Item 18)
  // ----------------------------------------------------
  console.log('\n--- 12. Internal Links & Footer Architecture ---');
  assert(homeRes.text?.includes('role="contentinfo"'), 'Footer uses semantic contentinfo landmark');
  assert(homeRes.text?.includes('/privacy'), 'Footer links to /privacy');
  assert(homeRes.text?.includes('/terms'), 'Footer links to /terms');
  assert(homeRes.text?.includes('/contact'), 'Footer links to /contact');
  assert(homeRes.text?.includes('/how-it-works'), 'Footer links to /how-it-works');
  assert(homeRes.text?.includes('/sources'), 'Footer links to /sources');
  assert(homeRes.text?.includes(String(new Date().getFullYear())), 'Footer renders current dynamic year');
  assert(!homeRes.text?.includes('href="#"'), 'Footer contains no placeholder "#" links');

  // ----------------------------------------------------
  // TEST GROUP 13: Protected Route & Noindex Verification
  // ----------------------------------------------------
  console.log('\n--- 13. Protected Route and Indexing Guardrails ---');
  const loginRes = await testUrl('/login');
  assert(loginRes.text?.includes('content="noindex, nofollow"'), '/login has robots noindex, nofollow');

  const analyticsRes = await testUrl('/analytics');
  assert(
    analyticsRes.status === 307 || analyticsRes.status === 302 || analyticsRes.text?.includes('content="noindex, nofollow"'),
    '/analytics is protected by middleware redirect or noindex'
  );

  console.log('\n====================================================');
  console.log(`Audit Complete: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
