import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BackgroundVideo } from "@/components/ui/background-video";
import styles from "./footer-video-cta.module.css";

const actions = [
  { label: "Make an Enquiry", href: "/book-consultation" },
  { label: "Our Services", href: "/solutions" },
  { label: "Our Technologies", href: "/#data-centre-infrastructure-services" },
];

export function FooterVideoCta() {
  const videoUrl = process.env.NEXT_PUBLIC_INTEGRATED_FOOTER_VIDEO_URL
    || "https://res.cloudinary.com/dnqn2cs4e/video/upload/integrated_service_new_2_cr2geq.mp4";

  return (
    <section className={styles.section} aria-labelledby="footer-video-heading">
      <BackgroundVideo className={styles.video} src={videoUrl} defer />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Your energy future starts here</p>
        <h2 id="footer-video-heading">Let’s talk about powering your business forward</h2>
        <div className={styles.actions}>
          {actions.map(({ label, href }) => (
            <Link key={label} href={href}>
              {label}
              <span className={styles.arrow}><ArrowRight size={18} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
