const playwright = require('playwright');

const TOKEN = process.env.EDU_TOKEN;
if (!TOKEN) {
  console.error('EDU_TOKEN env var not set');
  process.exit(1);
}

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  // Inject token into localStorage before any page loads
  await context.addInitScript(token => {
    try {
      localStorage.setItem('edusphere_token', token);
    } catch (e) {}
  }, TOKEN);

  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG [' + msg.type() + ']: ' + msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR: ' + err.message));

  console.log('Opening protected learn page...');
  await page.goto('http://localhost:5173/student/course/6a7326af9c59ac04ac8d856f/learn', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/protected_courselearn.png' });

  console.log('Done. Screenshot: client/protected_courselearn.png');
  await browser.close();
})().catch((e) => { console.error('ERROR:', e); process.exit(1); });