"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const photos = [
  "/images/DSC_0713.jpg",
  "/images/DSC_0719.jpg",
  "/images/DSC_0720.jpg",
  "/images/DSC_0721.jpg",
  "/images/DSC_0731.jpg",
  "/images/DSC_0736.jpg",
  "/images/DSC_0742.jpg",
  "/images/DSC_0751.jpg",
  "/images/DSC_0746.jpg",
  "/images/DSC_0752.jpg",
  "/images/DSC_0755.jpg",
  "/images/DSC_0760.jpg",
  "/images/DSC_0657-scaled.jpg",
  "/images/DSC_0661-scaled.jpg",
  "/images/DSC_0648-scaled.jpg",
  "/images/DSC_0641-scaled.jpg",
  "/images/DSC_0639-scaled.jpg",
  "/images/DSC_0627-scaled.jpg",
  "/images/DSC_0599-scaled.jpg",
];

const objectPosition: Record<string, string> = {
  "/images/DSC_0751.jpg": "bottom",
};

const INITIAL_COUNT = 9;

export default function GalleryMosaic() {
  const [expanded, setExpanded] = useState(false);
  const [cols, setCols] = useState(2);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      setCols(window.innerWidth < 768 ? 2 : 3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visible = expanded ? photos : photos.slice(0, INITIAL_COUNT);

  const columns: string[][] = Array.from({ length: cols }, () => []);
  visible.forEach((src, i) => columns[i % cols].push(src));

  function handleLoadMore() {
    setExpanded(true);
    setTimeout(() => {
      buttonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  return (
    <div>
      <div className="flex gap-[2px]">
        {columns.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-[2px]">
            {col.map((src) => (
              <div key={src} className="overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  width={800}
                  height={1000}
                  className="w-full h-auto block"
                  style={objectPosition[src] ? { objectPosition: objectPosition[src] } : undefined}
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={buttonRef} className="mt-6 text-center">
        {!expanded ? (
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center justify-center border border-black px-10 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Load More
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center justify-center border border-black px-10 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            View Less
          </button>
        )}
      </div>
    </div>
  );
}
