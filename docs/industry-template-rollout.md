# Shared industry template updates

Applied the approved corporate-office pattern to all 17 industry pages through the shared template.

- Centred section headings and introductions; the sticky applications column keeps its position with centred text inside it.
- Kept the desktop priority buttons and applications introduction sticky only within their sections, with the existing inline mobile accordion.
- Reduced each sector's solutions introduction and closing text to no more than two sentences, retaining sector-specific requirements.
- Removed the industry installation gallery section.
- Added three curated service cards per industry, with short descriptions, destination hero images and canonical `/services/` links. These selections replace CMS article/tool recommendations on industry pages.
- Extracted the booking form into `ConsultationForm`, reused on the booking page and every industry page. Both now use the same responsive field layout, current six service groups, styling, full-width submit button, validation and existing delivery path. Booking prefills and contact attribution remain supported.
- Removed case-study card eyebrows from the shared card component.
- Removed the interactive planning tool routes, workbench, checklist data, seed file, Sanity schema and editor menu. Tools are excluded from resource queries and the sitemap. Old `/resources/tools` URLs permanently redirect to booking; PDF downloads remain available.

Validation: production build and ESLint passed; 75 regression tests passed; GROQ relationship/PDF filtering and retired-tool exclusion passed. Browser checks covered all 17 pages on desktop and mobile, centred headings, gallery removal, three service cards, form columns and service options, and overflow. Booking prefills and case-study cards were checked separately. SEO audit: 88 pages, 140 images, zero errors and warnings.

Browser results are recorded in `docs/industry-template-audit.json`. No real enquiry was submitted during testing.
