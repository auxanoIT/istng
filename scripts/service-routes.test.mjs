import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';

const load = typescriptLoader();
const { canonicalServicePath, serviceRouteAliases } = load('lib/service-routes.ts');
const { solutionPillars } = load('data/enterprise-solutions.ts');
const { getInfrastructureSubservice } = load('data/infrastructure-subservices.ts');

test('six overviews and all 41 services follow their catalogue parent hierarchy', () => {
  assert.equal(solutionPillars.length, 6);
  const destinations = new Set();
  for (const pillar of solutionPillars) {
    assert.match(pillar.href, /^\/services\/[^/]+$/);
    for (const service of pillar.items) {
      assert.ok(service.href.startsWith(pillar.href + '/'), service.href);
      assert.equal(service.href.split('/').length, 4);
      assert.ok(!destinations.has(service.href), 'Duplicate service destination');
      destinations.add(service.href);
      if (pillar.slug !== 'solar-energy') {
        const page = getInfrastructureSubservice(service.href);
        assert.ok(page, 'Missing page content: ' + service.href);
        assert.equal(page.parent.path, pillar.href);
        assert.equal(page.path, service.href);
      }
    }
  }
  assert.equal(destinations.size, 41);
});

test('legacy aliases resolve directly without chains and retain query strings and anchors', () => {
  for (const [source, destination] of Object.entries(serviceRouteAliases)) {
    assert.notEqual(source, destination);
    assert.equal(serviceRouteAliases[destination], undefined);
    assert.equal(canonicalServicePath(source + '?ref=guide#details'), destination + '?ref=guide#details');
    assert.equal(canonicalServicePath('https://istng.com' + source), 'https://istng.com' + destination);
  }
  assert.equal(canonicalServicePath('/services'), '/services');
  assert.equal(canonicalServicePath('https://example.com/solutions/solar-energy'), 'https://example.com/solutions/solar-energy');
  assert.equal(canonicalServicePath('#service-process'), '#service-process');
});
