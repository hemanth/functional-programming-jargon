import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 5198;
server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  let exitCode = 0;
  let browser;

  try {
    const launchOptions = { headless: true };
    if (fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')) {
      launchOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    browser = await chromium.launch(launchOptions);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    console.log('Running test 1: Direct hash navigation (#thunk)...');
    await page.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const isPanelOpen = await page.locator('aside').isVisible();
    if (!isPanelOpen) throw new Error('Aside panel did not open on /#thunk');
    const title = await page.locator('aside h2').textContent();
    if (!title.toLowerCase().includes('thunk')) throw new Error(`Expected title Thunk, got: ${title}`);
    console.log('✓ Test 1 passed: /#thunk opened Thunk concept successfully.');

    console.log('Running test 2: Search and select concept...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.keyboard.press('/');
    await page.waitForTimeout(300);

    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('thunk');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    const panelAfterSearch = await page.locator('aside').isVisible();
    if (!panelAfterSearch) throw new Error('Aside panel did not open after search selection');
    const titleAfterSearch = await page.locator('aside h2').textContent();
    if (!titleAfterSearch.toLowerCase().includes('thunk')) throw new Error(`Expected title Thunk, got: ${titleAfterSearch}`);
    console.log('✓ Test 2 passed: Searching and selecting Thunk unfilters canvas and opens concept panel.');

    console.log('Running test 3: Root URL load without hash...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const isRootPanelOpen = await page.locator('aside').isVisible().catch(() => false);
    if (isRootPanelOpen) throw new Error('Aside panel should be closed on root / visit');
    console.log('✓ Test 3 passed: Root URL loads cleanly with sidebar closed.');

    console.log('Running test 4: Batch 3 direct hash navigation (#free-monad, #profunctor, #algebraic-effects)...');
    for (const term of ['free-monad', 'profunctor', 'algebraic-effects', 'semigroupoid', 'monad-transformer', 'traversal']) {
      await page.goto(`http://localhost:${PORT}/#${term}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const isTermOpen = await page.locator('aside').isVisible();
      if (!isTermOpen) throw new Error(`Aside panel failed to open for #${term}`);
      const termTitle = await page.locator('aside h2').textContent();
      console.log(`  ✓ #${term} loaded successfully: "${termTitle.trim()}"`);
    }

    console.log('Running test 5: Search for profunctor...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await page.keyboard.press('/');
    await page.waitForTimeout(200);
    await page.locator('input[type="search"]').fill('profunctor');
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const profunctorOpen = await page.locator('aside').isVisible();
    if (!profunctorOpen) throw new Error('Profunctor panel failed to open from search');
    const profunctorTitle = await page.locator('aside h2').textContent();
    if (!profunctorTitle.toLowerCase().includes('profunctor')) throw new Error(`Expected Profunctor, got: ${profunctorTitle}`);
    console.log('✓ Test 5 passed: Profunctor ranked #1 in search and opened cleanly.');

    console.log('Running test 6: Mobile bottom sheet peek & expand...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobilePage.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(600);
    const mobileAside = mobilePage.locator('aside');
    if (!(await mobileAside.isVisible())) throw new Error('Mobile bottom sheet should be visible');
    const peekBox = await mobileAside.boundingBox();
    if (!peekBox || peekBox.y < 350) throw new Error('Mobile sheet should start in bottom peek mode');
    console.log('  ✓ Mobile sheet starts in bottom peek mode');

    // Click expand button
    const expandBtn = mobilePage.locator('aside button[title*="Expand"]');
    await expandBtn.click();
    await mobilePage.waitForTimeout(400);
    const expBox = await mobileAside.boundingBox();
    if (!expBox || expBox.y > 200) throw new Error('Mobile sheet should expand upwards');
    console.log('  ✓ Mobile sheet expands to full view');
    await mobilePage.close();
    console.log('✓ Test 6 passed: Mobile bottom sheet behavior verified.');

  } catch (err) {
    console.error('Test failed:', err);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(exitCode);
  }
});
