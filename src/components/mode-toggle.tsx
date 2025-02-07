"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import clsx from "clsx";
import I18nSwitch from "./i18n-switch";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation("translation"); // 使用 i18n 获取翻译

  return (
    <div
      defaultValue={theme}
      className="flex gap-2 *:transition-all *:duration-300"
    >
      <I18nSwitch />
      <Button
        variant={theme === "system" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "system" })}
        onClick={() => setTheme("system")}
      >
        <Monitor className="size-4" />

        <p>{t("theme.system")}</p>
      </Button>
      <Button
        variant={theme === "light" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "light" })}
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
        <p>{t("theme.light")}</p>
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        className={clsx("space-x-2 w-full ", { "rounded-full": theme === "dark" })}
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />

        <p>{t("theme.dark")}</p>
      </Button>
    </div>
  );
}
