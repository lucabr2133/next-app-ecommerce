"use client";

import { useState, useEffect } from "react";
import { Button, Link } from "@heroui/react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

import { Games } from "@/types/database";

export function Carousel({ games }: { games: Games[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const next = () => {
    if (currentIndex < games.length - 1) goTo(currentIndex + 1);
    else goTo(0);
  };

  const previous = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
    else goTo(games.length - 1);
  };

  useEffect(() => {
    if (!games || games.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
    }, 6500);

    return () => clearInterval(timer);
  }, [games.length]);

  if (!games || games.length === 0) {
    return null;
  }

  const current = games[currentIndex] || games[0];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
      style={{ height: "520px" }}
    >
      {/* Background images with smooth crossfade */}
      {games.map((game, i) => (
        <div
          key={game.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${game.img_url})`,
            opacity: i === currentIndex ? 1 : 0,
            transform: i === currentIndex ? "scale(1)" : "scale(1.03)",
          }}
        />
      ))}

      {/* Refined editorial vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/65 to-neutral-950/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-widest text-neutral-300 font-semibold">
            Featured Release
          </span>
          {Number(current.metacritic) > 0 && (
            <>
              <span className="text-neutral-600">•</span>
              <span className="text-xs font-medium text-neutral-300">
                Metacritic {Number(current.metacritic)}
              </span>
            </>
          )}
        </div>

        <h1
          className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.08] mb-4 transition-opacity duration-300"
          style={{ opacity: isAnimating ? 0.3 : 1 }}
        >
          {current.title}
        </h1>

        <p
          className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed mb-8 line-clamp-3 transition-opacity duration-300"
          style={{ opacity: isAnimating ? 0.3 : 1 }}
        >
          {current.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            as={Link}
            className="bg-white text-neutral-950 hover:bg-neutral-200 font-semibold rounded-xl px-6 h-11 text-sm transition-all duration-200"
            href={`/games/${current.id}`}
          >
            Buy Now — ${Number(current.price).toFixed(2)}
          </Button>
          <Button
            as={Link}
            className="font-medium rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 h-11 px-5 text-sm transition-all duration-200"
            endContent={<ArrowUpRight className="w-4 h-4" />}
            href={`/games/${current.id}`}
            variant="bordered"
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Navigation controls (bottom right) */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-2">
          {games.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-200 rounded-full border-0 cursor-pointer"
              style={{
                width: i === currentIndex ? "24px" : "6px",
                height: "6px",
                background:
                  i === currentIndex ? "#ffffff" : "rgba(255,255,255,0.3)",
              }}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <Button
          isIconOnly
          aria-label="Previous slide"
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-xl border border-white/10 w-9 h-9 min-w-9"
          size="sm"
          variant="flat"
          onPress={previous}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          isIconOnly
          aria-label="Next slide"
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-xl border border-white/10 w-9 h-9 min-w-9"
          size="sm"
          variant="flat"
          onPress={next}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

