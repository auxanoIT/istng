import type { CaseStudy, ServiceNavMedia } from "@/lib/types";

export function getCaseStudyMedia(project: CaseStudy): ServiceNavMedia {
  const image = project.cardImage?.src ? project.cardImage : project.image;
  return image?.src ? { src: image.src, alt: image.alt || project.title } : {
    src: "/image/service-details/network-cabling-rack.webp",
    alt: "Structured cabling and equipment in an infrastructure rack",
  };
}
