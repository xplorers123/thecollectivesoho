"use client";

import { useEffect, useRef } from "react";

// Short silent clip that plays on a loop like a moving photo. Shows the poster
// still for visitors who prefer reduced motion.
export default function LoopVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React doesn't always reflect `muted` onto the element; browsers only autoplay muted video.
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
