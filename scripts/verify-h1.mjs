// Post-fix H1 visibility check.
// Usage: SITE=https://petpark.hr node verify-h1.mjs
// Requires: npx playwright install chromium
import { chromium } from 'playwright';

const SITE = process.env.SITE || 'https://petpark.hr';
const routes = ['/kontakt', '/o-nama', '/faq', '/cuvanje-pasa-zagreb', '/uvjeti', '/zajednica'];

const browser = await chromium.launch({ headless: true });
let fail = 0;

for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cspErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && /content security policy/i.test(m.text())) cspErrors.push(m.text());
  });
  await page.goto(SITE + r, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2500);

  let box = null, opacity = null;
  try {
    const h1 = page.locator('h1').first();
    box = await h1.boundingBox();
    opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
  } catch {}

  const visible = box && box.width > 0 && box.height > 0 && opacity !== '0';
  if (!visible || cspErrors.length) fail++;
  console.log(
    `${visible && !cspErrors.length ? 'PASS' : 'FAIL'}  ${r}  ` +
    `box=${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'null'} ` +
    `opacity=${opacity} cspErrors=${cspErrors.length}`
  );
  await page.close();
}

await browser.close();
console.log(fail === 0 ? '\nAll H1s visible, no CSP errors ✅' : `\n${fail} route(s) still broken ❌`);
process.exit(fail === 0 ? 0 : 1);
