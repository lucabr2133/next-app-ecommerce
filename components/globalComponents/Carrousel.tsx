"use client";

import { useState, useEffect } from "react";
import { Games } from "@/types/database";
import { Button, Link } from "@heroui/react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

export function Carousel({ games }: { games: Games[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const next = () => {
    if (currentIndex < games.length - 1) goTo(currentIndex + 1);
  };

  const previous = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [games.length]);

  const current = games[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "520px" }}>
      {/* Background images with crossfade */}
      {games.map((game, i) => (
        <div
          key={game.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${game.img_url})`,
            opacity: i === currentIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient overlay — always visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* Content — always visible, no hover required */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        {/* Badge */}
        <span
          className="mb-3 inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 border border-amber-500/40 bg-amber-500/10 backdrop-blur-sm"
        >
          ⭐ FEATURED
        </span>

        {/* Title */}
        <h2
          className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight leading-none mb-3"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            transition: "opacity 0.5s ease",
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {current.title}
        </h2>

        {/* Description */}
        <p
          className="hidden sm:block text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed mb-5"
          style={{
            transition: "opacity 0.5s ease",
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {current.description.slice(0, 180)}...
        </p>

        {/* Actions row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            as={Link}
            href={`/games/${current.id}`}
            color="warning"
            variant="solid"
            className="font-bold rounded-xl px-6"
            startContent={<ShoppingCart className="w-4 h-4" />}
          >
            Buy — ${current.price}
          </Button>
          <Button
            as={Link}
            href={`/games/${current.id}`}
            variant="bordered"
            className="font-semibold rounded-xl border-white/30 text-white hover:bg-white/10"
          >
            Details
          </Button>
        </div>
      </div>

      {/* Slide count (top right) */}
      <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold">
        {currentIndex + 1} / {games.length}
      </div>

      {/* Arrow buttons */}
      <Button
        isIconOnly
        variant="flat"
        onPress={previous}
        isDisabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm rounded-xl border border-white/10 transition-all"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        isIconOnly
        variant="flat"
        onPress={next}
        isDisabled={currentIndex === games.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm rounded-xl border border-white/10 transition-all"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full border-0 cursor-pointer"
            style={{
              width: i === currentIndex ? "20px" : "6px",
              height: "6px",
              background: i === currentIndex ? "#f59e0b" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
