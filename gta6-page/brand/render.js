// Renders the brand HTML files to PNG.
// Usage (from repo root): node gta6-page/brand/render.js
const path = require('path');
const { chromium } = require('playwright');

const jobs = [
  { html: 'avatar.html', out: 'avatar.png', width: 1080, height: 1080 },
  { html: 'unlock-times-card.html', out: '../media/edits/unlock-times-card.png', width: 1080, height: 1920 },
  // Instagram feed shows 4:5, so also export the centre 1080x1350 of the 9:16 card.
  { html: 'unlock-times-card.html', out: '../media/edits/unlock-times-card-4x5.png', width: 1080, height: 1920,
    clip: { x: 0, y: 235, width: 1080, height: 1350 } },
];

(async () => {
  const browser = await chromium.launch();
  for (const job of jobs) {
    const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
    await page.goto('file://' + path.join(__dirname, job.html));
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(__dirname, job.out);
    await page.screenshot({ path: out, clip: job.clip });
    console.log('wrote', path.relative(process.cwd(), out));
    await page.close();
  }
  await browser.close();
})();
