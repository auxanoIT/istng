import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CTABandSection } from "@/lib/types";

type CTABandProps = {
  section: CTABandSection;
};

export function CTABand({ section }: CTABandProps) {
  return (
    <section className="bg-brand-white py-12 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-brand-border bg-brand-tint px-5 py-8 sm:rounded-[2.25rem] sm:p-12">
          <SectionHeading
            title={section.title}
            description={section.description}
            align="center"
            className="[&>h2]:text-2xl [&>h2]:font-normal [&>h2]:tracking-normal [&>h2]:text-brand-navy lg:[&>h2]:text-3xl [&>p]:mx-auto [&>p]:max-w-2xl [&>p]:text-sm [&>p]:leading-7 [&>p]:text-brand-support lg:[&>p]:text-base"
          />
          <div className="mt-8 flex justify-center">
            <ButtonLink href={section.primaryCta.href} className="px-7">
              {section.primaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
