import React from "react";

import { NavbarComponet } from "@/components/globalComponents/Navbar";
import { CartProvider } from "./contex/cartProvider";
import { auth } from "@/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <CartProvider>
      <NavbarComponet session={session} />
      <main className="p-0">{children}</main>
    </CartProvider>
  );
}

