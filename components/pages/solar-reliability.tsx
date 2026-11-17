import Image from "next/image";

import { OverviewHeading, OverviewParagraphs, OverviewSection, type OverviewCopy } from "@/components/pages/overview-layout";
import styles from "./solar-reliability.module.css";

// Endpoints follow the panel, inverter and battery in the equipment image.
const callouts = [
  { points: "222,80 300,80 365,116", x: 365, y: 116 },
  { points: "222,234 266,234 307,257", x: 307, y: 257 },
  { points: "778,80 654,80 586,105", x: 586, y: 105 },
  { points: "778,234 746,234 705,251", x: 705, y: 251 },
];

export function SolarReliability({ copy }: { copy: OverviewCopy & { items: OverviewCopy[] } }) {
  return (
    <OverviewSection id="solar-reliability" tone="navy">
      <OverviewHeading copy={copy} id="solar-reliability-title" inverse />
      <div className={styles.presentation}>
        <div className={styles.equipment}>
          <Image
            src="/integrated-assets/images/solutions/solar-system-equipment.webp"
            alt="Solar panel, hybrid inverter and stacked battery modules"
            width={1200}
            height={800}
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 47vw, (min-width: 640px) 600px, 90vw"
            className="h-auto w-full"
          />
        </div>
        <svg className={styles.connectors} viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
          {callouts.map(({ points, x, y }) => (
            <g key={points}>
              <polyline points={points} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <circle cx={x} cy={y} r="3.5" stroke="none" />
            </g>
          ))}
        </svg>
        <ul className={styles.principles}>
          {copy.items.map((item) => (
            <li key={item.title} className={styles.principle}>
              <h3 className="text-base font-semibold leading-snug sm:text-lg">{item.title}</h3>
              <OverviewParagraphs paragraphs={item.paragraphs} className="mt-2 text-slate-200 sm:text-sm" />
            </li>
          ))}
        </ul>
      </div>
    </OverviewSection>
  );
}
