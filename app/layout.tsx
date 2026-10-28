import "@/styles/globals.css";
import { Metadata } from "next";

import { Providers } from "./(main)/providers";
import { inter } from "@/fonts";

export const metadata: Metadata = {
  title: "GameStore — Your Next Gaming Adventure",
  description: "GameStore — Browse, discover, and buy the best games online.",
  icons: {
    icon: "/cart.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={inter.className} lang="en">
      <body className="bg-[var(--surface-1)] text-[var(--text-primary)] m-0 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
