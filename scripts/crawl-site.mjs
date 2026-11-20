import { parse } from 'parse5';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

// A bounded, recursive HTML crawl. It never submits forms or visits Studio/API routes.
const origin = new URL(process.env.QA_BASE_URL || 'https://istng.com').origin;
const canonicalOrigin = process.env.CANONICAL_ORIGIN || origin;
const output = process.env.CRAWL_REPORT || 'docs/crawl-report.json';
const concurrency = 4;
const pages = new Map();
const pending = [];
const queued = new Set();
const fragments = [];
const issues = [];
const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
const sitemap = new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1].replaceAll('&amp;', '&')).pathname));
const assets = new Set();

function enqueue(path, depth, from) {
  if (queued.has(path) || /^(\/api|\/sanity|\/studio)(\/|$)/.test(path) || /\.[a-z0-9]{2,5}$/i.test(path)) return;
  if (queued.size >= 500) throw new Error('Crawl limit reached; check for a URL loop.');
  queued.add(path);
  pending.push({ path, depth, from });
}
function text(node) {
  if (['script', 'style', 'noscript'].includes(node.tagName)) return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(' ');
}
function visit(node, fn) {
  fn(node);
  for (const child of node.childNodes || []) visit(child, fn);
}
function schemaNodes(value, nodes = []) {
  if (!value || typeof value !== 'object') return nodes;
  if (value['@type']) nodes.push(value);
  for (const child of Object.values(value)) schemaNodes(child, nodes);
  return nodes;
}
const normalize = value => value.replace(/\s+/g, ' ').trim();
function localUrl(raw, base) {
  try {
    const url = new URL(raw, base);
    if (![new URL(origin).hostname, `www.${new URL(origin).hostname}`].includes(url.hostname)) return null;
    return url;
  } catch { return null; }
}
async function crawl({ path, depth, from }) {
  const started = performance.now();
  let url = `${origin}${path}`;
  const redirects = [];
  let response;
  try {
    for (let i = 0; i < 9; i++) {
      response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      if (response.status < 300 || response.status >= 400 || !response.headers.get('location')) break;
      const destination = new URL(response.headers.get('location'), url).href;
      redirects.push({ url, status: response.status, destination });
      await response.body?.cancel();
      if (!localUrl(destination, url)) throw new Error('Internal page redirects off site');
      if (redirects.some(r => r.url === destination)) throw new Error('Redirect loop');
      url = destination;
    }
    const ttfbMs = Math.round(performance.now() - started);
    const html = await response.text();
    const record = { path, depth, from, status: response.status, finalUrl: url, redirects,
      ttfbMs, totalMs: Math.round(performance.now() - started), htmlBytes: Buffer.byteLength(html),
      cache: response.headers.get('x-vercel-cache'), contentType: response.headers.get('content-type'),
      xRobots: response.headers.get('x-robots-tag'), title: '', description: '', canonical: '',
      robots: '', headings: [], ids: [], links: [], schemas: [], imageCount: 0, missingAlt: 0 };
    pages.set(path, record);
    if (response.status !== 200) { issues.push({ severity: 'error', path, message: `HTTP ${response.status}` }); return; }
    if (!record.contentType?.includes('text/html')) return;
    const doc = parse(html);
    let body;
    visit(doc, node => {
      const attr = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
      if (node.tagName === 'body') body = node;
      if (attr.id) record.ids.push(attr.id);
      if (node.tagName === 'title') record.title = text(node).trim();
      if (node.tagName === 'meta' && attr.name === 'description') record.description = attr.content;
      if (node.tagName === 'meta' && attr.name === 'robots') record.robots = attr.content;
      if (node.tagName === 'link' && attr.rel === 'canonical') record.canonical = attr.href;
      if (/^h[1-6]$/.test(node.tagName)) record.headings.push({ level: Number(node.tagName[1]), text: text(node).replace(/\s+/g, ' ').trim() });
      if (node.tagName === 'img') {
        record.imageCount++;
        if (!Object.hasOwn(attr, 'alt')) record.missingAlt++;
        if (attr.src) assets.add(new URL(attr.src, url).href);
      }
      if (node.tagName === 'script' && attr.type === 'application/ld+json') {
        try { record.schemas.push(JSON.parse(node.childNodes.map(n => n.value || '').join(''))); }
        catch { issues.push({ severity: 'error', path, message: 'Invalid JSON-LD' }); }
      }
      if (node.tagName === 'a' && attr.href) {
        const target = localUrl(attr.href, url);
        if (!target) return;
        const label = text(node).replace(/\s+/g, ' ').trim();
        record.links.push({ path: target.pathname, fragment: target.hash, label });
        if (target.hash && target.hash !== '#') fragments.push({ from: path, path: target.pathname, fragment: target.hash });
        if (target.pathname !== new URL(url).pathname) enqueue(target.pathname, depth + 1, path);
      }
    });
    const bodyText = normalize(text(body || doc));
    record.words = bodyText.split(/\s+/).length;
    record.indexable = !/noindex/i.test(`${record.robots} ${record.xRobots || ''}`);
    const error = message => issues.push({ severity: 'error', path, message });
    if (!record.title) error('Missing title');
    if (!record.description) error('Missing description');
    if (!record.canonical) error('Missing canonical');
    if (record.headings.filter(h => h.level === 1).length !== 1) error('Expected exactly one H1');
    const expectedCanonical = new URL(new URL(url).pathname, canonicalOrigin).href;
    if (record.indexable && new URL(record.canonical || '/', canonicalOrigin).href !== expectedCanonical) error(`Canonical mismatch: ${record.canonical}`);
    if (sitemap.has(path) && !record.indexable) error('Sitemap page is noindex');
    if (record.indexable && !sitemap.has(path) && redirects.length === 0) issues.push({ severity: 'warning', path, message: 'Indexable page outside sitemap' });
    if (record.missingAlt) error(`${record.missingAlt} images have no alt attribute`);
    if (!record.indexable && /nofollow/i.test(record.robots)) issues.push({ severity: 'warning', path, message: 'Public noindex page also uses nofollow' });
    const schemas = schemaNodes(record.schemas);
    record.schemaTypes = [...new Set(schemas.map(s => s['@type']).flat())];
    for (const schema of schemas) {
      if (schema['@type'] === 'BreadcrumbList') {
        const entries = schema.itemListElement || [];
        if (entries.some((entry, index) => entry.position !== index + 1 || !entry.name || !entry.item)) error('Invalid breadcrumb positions or destinations');
      }
      if (schema['@type'] === 'FAQPage') {
        for (const question of schema.mainEntity || []) {
          if (!bodyText.includes(normalize(question.name)) || !bodyText.includes(normalize(question.acceptedAnswer?.text || ''))) error(`FAQ schema differs from rendered content: ${question.name}`);
        }
      }
      if (['Article', 'BlogPosting'].includes(schema['@type']) && (!schema.headline || !schema.author || !schema.image)) error('Article schema missing headline, author or image');
      if (['Organization', 'LocalBusiness'].includes(schema['@type']) && schema.telephone && schema.telephone !== '+2348050274481') error('Incorrect business telephone in schema');
    }
    if (redirects.length > 1) issues.push({ severity: 'warning', path, message: `${redirects.length} redirect hops` });
  } catch (error) {
    pages.set(path, { path, depth, from, status: 0, error: error.message });
    issues.push({ severity: 'error', path, message: error.message });
  }
}

// Crawl discovery first, then check sitemap-only pages for genuine orphan detection.
enqueue('/', 0, null);
async function drain() {
  while (pending.length) await Promise.all(pending.splice(0, concurrency).map(crawl));
}
await drain();
const discovered = new Set(queued);
for (const path of sitemap) enqueue(path, null, 'sitemap');
await drain();
for (const path of sitemap) if (!discovered.has(path)) issues.push({ severity: 'warning', path, message: 'Sitemap URL not discovered through homepage links' });
for (const link of fragments) {
  const target = pages.get(link.path);
  let id;
  try { id = decodeURIComponent(link.fragment.slice(1)); } catch { id = link.fragment.slice(1); }
  if (target?.status === 200 && target.ids && !target.ids.includes(id)) issues.push({ severity: 'error', path: link.from, message: `Missing anchor ${link.path}${link.fragment}` });
}
for (const field of ['title', 'description']) {
  const groups = new Map();
  for (const p of pages.values()) if (p.indexable && !p.redirects?.length && p[field]) groups.set(p[field], [...(groups.get(p[field]) || []), p.path]);
  for (const [value, paths] of groups) if (paths.length > 1) issues.push({ severity: 'warning', paths, message: `Duplicate ${field}: ${value}` });
}
const uniqueIssues = [...new Map(issues.map(i => [JSON.stringify(i), i])).values()];
const accessChecks = [];
for (const path of ['/robots.txt', '/llms.txt', '/seo-audit-nonexistent-page-404']) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30000) });
  const expected = path.includes('nonexistent') ? 404 : 200;
  accessChecks.push({ path, status: response.status, expected });
  await response.body?.cancel();
  if (response.status !== expected) uniqueIssues.push({ severity: 'error', path, message: `Expected HTTP ${expected}, received ${response.status}` });
}
for (const agent of ['Googlebot', 'bingbot']) {
  const response = await fetch(`${origin}/services/solar-energy`, { headers: { 'User-Agent': agent }, signal: AbortSignal.timeout(30000) });
  accessChecks.push({ path: '/services/solar-energy', agent, status: response.status });
  await response.body?.cancel();
  if (response.status !== 200) uniqueIssues.push({ severity: 'error', path: '/services/solar-energy', message: `HTTP ${response.status} with ${agent} user agent` });
}
const assetChecks = [];
if (process.env.CRAWL_ASSETS === '1') {
  const queue = [...assets];
  while (queue.length) {
    await Promise.all(queue.splice(0, concurrency).map(async url => {
      try {
        const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
        assetChecks.push({ url, status: response.status });
        if (!response.ok) uniqueIssues.push({ severity: 'error', path: url, message: `Image HTTP ${response.status}` });
      } catch (e) {
        assetChecks.push({ url, error: e.message });
        uniqueIssues.push({ severity: 'error', path: url, message: `Image fetch failed: ${e.message}` });
      }
    }));
  }
}
const timings = [...pages.values()].filter(p => p.status === 200).map(p => p.ttfbMs).sort((a,b) => a-b);
const report = { origin, generatedAt: new Date().toISOString(),
  summary: { pages: pages.size, sitemapPages: sitemap.size, discoveredFromHome: discovered.size,
    errors: uniqueIssues.filter(i => i.severity === 'error').length, warnings: uniqueIssues.filter(i => i.severity === 'warning').length,
    medianTtfbMs: timings[Math.floor(timings.length * .5)], p95TtfbMs: timings[Math.floor(timings.length * .95)], assets: assets.size },
  issues: uniqueIssues, pages: [...pages.values()], imageUrls: [...assets], assetChecks, accessChecks };
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report.summary, issues: uniqueIssues }, null, 2));
if (report.summary.errors) process.exitCode = 1;
