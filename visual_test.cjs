const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/community',
  '/aerocaptains',
  '/aerocaptains/hall-of-fame',
  '/coverage',
  '/blog',
  '/about'
];

(async () => {
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
    fs.writeFileSync(`C:\\Users\\AeroLytics\\.gemini\\antigravity\\brain\\f6dbc1bc-e4bb-484b-b993-74d3b3acdc38\\page_${cleanRouteName}.html`, content);

    // Take screenshot
    const screenshotPath = `C:\\Users\\AeroLytics\\.gemini\\antigravity\\brain\\f6dbc1bc-e4bb-484b-b993-74d3b3acdc38\\screenshot_${cleanRouteName}.png`;
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
