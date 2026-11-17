import { Container } from "@/components/ui/container";
import { buildServiceSeoFaqs } from "@/lib/service-seo";
import type { Service } from "@/lib/types";

type ServiceSeoAnswerBlockProps = {
  service: Service;
};

export function ServiceSeoAnswerBlock({ service }: ServiceSeoAnswerBlockProps) {
  const faqs = buildServiceSeoFaqs(service);
  return (
    <section className="bg-[var(--brand-surface)] py-16 sm:py-24">
      <Container>
        <div>
          <div className="gap-5">
            <div className="mb-2">
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--color-ink)] sm:text-4xl text-center">
                How Integrated Solutions Technology Works With You
              </h2>
            </div>

            <div className="grid gap-4">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--brand-navy)_8%,transparent)] bg-white p-5 shadow-[0_14px_40px_color-mix(in_srgb,var(--brand-navy)_5%,transparent)]"
                >
                  <h3 className="text-lg font-semibold leading-7 text-[var(--color-ink)]">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
