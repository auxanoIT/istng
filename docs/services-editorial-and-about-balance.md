# Services editorial layout and About balance

Implemented the approved alternating-row services directory on /services. All six service overview links come from the existing shared catalogue; index-specific descriptions and audited local imagery live in data/service-directory.ts. Solar is first. Desktop/tablet use equal grid columns with alternating image placement; phone layouts keep image then content in reading order. One concise consultation invitation follows the service rows.

The page is server-rendered with no new client JavaScript or media assets. Only the first image is preloaded; later images remain lazy-loaded with fixed aspect ratios. Accessible link names identify each service. /services remains the canonical URL and the six-item ItemList and sitemap use the actual page links/images. The legacy /solutions route continues to use the same page/redirect configuration.

On About, removed the repeated planning/installation/support paragraph from the navy story band and its unused data. The statement and existing team image occupy equal columns from 768px upwards and stack on mobile. Image sizing and typography remain responsive. The other primary About sections retain centred containers and balanced outer margins.

Verification covers 1440, 1366, 1024, 768, 390 and 320px: alternating rows, equal columns, mobile reading order, six working overview links, image loading, canonical metadata, ItemList data, About band alignment, removed paragraph and no horizontal overflow/page errors. Final build, ESLint and production checks are required before publishing.

Final validation passed: production build, ESLint, responsive browser checks and SEO audit (88 pages, 139 images, zero errors/warnings).
