# Integrated Solutions Technology Vercel deployment

Deploy this Next.js project using `npm ci` and `npm run build`. Leave the output
directory at the framework default. Use a Node version compatible with package.json.

Set `NEXT_PUBLIC_SITE_URL` to the canonical Integrated Solutions Technology deployment origin.
Use Sanity project `wfht8407`, dataset `production`. See
[Sanity setup](docs/sanity-setup.md) for CORS and the signed publish webhook.

Configure only verified Integrated Solutions Technology forms, appointment URLs and email senders.
See [consultation delivery](docs/integrated-consultation-hubspot.md) for the integration
and external email-branding checks. Private tokens must not use NEXT_PUBLIC.
Local environment changes are not automatically copied to Vercel; redeploy after
changing deployment variables.

Run `npm run typecheck` and `npm run build` before deployment. Afterwards, verify
navigation, forms, customer emails, `/sanity`, `/robots.txt`, `/sitemap.xml` and
canonicals on https://istng.com. Keep the www host redirected there.
See [SEO launch checks](docs/seo-launch-checklist.md) for remaining owner checks.

