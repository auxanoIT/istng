# Integrated Solutions marketing image refresh

Replaced 55 inherited generic marketing image references and two derived legacy illustrations. The 57 explicit replacements resolve to 37 distinct Integrated assets: 19 newly generated photographs and 18 existing original Integrated assets.

The new WebP assets are saved in `public/integrated-assets/images/brand-refresh/`. Together they occupy 3,217,168 bytes, with a maximum width of 1440px. Next Image continues to provide responsive sizing, optimisation and lazy loading. Exact generation prompts, output paths, dimensions and sizes are recorded in `brand-image-generation.json`; generation used the built-in image tool.

The audit preserves the 22 shared assets that are actual team portraits, project gallery photographs or partner logos. No genuine project photographs were regenerated. The SHA-256 audit in `image-refresh-audit.json` confirms that none of the replacement targets matches an image in the original Ideal public image collection.

`data/image-replacements.json` is an explicit allowlist. The shared SiteImage component applies these replacements and descriptive alt text; external Sanity media and unlisted photographs pass through. SEO metadata, structured-data absolute URLs and sitemap images resolve through the same mapping. Old asset files remain available for backwards compatibility, but current rendered images and SEO outputs use the replacement paths.

Validation: production build and TypeScript passed; ESLint passed; 69 regression tests passed. The SEO audit covered 92 pages, 101 sitemap images and 98 internal paths with no errors or warnings. A separate 92-page rendered-image crawl found no replaced legacy URLs in image elements or social metadata. Desktop (1366px) and mobile (390px) checks passed for the data-centre, education and hospitality heroes, including loaded images, no horizontal overflow and no browser runtime errors. Screenshots were inspected for composition and readability.

Original imagery and descriptive metadata improve the site's relevance and identity; they do not guarantee search rankings.
