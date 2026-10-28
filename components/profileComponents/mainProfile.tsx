"use client";

import { Button, Link } from "@heroui/react";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import postgres from "postgres";

import { User } from "@/auth";

export function MainProfile({
  user,
  orderData,
}: {
  user: User;
  orderData: postgres.RowList<postgres.Row[]>;
}) {
  const initial = user.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[var(--surface-1)] pb-20">
      {/* Header Banner */}
      <div className="border-b border-[var(--border-color)] bg-[var(--surface-2)]">
        <div className="page-container py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[var(--text-primary)] text-[var(--surface-1)] flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Customer Account
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mt-0.5">
                {user.username}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {user.email || "Verified Digital Library"} • {orderData?.length ?? 0}{" "}
                {(orderData?.length ?? 0) === 1 ? "order" : "orders"}
              </p>
            </div>
          </div>

          <Button
            as={Link}
            className="rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)]"
            href="/games"
            size="sm"
            startContent={<ShoppingBag className="w-4 h-4" />}
          >
            Browse Catalog
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="page-container pt-12">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
            Purchases &amp; Keys
          </p>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Order History
          </h2>
        </div>

        {!orderData || orderData.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-3)] flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              No orders yet
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs">
              Purchased games and instant activation keys will appear here.
            </p>
            <Button
              as={Link}
              className="mt-2 rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)]"
              href="/games"
              size="sm"
            >
              Explore Store
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] divide-y divide-[var(--border-color)] overflow-hidden">
            {orderData.map((order) => {
              const isPaid = order.status === "paid";

              return (
                <div
                  key={order.order_id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-3)]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isPaid ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <p className="text-sm font-bold text-[var(--text-primary)] font-mono">
                          #{String(order.order_id).slice(0, 8).toUpperCase()}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-md border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-secondary)] capitalize font-medium">
                          {order.status || "paid"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : ""}
                        {order.items_count
                          ? ` • ${order.items_count} ${
                              Number(order.items_count) === 1 ? "item" : "items"
                            }`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    {order.total !== undefined && (
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        ${Number(order.total).toFixed(2)}
                      </span>
                    )}
                    <Button
                      as={Link}
                      className="rounded-xl font-medium text-xs border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-primary)]"
                      endContent={<ArrowRight className="w-3.5 h-3.5" />}
                      href={`/checkout/success?orderId=${order.order_id}`}
                      size="sm"
                      variant="flat"
                    >
                      View Keys
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
