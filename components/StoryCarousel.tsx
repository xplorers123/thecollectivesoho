"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  "/images/lou-and-customer.webp",
  "/images/lou-selling-presson.webp",
  "/images/lou-selling-in-wsp.webp",
  "/images/lou-house-of-yes.webp",
  "/images/selling-chelsea.webp",
  "/images/lou-shipping.webp",
];

const VISIBLE = 4;

export default function StoryCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  function prev() {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }
  function next() {
    setCurrent((c) => (c + 1) % slides.length);
  }

  // Always show VISIBLE thumbnails starting from current, wrapping around
  const visibleIndices = Array.from({ length: VISIBLE }, (_, i) =>
    (current + i) % slides.length
  );

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {slides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            className="object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ))}

        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 hover:bg-white transition-colors text-black text-lg"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 hover:bg-white transition-colors text-black text-lg"
        >
          ›
        </button>

        <div className="absolute bottom-3 right-4 bg-black/50 px-2 py-1 text-xs text-white">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Looping thumbnail strip */}
      <div className="mt-2 flex gap-1">
        {visibleIndices.map((slideIdx, pos) => (
          <button
            key={`${pos}-${slideIdx}`}
            onClick={() => setCurrent(slideIdx)}
            className="relative aspect-square flex-1 overflow-hidden"
            aria-label={`Go to photo ${slideIdx + 1}`}
          >
            <Image
              src={slides[slideIdx]}
              alt=""
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: pos === 0 ? 1 : 0.4 }}
              sizes="25vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
