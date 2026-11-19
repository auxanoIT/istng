import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const load = typescriptLoader();
const { getPlanningQuestions, planningChecklists } = load('data/planning-checklists.ts');
const { getRelatedSubserviceCards } = load('data/related-subservices.ts');
const { solutionPillars } = load('data/enterprise-solutions.ts');

test('all planning kinds provide ten useful questions, including for older short CMS lists', () => {
  for (const kind of Object.keys(planningChecklists)) {
    for (const supplied of [null, [], ['Prepare a device list', 'Check the room'], [' ', 'Repeated', 'Repeated'], [null, '']]) {
      const questions = getPlanningQuestions(kind, supplied);
      assert.equal(questions.length, 10);
      assert.equal(new Set(questions.map(q => q.prompt)).size, 10);
      assert.ok(questions.every(q => q.prompt.endsWith('?') && q.guidance.length > 30));
    }
    const custom = Array.from({ length: 12 }, (_, index) => `Published question ${index + 1}?`);
    assert.equal(getPlanningQuestions(kind, custom).length, 10);
    assert.equal(getPlanningQuestions(kind, custom)[0].prompt, custom[0]);
  }
});

test('every subservice has three distinct related service destinations and contextual copy', () => {
  const catalogue = new Set(solutionPillars.flatMap(p => p.items.map(i => i.href)));
  for (const pillar of solutionPillars) for (const service of pillar.items) {
    const cards = getRelatedSubserviceCards(service.href);
    assert.equal(cards.length, 3, service.href);
    assert.equal(new Set(cards.map(c => c.href)).size, 3);
    for (const card of cards) {
      assert.notEqual(card.href, service.href);
      assert.ok(catalogue.has(card.href));
      assert.ok(card.description.length > 30);
    }
  }
});
