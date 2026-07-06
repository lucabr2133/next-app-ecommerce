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

  const isInCart = cartList.some((g) => g.id === game.id);
  const isPlaceholder = game.title === "See more";
  const isInAdminPage = path === "/dashboard/games";

  const handleAddToCart = async () => {
    setLoading(true);
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game }),
    });
    setCartList([...cartList, game]);
    setLoading(false);
  };

  const handleRemoveFromCart = async () => {
    setLoading(true);
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    setCartList(cartList.filter((g) => g.id !== game.id));
    setLoading(false);
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
        className={`relative w-full h-[320px] overflow-hidden rounded-2xl border
          ${isInCart
            ? "border-amber-500/50 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
            : "border-[var(--border-color)] hover:border-amber-500/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
          }
          transition-all duration-300 hover:-translate-y-1`}
        style={{ willChange: "transform" }}
      >
        {/* Game image */}
        <div className="absolute inset-0">
          <Image
            removeWrapper
            alt={game.title}
            src={game.img_url}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Price badge (top right) */}
        {!isInAdminPage && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-sm font-extrabold">
            ${game.price}
          </div>
        )}

        {/* In-cart badge */}
        {isInCart && (
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold">
            In Cart
          </div>
        )}

        {/* Title */}
        <CardHeader className="absolute bottom-16 left-0 right-0 z-10 px-4 pb-0 flex-col items-start">
          <h3 className="text-white font-extrabold text-lg uppercase tracking-wide leading-tight line-clamp-2"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
          >
            {game.title}
          </h3>
        </CardHeader>

        {/* Footer actions */}
        {!isInAdminPage && (
          <CardFooter className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-md bg-black/30 border-t border-white/5 flex justify-between items-center px-4 py-2.5 gap-2">
            <div className="flex gap-2">
              {loading ? (
                <Spinner size="sm" color="warning" />
              ) : isInCart ? (
                <Button
                  onPress={handleRemoveFromCart}
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="font-semibold rounded-lg text-xs"
                  startContent={<ShopIcon />}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  onPress={handleAddToCart}
                  size="sm"
                  color="warning"
                  variant="solid"
                  className="font-semibold rounded-lg text-xs text-black"
                  startContent={<ShopIcon />}
                >
                  Add to Cart
                </Button>
              )}

              <Button
                as={Link}
                href={`/games/${game.id}`}
                size="sm"
                variant="flat"
                className="font-semibold rounded-lg text-xs text-white bg-white/10 hover:bg-white/20"
                startContent={<Info className="w-3.5 h-3.5" />}
              >
                Details
              </Button>
            </div>
          </CardFooter>
        )}

        {/* Admin dropdown */}
        {isInAdminPage && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                color="default"
                variant="flat"
                className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl"
                size="sm"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Game actions">
              <DropdownItem
                onPress={onOpen}
                startContent={<Pencil className="w-4 h-4" />}
                key="edit"
                color="warning"
                variant="flat"
              >
                Edit Game
              </DropdownItem>
              <DropdownItem
                onPress={async () => {
                  const res = await fetch(`/api/games/${game.id}`, { method: "DELETE" });
                  const data = await res.json();
                  if (res?.ok && setGames) {
                    setGames((prev) => prev.filter((g) => g.id !== data?.game?.id));
                  }
                  addToast({
                    title: data?.message || data?.error,
                    color: data?.message ? "success" : "danger",
                    variant: "flat",
                  });
                }}
                startContent={<XIcon className="w-4 h-4" />}
                key="delete"
                className="text-danger"
                variant="flat"
                color="danger"
              >
                Delete Game
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </Card>

      <UpdateModal setGames={setGames} game={game} isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
