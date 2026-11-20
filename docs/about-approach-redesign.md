# About delivery journey and typography

Implemented the approved five-step open journey on the About page. Desktop uses five connected columns; tablet and phone use a vertical timeline. The section has concise content, outline SVG icons and no extra booking CTA. It retains the existing about-approach anchor and a semantic ordered list.

Reduced headings in the previously redesigned story, company, purpose, vision/mission and values sections. Main section headings now top out at 40px (vision/mission at 36px), with a 26px phone size. Supporting headings and the larger mission paragraphs were reduced proportionately. Hero, global typography and other pages are unaffected.

The design uses server-rendered text and vector icons without an added image asset or client-side script. Approved visual reference: exec-d41021da-1962-4903-9792-6c5e39a60a6f.png in the generated-images preview library.

Browser verification covers 1440, 1366, 1024, 768, 390 and 320px, the horizontal/vertical layout switch, all five steps, heading sizes, absence of horizontal overflow and page errors. Production build and ESLint are required before publishing.

Production validation passed: build, ESLint, six responsive widths and SEO audit (88 pages, 140 images, zero errors or warnings).
