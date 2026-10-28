"use client";

import { Card, CardBody, CardFooter, CardHeader, Link } from "@heroui/react";
import {
  Users,
  ShoppingCart,
  Gamepad2,
  CircleDollarSign,
  ChevronRight,
} from "lucide-react";

import { data } from "../../../app/(main)/dashboard/page";
import SalesChart from "./salesChart";

export function MainDashboard({ data }: { data: data }) {
  const {
    totalUser,
    totalGames,
    totalOrders,
    sales,
    mostSellGames,
    totalEarnigs,
  } = data;

  const metrics = [
    {
      label: "Total Revenue",
      value: `$${Number(totalEarnigs?.sum || 0).toLocaleString()}`,
      href: "/dashboard/orders",
      icon: CircleDollarSign,
    },
    {
      label: "Completed Orders",
      value: String(totalOrders?.count || 0),
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: "Catalog Titles",
      value: String(totalGames?.count || 0),
      href: "/dashboard/games",
      icon: Gamepad2,
    },
    {
      label: "Registered Users",
      value: String(totalUser?.count || 0),
      href: "/dashboard/users",
      icon: Users,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="pb-6 border-b border-[var(--border-color)]">
        <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
          Analytics
        </p>
        <h1 className="font-extrabold text-3xl text-[var(--text-primary)] tracking-tight">
          Store Overview
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Real-time revenue, order volume, and catalog performance.
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.label}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] shadow-none"
            >
              <CardBody className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {metric.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--surface-3)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--text-primary)]" />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {metric.value}
                </h2>
              </CardBody>
              <CardFooter className="px-5 py-3 border-t border-[var(--border-color)]">
                <Link
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 no-underline"
                  href={metric.href}
                >
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area: Chart + Top Sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <Card className="xl:col-span-8 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] shadow-none">
          <CardHeader className="px-6 pt-6 pb-2 flex flex-col items-start">
            <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Performance
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
              Revenue Over Time
            </h3>
          </CardHeader>
          <CardBody className="px-4 pb-6 w-full">
            <SalesChart data={sales} />
          </CardBody>
        </Card>

        <div className="xl:col-span-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold block">
                Leaderboard
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
                Top Selling Titles
              </h3>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border-color)]">
            {mostSellGames.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
                No sales recorded yet.
              </p>
            ) : (
              mostSellGames.map((game, index) => (
                <div
                  key={game.id || index}
                  className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5"
                >
                  <span className="w-5 text-xs font-mono font-bold text-[var(--text-secondary)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img
                    alt={game.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[var(--border-color)] flex-shrink-0 bg-neutral-900"
                    src={game.img_url}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                      {game.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {game.count} {Number(game.count) === 1 ? "unit" : "units"} sold
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
