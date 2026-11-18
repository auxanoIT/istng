import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';
const load = typescriptLoader({ env: process.env, fetch: (...args) => globalThis.fetch(...args) });
const { submitToHubSpot, sendFallbackEmail, buildHubSpotConsentOptions } = load('lib/integrations.ts');
const { consultationHubSpotDestination, consultationHubSpotSubscriptionTypeId } = load('lib/consultation-hubspot.ts');

test('consultation delivery uses its own form and handles provider failures', async (t) => {
  const oldFetch = globalThis.fetch;
  const oldEnv = { ...process.env };
  t.after(() => { globalThis.fetch = oldFetch; process.env = oldEnv; });
  delete process.env.INTEGRATED_HUBSPOT_PORTAL_ID;
  delete process.env.INTEGRATED_HUBSPOT_CONSULTATION_FORM_ID;
  process.env.INTEGRATED_HUBSPOT_FORM_ID = 'other-form';
  const destination = consultationHubSpotDestination();
  assert.equal(destination.formId, 'c71a1658-a193-490c-b7ce-6d1422887470');
  delete process.env.INTEGRATED_HUBSPOT_SUBSCRIPTION_TYPE_ID;
  assert.equal(buildHubSpotConsentOptions(consultationHubSpotSubscriptionTypeId()).consent.communications.length, 0);
  assert.equal(buildHubSpotConsentOptions().consent.communications.length, 0);
  process.env.INTEGRATED_HUBSPOT_PORTAL_ID = 'another-account';
  assert.equal(consultationHubSpotSubscriptionTypeId(), undefined);
  delete process.env.INTEGRATED_HUBSPOT_PORTAL_ID;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, `https://api.hsforms.com/submissions/v3/integration/submit/149809153/${destination.formId}`);
    const body = JSON.parse(init.body);
    assert.equal(body.fields[0].value, 'Test request');
    assert.equal(body.context.pageName, 'Book Consultation');
    return new Response('{}', { status: 200 });
  };
  const request = { ...destination, fields: [{ name: 'message', value: 'Test request' }], pageUri: 'https://example.com/book-consultation', pageName: 'Book Consultation' };
  assert.equal(await submitToHubSpot(request), true);
  globalThis.fetch = async () => new Response('{}', { status: 400 });
  assert.equal(await submitToHubSpot(request), false);
  globalThis.fetch = async () => { throw new Error('Network unavailable'); };
  assert.equal(await submitToHubSpot(request), false);
  process.env.RESEND_API_KEY = 'test-only';
  process.env.INTEGRATED_RESEND_FROM_EMAIL = 'test@example.com';
  process.env.INTEGRATED_LEAD_FALLBACK_EMAIL = 'owner@example.com';
  assert.equal(await sendFallbackEmail('Test', ['<b>literal customer input</b>']), false);
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    assert.equal(body.text, '<b>literal customer input</b>');
    assert.equal(body.html, undefined);
    return new Response('{}', { status: 200 });
  };
  assert.equal(await sendFallbackEmail('Test', ['<b>literal customer input</b>']), true);
  for (const invalid of ['', 'invalid', '0', '-1', '1.2']) {
    process.env.INTEGRATED_HUBSPOT_SUBSCRIPTION_TYPE_ID = invalid;
    assert.equal(buildHubSpotConsentOptions().consent.communications.length, 0);
  }
  process.env.INTEGRATED_HUBSPOT_SUBSCRIPTION_TYPE_ID = '123';
  assert.equal(buildHubSpotConsentOptions().consent.communications.length, 0);
  assert.equal(buildHubSpotConsentOptions(123).consent.communications[0].subscriptionTypeId, 123);
});
