# About industry links redesign

Replaced the closed industry dropdown with 17 direct, server-rendered industry links. The repeated needs/requirements paragraphs are replaced by one line: Explore the sectors we serve.

The layout follows the approved mockup: three desktop columns, two mobile/tablet columns, subtle warm tile surfaces, navy outline icons, northeast link arrows and navy/orange hover and keyboard-focus states. Tile labels are concise; accessible names retain the full names from the existing industry navigation. Links use that shared navigation source so the destination slugs remain consistent.

No image asset, extra CTA or client-side JavaScript is added. Reduced-motion preferences disable the short colour transition. The section heading and about-industries anchor are preserved.

Verification covers 1440, 1366, 1024, 768, 390 and 320px, all 17 destination pages, hover/focus styling, touch-target size, text wrapping and horizontal overflow. Final production build, ESLint and browser checks are required before publication.

Final validation passed: production build, ESLint, responsive browser checks and SEO audit (88 pages, 138 images, zero errors or warnings).

Follow-up: Show the first six tiles initially. A native View more industries disclosure reveals the other eleven and changes to Show fewer industries. All links remain server-rendered, and the control works without client JavaScript. Verified expansion, collapse, Enter/Space keyboard use and no overflow at 1366, 768, 390 and 320px.
