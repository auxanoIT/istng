import { Container } from "@/components/ui/container";
import type { LogoStripSection } from "@/lib/types";

type LogoStripProps = {
  section: LogoStripSection;
};

export function LogoStrip({ section }: LogoStripProps) {
  return (
    <section className="border-y border-[color:color-mix(in_srgb,var(--brand-navy)_6%,transparent)] bg-white">
      <Container className="py-8">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {section.logos.map((logo) => (
            <div
              key={logo.name}
              className="rounded-full border border-[color:color-mix(in_srgb,var(--brand-navy)_8%,transparent)] bg-[var(--color-cloud)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)]"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
