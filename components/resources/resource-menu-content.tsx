import Link from "@/components/ui/site-link";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, ClipboardList, Download, Images, Newspaper, CircleHelp } from "lucide-react";

export const resourceIcons = {
  insights: Newspaper, guides: BookOpen, "knowledge-centre": CircleHelp,
  "case-studies": BriefcaseBusiness, "our-work": Images, tools: ClipboardList, downloads: Download,
};

export function ResourceProjectCard({ compact = false }: { compact?: boolean }) {
  return <Link href="/book-consultation" className={`group block rounded-xl bg-brand-navy text-white transition hover:bg-[#103c50] ${compact ? "px-5 py-4" : "p-6 sm:p-8"}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">Have a project?</p>
    <p className="mt-3 text-xl font-semibold leading-tight">Let’s discuss your requirements.</p>
    <span className="mt-3 inline-flex items-center gap-2 text-sm text-white/90">Book a technical consultation <ArrowUpRight className="size-4 text-brand-orange transition group-hover:translate-x-0.5" aria-hidden /></span>
  </Link>;
}
