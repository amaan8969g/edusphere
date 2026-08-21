const playwright = require('playwright');

const TOKEN = process.env.EDU_TOKEN;
if (!TOKEN) {
  console.error('EDU_TOKEN env var not set');
  process.exit(1);
}

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(token => { localStorage.setItem('edusphere_token', token); }, TOKEN);
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG [' + msg.type() + ']: ' + msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR: ' + err.message));

  console.log('Opening Student Dashboard...');
  await page.goto('http://localhost:5173/student/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/protected_dashboard.png' });

  console.log('Done. Screenshot: client/protected_dashboard.png');
  await browser.close();
})().catch((e) => { console.error('ERROR:', e); process.exit(1); });