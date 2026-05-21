"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  "/images/DSC_0657-scaled.jpg",
  "/images/DSC_0661-scaled.jpg",
  "/images/DSC_0721.jpg",
  "/images/DSC_0742.jpg",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function goTo(index: number) {
    setCurrent(index);
    startTimer(); // reset timer on manual nav
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) goTo((current + 1) % slides.length);
    if (diff < -40) goTo((current - 1 + slides.length) % slides.length);
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="p-3"
          >
            <span
              className="block rounded-full"
              style={{
                width: i === current ? "2rem" : "0.375rem",
                height: "0.375rem",
                backgroundColor: i === current ? "white" : "rgba(255,255,255,0.5)",
                transition: "all 0.3s",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
