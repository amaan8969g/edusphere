const { test } = require('@playwright/test');

test('headless diagnostic', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG [' + msg.type() + ']: ' + msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR: ' + err.message));

  console.log('Opening Student Dashboard...');
  await page.goto('http://localhost:5173/student/dashboard', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/src/dashboard.png' });

  console.log('Opening CourseWatch (course) ...');
  await page.goto('http://localhost:5173/courses/java-full-course-apna-college-', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'client/src/coursewatch.png' });

  console.log('Done. Screenshots saved to client/src/*.png');
});