"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { getSelectedModel } from "@/lib/model-helper";
import useChatStore from "@/app/hooks/useChatStore";
import { useTranslation } from "react-i18next";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({
  isLoading,
  chatId,
  messages,
  setMessages,
}: ChatTopbarProps) {
  const [models, setModels] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const { t } = useTranslation("translation");
  const [isClient, setIsClient] = useState(false); // 客户端标记

  useEffect(() => {
    setIsClient(true); // 在客户端渲染时设置 isClient
    (async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json().catch(() => null);
        if (!data?.models?.length) return;
        setModels(data.models.map(({ name }: { name: string }) => name));
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    })();
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setOpen(false);
  };

  const handleCloseSidebar = () => {
    setSheetOpen(false);
  };

  return (
    <div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center ">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <HamburgerMenuIcon className="lg:hidden w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatId={chatId || ""}
            isCollapsed={false}
            isMobile={false}
            messages={messages}
            closeSidebar={handleCloseSidebar}
          />
        </SheetContent>
      </Sheet>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {selectedModel || (isClient ? t("chat.model_select") : "chat.model_select")}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-1">
          {models.length > 0 ? (
            models.map((model) => (
              <Button
                key={model}
                variant="ghost"
                className="w-full"
                onClick={() => {
                  handleModelChange(model);
                }}
              >
                {model}
              </Button>
            ))
          ) : (
            <Button variant="ghost" disabled className=" w-full">
              {t("chat.no_models_available")}
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
