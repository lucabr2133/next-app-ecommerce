"use client";
import { User } from "@/auth";
import { Button, Card, CardBody, CardHeader, Divider, Link } from "@heroui/react";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import postgres from "postgres";

export function MainProfile({
  user,
  orderData,
}: {
  user: User;
  orderData: postgres.RowList<postgres.Row[]>;
}) {
  const initial = user.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      {/* ---- Hero Banner ---- */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "220px" }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-orange-500/20 to-violet-700/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-transparent to-transparent" />

        {/* Animated orbs */}
        <div
          className="absolute top-8 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
      </div>

      <div className="page-container">
        {/* ---- User Info Card (overlapping banner) ---- */}
        <div
          className="glass-card border border-[var(--border-color)] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-fade-in-up"
          style={{ marginTop: "-60px", position: "relative", zIndex: 10 }}
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-extrabold text-black flex-shrink-0 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            }}
          >
            {initial}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] capitalize">
              {user.username}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Member account</p>

            {/* Stats */}
            <div className="flex gap-6 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-extrabold text-amber-500">
                  {orderData?.length ?? 0}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Orders</p>
              </div>
            </div>
          </div>

          <Button
            as={Link}
            href="/games"
            color="warning"
            variant="flat"
            startContent={<ShoppingBag className="w-4 h-4" />}
            className="font-semibold rounded-xl"
          >
            Browse Games
          </Button>
        </div>

        {/* ---- Orders Section ---- */}
        <div className="py-10">
          <div className="section-heading">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
              Order History
            </h2>
          </div>

          {(!orderData || orderData.length === 0) ? (
            <div className="glass-card border border-[var(--border-color)] flex flex-col items-center justify-center py-16 gap-4">
              <Package className="w-12 h-12 text-[var(--text-secondary)]" />
              <p className="text-[var(--text-secondary)] font-semibold">No orders yet</p>
              <Button as={Link} href="/games" color="warning" variant="flat" className="rounded-xl font-semibold">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orderData.map((order) => (
                <div
                  key={order.order_id}
                  className="glass-card border border-[var(--border-color)] px-5 py-4 flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        Order #{String(order.order_id).slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">Completed</p>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    href={`/checkout/success?orderId=${order.order_id}`}
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="rounded-xl font-semibold text-xs flex-shrink-0"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}