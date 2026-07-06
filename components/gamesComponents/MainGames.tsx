"use client";

import { Games, Genres } from "@/types/database";
import { ProductCart } from "@/components/globalComponents/Card";
import { Selection } from "@heroui/react";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Pagination } from "./Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/(main)/loading";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { key: "release", label: "Release Date" },
  { key: "price", label: "Price (High → Low)" },
  { key: "metacritic", label: "Metacritic Score" },
  { key: "A-Z", label: "A → Z" },
  { key: "Z-A", label: "Z → A" },
];

export function MainGames({ data, genres }: { data: Games[]; genres: Genres[] }) {
  const params = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [dataGames, setDataGames] = useState(data);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDataGames(data);
  }, [data]);

  const dataSlice = useMemo(() => {
    const pages: Games[][] = [];
    for (let i = 0; i < dataGames.length; i += 9) {
      pages.push(dataGames.slice(i, i + 9));
    }
    return pages;
  }, [dataGames]);

  const games = useMemo(() => dataSlice[index] ?? [], [index, dataSlice]);

  function applySortKey(key: string) {
    setSelectedSort(key);
    setDataGames((prev) => {
      const sorted = [...prev];
      if (key === "release") sorted.sort((a, b) => new Date(b.release_at).getTime() - new Date(a.release_at).getTime());
      else if (key === "price") sorted.sort((a, b) => Number(b.price) - Number(a.price));
      else if (key === "metacritic") sorted.sort((a, b) => Number(b.metacritic) - Number(a.metacritic));
      else if (key === "A-Z") sorted.sort((a, b) => a.title.localeCompare(b.title));
      else if (key === "Z-A") sorted.sort((a, b) => b.title.localeCompare(a.title));
      return sorted;
    });
    setIndex(0);
  }

  function applyGenre(genre: Genres | undefined) {
    if (!genre) {
      setSelectedGenre(null);
      router.replace(path);
      return;
    }
    setSelectedGenre(genre.id.toString());
    const p = new URLSearchParams(params.toString());
    p.set("genre", genre.id.toString());
    router.replace(`${path}?${p.toString()}`);
  }

  const Sidebar = (
    <div className="flex flex-col gap-6 min-w-0">
      {/* Sort by */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Sort By
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => applySortKey(opt.key)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-0 cursor-pointer
                ${selectedSort === opt.key
                  ? "bg-amber-500/15 text-amber-500 font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border-color)]" />

      {/* Genre */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
          Genre
        </p>
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
          <button
            onClick={() => applyGenre(undefined)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-0 cursor-pointer
              ${!selectedGenre
                ? "bg-amber-500/15 text-amber-500 font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
              }`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => applyGenre(genre)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-0 cursor-pointer
                ${selectedGenre === genre.id.toString()
                  ? "bg-amber-500/15 text-amber-500 font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                }`}
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
      <div className="page-container py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Games
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Showing {dataGames.length} results
              {selectedGenre && genres.find((g) => g.id.toString() === selectedGenre)
                ? ` in ${genres.find((g) => g.id.toString() === selectedGenre)?.name}`
                : ""}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-semibold text-[var(--text-primary)] hover:border-amber-500/40 transition-all border-0 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(selectedSort || selectedGenre) && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* ---- Desktop Sidebar ---- */}
          <aside className="hidden lg:block w-52 flex-shrink-0 animate-fade-in-left">
            <div className="glass-card p-5 sticky top-20">
              {Sidebar}
            </div>
          </aside>

          {/* ---- Mobile Sidebar Overlay ---- */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Drawer */}
              <div className="relative ml-auto w-72 h-full bg-[var(--surface-1)] border-l border-[var(--border-color)] p-6 overflow-y-auto animate-fade-in-left">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[var(--text-primary)]">Filters</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-colors border-0 cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {games.map((game) => (
                  <ProductCart setGames={null} game={game} key={game.id} />
                ))}
              </div>
            </Suspense>

            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <Pagination
                setPage={(n) => setIndex(n)}
                index={index}
                nextPage={() => setIndex((p) => p + 1)}
                previousPage={() => setIndex((p) => p - 1)}
                listGames={data}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}