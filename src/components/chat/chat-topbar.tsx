"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { ChainEnum } from "@/types/chains";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
}

const CHAINS = [
  ChainEnum.FreeSQLModel,
  ChainEnum.SQLWithSuggestion,
  ChainEnum.CombineSQLAndSuggestion,
];
export default function ChatTopbar({
  isLoading,
  chatId,
  messages,
}: ChatTopbarProps) {
  const [open, setOpen] = React.useState(false);
  const [currentChain, setCurrentChain] = React.useState<ChainEnum>(
    ChainEnum.FreeSQLModel,
  );

  const handleModelChange = (chain: ChainEnum) => {
    setCurrentChain(chain);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedChain", chain);
    }
    setOpen(false);
  };

  return (
    <div className="w-full flex px-4 py-6  items-center justify-between lg:justify-center ">
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="lg:hidden w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatId={chatId || ""}
            isCollapsed={false}
            isMobile={false}
            messages={messages}
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
            {currentChain || "Select chain"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-1">
          {CHAINS.map((chain) => (
            <Button
              key={chain}
              variant="ghost"
              className="w-full"
              onClick={() => {
                handleModelChange(chain);
              }}
            >
              {chain}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
