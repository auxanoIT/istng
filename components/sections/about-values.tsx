import { BadgeCheck, ClipboardCheck, MessageCircleMore, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/container";
import copy from "@/data/about-company.json";
import styles from "./about-values.module.css";

const icons = [MessageCircleMore, ClipboardCheck, BadgeCheck, RefreshCw];

export function AboutValues() {
  const values = copy.values;
  return <section id="about-values" aria-labelledby="about-values-title" className={styles.section}>
    <Container>
      <header className={styles.intro}>
        <h2 id="about-values-title">{values.title}</h2>
        <p>{values.paragraphs[0]}</p>
      </header>
      <ul className={styles.ledger}>
        {values.items.map((item, index) => {
          const Icon = icons[index];
          return <li key={item.title} className={styles.row}>
            <Icon className={styles.icon} size={48} strokeWidth={1.5} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.paragraphs[0]}</p>
          </li>;
        })}
      </ul>
    </Container>
  </section>;
}
