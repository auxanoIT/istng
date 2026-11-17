import type { ServiceNavMedia } from "@/lib/types";

const overviewImage = (name: string, alt: string): ServiceNavMedia => ({
  src: `/integrated-assets/images/overview/${name}.webp`,
  alt,
});

export const overviewImages = {
  planning: overviewImage("network-planning", "Network engineer and facilities manager reviewing plans in Lagos"),
  fibre: overviewImage("fibre-installation", "Two Nigerian technicians connecting fibre in a data centre"),
  copper: overviewImage("copper-testing", "Nigerian network technician testing copper cabling"),
  wireless: overviewImage("wireless-survey", "Two Nigerian engineers inspecting an office Wi-Fi access point"),
  healthcare: overviewImage("hospital-workstation", "Nigerian clinician using a hospital workstation"),
  camera: overviewImage("camera-maintenance", "Nigerian technician inspecting a CCTV camera"),
  helpdesk: overviewImage("helpdesk", "Nigerian IT support technician at a helpdesk"),
  repair: overviewImage("server-repair", "Nigerian server engineer working on an open chassis"),
  consulting: overviewImage("technology-consultation", "Nigerian technology consultants discussing infrastructure with a client"),
  monitoring: overviewImage("operations-monitoring", "Nigerian engineer monitoring IT operations"),
  smallBusiness: overviewImage("small-business", "Two Nigerian businesswomen working at laptops"),
  upgrade: overviewImage("workstation-upgrade", "Nigerian technicians working on a workstation upgrade"),
};
