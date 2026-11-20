# About motion and values alignment

Added a small About-only client wrapper with one IntersectionObserver. Each below-the-fold section reveals once with a short opacity/12px translate animation; the hero and already-visible content stay stable. SVG connector paths draw using normalised path lengths. Company connectors, the purpose bridge, the values rail and delivery journey lines use CSS animation, with no scroll listener, animation library, perpetual loop or new media asset.

Content is server-rendered and visible without JavaScript. Reduced-motion preferences skip animation, including when changed during the session. The observer unobserves revealed sections and disconnects on cleanup. Print styles keep content visible. Decorative lines remain hidden from assistive technology.

The values list is capped at 60rem, centred below its heading, with a narrower desktop title column. Mobile retains readable, left-aligned stacked descriptions.

Reviewed the shared footer source and live footer: Integrated Solutions Technology branding, ask@istng.com and 08050274481 are already present, with no Ideal Solutions wording found. No unnecessary footer changes were made.

Browser coverage: 1440, 1366, 1024, 768, 390 and 320px; section reveals and completion; reduced motion; JavaScript disabled; centred values; no horizontal overflow or page errors. Final production build and checks are required before publication.

Final validation passed: production build, ESLint, six responsive widths, completed one-time animations, reduced-motion and no-JavaScript checks, and SEO audit (88 pages, 138 images, zero errors/warnings).
