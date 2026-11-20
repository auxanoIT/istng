import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { typescriptLoader } from './helpers/load-typescript.mjs';

const origin = process.env.QA_BASE_URL || 'https://istng.com';
const output = process.env.REDIRECT_REPORT || 'docs/redirect-audit-report.json';
const config = typescriptLoader()('next.config.ts').default;
const rules = (await config.redirects()).filter(rule => !rule.source.includes(':') && !rule.has);
// Also exercise the wildcard rules using representative old URLs.
rules.push(
  { source: '/resources/tools/infrastructure-readiness', destination: '/book-consultation' },
  { source: '/blog', destination: '/resources/insights' },
  { source: '/case-studies', destination: '/resources/case-studies' },
  { source: '/our-work', destination: '/resources/our-work' },
);
const results = [];
const uniqueRules = [...new Map(rules.map(rule => [rule.source, rule])).values()];
while (uniqueRules.length) {
  await Promise.all(uniqueRules.splice(0, 4).map(async rule => {
    try {
      const query = '?utm_source=seo-audit';
      const response = await fetch(origin + rule.source + query, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      const destination = new URL(response.headers.get('location') || rule.source, origin);
      await response.body?.cancel();
      const target = await fetch(destination, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      await target.body?.cancel();
      results.push({ path: rule.source, status: response.status, destination: destination.pathname,
        expected: rule.destination, targetStatus: target.status, queryRetained: destination.search === query,
        passed: response.status === 308 && destination.pathname === rule.destination && target.status === 200 && destination.search === query });
    } catch (e) { results.push({ path: rule.source, passed: false, error: e.message }); }
  }));
}
const report = { origin, checkedAt: new Date().toISOString(), checked: results.length, errors: results.filter(r => !r.passed), results };
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checked: report.checked, errors: report.errors }, null, 2));
if (report.errors.length) process.exitCode = 1;
