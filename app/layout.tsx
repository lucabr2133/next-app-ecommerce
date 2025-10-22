import "@/styles/globals.css";
import { Providers } from "./providers";
import { NavbarComponet } from "@/UI/Components/Navbar";
import { inter } from "@/fonts";
import { CartProvider } from "./contex/cartProvider";
import {SessionProvider} from 'next-auth/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <html
      className={`${inter.className} dark text-foreground bg-background`}
      suppressHydrationWarning
      lang="en"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <title>Document</title>
      </head>
      <body className="bg-black dark text-foreground m-0">
        <Providers>

            <CartProvider>

          <NavbarComponet />
          <div className="p-0">{children}</div>
            </CartProvider>

        </Providers>

      </body>
    </html>
  );
}
