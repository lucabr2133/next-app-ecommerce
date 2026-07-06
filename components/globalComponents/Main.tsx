"use client";

import { Games, Genres } from "@/types/database";
import { Button, Link } from "@heroui/react";
import { ProductCart } from "./Card";
import { Carousel } from "./Carrousel";
import { CarouselCard } from "./CarrouselCard";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

export function MainHome({
  data,
  dataGenres,
  data30Games,
}: {
  data: Games[];
  dataGenres: Genres[];
  data30Games: Games[];
}) {
  const featuredGamesResponse = useMemo(() => {
    return data30Games.slice(0, 6);
  }, [data30Games]);

  const discountGames = useMemo(() => {
    return data30Games.slice(6, 16);
  }, [data30Games]);

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      {/* ============ HERO CAROUSEL ============ */}
      <section className="page-container pt-6 pb-10">
        <Carousel games={featuredGamesResponse} />
      </section>

      {/* ============ NEW RELEASES ============ */}
      <section className="page-container pb-12">
        <div className="section-heading">
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            New Releases
          </h2>
          <Button
            as={Link}
            href="/games"
            variant="light"
            size="sm"
            endContent={<ArrowRight className="w-3.5 h-3.5" />}
            className="ml-auto text-amber-500 hover:text-amber-400 font-semibold"
          >
            See all
          </Button>
        </div>
        <CarouselCard games={data} />
      </section>

      {/* ============ DEALS & DISCOUNTS ============ */}
      <section className="bg-[var(--surface-2)] py-12">
        <div className="page-container">
          <div className="section-heading">
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Deals &amp; Discounts
            </h2>
            <Button
              as={Link}
              href="/games"
              variant="light"
              size="sm"
              endContent={<ArrowRight className="w-3.5 h-3.5" />}
              className="ml-auto text-amber-500 hover:text-amber-400 font-semibold"
            >
              See all
            </Button>
          </div>
          <CarouselCard games={discountGames.length > 0 ? discountGames : data} />
        </div>
      </section>

      {/* ============ GENRES ============ */}
      <section className="page-container py-14">
        <div className="section-heading">
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Browse by Genre
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {dataGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/games?genre=${genre.id}`}
              className="group relative overflow-hidden glass-card flex items-center justify-center h-24 text-center no-underline transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] hover:-translate-y-1"
            >
              {/* Amber glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/8 group-hover:to-transparent transition-all duration-300" />
              <span className="relative text-sm font-bold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors uppercase tracking-wide">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[var(--border-color)] py-8">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-extrabold gradient-text">GameStore</span>
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} GameStore. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/games" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors no-underline">Browse</Link>
            <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors no-underline">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}