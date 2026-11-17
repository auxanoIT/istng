# Integrated Solutions Technology

Next.js website for solar energy, battery storage, data centre infrastructure, networking, hardware, security and technical support in Nigeria.

Preferred production origin is https://istng.com. Contact details are maintained in data/site-identity.ts. Content Studio uses Sanity project wfht8407 and the production dataset.

## Development

    npm ci
    npm run dev -- --port 3100

Use .env.example as the configuration reference. Keep real environment files and API credentials out of Git. Node.js 20.9 or newer is required.

## Checks

    npm run typecheck
    npm run lint
    npm run check:seo
    npm run build

The SEO check expects a running site at http://localhost:3100. Set QA_BASE_URL for another server. It checks every sitemap page, canonical URLs, rendered headings, descriptions, structured data, confirmed contact information, local sitemap images and internal links. Results are written to docs/seo-audit-report.json.

## Content

The website uses shared overview and subservice components. The current solution menu and industry directory define the public catalogue. Published Sanity records supply articles, guides, knowledge entries, planning tools, PDF downloads, case studies and gallery albums. The nine supplied case studies also have a bundled fallback.

- Studio at /sanity
- Human directory at /site-map
- Search sitemap at /sitemap.xml
- Robots rules at /robots.txt
- Public reference summary at /llms.txt

See docs/sanity-setup.md, docs/integrated-case-studies.md and docs/seo-launch-checklist.md.

## Deployment

Repository https://github.com/auxanoIT/istng

Configure the host with NEXT_PUBLIC_SITE_URL=https://istng.com. Connect the domain and its www variant, then deploy. The application redirects www requests to the preferred HTTPS origin. Preview deployments carry noindex metadata. Configure analytics and chat with this business's own account IDs.

The consultation form uses the verified Integrated Solutions HubSpot destination. Optional email fallback, Turnstile, preview access and signed revalidation webhooks require their environment settings. Never commit tokens or sender credentials.
