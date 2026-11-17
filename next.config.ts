import type { NextConfig } from "next";
import { solarServicePath, solarServiceSlugs } from "./data/solar-routes";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  allowedDevOrigins: ["127.0.0.1"],
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.istng.com" }], destination: "https://istng.com/:path*", permanent: true },
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/blog/:path*", destination: "/resources/insights/:path*", permanent: true },
      { source: "/case-studies/:path*", destination: "/resources/case-studies/:path*", permanent: true },
      { source: "/our-work/:path*", destination: "/resources/our-work/:path*", permanent: true },
      ...solarServiceSlugs.map((slug) => ({
        source: `/solutions/${slug}`,
        destination: solarServicePath(slug),
        permanent: true,
      })),
      {
        source: "/data-cabling",
        destination: "/services/structured-lan-cabling",
        permanent: true,
      },
      {
        source: "/elementor-53",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/it-audit-services",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/it-services",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/services/sales-of-it-hardware",
        permanent: true,
      },
      {
        source: "/governance-risk-compliance",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/it-assessment",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/business-continuity-disaster-recovery",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/data-protection-services",
        destination: "/services/it-consultancy-audit-services",
        permanent: true,
      },
      {
        source: "/network-monitoring",
        destination: "/services/it-managed-services-staff-outsourcing",
        permanent: true,
      },
      {
        source: "/it-migration",
        destination: "/services/it-project-management",
        permanent: true,
      },
      {
        source: "/2022/02/14/elementor-7",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/product/:path*",
        destination: "/services/desktop-laptop-sales",
        permanent: true,
      },
      {
        source: "/product-category/:path*",
        destination: "/services/desktop-laptop-sales",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/resources/insights",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    qualities: [56, 70, 75, 82, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  transpilePackages: ["next-sanity", "sanity"],
};

export default nextConfig;
