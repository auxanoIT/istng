import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { resolveSiteImagePath } from "@/lib/image-assets";
import { canonicalServicePath } from "@/lib/service-routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyNGN(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function absoluteUrl(path = "/") {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://istng.com"
  ).replace(/\/+$/, "");
  return new URL(canonicalServicePath(resolveSiteImagePath(path)), base).toString();
}

export function createWhatsappLink(number: string, message: string) {
  const sanitized = number.replace(/\D/g, "");
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function getBrowserCookie(name: string) {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}
