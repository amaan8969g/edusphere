const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG [' + msg.type() + ']: ' + msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR: ' + err.message));

  console.log('Opening Student Dashboard...');
  await page.goto('http://localhost:5173/student/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/dashboard.png' });

  console.log('Opening CourseWatch (course) ...');
  await page.goto('http://localhost:5173/courses/java-full-course-apna-college-', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/coursewatch.png' });

  console.log('Done. Screenshots saved to client/dashboard.png and client/coursewatch.png');
  await browser.close();
})().catch((e) => { console.error('ERROR:', e); process.exit(1); });