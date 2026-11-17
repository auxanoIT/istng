"use client";

import { useState } from "react";
import { CaseStudyCard } from "./case-study-card";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCollection({ projects }: { projects: CaseStudy[] }) {
  const [active, setActive] = useState("All projects");
  const categories = ["All projects", ...new Set(projects.map(project => project.category ?? project.industry))];
  const visible = active === "All projects" ? projects : projects.filter(project => (project.category ?? project.industry) === active);
  return <>
    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by environment">
      {categories.map(category => <button key={category} type="button" aria-pressed={category === active} onClick={() => setActive(category)} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-text ${category === active ? "border-brand-navy bg-brand-navy text-white" : "border-brand-border bg-white text-brand-navy hover:border-brand-navy"}`}>{category}</button>)}
    </div>
    <p className="mb-5 text-sm text-brand-support" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
    <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">{visible.map(project => <CaseStudyCard key={project.slug} caseStudy={project} headingAs="h3" />)}</div>
  </>;
}
