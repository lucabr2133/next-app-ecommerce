"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCart } from "./Card";
import { Games } from "@/types/database";

export function CarouselCard({ games }: { games: Games[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!games || games.length === 0) return null;

  const maxIndex = Math.max(0, games.length - cardsPerView);

  const next = () => {
    if (currentIndex < maxIndex) setCurrentIndex((p) => p + 1);
  };

  const previous = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  return (
    <div className="relative w-full">
      <div className="grid gap-5"
        style={{
          gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
        }}
      >
        {games
          .slice(currentIndex, currentIndex + cardsPerView)
          .map((game) => (
            <ProductCart key={game.id} game={game} setGames={null} />
          ))}
      </div>

      {maxIndex > 0 && (
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to page ${i + 1}`}
                className="border-0 cursor-pointer rounded-full transition-all duration-200"
                style={{
                  width: i === currentIndex ? "20px" : "6px",
                  height: "6px",
                  background:
                    i === currentIndex
                      ? "var(--text-primary)"
                      : "var(--border-color)",
                }}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              aria-label="Previous"
              className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors"
              isDisabled={currentIndex === 0}
              size="sm"
              variant="flat"
              onPress={previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              aria-label="Next"
              className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors"
              isDisabled={currentIndex >= maxIndex}
              size="sm"
              variant="flat"
              onPress={next}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

