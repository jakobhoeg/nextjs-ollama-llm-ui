"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import clsx from "clsx";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div
      defaultValue={theme}
      className="flex gap-2 *:transition-all *:duration-300"
    >
      <Button
        variant={theme === "system" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "system" })}
        onClick={() => setTheme("system")}
      >
        <Monitor className="size-4" />

        <p>System</p>
      </Button>
      <Button
        variant={theme === "light" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "light" })}
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
        <p>Light</p>
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "dark" })}
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />

        <p>Dark</p>
      </Button>
    </div>
  );
}
