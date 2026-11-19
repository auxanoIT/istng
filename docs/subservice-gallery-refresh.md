# Sub-service galleries and resource-card imagery

The 40 existing sub-service galleries each contain four different image files. No two galleries repeat the same four-image selection. Assets may appear on different pages where the same equipment or activity is relevant; this does not claim 160 exclusive photographs. The residential solar page retains its approved layout without a gallery.

The audit found repeated images inside 15 galleries after the earlier generic-image refresh. Gallery selections are now explicit, per service, in `data/subservice-gallery-images.json`. All six content providers use this shared selection through `data/subservice-gallery.ts`, so rendered images and sitemap images stay consistent.

22 new photographic assets fill gaps including copper certification, fibre splicing and testing, storage systems, access equipment, fire alarm devices and gate operators. They are saved as responsive-friendly WebP sources in `public/integrated-assets/images/technical-gallery/`, 1200px wide. Their combined source-file size is 2,197,650 bytes. The built-in image-generation prompts, paths and individual sizes are in `technical-gallery-generation.json`. Real installation photographs remain intact.

Related Resources service cards use the destination page's hero media, with short editorial descriptions of no more than 20 words. Sanity resources use their cover image when supplied; resources without a cover retain a document placeholder. All images continue to use the shared image resolver, responsive Next Image optimisation and lazy loading.

Checks include hashes of every gallery image, distinct selections across all 40 galleries, correct hero references and concise descriptions, 74 regression tests, a production build and TypeScript, and an SEO crawl of all 92 sitemap pages without errors or warnings. `service-imagery-audit.json` checks rendered images on all 41 sub-service pages, including the 123 related-service hero cards. Desktop/mobile browser checks verify loaded images, layout and runtime behaviour.
