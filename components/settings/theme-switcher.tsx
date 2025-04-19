'use client';

import { useTheme } from 'next-themes';
import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@passport/components/ui/card';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by only rendering once mounted
  if (!mounted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose your preferred theme for the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-4'>
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            className='flex items-center gap-2 min-w-[120px] justify-center'
            onClick={() => setTheme('light')}
          >
            <SunIcon className='h-4 w-4' />
            Light
          </Button>

          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            className='flex items-center gap-2 min-w-[120px] justify-center'
            onClick={() => setTheme('dark')}
          >
            <MoonIcon className='h-4 w-4' />
            Dark
          </Button>

          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            className='flex items-center gap-2 min-w-[120px] justify-center'
            onClick={() => setTheme('system')}
          >
            <LaptopIcon className='h-4 w-4' />
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
