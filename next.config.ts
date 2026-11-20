import type { NextConfig } from "next";
import { canonicalServicePath, serviceRouteAliases } from "./lib/service-routes";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  allowedDevOrigins: ["127.0.0.1"],
  trailingSlash: false,
  async redirects() {
    const redirects = [
      { source: "/resources/tools/:path*", destination: "/book-consultation", permanent: true },
      ...Object.entries(serviceRouteAliases).map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/:path*", has: [{ type: "host" as const, value: "www.istng.com" }], destination: "https://istng.com/:path*", permanent: true },
      { source: "/blog", destination: "/resources/insights", permanent: true },
      { source: "/case-studies", destination: "/resources/case-studies", permanent: true },
      { source: "/our-work", destination: "/resources/our-work", permanent: true },
      { source: "/blog/:path*", destination: "/resources/insights/:path*", permanent: true },
      { source: "/case-studies/:path*", destination: "/resources/case-studies/:path*", permanent: true },
      { source: "/our-work/:path*", destination: "/resources/our-work/:path*", permanent: true },
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
    return redirects.map(rule => ({ ...rule, destination: canonicalServicePath(rule.destination) }));
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
