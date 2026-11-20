import { ClipboardCheck, Headset, FileSearch, MessageCircleMore, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import copy from "@/data/about-company.json";
import styles from "./about-approach.module.css";

const icons = [MessageCircleMore, FileSearch, Wrench, ClipboardCheck, Headset];

export function AboutApproach() {
  return (
    <section id="about-approach" aria-labelledby="about-approach-title" className={styles.section}>
      <Container>
        <header className={styles.intro}>
          <h2 id="about-approach-title">{copy.approach.title}</h2>
          <p>{copy.approach.paragraphs[0]}</p>
        </header>
        <ol className={styles.steps}>
          {copy.approach.items.map((step, index) => {
            const Icon = icons[index];
            return (
              <li key={step.title} className={styles.step}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <Icon className={styles.icon} size={48} strokeWidth={1.5} aria-hidden="true" />
                <div className={styles.copy}>
                  <h3>{step.title}</h3>
                  <p>{step.paragraphs[0]}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

