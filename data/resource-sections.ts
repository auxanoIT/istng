export const editorialSections = {
  insights: { type: "post", title: "Insights & Articles", heading: "Practical insight. Better decisions.", description: "Explore industry trends, buying advice and practical perspectives on energy and technology in Nigeria." },
  guides: { type: "technicalGuide", title: "Technical Guides", heading: "Know what to plan before you build.", description: "Explore detailed guides to selecting, planning and implementing the right energy and technology systems." },
  "knowledge-centre": { type: "knowledgeEntry", title: "Knowledge Centre", heading: "Find a clear answer.", description: "Straightforward answers, technical explanations and glossary terms for energy, IT infrastructure and security." },
} as const;

export const planningSections = {
  tools: { type: "planningTool", title: "Project Planning Tools", heading: "Start with the right questions.", description: "Use interactive worksheets to plan a solar, infrastructure or security project and prepare for a technical consultation." },
  downloads: { type: "resourceDownload", title: "Downloads & Checklists", heading: "Take your next step with confidence.", description: "Download assessment checklists, procurement templates and practical PDF guides for your next project." },
} as const;

export type EditorialSection = keyof typeof editorialSections;
export type PlanningSection = keyof typeof planningSections;
export type ResourceSection = EditorialSection | PlanningSection;

export const resourceSections = { ...editorialSections, ...planningSections };
export const resourcePath = (section: ResourceSection, slug?: string) =>
  `/resources/${section}${slug ? `/${encodeURIComponent(slug)}` : ""}`;

export const knowledgeKinds = { faq: "Frequently Asked Question", explainer: "Explainer", glossary: "Glossary Term" } as const;
