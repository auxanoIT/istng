import { Container } from "@/components/ui/container";
import { StatMetricIcon, type StatMetricIconKind } from "@/components/ui/stat-metric-icon";
import type { Metric } from "@/lib/types";
import styles from "./hero-metric-strip.module.css";

const metricIcons: StatMetricIconKind[] = ["award", "clipboard", "users", "headset"];

export function HeroMetricStrip({ metrics }: { metrics: Metric[] }) {
  if (!metrics.length) return null;
  return (
    <section aria-label="Integrated Solutions at a glance" className={styles.section}>
      <Container>
        <div className={styles.strip}>
          <label className={styles.control}>
            <input type="checkbox" aria-label="Pause automatic statistics sliding" />
            <span className={styles.pause}>Ⅱ Pause</span>
            <span className={styles.resume}>▷ Resume</span>
          </label>
          <div className={styles.viewport} tabIndex={0} aria-label="Company statistics">
            <div className={styles.track}>
              {[false, true].map((duplicate) => (
                <div key={String(duplicate)} className={duplicate ? styles.duplicate : styles.group} aria-hidden={duplicate || undefined}>
                  {metrics.map((metric, index) => (
                    <article key={metric.label} className={styles.metric}>
                      <StatMetricIcon kind={metricIcons[index % metricIcons.length]} />
                      <p className={styles.value}>{metric.value}</p>
                      <span className={styles.rule} aria-hidden="true" />
                      <p className={styles.label}>{metric.label}</p>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
