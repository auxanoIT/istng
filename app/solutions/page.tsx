import { SolutionCardGrid } from "@/components/sections/solution-card-grid";
import { Container } from "@/components/ui/container";
import { solutionPillars } from "@/data/enterprise-solutions";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar, Power & Technology Solutions",
  description: "Explore solar energy, battery storage and enterprise IT solutions from Integrated Solutions Technology.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <section className="bg-brand-soft-white py-14 text-brand-navy md:py-20">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Solar, Power & Technology Solutions</h1>
        <p className="mt-4 max-w-prose">Explore energy and technology services for homes, businesses and institutions.</p>
        <SolutionCardGrid cards={solutionPillars.map(({ label, description, href, image }) => ({ title: label, paragraphs: [description], href, image }))} />
      </Container>
    </section>
  );
}
