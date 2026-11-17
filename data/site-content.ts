import { operationalAdvantageSection } from "@/data/operational-advantage";
import { homeProjectCta } from "@/data/home-project-cta";
import { industryNavigation } from "@/data/industry-navigation";
import { siteIdentity } from "@/data/site-identity";
import { solutionPillars } from "@/data/enterprise-solutions";
import type {
  BlogPost,
  EstimatorConfig,
  FAQItem,
  FooterColumn,
  MarketingPage,
  NavItem,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

export { services, solutionCategories } from "@/data/solution-catalog";
export { industryProfiles } from "@/data/industry-catalog";
export { resourceGroups, resourceLinks } from "@/data/resource-catalog";

export const siteSettings: SiteSettings = {
  name: siteIdentity.name,
  shortName: siteIdentity.shortName,
  description: siteIdentity.description,
  phone: siteIdentity.phone,
  email: siteIdentity.email,
  address: siteIdentity.address,
  city: "Lagos",
  country: "Nigeria",
  whatsappSales: process.env.NEXT_PUBLIC_SALES_WHATSAPP ?? siteIdentity.telephone,
  whatsappSupport: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? siteIdentity.telephone,
  hubspotMeetingUrl:
    process.env.INTEGRATED_HUBSPOT_MEETINGS_URL ?? "",
};

export const navigation: NavItem[] = [
  { label: "Solutions", href: "/solutions", kind: "solutions" },
  { label: "Industries", href: "/industries", kind: "industries" },
  { label: "Case Studies", href: "/resources/case-studies", kind: "link" },
  { label: "Resources", href: "/resources", kind: "resources" },
  { label: "About", href: "/about", kind: "link" },
];

export { integratedCaseStudies as caseStudies } from "@/data/integrated-case-studies";

// Editorial content is published through the Integrated Solutions Technology Sanity project.
export const blogPosts: BlogPost[] = [];

// Add testimonials only after the business has approved their attribution.
export const testimonials: Testimonial[] = [];

export const faqs: FAQItem[] = [
  {
    id: "services",
    question: "What does Integrated Solutions Technology do?",
    answer: "We design and install solar and battery systems for homes, businesses and institutions. We also deliver data centre and server room infrastructure, networking and structured cabling, servers, storage and hardware, CCTV and surveillance, and ongoing IT support.",
  },
  {
    id: "solar-sizing",
    question: "How do I know what size solar system I need?",
    answer: "We start by looking at which appliances or equipment you use, when they run and how long they need backup. We also check the property for panel space and shading. That assessment helps us match the panels, inverter and battery storage to your needs and budget.",
  },
  {
    id: "solar-loads",
    question: "Can solar power my whole home or run air conditioners?",
    answer: "Yes, if the system is sized for those loads. Air conditioners, pumps and other high-demand equipment can increase the inverter and battery capacity you need. We can plan for essential loads first or design for broader coverage, depending on your priorities.",
  },
  {
    id: "solar-backup",
    question: "Will solar work at night or during a power outage?",
    answer: "Panels generate electricity during daylight. After dark, a charged battery can supply the circuits connected to the backup system. During an outage, a system designed for backup can keep selected equipment running. How long it lasts depends on battery charge, usable capacity and what you run.",
  },
  {
    id: "solar-hybrid",
    question: "Can I keep using my generator or grid supply?",
    answer: "Yes. A compatible hybrid system can combine solar panels, battery storage and grid power, and can also integrate a generator where the equipment and site allow. We review your existing setup before recommending how those power sources should work together.",
  },
  {
    id: "solar-weather",
    question: "Will solar work during the rainy season and Harmattan?",
    answer: "Panels can still generate power on cloudy or rainy days, but usually produce less than in bright sunshine. Harmattan dust can also reduce output. We take local conditions into account during design and explain what routine maintenance your installation needs.",
  },
  {
    id: "solar-cost",
    question: "How much does solar installation cost in Nigeria?",
    answer: "Cost depends on the equipment you want to power, how long you need backup, the size of the system and the work needed at your site. A useful quote should identify the equipment, installation scope, warranty terms and any exclusions so you can compare proposals on the same basis.",
  },
  {
    id: "solar-installation",
    question: "How long does solar installation take, and what happens at handover?",
    answer: "The timeline depends on system size, site readiness and equipment availability. We confirm the schedule after assessment, then install and test the system before handover. We explain how to operate it, which circuits have backup and what maintenance is needed.",
  },
  {
    id: "solar-expansion",
    question: "Can I add more panels or batteries later?",
    answer: "Often, yes. Expansion depends on inverter compatibility, battery specifications, available space and the original design. Tell us about planned appliances, new equipment or longer backup needs so we can account for them from the start.",
  },
  {
    id: "it-infrastructure",
    question: "Can you upgrade an existing server room or office network?",
    answer: "Yes. We can review your existing equipment, racks and cabling, then plan the upgrade with your team. Depending on the project, the work can include structured copper and fibre cabling, rack and equipment installation, network configuration, testing and handover. We agree any work that may affect live services before it starts.",
  },
  {
    id: "support",
    question: "Do you provide maintenance and technical support after installation?",
    answer: "Yes. We can agree a support plan for solar systems or IT infrastructure based on your equipment and operating needs. Support can include planned maintenance, fault diagnosis and advice on upgrades. Coverage and response arrangements are confirmed as part of the scope.",
  },
  {
    id: "consultation",
    question: "How do I get started or request a quote?",
    answer: "Use the Book Consultation page and share your location, what you want to power or connect, and any equipment you already have. For solar, an appliance list or recent electricity bill is useful. For IT projects, share your goals, site details and preferred schedule so we can advise on the next step.",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      ...solutionPillars.map(pillar => ({ label: pillar.label, href: pillar.href })),
      { label: "Explore All Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Industries",
    links: industryNavigation.flatMap(group =>
      group.entries.map(([slug, label]) => ({ label, href: `/industries/${slug}` })),
    ),
  },
  {
    title: "Explore",
    links: [
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "Our Work / Gallery", href: "/resources/our-work" },
      { label: "Insights & Articles", href: "/resources/insights" },
      { label: "All Resources", href: "/resources" },
      { label: "Careers", href: "/careers" },
      { label: "Website Directory", href: "/site-map" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: siteIdentity.email, href: `mailto:${siteIdentity.email}` },
      { label: siteIdentity.phone, href: `tel:${siteIdentity.telephone}` },
      { label: "Book Consultation", href: "/book-consultation" },
    ],
  },
];

export const homeTrustCopy = {
  title: "Trusted by 367+ Organisations.",
  description: "Energy and technology solutions tailored to your business.",
};

export const marketingPages: MarketingPage[] = [
  {
    slug: "home",
    title:
      "Infrastructure, Networking, and Managed IT Solutions for Critical Teams",
    description:
      "Integrated Solutions Technology helps businesses design, deploy, and support infrastructure, networking, hardware, software, and managed operations with enterprise-grade clarity.",
    sections: [
      {
        _type: "hero",
        eyebrow: "Enterprise IT And Infrastructure",
        title: "One command view for IT, CCTV, and network infrastructure.",
        description:
          "Design, deployment, and support for business-critical environments.",
        mode: "videoCarousel",
        tags: [
          "Infrastructure",
          "Networking",
          "Hardware Systems",
          "Software & Licenses",
        ],
        metrics: [
          { value: "15+", label: "Years in Business" },
          { value: "500+", label: "Projects delivered" },
          { value: "200+", label: "Clients served" },
          { value: "24/7", label: "Support available" },
        ],
        primaryCta: {
          label: "Book Consultation",
          href: "/book-consultation",
          variant: "primary",
        },
        secondaryCta: {
          label: "Book Consultation",
          href: "/book-consultation",
          variant: "secondary",
        },
        slides: [
          {
            id: "hero-slide-1",
            videoPublicId: "placeholder",
            videoUrl: "",
            headline:
              "One command view for IT, CCTV, and network infrastructure.",
            description:
              "Integrated Solutions Technology connects IT, CCTV, networking, and support into one easier operating view.",
            primaryCta: {
              label: "Book Consultation",
              href: "/book-consultation",
              variant: "primary",
            },
          },
          {
            id: "hero-slide-2",
            videoPublicId: "placeholder",
            videoUrl: "",
            headline: "Physical security installed with network discipline.",
            description:
              "CCTV, access, cabling, storage, and handover are planned together for reliable coverage from day one.",
            primaryCta: {
              label: "Explore Security Solutions",
              href: "/services/door-access-control",
              variant: "primary",
            },
          },
          {
            id: "hero-slide-3",
            videoPublicId: "placeholder",
            videoUrl: "",
            headline:
              "Networks built for the devices and teams that rely on them.",
            description:
              "Structured cabling, switching, wireless, firewalls, and documentation built for easier daily management.",
            primaryCta: {
              label: "Explore Network Infrastructure",
              href: "/services#networking",
              variant: "primary",
            },
          },
          {
            id: "hero-slide-4",
            videoPublicId: "placeholder",
            videoUrl: "",
            headline: "Managed IT support with clearer ownership.",
            description:
              "Users, devices, monitoring, and escalation stay under one support model leadership can track.",
            primaryCta: {
              label: "Explore Managed IT",
              href: "/services/it-managed-services-staff-outsourcing",
              variant: "primary",
            },
          },
        ],
      },
      {
        _type: "serviceShowcase",
        eyebrow: "Our Services",
        title: "Everything your business needs under one roof.",
        description:
          "Explore the core service areas Integrated Solutions Technology delivers for modern business environments.",
        items: [
          {
            id: "it-infrastructure",
            title: "IT Infrastructure",
            description:
              "Reliable IT infrastructure built for performance, scalability, and long-term business growth.",
            imageSrc: "/image/IT%20Infrastructure.png",
            imageAlt: "IT infrastructure systems for reliable business operations",
            ctaLabel: "Learn more",
            ctaHref: "/services#infrastructure",
          },
          {
            id: "fire-alarm-safety",
            title: "Fire Alarm & Safety",
            description:
              "Fire alarm systems designed, installed, tested, maintained, integrated, and aligned with safety compliance requirements.",
            imageSrc: "/image/service-details/fire-alarm-hero-call-point.webp",
            imageAlt: "Red manual fire alarm call point mounted on a clean commercial wall",
            ctaLabel: "Learn more",
            ctaHref: "/services#fire-alarm-safety",
          },
          {
            id: "networking",
            title: "Networking",
            description:
              "Fast, secure networks that keep your business connected and operating without interruption.",
            imageSrc: "/image/networking.png",
            imageAlt: "Business networking infrastructure connecting teams and devices",
            ctaLabel: "Learn more",
            ctaHref: "/services#networking",
          },
          {
            id: "computers-and-servers",
            title: "Computers & Servers",
            description:
              "Business-grade computers and servers for speed, reliability, and storage.",
            imageSrc: "/image/computer_and_server.png",
            imageAlt: "Business computers and servers prepared for workplace use",
            ctaLabel: "Learn more",
            ctaHref: "/services#hardware-systems",
          },
          {
            id: "software-and-licenses",
            title: "Software & Licenses",
            description:
              "Licensed software that keeps your business secure, compliant, and productive.",
            imageSrc: "/image/software_and_licenses.jpg",
            imageAlt: "Licensed business software and security applications",
            ctaLabel: "Learn more",
            ctaHref: "/services#software-licenses",
          },
          {
            id: "it-management",
            title: "IT Management",
            description:
              "End-to-end IT support to keep your systems stable, secure, and optimized daily.",
            imageSrc: "/image/It_management.jpg",
            imageAlt: "Managed IT support environment with operational monitoring",
            ctaLabel: "Learn more",
            ctaHref: "/services/it-managed-services-staff-outsourcing",
          },
        ],
      },
      {
        _type: "networkMapSection",
        eyebrow: "",
        title: "Ready to get it right the first time?",
        description:
          "Integrated Solutions Technology delivers specialized and cost-effective ICT services that empower businesses to streamline operations, secure assets, and scale efficiently.",
        imageSrc: "/image/left.png",
        imageAlt: "Integrated Solutions Technology left-side section visual",
        bullets: [],
        nodes: [
          {
            label: "Core Network",
            detail: "Switching, design, and monitoring",
            x: 50,
            y: 18,
          },
          {
            label: "CCTV",
            detail: "Coverage, storage, retrieval",
            x: 80,
            y: 40,
          },
          {
            label: "Access",
            detail: "Entry, permissions, audit",
            x: 72,
            y: 72,
          },
          {
            label: "Support",
            detail: "Users, devices, continuity",
            x: 28,
            y: 72,
          },
          {
            label: "Hardware",
            detail: "Servers, printers, endpoints",
            x: 18,
            y: 40,
          },
        ],
      },
      {
        _type: "trustBanner",
        ...homeTrustCopy,
        cta: {
          label: "Explore our services",
          href: "/solutions",
          variant: "primary",
        },
      },
      operationalAdvantageSection,
      {
        _type: "interactiveServices",
        eyebrow: "Service Ecosystem",
        title: "Full-Service IT Solutions Built Right. Every Time.",
        description:
          "Select any point in the scene to explore how infrastructure, networking, hardware, software, and managed support connect in a live business setup.",
        imageSrc: "/image/servces.png",
        imageAlt:
          "Interactive Integrated Solutions Technology services environment showing integrated infrastructure, networking, hardware, software, and managed support touchpoints.",
        promptLabel: "Explore the stack",
        items: [
          {
            id: "software-hotspot",
            label: "Software & Licenses",
            title: "Licensed and configured software for the real environment.",
            description:
              "Integrated Solutions Technology handles licensing, activation, security configuration, and cloud or business application setup so the software layer is compliant, usable, and supportable after deployment instead of becoming a separate cleanup project.",
            ctaLabel: "Explore Software",
            ctaHref: "/services#software-licenses",
            x: 24.1,
            y: 14.0,
            size: 66,
            glowFrom: "rgba(191,219,254,0.30)",
            glowTo: "rgba(59,130,246,0.10)",
            panelPlacement: "bottom",
            targetSize: 127,
            targetOffsetY: 72,
          },
          {
            id: "security-hotspot",
            label: "Physical Security & Access",
            title:
              "Security and access systems deployed as one controlled layer.",
            description:
              "Integrated Solutions Technology delivers CCTV, access control, structured cabling, automation, and site readiness as one coordinated infrastructure layer so environments open with cleaner coverage, safer entry, and fewer technical gaps.",
            ctaLabel: "Explore Infrastructure",
            ctaHref: "/services#infrastructure",
            x: 50,
            y: 8,
            size: 66,
            glowFrom: "rgba(34,211,238,0.38)",
            glowTo: "rgba(59,130,246,0.12)",
            panelPlacement: "bottom",
            targetSize: 127,
            targetOffsetY: 72,
          },
          {
            id: "infrastructure-hotspot",
            label: "Infrastructure",
            title:
              "Infrastructure planned, installed, and handed over properly.",
            description:
              "Structured cabling, site readiness, data-centre support, and operational installation standards are coordinated together so the physical environment stays stable, supportable, and ready for growth.",
            ctaLabel: "Explore Infrastructure",
            ctaHref: "/services#infrastructure",
            x: 76,
            y: 14.5,
            size: 10,
            glowFrom: "rgba(125,211,252,0.34)",
            glowTo: "rgba(96,165,250,0.14)",
            panelPlacement: "bottom",
            targetSize: 127,
            targetOffsetY: 72,
          },
          {
            id: "it-management-hotspot",
            label: "IT Management",
            title:
              "Managed IT support with clearer ownership and follow-through.",
            description:
              "Integrated Solutions Technology supports users, devices, escalations, and continuity with a structured operating model that keeps the environment from slipping after rollout or daily support pressure increases.",
            ctaLabel: "Explore Managed Services",
            ctaHref: "/services#managed-advisory",
            x: 13.8,
            y: 41.8,
            size: 66,
            glowFrom: "rgba(165,243,252,0.34)",
            glowTo: "rgba(147,197,253,0.12)",
            panelPlacement: "right",
            targetSize: 128,
            targetOffsetY: 72,
          },
          {
            id: "networking-hotspot",
            label: "Networking",
            title: "Networks designed, configured, and documented properly.",
            description:
              "From survey-led topology planning to active configuration and final diagrams, Integrated Solutions Technology builds networks that support CCTV, users, cloud apps, and business communications without leaving the client to coordinate separate vendors.",
            ctaLabel: "Explore Networking",
            ctaHref: "/services#networking",
            x: 14.8,
            y: 68.9,
            size: 66,
            glowFrom: "rgba(125,211,252,0.34)",
            glowTo: "rgba(96,165,250,0.14)",
            panelPlacement: "right",
            targetSize: 127,
            targetOffsetY: 72,
          },
          {
            id: "hardware-support-hotspot",
            label: "Hardware & Support",
            title: "Hardware delivery tied to support readiness from day one.",
            description:
              "Original endpoints, peripherals, support setup, and deployment preparation are handled together so the business receives devices that are easier to operate, maintain, and replace without friction.",
            ctaLabel: "Explore Hardware",
            ctaHref: "/services#hardware-systems",
            x: 83.9,
            y: 41.9,
            size: 66,
            glowFrom: "rgba(165,243,252,0.34)",
            glowTo: "rgba(147,197,253,0.12)",
            panelPlacement: "left",
            targetSize: 125,
            targetOffsetY: 72,
          },
          {
            id: "hardware-hotspot",
            label: "Computers & Servers",
            title: "Original hardware supplied and prepared for immediate use.",
            description:
              "Computers, servers, storage, printers, and supporting endpoints are sourced, deployed, and configured against the environment they will serve, making replacement, support, and future growth more predictable.",
            ctaLabel: "Explore Hardware",
            ctaHref: "/services#hardware-systems",
            x: 83.5,
            y: 69.3,
            size: 66,
            glowFrom: "rgba(103,232,249,0.32)",
            glowTo: "rgba(96,165,250,0.12)",
            panelPlacement: "left",
            targetSize: 128,
            targetOffsetY: 72,
          },
          {
            id: "data-centre-hotspot",
            label: "Data Centre",
            title: "Data-centre readiness built into the wider environment.",
            description:
              "Server-room power, racks, cooling, monitoring, and supporting infrastructure are planned as part of the broader deployment, not left as an isolated technical afterthought.",
            ctaLabel: "Explore Data Centre Services",
            ctaHref: "/services#infrastructure",
            x: 50,
            y: 90,
            size: 54,
            glowFrom: "rgba(56,189,248,0.30)",
            glowTo: "rgba(59,130,246,0.10)",
            panelPlacement: "bottom",
            targetSize: 122,
            targetOffsetY: 72,
          },
        ],
      },
      homeProjectCta,
      {
        _type: "faqBlock",
        eyebrow: "FAQs",
        title: "Working with Integrated Solutions Technology: Your Questions, Answered",
        description:
          "Answers about solar, battery backup, installation and ongoing support for your energy and IT infrastructure.",
        ids: faqs.map(({ id }) => id),
      },
    ],
  },
  {
    slug: "about",
    title: "About Integrated Solutions Technology",
    description:
      "Integrated Solutions Technology combines infrastructure delivery, networking, hardware systems, software licensing, and managed advisory support for organizations that need serious operational execution.",
    sections: [
      {
        _type: "richContent",
        eyebrow: "About Integrated Solutions Technology",
        title:
          "A technical delivery partner for organizations that need more than generic IT support.",
        content: [
          "Integrated Solutions Technology works across infrastructure, networking, hardware systems, software licensing, and managed advisory support. The company is built around doing technical work properly from the beginning rather than treating quality as a later correction step.",
          "That operating view matters because surveillance depends on the network, devices depend on clean setup, licensing depends on compliance discipline, and support quality shapes what happens after deployment.",
          "Clients get a serious technical partner with clear scoping, structured execution, and commercially credible handover.",
        ],
      },
    ],
  },
];

export const estimatorConfig: EstimatorConfig = {
  companySizes: [
    {
      id: "small",
      label: "10-25 staff",
      multiplierLow: 1,
      multiplierHigh: 1.1,
    },
    {
      id: "mid",
      label: "26-75 staff",
      multiplierLow: 1.2,
      multiplierHigh: 1.35,
    },
    {
      id: "large",
      label: "76-150 staff",
      multiplierLow: 1.45,
      multiplierHigh: 1.65,
    },
    {
      id: "enterprise",
      label: "150+ staff",
      multiplierLow: 1.7,
      multiplierHigh: 2,
    },
  ],
  locationBands: [
    {
      id: "single-site",
      label: "Single site",
      multiplierLow: 1,
      multiplierHigh: 1.05,
    },
    {
      id: "two-to-four",
      label: "2-4 locations",
      multiplierLow: 1.18,
      multiplierHigh: 1.3,
    },
    {
      id: "multi-site",
      label: "5+ locations",
      multiplierLow: 1.38,
      multiplierHigh: 1.55,
    },
  ],
  supportTiers: [
    {
      id: "standard",
      label: "Standard support coverage",
      multiplierLow: 1,
      multiplierHigh: 1.08,
    },
    {
      id: "business-critical",
      label: "Business-critical coverage",
      multiplierLow: 1.18,
      multiplierHigh: 1.28,
    },
    {
      id: "24-7",
      label: "24/7 support expectation",
      multiplierLow: 1.35,
      multiplierHigh: 1.5,
    },
  ],
  cameraBands: [
    { id: "none", label: "No camera scope", low: 0, high: 0 },
    { id: "1-8", label: "1-8 cameras", low: 900000, high: 1600000 },
    { id: "9-24", label: "9-24 cameras", low: 1800000, high: 3600000 },
    { id: "25-60", label: "25-60 cameras", low: 3800000, high: 7200000 },
    { id: "60-plus", label: "60+ cameras", low: 7600000, high: 12800000 },
  ],
  networkScopes: [
    { id: "light", label: "Office refresh", low: 750000, high: 1500000 },
    {
      id: "medium",
      label: "Multi-floor or dense endpoint rollout",
      low: 1800000,
      high: 3600000,
    },
    {
      id: "heavy",
      label: "Multi-site or complex infrastructure scope",
      low: 4200000,
      high: 7800000,
    },
  ],
  complianceLevels: [
    { id: "none", label: "No compliance uplift", low: 0, high: 0 },
    { id: "basic", label: "Basic audit review", low: 650000, high: 1200000 },
    {
      id: "regulated",
      label: "Regulated or board-level review",
      low: 1450000,
      high: 2800000,
    },
  ],
  services: [
    {
      id: "managed-it",
      label: "Managed IT Support",
      baseLow: 1500000,
      baseHigh: 3200000,
      description:
        "Support model, endpoint visibility, onboarding, reporting, and response structure.",
    },
    {
      id: "cctv",
      label: "CCTV & Surveillance",
      baseLow: 1800000,
      baseHigh: 3400000,
      description:
        "Coverage planning, deployment, recording, and control-room readiness.",
    },
    {
      id: "network",
      label: "Network Infrastructure",
      baseLow: 1600000,
      baseHigh: 3000000,
      description:
        "Structured network rollout, switching, wireless, and monitoring setup.",
    },
    {
      id: "audit",
      label: "IT Audit & Compliance",
      baseLow: 900000,
      baseHigh: 1850000,
      description:
        "Controls review, gap assessment, reporting, and remediation planning.",
    },
    {
      id: "access-control",
      label: "Access Control",
      baseLow: 1250000,
      baseHigh: 2600000,
      description:
        "Entry management design, hardware planning, and access policy structure.",
    },
    {
      id: "disaster-recovery",
      label: "Business Continuity & DR",
      baseLow: 850000,
      baseHigh: 1750000,
      description:
        "Critical dependency mapping, recovery planning, and resilience recommendations.",
    },
  ],
  contingencyLow: 1.04,
  contingencyHigh: 1.12,
};
