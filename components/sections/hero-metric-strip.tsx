import { Container } from "@/components/ui/container";
import { StatMetricIcon, type StatMetricIconKind } from "@/components/ui/stat-metric-icon";
import type { Metric } from "@/lib/types";

type HeroMetricStripProps = {
  metrics: Metric[];
};

const metricIcons: StatMetricIconKind[] = ["award", "clipboard", "users", "headset"];

export function HeroMetricStrip({ metrics }: HeroMetricStripProps) {
  return (
    <section className="bg-[var(--brand-white)] py-14 [--stat-icon-primary:var(--brand-navy)] [--stat-icon-accent:var(--brand-orange)] [--stat-icon-surface:var(--brand-white)] [--stat-icon-dots:var(--brand-orange)] sm:py-16">
      <Container>
        <div className="overflow-hidden rounded-[1.75rem] border border-[var(--brand-navy)]/10 bg-white">
          <div className="grid divide-y divide-[var(--brand-navy)]/12 md:grid-cols-4 md:divide-x md:divide-y-0">
            {metrics.map((metric, index) => {
              const icon = metricIcons[index % metricIcons.length];

              return (
                <article
                  key={metric.label}
                  className="relative flex min-h-[16rem] flex-col items-center justify-center px-6 py-9 text-center"
                >
                  <StatMetricIcon kind={icon} />
                  <p className="mt-8 text-[1.5rem] font-semibold leading-none tracking-normal text-[var(--brand-navy)] sm:text-[2.5rem]">
                    {metric.value}
                  </p>
                  <span className="mt-6 h-1 w-16 rounded-full bg-[var(--brand-orange)]" />
                  <p className="mt-6 text-lg font-semibold text-[var(--brand-navy)]">
                    {metric.label}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
