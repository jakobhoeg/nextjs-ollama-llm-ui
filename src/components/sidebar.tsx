"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { useLocalStorageData } from "@/app/hooks/useLocalStorageData";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
  chatId: string;
}

export function Sidebar({ messages, isCollapsed, isMobile, chatId }: SidebarProps) {
  const [localChats, setLocalChats] = useState<
    { chatId: string; messages: Message[] }[]
  >([]);
  const localChatss = useLocalStorageData("chat_", []);
  const [selectedChatId, setSselectedChatId] = useState<string | null>(null);

  useEffect(() => {

    if (chatId) {
      setSselectedChatId(chatId);
    }

    setLocalChats(getLocalstorageChats());
    const handleStorageChange = () => {
      setLocalChats(getLocalstorageChats());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getLocalstorageChats = (): {
    chatId: string;
    messages: Message[];
  }[] => {
    const chats = Object.keys(localStorage).filter((key) =>
      key.startsWith("chat_")
    );
    // Map through the chats and return an object with chatId and messages
    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      return item
        ? { chatId: chat, messages: JSON.parse(item) }
        : { chatId: "", messages: [] };
    });

    // Sort chats by the createdAt date of the first message of each chat
    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0].createdAt);
      const bDate = new Date(b.messages[0].createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    return chatObjects;
  };

  const handleDeleteChat = (chatId: string) => {
    localStorage.removeItem(chatId);
    setLocalChats(getLocalstorageChats());
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group bg-accent/20 dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <Button
          onClick={() => {
            window.location.replace("/");
          }}
          variant="ghost"
          className="flex justify-between w-full h-14 text-lg font-normal items-center "
        >
          <div className="flex gap-3 items-center">
            {!isCollapsed && !isMobile && (
              <Image
                src="/ollama.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden xl:block"
              />
            )}
            New chat
          </div>
          <SquarePen size={18} className="shrink-0" />
        </Button>

        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
          {localChats.length > 0 ? (
            <div>
              {localChats.map(({ chatId, messages }, index) => (
                <Link
                  key={index}
                  href={`/${chatId.substr(5)}`}
                  className={cn(
                    {
                      [buttonVariants({ variant: "secondaryLink" })]: (chatId.substring(5)) === selectedChatId,
                      [buttonVariants({ variant: "ghost" })]: (chatId.substring(5)) !== selectedChatId,
                    },
                    "flex justify-between w-full h-14 text-base font-normal items-center "
                  )}
                >
                  <div className="flex gap-3 items-center truncate">
                    <div className="flex flex-col">
                      <span className="text-xs font-normal ">
                        {messages.length > 0 ? messages[0].content : ""}
                      </span>
                    </div>
                  </div>
                  <MoreHorizontal
                    size={15}
                    className="ml-4 shrink-0 flex"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteChat(chatId);
                    }}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <SidebarSkeleton />
          )}
        </div>
      </div>

      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
