"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { sreenshoots } from "@/types/database";

export function CarouselGameDetail({ images }: { images: sreenshoots[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const next = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main 16:9 Stage */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border-color)] bg-neutral-950">
        <img
          alt={`Preview ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          src={images[currentIndex]?.screenshot_url}
        />

        {images.length > 1 && (
          <>
            <Button
              isIconOnly
              aria-label="Previous screenshot"
              className="absolute z-20 left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-xl border border-white/15"
              size="sm"
              variant="flat"
              onPress={previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              isIconOnly
              aria-label="Next screenshot"
              className="absolute z-20 right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-xl border border-white/15"
              size="sm"
              variant="flat"
              onPress={next}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Interactive Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((item, idx) => (
            <button
              key={item.id || idx}
              className={`relative w-28 aspect-video rounded-xl overflow-hidden flex-shrink-0 border transition-all cursor-pointer p-0 bg-neutral-900 ${
                idx === currentIndex
                  ? "border-[var(--text-primary)] opacity-100"
                  : "border-[var(--border-color)] opacity-55 hover:opacity-90"
              }`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
            >
              <img
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                src={item.screenshot_url}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
