# About-purpose bridge design

Implemented the approved navy bridge concept in `components/sections/about-purpose.tsx` and its CSS module. The illustration connects technology's possibilities with what people can achieve. Desktop uses a horizontal engineering-style bridge; smaller screens use two stacked statements and a vertical orange connection.

The “Practical technology. Meaningful progress.” heading is omitted as requested. The remaining closing sentence is centred below a subtle divider, without an empty heading column. Existing section IDs and About metadata are retained.

The bridge is native SVG with visible server-rendered text, decorative graphics hidden from assistive technology, and no additional images, animation or client-side interaction.

Validation: production build and ESLint passed. Browser checks at 1366, 1024, 768, 390 and 320px verified both layouts, heading structure, removal of the requested text and no horizontal overflow or page errors. The previous About story and company sections remain present. SEO audit passed 88 pages and 139 images with zero errors or warnings. Results are recorded in `docs/about-purpose-audit.json`.
