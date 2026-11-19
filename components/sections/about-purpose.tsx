import copy from "@/data/about-company.json";
import { Container } from "@/components/ui/container";
import styles from "./about-purpose.module.css";

function MobilePlatform({ end = false }: { end?: boolean }) {
  return <svg className={`${styles.platform} ${end ? styles.platformEnd : ""}`} aria-hidden="true" viewBox="0 0 160 55" width="160" height="55">
    <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M20 19V5h120v14 M15 19h130v6H15Z M35 25l45 18 45-18 M80 25v18 M45 5v14 M70 5v14 M95 5v14 M120 5v14" />
    </g>
    <path d="M80 43v12" stroke="var(--brand-orange)" strokeWidth="2" />
    <circle cx="80" cy="43" r="4" fill="var(--brand-orange)" />
  </svg>;
}

function DesktopBridge() {
  return <svg className={styles.bridge} aria-hidden="true" viewBox="0 0 1000 170" width="1000" height="170">
    <defs><g id="purpose-platform" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M25 28V12h270v16 M20 28h280v8H20Z M65 36l58 42 M263 36l-128 66 M123 36v96h12V36 M99 132h60 M60 12v16 M105 12v16 M150 12v16 M195 12v16 M240 12v16" />
    </g></defs>
    <use href="#purpose-platform" /><use href="#purpose-platform" transform="translate(1000 0) scale(-1 1)" />
    <path d="M300 32H700" stroke="var(--brand-orange)" strokeWidth="2.5" />
    <circle cx="300" cy="32" r="6" fill="var(--brand-orange)" /><circle cx="700" cy="32" r="6" fill="var(--brand-orange)" />
  </svg>;
}

export function AboutPurpose() {
  const purpose = copy.purpose;
  return <section id="about-purpose" aria-labelledby="about-purpose-title" className={styles.section}>
    <Container>
      <header className={styles.intro}>
        <h2 id="about-purpose-title">{purpose.title}</h2>
        <p>{purpose.paragraphs[0]}</p>
      </header>
      <div className={styles.experience}>
        <div className={styles.possibility}>
          <MobilePlatform />
          <h3>{purpose.possibility.title}</h3><p>{purpose.possibility.description}</p>
        </div>
        <div className={styles.connection}><span>{purpose.connector}</span></div>
        <div className={styles.achievement}>
          <h3>{purpose.achievement.title}</h3><p>{purpose.achievement.description}</p>
          <MobilePlatform end />
        </div>
        <DesktopBridge />
      </div>
      <p className={styles.closing}>{purpose.closing}</p>
    </Container>
  </section>;
}
