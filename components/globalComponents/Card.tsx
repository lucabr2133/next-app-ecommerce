import { Games } from "@/types/database";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Link,
  Image,
  Spinner,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { SetStateAction, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { EllipsisVertical, Pencil, XIcon, ShoppingCart, Info } from "lucide-react";
import { CartContext } from "@/app/(main)/contex/contex";
import { UpdateModal } from "@/components/dashboardComponents/games/updateModal";

export function ShopIcon() {
  return <ShoppingCart className="w-4 h-4" />;
}

export function ProductCart({
  game,
  setGames,
}: {
  game: Games;
  setGames: React.Dispatch<SetStateAction<Games[]>> | null;
}) {
  const path = usePathname();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const { cartList, setCartList } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const safeCartList = Array.isArray(cartList) ? cartList : [];
  const isInCart = safeCartList.some((g) => g.id === game.id);
  const isPlaceholder = game.title === "See more";
  const isInAdminPage = path === "/dashboard/games";

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game }),
      });

      if (res.status === 401) {
        addToast({
          title: "Please log in to add games to your cart",
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id }),
      });

      if (res.ok) {
        setCartList(safeCartList.filter((g) => g.id !== game.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPlaceholder) {
    return (
      <Link
        href="/games"
        className="flex justify-center items-center w-full h-[300px] rounded-2xl glass-card border border-[var(--border-color)] hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 text-lg font-bold text-amber-500 hover:text-amber-400 no-underline"
      >
        See More →
      </Link>
    );
  }

  return (
    <>
      <Card
        className={`group relative w-full overflow-hidden rounded-2xl border bg-[var(--surface-2)] transition-all duration-200 hover:-translate-y-0.5
          ${
            isInCart
              ? "border-neutral-400 dark:border-neutral-500"
              : "border-[var(--border-color)] hover:border-neutral-400 dark:hover:border-neutral-600"
          }`}
      >
        {/* Cover Image */}
        <Link
          className="relative block w-full h-52 overflow-hidden bg-neutral-900"
          href={`/games/${game.id}`}
        >
          <Image
            removeWrapper
            alt={game.title}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
            src={game.img_url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Metacritic badge */}
          {Number(game.metacritic) > 0 && (
            <span className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/15 text-white text-[11px] font-semibold">
              MC {Number(game.metacritic)}
            </span>
          )}

          {/* In-cart indicator */}
          {isInCart && !isInAdminPage && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-white text-neutral-950 text-[11px] font-bold tracking-tight shadow-sm">
              In Cart
            </span>
          )}
        </Link>

        {/* Card Content */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <Link
              className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-snug line-clamp-1 no-underline hover:opacity-80 transition-opacity"
              href={`/games/${game.id}`}
            >
              {game.title}
            </Link>
            <span className="text-sm font-bold text-[var(--text-primary)] flex-shrink-0">
              ${Number(game.price).toFixed(2)}
            </span>
          </div>

          {!isInAdminPage && (
            <div className="flex items-center gap-2 pt-1">
              {loading ? (
                <div className="h-9 flex-1 flex items-center justify-center">
                  <Spinner color="default" size="sm" />
                </div>
              ) : isInCart ? (
                <Button
                  className="flex-1 font-medium rounded-xl text-xs h-9"
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={handleRemoveFromCart}
                >
                  Remove from Cart
                </Button>
              ) : (
                <Button
                  className="flex-1 font-semibold rounded-xl text-xs h-9 bg-[var(--text-primary)] text-[var(--surface-1)] hover:opacity-90 transition-opacity"
                  size="sm"
                  startContent={<ShopIcon />}
                  onPress={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}

              <Button
                isIconOnly
                aria-label="Game details"
                as={Link}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-3)] text-[var(--text-primary)] hover:bg-[var(--surface-1)] h-9 w-9 min-w-9"
                href={`/games/${game.id}`}
                size="sm"
                variant="flat"
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Admin dropdown */}
        {isInAdminPage && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                className="absolute top-3 right-3 z-20 bg-black/65 text-white backdrop-blur-md border border-white/15 rounded-xl"
                color="default"
                size="sm"
                variant="flat"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Game actions">
              <DropdownItem
                key="edit"
                startContent={<Pencil className="w-4 h-4" />}
                variant="flat"
                onPress={onOpen}
              >
                Edit Game
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<XIcon className="w-4 h-4" />}
                variant="flat"
                onPress={async () => {
                  const res = await fetch(`/api/games/${game.id}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();

                  if (res?.ok && setGames) {
                    setGames((prev) =>
                      prev.filter((g) => g.id !== data?.game?.id)
                    );
                  }
                  addToast({
                    title: data?.message || data?.error,
                    color: data?.message ? "success" : "danger",
                    variant: "flat",
                  });
                }}
              >
                Delete Game
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </Card>

      <UpdateModal
        game={game}
        isOpen={isOpen}
        setGames={setGames}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
