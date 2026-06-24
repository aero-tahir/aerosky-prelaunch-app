const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/community',
  '/aerocaptains',
  '/aerocaptains/hall-of-fame',
  '/coverage',
  '/insights',
  '/about',
  '/support'
];

const artifactDir = 'C:\\Users\\AeroLytics\\.gemini\\antigravity\\brain\\9f76b109-dc69-4295-a3d1-229dd8b48585';

(async () => {
  // Ensure artifact directory exists
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const errors = {};

  for (const route of routes) {
    console.log(`\n===========================================`);
    console.log(`Testing route: ${route}`);
    console.log(`===========================================`);
    const page = await browser.newPage();
    
    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console error: ${msg.text()}`);
        console.error(`[${route}] PAGE ERROR: ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(`Page error: ${err.message}`);
      console.error(`[${route}] PAGE CRASH: ${err.message}`);
    });

    try {
      await page.goto(`http://localhost:3001${route}`, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch (e) {
      console.error(`[${route}] Navigation error: `, e);
    }

    // Wait for 3 seconds for client side rendering
    await new Promise(r => setTimeout(r, 3000));

    // Save HTML snippet
    const content = await page.content();
    const cleanRouteName = route.replace(/\//g, '_') || 'index';
    const htmlPath = path.join(artifactDir, `page_${cleanRouteName}.html`);
    fs.writeFileSync(htmlPath, content);

    // Take screenshot
    const screenshotPath = path.join(artifactDir, `screenshot_${cleanRouteName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`[${route}] Screenshot saved to: ${screenshotPath}`);

    errors[route] = consoleErrors;
    await page.close();
  }

  console.log("\n===========================================");
  console.log("Visual test completed!");
  console.log("Summary of errors by route:", JSON.stringify(errors, null, 2));
  console.log("===========================================");

  await browser.close();
})();
