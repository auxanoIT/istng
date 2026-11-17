import { installationPortfolio } from "./integrated-case-studies";
export const galleryCategories = ["Solar Energy", "Inverter & Battery Systems", "Data Centre Work", "Security & Access", "Onsite Installations"] as const;
export type GalleryPhoto = { src: string; alt: string; width: number; height: number };
export type GalleryAlbum = { id: string; title: string; category: string; description: string; photos: GalleryPhoto[] };
const dimensions = [[960,1280],[1080,1080],[1080,608],[768,1020]];
const photos = (indices: number[]): GalleryPhoto[] => indices.map(index => ({
  ...installationPortfolio[index],
  width: dimensions[index]?.[0] ?? 1280,
  height: dimensions[index]?.[1] ?? 1280,
}));
export const starterGallery: GalleryAlbum[] = [
  { id: "solar-installations", title: "Solar installations", category: "Solar Energy", description: "Rooftop solar arrays and panel installation work from the supplied Integrated Solutions photographs.", photos: photos([0,2,4,6,9,10,12]) },
  { id: "inverter-battery-installations", title: "Inverters and battery storage", category: "Inverter & Battery Systems", description: "Indoor inverter, battery and electrical protection installations.", photos: photos([1,3,5,7,8,11]) },
];
