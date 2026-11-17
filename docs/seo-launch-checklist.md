# Integrated Solutions Technology SEO and launch checks

## Website identity

Preferred origin https://istng.com

Business name Integrated Solutions Technology

Email ask@istng.com

Telephone +2348050274481

Office 26A Adeshina Street, Obafemi Awolowo Way, Ikeja, Lagos, Nigeria

The owner confirmed these business details on 17 November 2026 and delegated selection of the preferred domain. The non-www HTTPS origin is used consistently in canonicals, Open Graph URLs, structured data, robots and the sitemap. The www variant has a permanent host-based redirect.

## Implemented in the project

- The sitemap contains the current solution catalogue, all 17 industry pages, published project records, usable CMS resources and the supplied installation gallery. Duplicate paths and per-page images are deduplicated. Redirects, private routes, placeholder policies and superseded catalogue pages are excluded.
- Sitemap images come from the actual page content and service cards. Published article cover and body images are included. Local image files are checked for existence. Only real CMS modification timestamps are emitted.
- Important navigation appears in visible server-rendered footer links and the /site-map directory. The inherited hidden all-links navigation has been removed.
- Each indexed page has a self-referencing canonical, meaningful title and description, one H1, crawlable links and valid structured data. Image descriptions remain accessible. Image filenames and paths use current terminology.
- Organization, LocalBusiness and OfferCatalog data use the current business identity and catalogue. No review ratings, savings, accreditations or invented runtime guarantees are added.
- Empty article, guide, knowledge and download indexes stay accessible but carry noindex until publishable entries exist. They enter the sitemap automatically once content is available.
- Case-study FAQs and visible image-origin labels were removed at the owner's request. Technical image descriptions remain in alternative text.
- /llms.txt describes the current services, industries, project records and contact details. It is a convenience reference, not a special ranking mechanism.
- Inherited company identifiers, unused project records, old reference files, old video wordmarks and visible wording were removed or replaced. Two existing service illustrations were edited to remove retired uniform and cabinet branding.
- Real credentials are excluded. Configuration examples use current environment names. Analytics and chat require explicitly configured business accounts.

## Verification

Run npm run check:seo against a running server. The complete report is docs/seo-audit-report.json. Run typecheck, lint, form regressions and a production build before publication. For a separate build output during a running preview, set NEXT_BUILD_DIR to .next-seo-audit.

## Hosting and search account setup after deployment

1. Connect istng.com and www.istng.com to the deployment and enable valid TLS for both. Set NEXT_PUBLIC_SITE_URL to https://istng.com in production.
2. Verify the live host serves the expected application, redirects the www variant in one hop and returns the production sitemap and robots files.
3. Add this origin to Sanity CORS. Configure the signed publish webhook to https://istng.com/api/revalidate when the production secret is available.
4. Verify the domain property in Google Search Console and Bing Webmaster Tools, add the verification values if needed, and submit https://istng.com/sitemap.xml.
5. Inspect representative solar, IT, industry, article and case-study URLs. Validate supported structured data, then monitor indexing, Core Web Vitals and actual enquiries.

Domain connection, TLS, live deployment and search-account submission are external launch steps. A local technical audit does not establish that the public domain is deployed, indexed or ranked.

## Primary guidance

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/ai-features
