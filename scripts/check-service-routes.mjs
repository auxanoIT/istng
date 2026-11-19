import assert from 'node:assert/strict';
import fs from 'node:fs';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3104';
const { canonicalServicePath, serviceRouteAliases } = typescriptLoader()('lib/service-routes.ts');
const groups = JSON.parse(fs.readFileSync('data/service-route-migration.json'));
const pages = groups.flatMap(group => [group, ...group.services.map(page => ({ ...page, parent: group.path }))]);
const known = new Set(['/services', ...pages.map(page => page.path)]);
const remaining = new Set();
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < pages.length) {
    const page = pages[cursor++];
    const response = await fetch(base + page.path, { redirect: 'manual', signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, page.path);
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="https://istng.com${page.path}"`), 'Canonical ' + page.path);
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), 'Unexpected noindex ' + page.path);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, page.path);
    assert.ok(!html.includes('Images illustrate the equipment and work involved.'), page.path);
    if (page.parent) {
      const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => { const data=JSON.parse(match[1]); return Array.isArray(data) ? data : [data]; });
      const crumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
      assert.ok(crumbs?.itemListElement.some(item => item.item === 'https://istng.com' + page.parent), 'Parent breadcrumb ' + page.path);
      assert.ok(html.includes('data-related-resources'), 'Related service cards ' + page.path);
    }
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      assert.equal(canonicalServicePath(href), href, 'Legacy internal link ' + page.path + ' -> ' + href);
      if (href.startsWith('/services/') && !known.has(href.split(/[?#]/)[0])) remaining.add(href);
    }
  }
}));
for (const [source, target] of Object.entries(serviceRouteAliases)) {
  const response = await fetch(base + source + '?ref=migration-check', { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  assert.ok([301, 308].includes(response.status), 'Permanent redirect ' + source);
  const location = new URL(response.headers.get('location'), base);
  assert.equal(location.pathname, target, source);
  assert.equal(location.searchParams.get('ref'), 'migration-check', 'Lost query ' + source);
}
const report = { checkedAt: new Date().toISOString(), overviews: groups.length, subservices: pages.length - groups.length, redirects: Object.keys(serviceRouteAliases).length, remainingServiceLinks: [...remaining] };
fs.writeFileSync('docs/service-route-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
