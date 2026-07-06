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
import { DrawerComponent } from "./Drawer";
import { LogOut } from "@/lib/logOut";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function NavbarComponet({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function onHandleSearch(search: string) {
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`${url}/games?${params.toString()}`);
  }

  const isActive = (href: string) => pathname === href;

  // Get user initials for avatar
  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <>
      <Navbar
        className="border-b border-[var(--border-color)] bg-[var(--surface-1)]/80 backdrop-blur-xl"
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
      >
        {/* ---- Mobile: hamburger ---- */}
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* ---- Brand (always visible) ---- */}
        <NavbarContent className="sm:hidden" justify="center">
          <NavbarItem>
            <Link href={url} className="flex items-center gap-2 no-underline">
              <span className="text-lg font-extrabold tracking-tight gradient-text">
                GameStore
              </span>
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* ---- Desktop left: brand ---- */}
        <NavbarContent className="hidden sm:flex gap-6" justify="start">
          <NavbarItem>
            <Link href={url} className="flex items-center gap-2 no-underline">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500"
              >
                <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
              <span className="text-lg font-extrabold tracking-tight gradient-text">
                GameStore
              </span>
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* ---- Desktop center: search ---- */}
        <NavbarContent className="hidden sm:flex flex-1" justify="center">
          <NavbarItem className="w-full max-w-lg">
            <Input
              defaultValue={searchParams.get("search")?.toString()}
              onChange={useDebouncedCallback((e) => {
                onHandleSearch(e.target.value);
              }, 500)}
              placeholder="Search games..."
              radius="full"
              variant="bordered"
              size="sm"
              classNames={{
                inputWrapper: "border-[var(--border-color)] hover:border-amber-500/60 transition-colors bg-[var(--surface-2)]",
              }}
              startContent={
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)] mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </NavbarItem>
        </NavbarContent>

        {/* ---- Desktop right: nav links + actions ---- */}
        <NavbarContent className="hidden sm:flex gap-2" justify="end">
          <NavbarItem>
            <Link
              href="/games"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors no-underline
                ${isActive("/games")
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                }`}
            >
              Browse
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/dashboard"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors no-underline
                ${isActive("/dashboard")
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                }`}
            >
              Dashboard
            </Link>
          </NavbarItem>

          {/* Cart button */}
          <NavbarItem>
            <Button
              isIconOnly
              variant="flat"
              onPress={onOpen}
              className="rounded-xl relative hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
              size="sm"
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </Button>
          </NavbarItem>

          {/* User avatar */}
          <NavbarItem>
            <Button
              as={Link}
              href={`/profile/${session?.user?.name}`}
              isIconOnly
              variant="flat"
              size="sm"
              className="rounded-xl font-bold text-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 hover:opacity-90 transition-opacity"
              aria-label="Profile"
            >
              {userInitial}
            </Button>
          </NavbarItem>

          {/* Logout */}
          <NavbarItem>
            <Form action={LogOut}>
              <Button
                type="submit"
                variant="flat"
                color="danger"
                size="sm"
                className="rounded-xl text-sm"
              >
                Log out
              </Button>
            </Form>
          </NavbarItem>

          {/* Theme switcher */}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
        </NavbarContent>

        {/* ---- Mobile menu ---- */}
        <NavbarMenu className="pt-6 gap-4 bg-[var(--surface-1)]/95 backdrop-blur-xl">
          <NavbarMenuItem>
            <Input
              defaultValue={searchParams.get("search")?.toString()}
              onChange={useDebouncedCallback((e) => {
                onHandleSearch(e.target.value);
              }, 500)}
              placeholder="Search games..."
              radius="full"
              variant="bordered"
              classNames={{
                inputWrapper: "border-[var(--border-color)]",
              }}
            />
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              href={url}
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
            >
              Home
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              href="/games"
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
            >
              Browse Games
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              href="/dashboard"
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
            >
              Dashboard
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              href={`/profile/${session?.user?.name}`}
              className="text-base font-semibold text-[var(--text-primary)] no-underline"
            >
              My Profile
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Form action={LogOut}>
              <Button type="submit" variant="flat" color="danger" fullWidth>
                Log out
              </Button>
            </Form>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <ThemeSwitcher />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}