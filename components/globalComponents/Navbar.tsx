"use client";

import { Button } from "@heroui/button";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Input,
  Link,
  useDisclosure,
  Form,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ShoppingCartIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Session } from "next-auth";
import { Suspense, useContext, useState } from "react";

import { DrawerComponent } from "./Drawer";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LogOut } from "@/lib/logOut";
import { CartContext } from "@/app/(main)/contex/contex";

function NavbarInner({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { cartList } = useContext(CartContext);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function onHandleSearch(search: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`/games?${params.toString()}`);
  }

  const isActive = (href: string) => pathname === href;
  const isAdmin = session?.user?.role === "admin";
  const isLogged = !!session?.user;
  const cartCount = Array.isArray(cartList) ? cartList.length : 0;

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <>
      <Navbar
        className="border-b border-[var(--border-color)] bg-[var(--surface-1)]/90 backdrop-blur-md"
        maxWidth="xl"
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* ---- Mobile: hamburger ---- */}
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* ---- Brand (always visible on mobile) ---- */}
        <NavbarContent className="sm:hidden" justify="center">
          <NavbarItem>
            <Link className="flex items-center gap-2 no-underline" href="/">
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                GAMESTORE
              </span>
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* ---- Desktop left: brand ---- */}
        <NavbarContent className="hidden sm:flex gap-8" justify="start">
          <NavbarItem>
            <Link className="flex items-center gap-2.5 no-underline" href="/">
              <div className="w-7 h-7 rounded-lg bg-[var(--text-primary)] text-[var(--surface-1)] flex items-center justify-center font-black text-xs tracking-tighter">
                GS
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                GameStore
              </span>
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              className={`text-sm font-medium transition-colors no-underline ${
                isActive("/")
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              href="/"
            >
              Store
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              className={`text-sm font-medium transition-colors no-underline ${
                isActive("/games")
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              href="/games"
            >
              Catalog
            </Link>
          </NavbarItem>

          {isAdmin && (
            <NavbarItem>
              <Link
                className={`text-sm font-medium transition-colors no-underline ${
                  pathname.startsWith("/dashboard")
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                href="/dashboard"
              >
                Admin
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* ---- Desktop center: search ---- */}
        <NavbarContent className="hidden sm:flex flex-1 max-w-md" justify="center">
          <NavbarItem className="w-full">
            <Input
              classNames={{
                inputWrapper:
                  "border-[var(--border-color)] hover:border-neutral-500 transition-colors bg-[var(--surface-2)] h-9",
              }}
              defaultValue={searchParams.get("search")?.toString()}
              placeholder="Search titles, genres..."
              radius="lg"
              size="sm"
              startContent={
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)] mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                  />
                </svg>
              }
              variant="bordered"
              onChange={useDebouncedCallback((e) => {
                onHandleSearch(e.target.value);
              }, 400)}
            />
          </NavbarItem>
        </NavbarContent>

        {/* ---- Desktop right: actions ---- */}
        <NavbarContent className="hidden sm:flex gap-2.5" justify="end">
          {/* Theme switcher */}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>

          {/* Cart button */}
          <NavbarItem>
            <div className="relative">
              <Button
                isIconOnly
                aria-label="Shopping cart"
                className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors"
                size="sm"
                variant="flat"
                onPress={onOpen}
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[var(--text-primary)] text-[var(--surface-1)] text-[10px] font-bold flex items-center justify-center pointer-events-none">
                  {cartCount}
                </span>
              )}
            </div>
          </NavbarItem>

          {isLogged ? (
            <>
              {/* User avatar */}
              <NavbarItem>
                <Button
                  isIconOnly
                  aria-label="Profile"
                  as={Link}
                  className="rounded-xl font-semibold text-xs bg-[var(--surface-3)] text-[var(--text-primary)] border border-[var(--border-color)] hover:opacity-90 transition-opacity"
                  href={`/profile/${session?.user?.name}`}
                  size="sm"
                  variant="flat"
                >
                  {userInitial}
                </Button>
              </NavbarItem>

              {/* Logout */}
              <NavbarItem>
                <Form action={LogOut}>
                  <Button
                    className="rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-danger"
                    size="sm"
                    type="submit"
                    variant="light"
                  >
                    Sign out
                  </Button>
                </Form>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  className="rounded-xl text-xs font-medium text-[var(--text-primary)]"
                  href="/login"
                  size="sm"
                  variant="light"
                >
                  Sign in
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  className="rounded-xl text-xs font-semibold bg-[var(--text-primary)] text-[var(--surface-1)]"
                  href="/sign"
                  size="sm"
                >
                  Create account
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* ---- Mobile right: cart button ---- */}
        <NavbarContent className="sm:hidden" justify="end">
          <NavbarItem>
            <div className="relative">
              <Button
                isIconOnly
                aria-label="Shopping cart"
                className="rounded-xl relative"
                size="sm"
                variant="flat"
                onPress={onOpen}
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center justify-center pointer-events-none">
                  {cartCount}
                </span>
              )}
            </div>
          </NavbarItem>
        </NavbarContent>

        {/* ---- Mobile menu ---- */}
        <NavbarMenu className="pt-6 gap-4 bg-[var(--surface-1)]/95 backdrop-blur-xl">
          <NavbarMenuItem>
            <Input
              classNames={{
                inputWrapper: "border-[var(--border-color)]",
              }}
              defaultValue={searchParams.get("search")?.toString()}
              placeholder="Search games..."
              radius="full"
              variant="bordered"
              onChange={useDebouncedCallback((e) => {
                onHandleSearch(e.target.value);
              }, 500)}
            />
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
              href="/"
            >
              Home
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
              href="/games"
            >
              Browse Games
            </Link>
          </NavbarMenuItem>

          {isAdmin && (
            <NavbarMenuItem>
              <Link
                className="text-base font-semibold text-[var(--text-primary)] no-underline"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </NavbarMenuItem>
          )}

          {isLogged ? (
            <>
              <NavbarMenuItem>
                <Link
                  className="text-base font-semibold text-[var(--text-primary)] no-underline"
                  href={`/profile/${session?.user?.name}`}
                >
                  My Profile
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <Form action={LogOut}>
                  <Button fullWidth color="danger" type="submit" variant="flat">
                    Log out
                  </Button>
                </Form>
              </NavbarMenuItem>
            </>
          ) : (
            <NavbarMenuItem className="flex gap-2">
              <Button fullWidth as={Link} href="/login" variant="flat">
                Log in
              </Button>
              <Button
                fullWidth
                as={Link}
                className="font-bold text-black"
                color="warning"
                href="/sign"
              >
                Sign up
              </Button>
            </NavbarMenuItem>
          )}

          <NavbarMenuItem>
            <ThemeSwitcher />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}

export function NavbarComponet({ session }: { session: Session | null }) {
  return (
    <Suspense fallback={<div className="h-16 border-b border-[var(--border-color)] bg-[var(--surface-1)]" />}>
      <NavbarInner session={session} />
    </Suspense>
  );
}
