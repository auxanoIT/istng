"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { backgroundVideoUrl } from "@/lib/background-media";

import styles from "./background-video.module.css";

export function BackgroundVideo({
  src,
  poster,
  className,
  defer = false,
}: {
  src: string;
  poster?: string;
  className: string;
  defer?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deliverySrc = backgroundVideoUrl(src, window.matchMedia("(max-width: 767px)").matches);
    let inView = false;
    let ready = defer;
    let posterImage: HTMLImageElement | undefined;

    function updatePlayback() {
      if (!inView || document.hidden || motion.matches) {
        video?.pause();
      } else if (ready && video && !userPaused.current) {
        if (!video.hasAttribute("src")) video.src = deliverySrc;
        void video.play().catch(() => {});
      }
    }

    const playbackObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    playbackObserver.observe(video);

    // Begin as soon as the preloaded poster is available, without waiting for
    // unrelated below-fold resources or an arbitrary autoplay delay.
    function beginStreaming() {
      ready = true;
      updatePlayback();
    }
    if (!defer) {
      if (video.poster) {
        posterImage = new window.Image();
        posterImage.onload = posterImage.onerror = beginStreaming;
        posterImage.src = video.poster;
      } else beginStreaming();
    }

    const preloadObserver = defer ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || motion.matches) return;
      if (!video.hasAttribute("src")) video.src = deliverySrc;
      preloadObserver?.disconnect();
    }, { rootMargin: "200px 0px" }) : null;
    preloadObserver?.observe(video);

    document.addEventListener("visibilitychange", updatePlayback);
    motion.addEventListener("change", updatePlayback);
    return () => {
      preloadObserver?.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      motion.removeEventListener("change", updatePlayback);
      if (posterImage) posterImage.onload = posterImage.onerror = null;
    };
  }, [src, defer]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    userPaused.current = !video.paused;
    if (userPaused.current) {
      video.pause();
    } else {
      if (!video.hasAttribute("src")) video.src = backgroundVideoUrl(src, window.matchMedia("(max-width: 767px)").matches);
      void video.play().catch(() => {});
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        aria-hidden="true"
      />
      <button
        className={styles.toggle}
        type="button"
        aria-label={playing ? "Pause background video" : "Play background video"}
        onClick={togglePlayback}
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </>
  );
}
