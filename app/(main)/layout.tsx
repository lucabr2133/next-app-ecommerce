import "@/styles/globals.css";
import { Providers } from "./providers";
import { NavbarComponet } from "@/UI/Components/Navbar";
import { inter } from "@/fonts";
import { CartProvider } from "./contex/cartProvider";
import { auth } from "@/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <title>Document</title>
      </head>
      <body className="bg-background text-foreground m-0">
        <Providers>
          <CartProvider>
            <NavbarComponet session={session} />
            <main className="p-0">{children}</main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
