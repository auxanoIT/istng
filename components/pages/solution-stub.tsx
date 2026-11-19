import Image from "@/components/ui/site-image";
import Link from "@/components/ui/site-link";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { solutionPillars } from "@/data/enterprise-solutions";

const briefs: Record<string, { description: string; enquiryNote: string }> = {
  "industrial-solar": {
    description: "Plan solar around shift patterns, machinery and the loads your facility needs to keep running. We review available roof or ground space, existing supply and operating hours before recommending capacity.",
    enquiryNote: "Share your load profile, shift schedule and any planned equipment additions.",
  },
  "hybrid-solar-systems": {
    description: "A compatible hybrid inverter can manage solar generation, battery storage and grid supply. Where your equipment supports it, a generator can also be integrated into the design.",
    enquiryNote: "Tell us which circuits need backup, which power sources you already use and how long backup should last.",
  },
  "battery-storage": {
    description: "Battery storage can keep selected loads running after sunset or during outages. We assess your expected runtime, the equipment you need to support and whether your inverter is compatible.",
    enquiryNote: "Share your current inverter model, typical outages and the appliances or equipment you want backed up.",
  },
  "solar-maintenance": {
    description: "We assess system performance and help identify issues such as reduced generation, frequent inverter alerts or batteries that no longer meet backup requirements. We can also assess whether an expansion is practical.",
    enquiryNote: "Share your equipment models, recent alerts and any changes in how you use electricity.",
  },
  "data-centre-planning": {
    description: "We review the room, equipment, rack layouts and cabling needs before deployment. Planning can account for access, existing power and cooling provisions, and future capacity.",
    enquiryNote: "Share floor plans, equipment lists and the constraints of the existing environment.",
  },
  "fibre-optic-cabling": {
    description: "We plan and install fibre links between racks, floors or buildings. The scope can include route planning, termination, labelling and agreed link testing.",
    enquiryNote: "Share the locations to connect, estimated distances and details of your existing network equipment.",
  },
  "wireless-networks": {
    description: "We plan and install business Wi-Fi around the building layout, coverage requirements and expected devices. Equipment placement and coverage checks are agreed during scoping.",
    enquiryNote: "Share your floor plan, areas with poor coverage and the types of devices that need access.",
  },
  "enterprise-server-installation": {
    description: "We help specify and source suitable server hardware and plan its physical installation and connection. Configuration and acceptance checks are agreed with your IT team before deployment.",
    enquiryNote: "Share your workload, hardware requirements and the rack environment where it will be installed.",
  },
  "video-monitoring-recording": {
    description: "We help plan camera recording, storage retention and authorised access to footage. The design depends on camera coverage, the required retention period and how your team reviews recordings.",
    enquiryNote: "Share how many cameras you have or need, which areas matter and how long recordings should be kept.",
  },
  "security-maintenance": {
    description: "We review existing CCTV and access systems and scope maintenance or upgrades where needed. The review can cover camera visibility, recording checks or replacement of compatible equipment.",
    enquiryNote: "Share the equipment you have and what has stopped working or needs improvement.",
  },
  "it-infrastructure-upgrades": {
    description: "We assess existing equipment, connectivity and operating constraints, then help plan upgrades around the work your organisation needs to keep running.",
    enquiryNote: "Share your equipment inventory, current issues and any preferred maintenance windows.",
  },
};

export function getSolutionStub(path: string) {
  const pillar = solutionPillars.find((item) => item.href === path);
  if (pillar) return { title: pillar.label, description: pillar.description, image: pillar.image, related: pillar.items, back: "/solutions" };

  const brief = briefs[path.split("/").at(-1) ?? ""];
  if (!brief) return null;
  for (const group of solutionPillars) {
    const service = group.items.find((item) => item.href === path);
    if (service) return {
      title: service.title,
      description: brief.description,
      image: service.image,
      enquiryNote: brief.enquiryNote,
      related: [],
      back: group.href,
    };
  }
  return null;
}

export function SolutionStub({ solution }: { solution: NonNullable<ReturnType<typeof getSolutionStub>> }) {
  return (
    <section className="bg-brand-soft-white py-14 text-brand-navy md:py-20">
      <Container>
        <Link href={solution.back} className="mb-8 inline-block text-sm font-semibold underline">Back to solutions</Link>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{solution.title}</h1>
            <p className="mt-5 max-w-prose leading-relaxed">{solution.description}</p>
            {"enquiryNote" in solution && <p className="mt-4 max-w-prose leading-relaxed">{solution.enquiryNote}</p>}
            <ButtonLink href="/book-consultation#project-enquiry" className="mt-6 gap-2">Discuss Your Requirements <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image src={solution.image.src} alt={solution.image.alt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
        </div>
        {solution.related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Specialised services</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {solution.related.map((item) => (
                <li key={item.href}><Link href={item.href} className="flex h-full items-center justify-between gap-3 rounded-md border border-[var(--brand-border)] bg-white p-4 hover:underline">{item.title}<ArrowRight size={17} className="shrink-0" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
