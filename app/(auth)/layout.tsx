import "@/styles/globals.css";
import { Providers } from "../(main)/providers";
import { NavbarComponet } from "@/UI/Components/Navbar";
import { inter } from "@/fonts";
import {SessionProvider} from 'next-auth/react'
import { auth } from "@/auth";
import { ToastProvider } from "@heroui/react";

export default  async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth(); 
    
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


          <div className="p-0">{children}</div>

        </Providers>

      </body>
    </html>
  );
}
