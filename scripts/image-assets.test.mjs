import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { typescriptLoader } from './helpers/load-typescript.mjs';

const load = typescriptLoader();
const { getImageReplacement, resolveSiteImagePath } = load('lib/image-assets.ts');
const replacements = JSON.parse(readFileSync(new URL('../data/image-replacements.json', import.meta.url)));
const inherited = '/image/service-details/network-cabling-rack.webp';
const updated = '/integrated-assets/images/brand-refresh/structured-network-rack.webp';

test('audited images resolve consistently for local paths and site metadata URLs', () => {
  assert.equal(resolveSiteImagePath(inherited), updated);
  assert.equal(resolveSiteImagePath(inherited + '?v=2#detail'), updated + '?v=2#detail');
  assert.equal(resolveSiteImagePath('https://istng.com' + inherited), 'https://istng.com' + updated);
  assert.equal(resolveSiteImagePath('https://www.istng.com' + inherited), 'https://www.istng.com' + updated);
  assert.match(getImageReplacement(inherited).alt, /copper and fibre/);
});

test('project photos, portraits, logos, page URLs and external CMS images pass through', () => {
  for (const source of [
    '/image/about/tosin-ayorinde.webp', '/image/about/ifeyemi-banjo-aina.webp',
    '/image/our-work/integrated-solutions-data-centre-rack-r08-11-rear.webp',
    '/image/case-studies/integrated/customer-installation.webp',
    '/brand/integrated_solution_technology.png', '/services/data-centre-deployment',
    'https://cdn.sanity.io' + inherited, 'https://example.com' + inherited,
  ]) {
    assert.equal(resolveSiteImagePath(source), source);
    assert.equal(getImageReplacement(source), undefined);
  }
});

test('every replacement is a distinct existing asset with descriptive metadata and no redirect chains', () => {
  for (const [source, target] of Object.entries(replacements)) {
    assert.notEqual(source, target.src);
    assert.equal(replacements[target.src], undefined, 'Replacement must be canonical in one step');
    assert.ok(target.alt.length > 15, source);
    const asset = new URL('../public' + target.src, import.meta.url);
    assert.ok(existsSync(asset), target.src);
    const original = new URL('../public' + source, import.meta.url);
    if (existsSync(original)) {
      const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
      assert.notEqual(hash(asset), hash(original), source);
    }
  }
});
