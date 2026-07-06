"use client";

import { useState, useEffect } from "react";
import { Games } from "@/types/database";
import { ProductCart } from "./Card";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CarouselCard({ games }: { games: Games[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const updatedGames = [
    ...games,
    {
      id: "11",
      title: "See more",
      create_at: new Date(),
      description: "",
      id_developer: "",
      id_platform: "",
      img_url: "",
      metacritic: 0,
      price: 70,
      release_at: new Date(),
      stock: 0,
      updated_at: new Date(),
    },
  ];

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

  const gameLength = updatedGames.length - cardsPerView;

  const next = () => {
    if (currentIndex < gameLength) setCurrentIndex((p) => p + 1);
  };

  const previous = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  return (
    <div className="relative w-full">
      {/* Navigation + cards row */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="flat"
          onPress={previous}
          isDisabled={currentIndex === 0}
          size="sm"
          className="rounded-xl bg-[var(--surface-3)] hover:bg-amber-500/15 hover:text-amber-500 transition-colors flex-shrink-0"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
          }}
        >
          {updatedGames
            .slice(currentIndex, currentIndex + cardsPerView)
            .map((game) => (
              <ProductCart key={game.id} setGames={null} game={game} />
            ))}
        </div>

        <Button
          isIconOnly
          variant="flat"
          onPress={next}
          isDisabled={currentIndex >= gameLength}
          size="sm"
          className="rounded-xl bg-[var(--surface-3)] hover:bg-amber-500/15 hover:text-amber-500 transition-colors flex-shrink-0"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: Math.max(1, gameLength + 1) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="border-0 cursor-pointer rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? "20px" : "6px",
              height: "6px",
              background: i === currentIndex ? "#f59e0b" : "var(--border-color)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
