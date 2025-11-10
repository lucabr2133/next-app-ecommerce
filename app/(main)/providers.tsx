'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { SessionProvider } from 'next-auth/react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        {...themeProps}
      >
        <HeroUIProvider navigate={router.push}>
          <ToastProvider />
          {children}
        </HeroUIProvider>
      </NextThemesProvider>
  );
}
