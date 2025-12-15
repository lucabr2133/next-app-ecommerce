"use client";
import { Link } from "@heroui/react";
import { Gamepad, LayoutDashboard, NotepadText, User2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Drawer() {
  const size = 30;
  return (
    <aside className="fixed bottom-6 right-6 z-50 backdrop-blur-2xl rounded-3xl border">
      <ul className=" text-white rounded-2xl shadow-2xl overflow-hidden">
        <LiComponent text="Users" href="/users">
          <User2Icon height={size} width={size} />
        </LiComponent>
        <LiComponent text="Games" href="/games">
          <Gamepad height={size} width={size} />
        </LiComponent>
        <LiComponent text="Orders" href="/orders">
          <NotepadText height={size} width={size} />
        </LiComponent>
            <LiComponent text="Dashboard" href="/">
          <LayoutDashboard height={size} width={size} />
        </LiComponent>
      </ul>
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
  const pathName=usePathname().split('/')

  return (
    <Link
      href={"/dashboard" + href}
      className={`flex items-center gap-4 px-5 py-3 text-lg font-semibold hover:bg-blue-500/40 transition-all duration-200 ${pathName[2]==text.toLowerCase() ? 'bg-blue-500/40':''} }`}
    >
      {children}
      {text}
    </Link>
  );
}
