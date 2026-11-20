import assert from 'node:assert/strict';
import { test } from 'node:test';
import { typescriptLoader } from './helpers/load-typescript.mjs';

test('empty public hubs exclude indexing without blocking their outgoing links', () => {
  const { buildMetadata } = typescriptLoader()('lib/seo.ts');
  const meta = buildMetadata({ title: 'Solar insights', description: 'Solar planning articles.', path: '/resources/insights/solar-energy', noIndex: true });
  assert.equal(meta.robots.index, false);
  assert.equal(meta.robots.follow, true);
  assert.equal(meta.robots.googleBot.follow, true);
});

test('preview metadata remains noindex and public service metadata remains indexable', () => {
  const input = { title: 'Solar energy', description: 'Residential and business solar installations.', path: '/services/solar-energy' };
  const preview = typescriptLoader({ env: { VERCEL_ENV: 'preview' } })('lib/seo.ts').buildMetadata(input);
  assert.equal(preview.robots.index, false);
  const live = typescriptLoader()('lib/seo.ts').buildMetadata(input);
  assert.equal(live.robots.index, true);
  assert.equal(live.alternates.canonical, 'https://istng.com/services/solar-energy');
});

test('background video transforms preserve custom and signed delivery URLs', () => {
  const { backgroundVideoUrl } = typescriptLoader()('lib/background-media.ts');
  const src = 'https://res.cloudinary.com/dnqn2cs4e/video/upload/integrated_service_new_xd6vey.mp4';
  assert.match(backgroundVideoUrl(src, true), /w_720/);
  assert.match(backgroundVideoUrl(src, false), /w_1280/);
  for (const url of [src + '?signature=secret', src.replace('dnqn2cs4e', 'another-account'), 'https://example.com/video.mp4', backgroundVideoUrl(src, true)]) {
    assert.equal(backgroundVideoUrl(url, false), url);
  }
});
