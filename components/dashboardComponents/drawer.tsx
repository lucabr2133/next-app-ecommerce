"use client";
import { Link } from "@heroui/react";
import { Gamepad2, LayoutDashboard, NotepadText, User2, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { text: "Dashboard", href: "/", icon: <LayoutDashboard /> },
  { text: "Games", href: "/games", icon: <Gamepad2 /> },
  { text: "Orders", href: "/orders", icon: <NotepadText /> },
  { text: "Users", href: "/users", icon: <User2 /> },
];

export default function Drawer() {
  return (
    <aside
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 flex flex-col"
      style={{
        width: "var(--sidebar-width, 240px)",
        background: "var(--surface-2)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            GameStore
          </p>
          <p className="text-sm font-extrabold text-[var(--text-primary)] leading-tight">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Management
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <LiComponent key={item.href} text={item.text} href={item.href}>
              {item.icon}
            </LiComponent>
          ))}
        </ul>
      </nav>

      {/* Footer link back to store */}
      <div className="px-3 py-4 border-t border-[var(--border-color)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-all no-underline"
        >
          <Gamepad2 className="w-5 h-5 flex-shrink-0" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}

function LiComponent({
  children,
  text,
  href,
}: {
  children: ReactNode;
  text: string;
  href: string;
}) {
  const segments = usePathname().split("/");
  const segment = segments[2]; // e.g. "games", "orders", "users" or undefined for dashboard root
  const isActive =
    href === "/"
      ? segments.length === 2 // /dashboard exactly
      : segment === text.toLowerCase();

  return (
    <li>
      <Link
        href={"/dashboard" + href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
          ${isActive
            ? "bg-amber-500/12 text-amber-500 border border-amber-500/20"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
          }`}
      >
        <span
          className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-amber-500" : ""}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          {children}
        </span>
        {text}
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
        )}
      </Link>
    </li>
  );
}
