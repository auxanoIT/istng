import assert from 'node:assert/strict';
import fs from 'node:fs';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3105';
const load = typescriptLoader();
const { solutionPillars } = load('data/enterprise-solutions.ts');
const { getInfrastructureSubservice } = load('data/infrastructure-subservices.ts');
const { getSolarSubservice } = load('data/solar-subservices.ts');
const { getRelatedSubserviceCards } = load('data/related-subservices.ts');
const { resolveSiteImagePath } = load('lib/image-assets.ts');
const pages = solutionPillars.flatMap(pillar => pillar.items.map(service => ({ pillar, service })));
function images(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base);
    return url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname;
  });
}
let cursor = 0, galleryCount = 0, cardCount = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < pages.length) {
    const { pillar, service } = pages[cursor++];
    const response = await fetch(base + service.href, { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, service.href);
    const html = await response.text();
    const content = pillar.slug === 'solar-energy' ? getSolarSubservice(service.slug).content : getInfrastructureSubservice(service.href).content;
    if (content.gallery) {
      const section = html.match(/<section\b[^>]*id="service-gallery"[\s\S]*?<\/section>/)?.[0];
      assert.ok(section, service.href);
      const actual = images(section);
      const expected = Array.from(content.gallery.items, item => resolveSiteImagePath(item.image.src));
      assert.deepEqual(actual, expected, 'Gallery mismatch ' + service.href);
      assert.equal(new Set(actual).size, 4, service.href);
      galleryCount++;
    }
    const related = html.match(/<ul\b[^>]*data-related-resources[\s\S]*?<\/ul>/)?.[0];
    assert.ok(related, 'Related cards missing ' + service.href);
    const expected = getRelatedSubserviceCards(service.href);
    assert.deepEqual(images(related).slice(0, 3), Array.from(expected, card => resolveSiteImagePath(card.image.src)), 'Card hero mismatch ' + service.href);
    for (const card of expected) assert.ok(related.includes(`href="${card.href}"`), card.href);
    cardCount += expected.length;
  }
}));
const report = { checkedAt: new Date().toISOString(), pages: pages.length, galleries: galleryCount, distinctImagesPerGallery: 4, heroImageCards: cardCount };
fs.writeFileSync('docs/service-imagery-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
