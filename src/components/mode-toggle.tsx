'use client';

import * as React from 'react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          {theme === 'light' && (
            <div className="flex w-full scale-100 justify-between dark:scale-0">
              <p>Light mode</p>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          )}
          {theme === 'dark' && (
            <div className=" flex w-full scale-0 justify-between dark:scale-100">
              <p>Dark mode</p>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
