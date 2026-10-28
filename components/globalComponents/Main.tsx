"use client";

import { Button, Input, Link } from "@heroui/react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  ShieldCheck,
  Globe,
  Zap,
  ChevronDown,
  Check,
} from "lucide-react";

import { Carousel } from "./Carrousel";
import { CarouselCard } from "./CarrouselCard";
import { Games, Genres } from "@/types/database";

const VALUE_PILLARS = [
  {
    icon: Zap,
    title: "Instant Digital Delivery",
    description:
      "Activation keys are generated and delivered to your account immediately after payment.",
  },
  {
    icon: ShieldCheck,
    title: "Official Publisher Keys",
    description:
      "100% authorized digital licenses sourced directly from verified studio partners.",
  },
  {
    icon: Globe,
    title: "Global Region Support",
    description:
      "Unrestricted activation for PC digital platforms across all supported regions.",
  },
  {
    icon: KeyRound,
    title: "Permanent Library Access",
    description:
      "All your purchased redemption codes remain archived securely in your profile.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Select Your Digital Title",
    description:
      "Browse our curated catalog of PC releases, filter by genre or Metacritic score, and add your chosen titles to the cart.",
  },
  {
    step: "02",
    title: "Encrypted Checkout via Stripe",
    description:
      "Complete your purchase with bank-grade encryption using any major credit or debit card through Stripe Checkout.",
  },
  {
    step: "03",
    title: "Redeem & Play Immediately",
    description:
      "Your unique 15-character activation key is revealed right on the confirmation screen and saved permanently in your Order History.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How quickly will I receive my activation key after purchase?",
    answer:
      "Delivery is instantaneous. As soon as your payment is confirmed through Stripe, your unique activation code is generated and displayed on the order confirmation screen.",
  },
  {
    question: "Where can I find my keys if I close the confirmation page?",
    answer:
      "Every order is permanently linked to your account. You can visit your Profile page at any time to view your Order History and copy your activation keys with a single click.",
  },
  {
    question: "Are the digital keys official and region-free?",
    answer:
      "Yes. All keys distributed on GameStore are official digital licenses verified for global PC activation without regional restrictions unless explicitly noted on the product page.",
  },
  {
    question: "How do I activate my game key on PC?",
    answer:
      "Open your PC game client (such as Steam or Epic Games Launcher), select 'Activate a Product' or 'Redeem Code' from the library menu, paste your 15-character key, and the download will begin immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We process all transactions securely through Stripe, supporting Visa, Mastercard, American Express, and regional debit cards with full buyer protection.",
  },
];

export function MainHome({
  data,
  dataGenres,
  data30Games,
}: {
  data: Games[];
  dataGenres: Genres[];
  data30Games: Games[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredGames = useMemo(() => {
    return data30Games.slice(0, 6);
  }, [data30Games]);

  const topRatedGames = useMemo(() => {
    return [...data30Games]
      .sort((a, b) => Number(b.metacritic || 0) - Number(a.metacritic || 0))
      .slice(0, 9);
  }, [data30Games]);

  const valuePicks = useMemo(() => {
    return [...data30Games]
      .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
      .slice(0, 9);
  }, [data30Games]);

  const spotlightGame = topRatedGames[0] || data30Games[0];
  const under20Games = useMemo(
    () => data30Games.filter((g) => Number(g.price) <= 25),
    [data30Games]
  );
  const acclaimedCount = useMemo(
    () => data30Games.filter((g) => Number(g.metacritic) >= 85).length,
    [data30Games]
  );

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      {/* ============ HERO CAROUSEL ============ */}
      <section className="page-container pt-8 pb-12">
        <Carousel games={featuredGames} />
      </section>

      {/* ============ VALUE PROPOSITION BAR ============ */}
      <section className="border-y border-[var(--border-color)] bg-[var(--surface-2)]">
        <div className="page-container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div key={pillar.title} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--surface-3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ NEW RELEASES ============ */}
      <section className="page-container py-16">
        <div className="section-heading">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
              Just Added
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Latest Releases
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
            View catalog
          </Button>
        </div>
        <CarouselCard games={data} />
      </section>

      {/* ============ CURATED BENTO COLLECTIONS ============ */}
      {spotlightGame && (
        <section className="border-t border-[var(--border-color)] bg-[var(--surface-2)] py-16">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                  Editorial Selection
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  Curated Collections
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 7 cols: Editor's Spotlight */}
              <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-neutral-950 min-h-[360px] flex flex-col justify-end p-8">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-55 transition-transform duration-700 hover:scale-105"
                  style={{ backgroundImage: `url(${spotlightGame.img_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-[11px] uppercase tracking-widest text-neutral-300 font-semibold">
                      Editor&apos;s Choice
                    </span>
                    {Number(spotlightGame.metacritic) > 0 && (
                      <>
                        <span className="text-neutral-500">•</span>
                        <span className="text-xs font-semibold text-white">
                          Metacritic {Number(spotlightGame.metacritic)}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {spotlightGame.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-2 leading-relaxed">
                    {spotlightGame.description}
                  </p>
                  <div className="flex items-center gap-4 mt-5">
                    <Button
                      as={Link}
                      className="bg-white text-neutral-950 font-semibold rounded-xl text-xs h-10 px-5"
                      endContent={<ArrowUpRight className="w-3.5 h-3.5" />}
                      href={`/games/${spotlightGame.id}`}
                    >
                      Explore Title — ${Number(spotlightGame.price).toFixed(2)}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Two stacked collection cards */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Collection 1: Acclaimed 85+ */}
                <Link
                  className="group flex-1 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 flex flex-col justify-between no-underline transition-all duration-200 hover:border-neutral-500"
                  href="/games?rating=85"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold block">
                        Collection 01
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
                        Metacritic 85+ Hall of Fame
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {acclaimedCount > 0 ? acclaimedCount : topRatedGames.length} highest-rated titles celebrated by critics and players alike.
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-[var(--text-primary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5">
                    {topRatedGames.slice(0, 4).map((g) => (
                      <img
                        key={g.id}
                        alt={g.title}
                        className="w-11 h-11 rounded-lg object-cover border border-[var(--border-color)] bg-neutral-900"
                        src={g.img_url}
                      />
                    ))}
                    <span className="text-xs font-medium text-[var(--text-secondary)] ml-2">
                      Browse collection →
                    </span>
                  </div>
                </Link>

                {/* Collection 2: Budget / Under $25 */}
                <Link
                  className="group flex-1 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 flex flex-col justify-between no-underline transition-all duration-200 hover:border-neutral-500"
                  href="/games?price=under25"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold block">
                        Collection 02
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
                        Essential Hits Under $25
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {under20Games.length > 0 ? under20Games.length : valuePicks.length} full digital releases at accessible everyday prices.
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-[var(--text-primary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5">
                    {valuePicks.slice(0, 4).map((g) => (
                      <img
                        key={g.id}
                        alt={g.title}
                        className="w-11 h-11 rounded-lg object-cover border border-[var(--border-color)] bg-neutral-900"
                        src={g.img_url}
                      />
                    ))}
                    <span className="text-xs font-medium text-[var(--text-secondary)] ml-2">
                      View savings →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ CRITICALLY ACCLAIMED ============ */}
      <section className="border-t border-[var(--border-color)] py-16">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                Highest Metacritic
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Critically Acclaimed
              </h2>
            </div>
            <Button
              as={Link}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] group"
              endContent={
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              }
              href="/games?rating=85"
              size="sm"
              variant="light"
            >
              Explore all
            </Button>
          </div>
          <CarouselCard
            games={topRatedGames.length > 0 ? topRatedGames : data}
          />
        </div>
      </section>

      {/* ============ ESSENTIAL VALUE PICKS ============ */}
      <section className="border-t border-[var(--border-color)] bg-[var(--surface-2)] py-16">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                Best Value
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Essential Picks &amp; Deals
              </h2>
            </div>
            <Button
              as={Link}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] group"
              endContent={
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              }
              href="/games?price=under25"
              size="sm"
              variant="light"
            >
              See all deals
            </Button>
          </div>
          <CarouselCard games={valuePicks.length > 0 ? valuePicks : data} />
        </div>
      </section>

      {/* ============ BROWSE BY GENRE ============ */}
      <section className="border-t border-[var(--border-color)] py-16">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                Categories
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Browse by Genre
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {dataGenres.map((genre) => (
              <Link
                key={genre.id}
                className="group rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] px-4 py-5 flex items-center justify-between no-underline transition-all duration-200 hover:border-neutral-500 hover:-translate-y-0.5"
                href={`/games?genre=${genre.id}`}
              >
                <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                  {genre.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--text-primary)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS (3 STEPS) ============ */}
      <section className="border-t border-[var(--border-color)] bg-[var(--surface-2)] py-20">
        <div className="page-container">
          <div className="max-w-xl mb-12">
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
              Seamless Process
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              How Digital Activation Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              No physical shipping or waiting periods. Go from checkout to downloading your game in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 flex flex-col justify-between gap-6"
              >
                <span className="text-xs font-mono font-bold text-[var(--text-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-color)] bg-[var(--surface-2)] self-start">
                  STEP {item.step}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ACCORDION ============ */}
      <section className="border-t border-[var(--border-color)] py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                Support &amp; Licensing
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-md">
                Everything you need to know about digital key delivery, regional compatibility, and account security.
              </p>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] divide-y divide-[var(--border-color)] overflow-hidden">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaq === idx;

                return (
                  <div key={faq.question} className="p-5 sm:p-6">
                    <button
                      className="w-full flex items-center justify-between gap-4 text-left bg-transparent border-0 cursor-pointer p-0"
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--text-secondary)] flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-3 pr-6">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER / DEAL ALERTS ============ */}
      <section className="border-t border-[var(--border-color)] bg-[var(--surface-2)] py-16">
        <div className="page-container">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
                Store Dispatch
              </p>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Get notified on major catalog drops &amp; weekend price cuts
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Zero spam. Only curated weekly highlights and price drops on top-rated PC titles.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-primary)]">
                <Check className="w-4 h-4 text-emerald-500" />
                Subscribed — You&apos;ll receive our next weekly dispatch.
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row w-full lg:w-auto gap-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
              >
                <Input
                  isRequired
                  className="w-full sm:w-64"
                  classNames={{
                    inputWrapper:
                      "border-[var(--border-color)] bg-[var(--surface-2)] h-10",
                  }}
                  placeholder="Enter your email"
                  radius="lg"
                  size="sm"
                  type="email"
                  value={email}
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  className="rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)] h-10 px-5"
                  type="submit"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============ MULTI-COLUMN FOOTER ============ */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--surface-1)] pt-14 pb-10">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-color)]">
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--text-primary)] text-[var(--surface-1)] flex items-center justify-center font-black text-xs">
                  GS
                </div>
                <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                  GameStore
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                Authorized digital PC game distributor. Instant 15-character activation keys with permanent library storage and verified Stripe checkout.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                Storefront
              </span>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/games"
              >
                Full Catalog
              </Link>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/games?rating=85"
              >
                Metacritic 85+
              </Link>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/games?price=under25"
              >
                Under $25 Deals
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                Account
              </span>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/login"
              >
                Sign In
              </Link>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/sign"
              >
                Create Account
              </Link>
              <Link
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
                href="/profile/me"
              >
                Order History &amp; Keys
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                Payment &amp; Security
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                Stripe Encrypted Checkout
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                Visa / Mastercard / Amex
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                Instant Digital Fulfillment
              </span>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <p>© {new Date().getFullYear()} GameStore Digital. All rights reserved.</p>
            <p>All product names and trademarks are property of their respective publishers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
