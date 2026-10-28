"use client";

import { Button, Link, addToast } from "@heroui/react";
import { useContext, useState } from "react";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  ArrowLeft,
  ArrowRight,
  Cpu,
  KeyRound,
} from "lucide-react";

import { CarouselGameDetail } from "./Carroulsel";
import { CartContext } from "../../app/(main)/contex/contex";
import { Games, sreenshoots, tags } from "@/types/database";
import { ProductCart } from "@/components/globalComponents/Card";

const SYSTEM_REQUIREMENTS = {
  minimum: [
    { label: "OS", value: "Windows 10 64-bit (v1909 or higher)" },
    { label: "Processor", value: "Intel Core i5-8400 / AMD Ryzen 5 2600" },
    { label: "Memory", value: "12 GB RAM" },
    { label: "Graphics", value: "NVIDIA GTX 1060 6GB / AMD RX 580 8GB" },
    { label: "DirectX", value: "Version 12" },
    { label: "Storage", value: "50 GB available SSD space" },
  ],
  recommended: [
    { label: "OS", value: "Windows 11 64-bit" },
    { label: "Processor", value: "Intel Core i7-10700K / AMD Ryzen 7 5800X" },
    { label: "Memory", value: "16 GB RAM" },
    { label: "Graphics", value: "NVIDIA RTX 3070 8GB / AMD RX 6800 XT" },
    { label: "DirectX", value: "Version 12" },
    { label: "Storage", value: "50 GB available NVMe SSD space" },
  ],
};

const ACTIVATION_STEPS = [
  {
    step: "01",
    title: "Complete Checkout",
    detail:
      "Your unique 15-character activation code is generated immediately after payment.",
  },
  {
    step: "02",
    title: "Open Your PC Client",
    detail:
      "Launch your PC digital launcher and click 'Activate a Product' in the Games menu.",
  },
  {
    step: "03",
    title: "Paste Key & Install",
    detail:
      "Enter your code from the Order Confirmation or Profile page to unlock the full game permanently.",
  },
];

export default function MainContent({
  game,
  tags,
  screenshoots,
  relatedGames = [],
}: {
  game: Games;
  tags: tags[];
  screenshoots: sreenshoots[];
  relatedGames?: Games[];
}) {
  const { cartList, setCartList } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const safeCartList = Array.isArray(cartList) ? cartList : [];
  const isInCart = safeCartList.some((g) => g.id === game.id);

  const allMedia: sreenshoots[] = [
    { id: "cover", screenshot_url: game.img_url },
    ...(screenshoots || []),
  ];

  const handleToggleCart = async () => {
    setLoading(true);
    try {
      if (isInCart) {
        const res = await fetch("/api/orders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id }),
        });

        if (res.ok) {
          setCartList(safeCartList.filter((g) => g.id !== game.id));
          addToast({
            title: `${game.title} removed from cart`,
            color: "default",
            variant: "flat",
          });
        }
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game }),
        });

        if (res.status === 401) {
          addToast({
            title: "Please sign in to add games to your cart",
            color: "warning",
            variant: "flat",
          });
        } else if (res.ok) {
          setCartList([...safeCartList, game]);
          addToast({
            title: `${game.title} added to cart`,
            color: "success",
            variant: "flat",
          });
        } else {
          addToast({
            title: "Could not add game to cart",
            color: "danger",
            variant: "flat",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const releaseDateFormatted = game.release_at
    ? new Date(game.release_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Available Now";

  const stockCount = Number(game.stock ?? 15);

  return (
    <div className="min-h-screen bg-[var(--surface-1)] pb-24">
      {/* Subtle top header bar */}
      <div className="border-b border-[var(--border-color)] bg-[var(--surface-2)]">
        <div className="page-container py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Link
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 no-underline"
              href="/games"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Catalog
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium truncate max-w-[260px]">
              {game.title}
            </span>
          </div>

          {Number(game.metacritic) > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)]">
                Metacritic Score
              </span>
              <span className="px-2 py-0.5 rounded-md border border-[var(--border-color)] bg-[var(--surface-3)] text-xs font-bold text-[var(--text-primary)]">
                {Number(game.metacritic)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div className="page-container pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left column: Media Gallery + Editorial Description + Specs + Redemption */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <CarouselGameDetail images={allMedia} />

            {/* Editorial Overview */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-2">
                About This Title
              </p>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                Overview
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl whitespace-pre-line">
                {game.description}
              </p>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-3">
                    Features &amp; Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.tag_id}
                        className="px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-medium text-[var(--text-secondary)]"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Specifications */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-4">
                Release Details
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)]">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block">
                    Platform
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                    PC Digital
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)]">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block">
                    Release Date
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                    {releaseDateFormatted}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)]">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block">
                    Region
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                    Global / Worldwide
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)]">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block">
                    Delivery
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                    Instant Key
                  </span>
                </div>
              </div>
            </div>

            {/* System Requirements (Minimum vs Recommended) */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                  Hardware Compatibility
                </p>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-5">
                PC System Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Minimum */}
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-6">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold block mb-4 pb-3 border-b border-[var(--border-color)]">
                    Minimum Configuration
                  </span>
                  <dl className="flex flex-col gap-3">
                    {SYSTEM_REQUIREMENTS.minimum.map((spec) => (
                      <div key={spec.label} className="flex flex-col gap-0.5">
                        <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                          {spec.label}
                        </dt>
                        <dd className="text-xs font-medium text-[var(--text-primary)] m-0">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Recommended */}
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-6">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold block mb-4 pb-3 border-b border-[var(--border-color)]">
                    Recommended Configuration
                  </span>
                  <dl className="flex flex-col gap-3">
                    {SYSTEM_REQUIREMENTS.recommended.map((spec) => (
                      <div key={spec.label} className="flex flex-col gap-0.5">
                        <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                          {spec.label}
                        </dt>
                        <dd className="text-xs font-medium text-[var(--text-primary)] m-0">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* Key Activation Guide */}
            <div className="border-t border-[var(--border-color)] pt-8">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                  Redemption Guide
                </p>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-5">
                How to Activate Your Digital Key
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ACTIVATION_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-5 flex flex-col gap-2"
                  >
                    <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
                      {item.step}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Sticky Purchase Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-6 flex flex-col gap-6">
              {/* Cover + Title */}
              <div className="flex items-start gap-4">
                <img
                  alt={game.title}
                  className="w-20 h-24 rounded-xl object-cover border border-[var(--border-color)] flex-shrink-0 bg-neutral-900"
                  src={game.img_url}
                />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold block">
                    Standard Digital Edition
                  </span>
                  <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight leading-snug mt-1">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      {stockCount > 0
                        ? `In stock (${stockCount} keys ready)`
                        : "In stock — Digital key"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edition contents */}
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-3.5 flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Included in this edition
                </span>
                <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Full Base Game ({game.title})</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Official 15-Character Activation Code</span>
                </div>
              </div>

              {/* Price block */}
              <div className="border-y border-[var(--border-color)] py-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                  Total Price
                </span>
                <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  ${Number(game.price).toFixed(2)}
                </span>
              </div>

              {/* Primary CTA */}
              <Button
                fullWidth
                className={`h-12 rounded-xl font-semibold text-sm transition-all ${
                  isInCart
                    ? ""
                    : "bg-[var(--text-primary)] text-[var(--surface-1)] hover:opacity-90"
                }`}
                color={isInCart ? "danger" : "default"}
                isLoading={loading}
                startContent={
                  isInCart ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )
                }
                variant={isInCart ? "flat" : "solid"}
                onPress={handleToggleCart}
              >
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </Button>

              {/* Trust guarantees */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
                  <Zap className="w-4 h-4 text-[var(--text-primary)] flex-shrink-0" />
                  <span>Instant key delivery in your account</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--text-primary)] flex-shrink-0" />
                  <span>Verified official publisher license</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
                  <Globe className="w-4 h-4 text-[var(--text-primary)] flex-shrink-0" />
                  <span>Global region activation</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related / Recommended Titles */}
        {relatedGames && relatedGames.length > 0 && (
          <section className="mt-20 pt-14 border-t border-[var(--border-color)]">
            <div className="section-heading">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                  Recommendations
                </p>
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <Button
                as={Link}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] group"
                endContent={
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                }
                href="/games"
                size="sm"
                variant="light"
              >
                View full catalog
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedGames.map((relGame) => (
                <ProductCart key={relGame.id} game={relGame} setGames={null} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
