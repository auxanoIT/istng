import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const load = typescriptLoader();
const { solutionPillars } = load('data/enterprise-solutions.ts');
const { getInfrastructureSubservice } = load('data/infrastructure-subservices.ts');
const { getSolarSubservice } = load('data/solar-subservices.ts');
const { resolveSiteImagePath } = load('lib/image-assets.ts');

test('all existing galleries have four distinct image files and different selections across pages', () => {
  const selections = new Set();
  let galleries = 0;
  for (const pillar of solutionPillars) for (const service of pillar.items) {
    const content = pillar.slug === 'solar-energy' ? getSolarSubservice(service.slug).content : getInfrastructureSubservice(service.href).content;
    if (!content.gallery) continue;
    const hashes = content.gallery.items.map(item => {
      assert.ok(item.image.alt.length > 15, item.title);
      const file = new URL('../public' + resolveSiteImagePath(item.image.src), import.meta.url);
      return createHash('sha256').update(readFileSync(file)).digest('hex');
    });
    assert.equal(hashes.length, 4, service.href);
    assert.equal(new Set(hashes).size, 4, 'Repeated image within ' + service.href);
    const signature = hashes.sort().join('|');
    assert.ok(!selections.has(signature), 'Repeated four-image selection: ' + service.href);
    selections.add(signature);
    galleries++;
  }
  assert.equal(galleries, 40);
});
