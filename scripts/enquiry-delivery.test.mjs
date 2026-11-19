import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';

const details = {
  name: 'Website Test', company: 'Integration QA', email: 'visitor@example.test', phone: '08050274481',
  serviceInterest: 'Solar Energy & Power Solutions', message: 'Goal: Improve power reliability\nMonthly spend: Not sure', context: 'hero',
};
const smtpEnv = { ZOHO_SMTP_USER: 'elijaho@auxanosolutions.net', ZOHO_SMTP_PASSWORD: 'test-only-not-a-real-credential' };
const recipients = ['ask@istng.com'];

function mailHarness(send, env = smtpEnv) {
  const sent = [], configurations = [];
  const load = typescriptLoader({ env, overrides: {
    nodemailer: { createTransport: options => {
      configurations.push(options);
      return { async sendMail(message) { sent.push(message); return send(message, sent.length); }, close() {} };
    } },
  } });
  return { ...load('lib/enquiry-email.ts'), sent, configurations };
}

test('notification and acknowledgement use the confirmed recipients and identity', () => {
  const { buildEnquiryEmails } = mailHarness();
  const emails = buildEnquiryEmails(details);
  assert.deepEqual([...emails.notification.to], recipients);
  assert.equal(emails.notification.replyTo, details.email);
  assert.match(emails.notification.text, /Goal: Improve power reliability/);
  assert.equal(emails.acknowledgement.to, details.email);
  assert.equal(emails.acknowledgement.replyTo, 'ask@istng.com');
  assert.match(emails.acknowledgement.text, /26A Adeshina Street/);
  assert.match(emails.acknowledgement.text, /08050274481/);
  assert.doesNotMatch(emails.acknowledgement.text, /elijaho@|support@/);
  const booking = buildEnquiryEmails({ ...details, context: 'consultation' });
  assert.match(booking.acknowledgement.text, /before confirming an appointment/);
  for (const context of ['hero', 'consultation', 'contact']) {
    assert.deepEqual([...buildEnquiryEmails({ ...details, context }).notification.to], ['ask@istng.com']);
  }
});

test('customer text is escaped in HTML and remains literal in the plain text version', () => {
  const { buildEnquiryEmails } = mailHarness();
  const message = buildEnquiryEmails({ ...details, name: '<img src=x onerror=alert(1)>', serviceInterest: 'Power & <script>x</script>' });
  assert.doesNotMatch(message.acknowledgement.html, /<script>|<img/);
  assert.match(message.acknowledgement.html, /&lt;img/);
  assert.match(message.acknowledgement.text, /<img src=x/);
});

test('Zoho sends both messages over verified TLS with no external file or URL reads', async () => {
  const mail = mailHarness(message => ({ accepted: Array.isArray(message.to) ? message.to : [message.to] }));
  const result = await mail.sendEnquiryEmails(details, true);
  assert.equal(result.notificationSent, true);
  assert.equal(result.storedByEmail, true);
  assert.equal(result.acknowledgementSent, true);
  assert.equal(mail.sent.length, 2);
  assert.equal(mail.configurations[0].port, 465);
  assert.equal(mail.configurations[0].secure, true);
  assert.equal(mail.configurations[0].tls.minVersion, 'TLSv1.2');
  for (const message of mail.sent) {
    assert.equal(message.disableFileAccess, true);
    assert.equal(message.disableUrlAccess, true);
    assert.equal(message.from.address, smtpEnv.ZOHO_SMTP_USER);
  }
});

test('no acknowledgement is sent when neither CRM nor owner mail saved the enquiry', async () => {
  const mail = mailHarness(() => { throw new Error('Provider unavailable'); });
  const result = await mail.sendEnquiryEmails(details, false);
  assert.equal(result.acknowledgementSent, false);
  assert.equal(result.storedByEmail, false);
  assert.equal(mail.sent.length, 1);
});

test('CRM receipt permits acknowledgement even if notification transport fails', async () => {
  const mail = mailHarness((message, attempt) => {
    if (attempt === 1) throw new Error('Provider notification failure');
    return { accepted: [message.to] };
  });
  const result = await mail.sendEnquiryEmails(details, true);
  assert.equal(result.notificationSent, false);
  assert.equal(result.acknowledgementSent, true);
});

test('rejection of the single notification recipient does not claim receipt or send acknowledgement', async () => {
  const mail = mailHarness(() => ({ accepted: [] }));
  const result = await mail.sendEnquiryEmails(details, false);
  assert.equal(result.notificationSent, false);
  assert.equal(result.storedByEmail, false);
  assert.equal(result.acknowledgementSent, false);
  assert.equal(mail.sent.length, 1);
});

test('missing credentials and invalid ports never attempt SMTP or falsely claim delivery', async () => {
  for (const env of [{}, { ...smtpEnv, ZOHO_SMTP_PORT: '25' }]) {
    const mail = mailHarness(() => { throw new Error('Should not be called'); }, env);
    const result = await mail.sendEnquiryEmails(details, true);
    assert.equal(result.notificationSent, false);
    assert.equal(result.acknowledgementSent, false);
    assert.equal(mail.sent.length, 0);
  }
});

test('both form destinations stay in the new account even with stale hosting variables', () => {
  const load = typescriptLoader({ env: { INTEGRATED_HUBSPOT_PORTAL_ID: 'former-account', INTEGRATED_HUBSPOT_CONSULTATION_FORM_ID: 'former-form' } });
  const hubspot = load('lib/consultation-hubspot.ts');
  assert.equal(hubspot.consultationHubSpotDestination().portalId, '149809153');
  assert.equal(hubspot.heroHubSpotDestination().portalId, '149809153');
  assert.notEqual(hubspot.consultationHubSpotDestination().formId, hubspot.heroHubSpotDestination().formId);
  const fields = hubspot.enquiryHubSpotFields(details);
  assert.deepEqual(Array.from(fields, field => field.name).sort(), ['email', 'firstname', 'lastname', 'message', 'phone']);
  assert.match(fields.find(field => field.name === 'message').value, /Company: Integration QA/);
});

for (const context of ['hero', 'consultation', 'contact']) {
  test(`${context} route chooses the right form, captures consent, and accurately handles each delivery result`, async () => {
    for (const [crm, stored, expected] of [[true, false, 200], [false, true, 200], [false, false, 503]]) {
      let submitted;
      const load = typescriptLoader({ overrides: {
        'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
        '@/lib/integrations': {
          verifyTurnstile: async () => true,
          submitToHubSpot: async payload => { submitted = payload; return crm; },
          buildHubSpotConsentOptions: () => ({ consent: { consentToProcess: true, communications: [] } }),
          getRequestIpAddress: () => undefined,
        },
        '@/lib/enquiry-email': { sendEnquiryEmails: async (_details, saved) => {
          assert.equal(saved, crm);
          return { notificationSent: stored, storedByEmail: stored, acknowledgementSent: stored };
        } },
      } });
      const route = load('app/api/lead/route.ts');
      const response = await route.POST(new Request('https://istng.com/api/lead', { method: 'POST', body: JSON.stringify({ ...details, context, marketingConsent: true }) }));
      assert.equal(response.status, expected);
      assert.equal(submitted.portalId, '149809153');
      assert.equal(submitted.formId, context === 'hero' ? 'e6094f85-db77-4f49-848e-6202c5161114' : 'c71a1658-a193-490c-b7ce-6d1422887470');
      assert.equal(submitted.pageUri, context === 'hero' ? 'https://istng.com/' : 'https://istng.com/book-consultation');
      if (expected === 200) assert.equal((await response.json()).acknowledgementSent, stored);
    }
  });
}

test('invalid or unconsented submissions do not reach either provider', async () => {
  let attempts = 0;
  const load = typescriptLoader({ overrides: {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/integrations': { verifyTurnstile: async () => { attempts++; return true; } },
    '@/lib/enquiry-email': {},
  } });
  const route = load('app/api/lead/route.ts');
  for (const payload of [{}, { ...details, marketingConsent: false }, { ...details, email: 'invalid', marketingConsent: true }]) {
    const response = await route.POST(new Request('https://istng.com/api/lead', { method: 'POST', body: JSON.stringify(payload) }));
    assert.equal(response.status, 400);
  }
  assert.equal(attempts, 0);
});
