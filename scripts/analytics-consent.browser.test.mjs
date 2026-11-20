import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || join(process.env.TEMP, 'integrated-nav-browser-qa/node_modules/playwright-core'));
const base = process.env.ANALYTICS_TEST_BASE_URL || 'http://localhost:3107';

test('optional analytics requires consent, persists choices and avoids duplicate setup on navigation', {timeout: 90_000}, async t => {
  const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
  t.after(() => browser.close());
  const context = await browser.newContext();
  const requests = [];
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    requests.push(url);
    // No test event is sent to Google or other external services.
    return route.fulfill({status:200, contentType:'application/javascript', body:'/* external service stub */'});
  });
  const page = await context.newPage();
  await page.goto(base, {waitUntil:'networkidle'});
  const gaRequests = () => requests.filter(url => url.includes('googletagmanager.com'));
  assert.equal(gaRequests().length,0);
  await page.getByRole('button',{name:'Decline',exact:true}).click();
  await page.reload({waitUntil:'networkidle'});
  assert.equal(gaRequests().length,0);
  assert.equal(await page.getByRole('button',{name:'Accept',exact:true}).count(),0);
  await page.getByRole('button',{name:'Cookie preferences',exact:true}).click();
  await page.getByRole('button',{name:'Accept',exact:true}).click();
  await page.waitForFunction(() => window.dataLayer?.some(item => item[0] === 'config'));
  await page.waitForLoadState('networkidle');
  assert.equal(gaRequests().length,1);
  assert.match(gaRequests()[0],/G-YWBE572JH3/);
  const config = await page.evaluate(() => window.dataLayer.filter(item => item[0] === 'config').map(item => Array.from(item)));
  assert.equal(config.length,1);
  assert.equal(config[0][1],'G-YWBE572JH3');
  await page.evaluate(() => document.addEventListener('click', event => {
    if(event.target.closest?.('a[href^="tel:"]')) event.preventDefault();
  }));
  await page.locator('footer a[href^="tel:"]').first().click();
  const contacts = await page.evaluate(() => window.dataLayer.filter(item => item[1] === 'contact_click').map(item => Array.from(item)));
  assert.deepEqual(contacts, [['event','contact_click',{contact_method:'phone'}]]);
  await page.locator('footer a[href="/privacy"]').click();
  await page.getByRole('heading',{name:'Website Privacy & Cookies',exact:true}).waitFor();
  assert.equal(await page.evaluate(() => window.dataLayer.filter(item => item[0] === 'config').length),1);
  assert.equal(gaRequests().length,1);
});
