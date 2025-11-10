'use client';

import { useTheme } from 'next-themes';
import { Switch } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita el "hydration mismatch"
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Sun className="w-4 h-4" />
      <Switch
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        size="sm"
        color="secondary"
      />
      <Moon className="w-4 h-4" />
    </div>
  );
}
