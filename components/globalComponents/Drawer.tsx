"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Link,
} from "@heroui/react";
import { useContext, useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";

import { CartContext } from "@/app/(main)/contex/contex";
import CheckoutButton from "@/components/checkoutComponents/CheckoutButton";

export function DrawerComponent({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const { cartList, setCartList } = useContext(CartContext);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const safeCartList = Array.isArray(cartList) ? cartList : [];

  const totalPrice = safeCartList.reduce(
    (acc, game) => acc + Number(game.price || 0),
    0
  );

  const handleRemoveItem = async (gameId: string) => {
    setRemovingId(gameId);
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });

      if (res.ok) {
        setCartList(safeCartList.filter((g) => g.id !== gameId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Drawer
      classNames={{
        base: "bg-[var(--surface-1)] border-l border-[var(--border-color)]",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                  Shopping Cart
                </h3>
                <p className="text-xs font-normal text-[var(--text-secondary)] mt-0.5">
                  {safeCartList.length}{" "}
                  {safeCartList.length === 1 ? "item" : "items"} selected
                </p>
              </div>
            </DrawerHeader>

            <DrawerBody className="px-6 py-5">
              {safeCartList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-16">
                  <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] max-w-[220px]">
                    Explore the catalog and add digital titles to your cart.
                  </p>
                  <Button
                    as={Link}
                    className="mt-2 rounded-xl text-xs font-semibold bg-[var(--text-primary)] text-[var(--surface-1)]"
                    href="/games"
                    size="sm"
                    onPress={onClose}
                  >
                    Browse Catalog
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--border-color)]">
                  {safeCartList.map((game) => (
                    <div
                      key={game.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5"
                    >
                      <img
                        alt={game.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-[var(--border-color)] bg-neutral-900"
                        src={game.img_url}
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          className="text-sm font-semibold text-[var(--text-primary)] truncate block no-underline hover:underline"
                          href={`/games/${game.id}`}
                          onPress={onClose}
                        >
                          {game.title}
                        </Link>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          PC Digital Key
                        </p>
                        <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                          ${Number(game.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        aria-label={`Remove ${game.title}`}
                        className="text-[var(--text-secondary)] hover:text-danger rounded-lg"
                        isLoading={removingId === game.id}
                        size="sm"
                        variant="light"
                        onPress={() => handleRemoveItem(game.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DrawerBody>

            <DrawerFooter className="border-t border-[var(--border-color)] px-6 py-5 flex flex-col gap-4 bg-[var(--surface-2)]">
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Estimated Total
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Instant digital key delivery
                  </span>
                </div>
                <span className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="w-full flex items-center gap-2">
                <Button
                  className="rounded-xl font-medium"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <div className="flex-1">
                  <CheckoutButton games={safeCartList} />
                </div>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}


