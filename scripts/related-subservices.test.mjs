import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const load = typescriptLoader();
const { getRelatedSubserviceCards } = load('data/related-subservices.ts');
const { solutionPillars } = load('data/enterprise-solutions.ts');
const { getInfrastructureSubservice } = load('data/infrastructure-subservices.ts');
const { getSolarSubservice } = load('data/solar-subservices.ts');
const { serviceCardSummaries } = load('data/service-card-summaries.ts');
const { resolveSiteImagePath } = load('lib/image-assets.ts');

test('every subservice has three distinct related service destinations and contextual copy', () => {
  const catalogue = new Set(solutionPillars.flatMap(p => p.items.map(i => i.href)));
  for (const pillar of solutionPillars) for (const service of pillar.items) {
    const cards = getRelatedSubserviceCards(service.href);
    assert.equal(cards.length, 3, service.href);
    assert.equal(new Set(cards.map(c => c.href)).size, 3);
    assert.equal(new Set(cards.map(c => resolveSiteImagePath(c.image.src))).size, 3, 'Resource cards must show different hero images');
    for (const card of cards) {
      assert.notEqual(card.href, service.href);
      assert.ok(catalogue.has(card.href));
      assert.ok(card.description.length > 30);
      assert.ok(card.description.split(/\s+/).length <= 20, 'Card copy must stay concise');
      const targetPillar = solutionPillars.find(group => group.items.some(item => item.href === card.href));
      const target = targetPillar.items.find(item => item.href === card.href);
      const content = targetPillar.slug === 'solar-energy' ? getSolarSubservice(target.slug).content : getInfrastructureSubservice(card.href).content;
      assert.equal(card.image.src, content.hero.image.src, 'Card must use the destination hero');
    }
    assert.ok(serviceCardSummaries[service.slug], service.title);
  }
});
