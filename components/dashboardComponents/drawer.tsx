"use client";

import { Link } from "@heroui/react";
import {
  Gamepad2,
  LayoutDashboard,
  NotepadText,
  User2,
  ArrowLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { text: "Overview", segment: undefined, href: "", icon: <LayoutDashboard className="w-4 h-4" /> },
  { text: "Games", segment: "games", href: "/games", icon: <Gamepad2 className="w-4 h-4" /> },
  { text: "Orders", segment: "orders", href: "/orders", icon: <NotepadText className="w-4 h-4" /> },
  { text: "Users", segment: "users", href: "/users", icon: <User2 className="w-4 h-4" /> },
];

export default function Drawer() {
  return (
    <aside className="w-full lg:w-60 lg:min-h-[calc(100vh-4rem)] border-b lg:border-b-0 lg:border-r border-[var(--border-color)] bg-[var(--surface-2)] flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="hidden lg:flex flex-col px-6 py-6 border-b border-[var(--border-color)]">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Management
        </span>
        <span className="text-base font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
          Admin Console
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:py-5 lg:px-3 overflow-x-auto">
        <ul className="flex lg:flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <LiComponent
              key={item.text}
              href={item.href}
              segment={item.segment}
              text={item.text}
            >
              {item.icon}
            </LiComponent>
          ))}
        </ul>
      </nav>

      {/* Footer link back to store */}
      <div className="hidden lg:block p-3 border-t border-[var(--border-color)]">
        <Link
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors no-underline"
          href="/"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          Back to Storefront
        </Link>
      </div>
    </aside>
  );
}

function LiComponent({
  children,
  text,
  href,
  segment,
}: {
  children: ReactNode;
  text: string;
  href: string;
  segment: string | undefined;
}) {
  const segments = usePathname().split("/");
  const currentSegment = segments[2];
  const isActive = currentSegment === segment;

  return (
    <li>
      <Link
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 no-underline whitespace-nowrap ${
          isActive
            ? "bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
        }`}
        href={"/dashboard" + href}
      >
        <span className="flex items-center flex-shrink-0">{children}</span>
        {text}
      </Link>
    </li>
  );
}
