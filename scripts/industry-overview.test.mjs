import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { typescriptLoader } from './helpers/load-typescript.mjs';

const load = typescriptLoader();
const { industryNavigation } = load('data/industry-navigation.ts');
const { getIndustryEditorial } = load('data/industry-editorial.ts');
const copy = load('data/industry-page-copy.json');

test('every listed industry has four complete priorities and its own optimised illustration', () => {
  const entries = industryNavigation.flatMap(group => group.entries);
  const images = new Set();
  assert.equal(entries.length, 17);
  for (const [slug] of entries) {
    const experience = getIndustryEditorial(slug).overviewExperience;
    assert.equal(experience.title, copy[slug].overview.title);
    assert.equal(experience.items.length, 4, slug);
    assert.equal(new Set(experience.items.map(item => item.label)).size, 4, slug);
    for (const item of experience.items) {
      assert.ok(item.title && item.label && item.focus, slug);
      assert.ok(item.paragraphs.length > 0 && item.paragraphs.every(Boolean), slug);
    }
    const image = experience.image;
    const bytes = readFileSync(new URL('../public' + image.src, import.meta.url));
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.ok(!images.has(hash), 'Duplicate scene: ' + slug);
    images.add(hash);
    assert.ok(bytes.length < 350000, 'Oversized scene: ' + slug);
    assert.ok(image.width > 1000 && image.height > 400 && image.alt.length > 30, slug);
    for (const point of Object.values(image.anchors)) {
      assert.ok(point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100, slug);
    }
  }
});
