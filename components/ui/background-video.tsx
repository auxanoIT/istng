"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    let inView = false;

    function updatePlayback() {
      if (!inView || document.hidden || motion.matches) {
        video?.pause();
      } else if (video && !userPaused.current) {
        if (!video.hasAttribute("src")) video.src = src;
        void video.play().catch(() => {});
      }
    }

    const playbackObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    playbackObserver.observe(video);

    const preloadObserver = defer ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || motion.matches) return;
      if (!video.hasAttribute("src")) video.src = src;
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
    };
  }, [src, defer]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    userPaused.current = !video.paused;
    if (userPaused.current) {
      video.pause();
    } else {
      if (!video.hasAttribute("src")) video.src = src;
      void video.play().catch(() => {});
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        src={defer ? undefined : src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
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
