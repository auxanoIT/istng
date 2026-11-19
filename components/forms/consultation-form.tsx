import type { ComponentProps } from "react";
import { LeadForm } from "./lead-form";
import { solutionPillars } from "@/data/enterprise-solutions";
import styles from "./consultation-form.module.css";

type Props = Omit<ComponentProps<typeof LeadForm>, "context" | "className" | "serviceOptions">;

export function ConsultationForm(props: Props) {
  return <div className={styles.card}>
    <LeadForm
      context="consultation"
      headingAs="h2"
      showEyebrow={false}
      fullWidthSubmit
      submitLabel="Request consultation"
      messagePlaceholder="Tell us what you need, where your project is located and any preferred timeline. For solar, include the appliances or equipment you want to power."
      {...props}
      className="border-0 bg-transparent p-0 shadow-none"
      serviceOptions={[...new Set([
        ...(props.initialService ? [props.initialService] : []),
        "Select the service you need",
        ...solutionPillars.map(({ label }) => label),
        "Multiple Services / Not Sure Yet",
      ])]}
    />
  </div>;
}
