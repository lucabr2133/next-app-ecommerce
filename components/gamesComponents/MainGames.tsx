"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { Pagination } from "./Pagination";
import { Games, Genres } from "@/types/database";
import { ProductCart } from "@/components/globalComponents/Card";
import Loading from "@/app/(main)/loading";

const SORT_OPTIONS = [
  { key: "release", label: "Release Date (Newest)" },
  { key: "price-asc", label: "Price (Low → High)" },
  { key: "price", label: "Price (High → Low)" },
  { key: "metacritic", label: "Metacritic Score" },
  { key: "A-Z", label: "Title (A → Z)" },
  { key: "Z-A", label: "Title (Z → A)" },
];

const PRICE_OPTIONS = [
  { key: "all", label: "All Prices" },
  { key: "under25", label: "Under $25" },
  { key: "25to45", label: "$25 – $45" },
  { key: "over45", label: "$45+" },
];

const RATING_OPTIONS = [
  { key: "all", label: "Any Score" },
  { key: "85", label: "85+ Acclaimed" },
  { key: "75", label: "75+ Favorable" },
];

export function MainGames({
  data,
  genres,
}: {
  data: Games[];
  genres: Genres[];
}) {
  const params = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    params.get("genre")
  );
  const [selectedPrice, setSelectedPrice] = useState<string>(
    params.get("price") || "all"
  );
  const [selectedRating, setSelectedRating] = useState<string>(
    params.get("rating") || "all"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSelectedGenre(params.get("genre"));
    setSelectedPrice(params.get("price") || "all");
    setSelectedRating(params.get("rating") || "all");
  }, [data, params]);

  const filteredAndSortedGames = useMemo(() => {
    let result = [...data];

    if (selectedPrice === "under25") {
      result = result.filter((g) => Number(g.price) <= 25);
    } else if (selectedPrice === "25to45") {
      result = result.filter(
        (g) => Number(g.price) > 25 && Number(g.price) <= 45
      );
    } else if (selectedPrice === "over45") {
      result = result.filter((g) => Number(g.price) > 45);
    }

    if (selectedRating !== "all") {
      const minScore = Number(selectedRating);

      result = result.filter((g) => Number(g.metacritic || 0) >= minScore);
    }

    if (selectedSort === "release") {
      result.sort(
        (a, b) =>
          new Date(b.release_at).getTime() - new Date(a.release_at).getTime()
      );
    } else if (selectedSort === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === "price") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectedSort === "metacritic") {
      result.sort(
        (a, b) => Number(b.metacritic || 0) - Number(a.metacritic || 0)
      );
    } else if (selectedSort === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "Z-A") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [data, selectedPrice, selectedRating, selectedSort]);

  const dataSlice = useMemo(() => {
    const pages: Games[][] = [];

    for (let i = 0; i < filteredAndSortedGames.length; i += 9) {
      pages.push(filteredAndSortedGames.slice(i, i + 9));
    }

    return pages;
  }, [filteredAndSortedGames]);

  const games = useMemo(() => dataSlice[index] ?? [], [index, dataSlice]);

  function applySortKey(key: string) {
    setSelectedSort((prev) => (prev === key ? null : key));
    setIndex(0);
  }

  function applyGenre(genre: Genres | undefined) {
    const p = new URLSearchParams(params.toString());

    if (!genre) {
      setSelectedGenre(null);
      p.delete("genre");
    } else {
      setSelectedGenre(genre.id.toString());
      p.set("genre", genre.id.toString());
    }
    const queryStr = p.toString();

    router.replace(queryStr ? `${path}?${queryStr}` : path);
  }

  function resetAllFilters() {
    setSelectedSort(null);
    setSelectedGenre(null);
    setSelectedPrice("all");
    setSelectedRating("all");
    setIndex(0);
    router.replace(path);
  }

  const activeGenreName = selectedGenre
    ? genres.find((g) => g.id.toString() === selectedGenre)?.name
    : null;
  const activeSearch = params.get("search");
  const hasAnyFilter =
    Boolean(selectedGenre) ||
    Boolean(selectedSort) ||
    selectedPrice !== "all" ||
    selectedRating !== "all" ||
    Boolean(activeSearch);

  const Sidebar = (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Sort by */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Sort By
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-0 cursor-pointer ${
                selectedSort === opt.key
                  ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
              }`}
              onClick={() => applySortKey(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border-color)]" />

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Price Range
        </p>
        <div className="flex flex-col gap-1">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-0 cursor-pointer ${
                selectedPrice === opt.key
                  ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
              }`}
              onClick={() => {
                setSelectedPrice(opt.key);
                setIndex(0);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border-color)]" />

      {/* Metacritic Score */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Metacritic Score
        </p>
        <div className="flex flex-col gap-1">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-0 cursor-pointer ${
                selectedRating === opt.key
                  ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
              }`}
              onClick={() => {
                setSelectedRating(opt.key);
                setIndex(0);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border-color)]" />

      {/* Genre */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Genre
        </p>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
          <button
            className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-0 cursor-pointer ${
              !selectedGenre
                ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
            }`}
            onClick={() => applyGenre(undefined)}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-0 cursor-pointer ${
                selectedGenre === genre.id.toString()
                  ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
              }`}
              onClick={() => applyGenre(genre)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <div className="page-container py-10">
        {/* Page header */}
        <div className="flex items-end justify-between pb-8 mb-8 border-b border-[var(--border-color)]">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
              Store Directory
            </p>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Catalog
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Showing {filteredAndSortedGames.length}{" "}
              {filteredAndSortedGames.length === 1 ? "title" : "titles"}
              {activeGenreName ? ` in ${activeGenreName}` : ""}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-[var(--text-primary)] border border-[var(--border-color)] cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Active Filter Pills Bar */}
        {hasAnyFilter && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[var(--text-secondary)] mr-1">
              Active filters:
            </span>
            {activeSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-primary)]">
                Search: &ldquo;{activeSearch}&rdquo;
              </span>
            )}
            {activeGenreName && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                onClick={() => applyGenre(undefined)}
              >
                Genre: {activeGenreName}
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            )}
            {selectedPrice !== "all" && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                onClick={() => setSelectedPrice("all")}
              >
                {PRICE_OPTIONS.find((p) => p.key === selectedPrice)?.label}
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            )}
            {selectedRating !== "all" && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                onClick={() => setSelectedRating("all")}
              >
                Metacritic {selectedRating}+
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            )}
            {selectedSort && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                onClick={() => setSelectedSort(null)}
              >
                Sort: {SORT_OPTIONS.find((s) => s.key === selectedSort)?.label}
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            )}
            <button
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline ml-2 bg-transparent border-0 cursor-pointer"
              onClick={resetAllFilters}
            >
              Reset all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* ---- Desktop Sidebar ---- */}
          <aside className="hidden lg:block w-56 flex-shrink-0 animate-fade-in-left">
            <div className="glass-card p-5 sticky top-20">{Sidebar}</div>
          </aside>

          {/* ---- Mobile Sidebar Overlay ---- */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative ml-auto w-72 h-full bg-[var(--surface-1)] border-l border-[var(--border-color)] p-6 overflow-y-auto animate-fade-in-left">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[var(--text-primary)]">
                    Filters
                  </h3>
                  <button
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-colors border-0 cursor-pointer"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
                {Sidebar}
              </div>
            </div>
          )}

          {/* ---- Games Grid ---- */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<Loading />}>
              {filteredAndSortedGames.length === 0 ? (
                <div className="glass-card border border-[var(--border-color)] flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    No matching titles found
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] max-w-sm">
                    Try adjusting your price range, Metacritic score, or genre filters to see more games.
                  </p>
                  <button
                    className="px-4 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold text-xs border-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={resetAllFilters}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {games.map((game) => (
                    <ProductCart key={game.id} game={game} setGames={null} />
                  ))}
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <Pagination
                index={index}
                listGames={filteredAndSortedGames}
                nextPage={() => setIndex((p) => p + 1)}
                previousPage={() => setIndex((p) => p - 1)}
                setPage={(n) => setIndex(n)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
