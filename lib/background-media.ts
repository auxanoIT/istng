// Transform only the site's known, untransformed Cloudinary MP4 URLs.
// Signed URLs, other hosts and already transformed assets remain intact.
export function backgroundVideoUrl(src: string, mobile: boolean) {
  const url = new URL(src, "https://istng.com");
  if (url.hostname !== "res.cloudinary.com" || url.search ||
      !/^\/dnqn2cs4e\/video\/upload\/[^/]+\.mp4$/.test(url.pathname)) return src;
  return src.replace('/video/upload/', `/video/upload/f_mp4,vc_h264,q_auto:eco,c_limit,w_${mobile ? 720 : 1280}/`);
}
// Negotiate AVIF/WebP through the existing Next image cache. A video poster has
// no srcset, so cap its request instead of downloading a full-resolution image.
export const homeVideoPoster = "/_next/image?url=%2Fintegrated-assets%2Fimages%2Fsolar-campus-poster.webp&w=1080&q=56";
