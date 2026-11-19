# Industry overview refresh

Replaces the opening industry overview's two-column text layout with the approved interactive layout across all 17 industry pages. The existing hero, sector-specific heading, canonical URLs, metadata and subsequent sections remain in place.

- Desktop: centred heading and concise introduction, four horizontal priorities, one architectural illustration, a short selected explanation and one compact “Discuss Your Needs” link.
- Mobile: the illustration and explanation open within the selected priority row. Selecting another row smoothly brings its heading into view beneath the navigation.
- Each industry has its own optimised WebP illustration and four relevant priorities. Orange SVG connections highlight the selected topic without loading additional images. Illustrations are conceptual environments, not client project photography.
- Buttons expose expanded state and panel relationships. Desktop arrow keys, Home and End switch priorities. Reduced-motion preferences disable animations and smooth scrolling. All four explanations remain in the rendered markup.
- Images load lazily; the 17 source WebPs total approximately 2.8 MB, with only the relevant industry's image requested on its page. Each is below 205 KB before responsive image optimisation.

## Source and validation

The shared component is `components/pages/industry-overview-explorer.tsx`, its sector configuration is `data/industry-overview-explorer.ts`, and image metadata and highlight anchors are in `data/industry-overview-scenes.json`.

Generated assets are in `public/integrated-assets/images/industry-explorer/`. All generation used the built-in image tool. Exact prompts, output paths, dimensions and sizes are recorded in `docs/industry-overview-generation.json`.

Validation includes the production build, ESLint, 75 regression checks, all 17 industry pages on desktop, mobile inline expansion and scrolling, keyboard controls, overflow checks, and the site's SEO audit. Browser results are recorded in `docs/industry-overview-audit.json`.
