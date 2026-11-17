"use client";

import { useEffect } from "react";

type TawkApi = {
  onLoad?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

const scriptId = "integrated-solutions-tawk";
const embedUrl = process.env.NEXT_PUBLIC_TAWK_EMBED_URL;

// Mounted only after consent, inside the marketing shell (not Sanity Studio).
export function TawkChat() {
  useEffect(() => {
    if (!embedUrl || !/^https:\/\/embed\.tawk\.to\//.test(embedUrl)) return;
    let active = true;
    const api = (window.Tawk_API ??= {});
    api.onLoad = () => {
      if (active) api.showWidget?.();
      else api.hideWidget?.();
    };
    api.showWidget?.();

    // Preserve the conversation across client navigation and React remounts.
    if (!document.getElementById(scriptId)) {
      window.Tawk_LoadStart = new Date();
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = embedUrl;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    }

    return () => {
      active = false;
      api.hideWidget?.();
    };
  }, []);

  return null;
}
