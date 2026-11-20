# Connected-services About section

Implemented the approved “We Bring the Essential Pieces Together” mockup in `components/sections/about-company.tsx` with its CSS module. Replaced the long introduction and separate company-summary box with concise company copy, a customer-requirements hub, six service groups and one link to the services page.

Desktop places three services on each side of the hub. Native SVG connectors meet the six orange nodes on the hub; the circle and row geometry remain aligned at laptop and desktop widths. Below 1024px, the same content becomes a vertical list with an orange connecting line. The icons and diagram are code-native vectors; no raster image or new client interaction is required.

All copy is visible in server-rendered HTML. The existing About-page URL, metadata, hero, previous story section and subsequent content remain in place.

Validation: ESLint and production build passed. Browser checks at 1366, 1024, 768, 390 and 320px confirmed both layouts, six service headings, the single solutions link and no horizontal overflow or page errors. SEO audit passed 88 pages and 139 images with zero errors or warnings. Results are recorded in `docs/about-company-audit.json`.

The repeated About-page services section was retired during the vision-and-mission redesign. The hub button now leads to /services; current navigation verification is recorded in docs/about-vision-mission-audit.json.
