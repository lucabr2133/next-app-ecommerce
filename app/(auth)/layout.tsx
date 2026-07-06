import "@/styles/globals.css";
import { Providers } from "../(main)/providers";
import { inter } from "@/fonts";
import { ToastProvider } from "@heroui/react";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${inter.className} dark text-foreground bg-background`}
      suppressHydrationWarning
      lang="en"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/cart.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="GameStore — Sign in to access your account." />
        <title>GameStore — Login</title>
      </head>
      <body className="text-foreground m-0 bg-[var(--surface-1)]">
        <Providers>
          <div className="p-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
