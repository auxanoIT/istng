import type { Metadata } from "next";

import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./globals.css";

import { CookieConsentManager } from "@/components/layout/cookie-consent-manager";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getFooterColumns,
  getIndustries,
  getNavigation,
  getResourceGroups,
  getSiteSettings,
} from "@/lib/content";
import type { SiteSettings } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";
import { solutionPillars } from "@/data/enterprise-solutions";
import { siteIdentity } from "@/data/site-identity";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default:
      "Integrated Solutions Technology | Solar Energy & IT Solutions Nigeria",
    template: "%s | Integrated Solutions Technology",
  },
  description:
    siteIdentity.description,
  applicationName: "Integrated Solutions Technology",
  icons: {
    icon: [{ url: "/brand/integrated-favicon.png", sizes: "48x48", type: "image/png" }],
    shortcut: "/brand/integrated-favicon.png",
    apple: [{ url: "/apple-touch-icon.png?v=integrated", sizes: "180x180", type: "image/png" }],
  },
  authors: [{ name: "Integrated Solutions Technology" }],
  creator: "Integrated Solutions Technology",
  publisher: "Integrated Solutions Technology",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Integrated Solutions Technology | Solar Energy & IT Solutions Nigeria",
    description:
      siteIdentity.description,
    url: absoluteUrl("/"),
    siteName: "Integrated Solutions Technology",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Integrated Solutions Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Integrated Solutions Technology | Solar Energy & IT Solutions Nigeria",
    description:
      siteIdentity.description,
    images: [{ url: absoluteUrl("/opengraph-image"), alt: "Integrated Solutions Technology" }],
  },
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: true,
    googleBot: {
      index: process.env.VERCEL_ENV !== "preview",
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

function buildOfferCatalog() {
  return {
    "@type": "OfferCatalog",
    name: "Solar energy and technology solutions",
    itemListElement: solutionPillars.map(pillar => ({
      "@type": "OfferCatalog",
      name: pillar.label,
      url: absoluteUrl(pillar.href),
      itemListElement: pillar.items.map(service => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: absoluteUrl(service.href),
          areaServed: { "@type": "Country", name: "Nigeria" },
        },
      })),
    })),
  };
}

function buildSiteJsonLd(settings: SiteSettings) {
  const organizationId = `${absoluteUrl("/")}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: settings.name,
        alternateName: settings.shortName,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/brand/integrated_solution_tech_full_logo.png"),
        image: absoluteUrl("/opengraph-image"),
        description: settings.description,
        email: settings.email,
        telephone: siteIdentity.telephone,
        knowsAbout: [
          "Solar energy systems",
          "Battery storage",
          "Solar energy systems",
          "Battery storage",
          "Managed IT support",
          "CCTV installation",
          "Access control installation",
          "Fire alarm system installation",
          "Fire safety systems",
          "Structured LAN cabling",
          "Network infrastructure",
          "Access control systems",
          "ELV systems",
          "Server and storage deployment",
          "Software licensing",
          "Firewall licenses",
          "IT audit and compliance",
          "Business continuity",
        ],
        hasOfferCatalog: buildOfferCatalog(),
      },
      {
        "@type": "LocalBusiness",
        "@id": `${absoluteUrl("/")}#local-business`,
        name: settings.name,
        url: absoluteUrl("/"),
        image: absoluteUrl("/opengraph-image"),
        logo: absoluteUrl("/brand/integrated_solution_tech_full_logo.png"),
        description: settings.description,
        email: settings.email,
        telephone: siteIdentity.telephone,
        parentOrganization: {
          "@id": organizationId,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: siteIdentity.streetAddress,
          addressLocality: "Ikeja",
          addressRegion: "Lagos",
          addressCountry: "NG",
        },
        areaServed: [
          {
            "@type": "Country",
            name: "Nigeria",
          },
          {
            "@type": "City",
            name: "Lagos",
          },
          {
            "@type": "City",
            name: "Abuja",
          },
          {
            "@type": "City",
            name: "Port Harcourt",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: settings.shortName,
        url: absoluteUrl("/"),
        publisher: {
          "@id": organizationId,
        },
        inLanguage: "en-NG",
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await getNavigation();
  const needsSolutions = navigation.some((item) => item.kind === "solutions");
  const needsIndustries = navigation.some((item) => item.kind === "industries");
  const needsResources = navigation.some((item) => item.kind === "resources");

  const [
    industries,
    resourceGroups,
    footerColumns,
    siteSettings,
  ] = await Promise.all([
    needsIndustries ? getIndustries() : Promise.resolve([]),
    needsResources ? getResourceGroups() : Promise.resolve([]),
    getFooterColumns(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <SiteShell studio={children}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader
            navigation={navigation}
            solutionCategories={needsSolutions ? solutionPillars : []}
            industries={industries}
            resourceGroups={resourceGroups}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter columns={footerColumns} settings={siteSettings} />
        </div>
        <JsonLd data={buildSiteJsonLd(siteSettings)} />
        <CookieConsentManager />
        </SiteShell>
      </body>
    </html>
  );
}
