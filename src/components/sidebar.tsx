"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
}

export function Sidebar({ messages, isCollapsed, isMobile }: SidebarProps) {
  const [localChats, setLocalChats] = useState<{ chatId: string; messages: Message[] }[]>([]);

  useEffect(() => {
    setLocalChats(getLocalstorageChats());
  }
  , [messages,]);


  const getLocalstorageChats = (): { chatId: string; messages: Message[] }[] => {
    const chats = Object.keys(localStorage).filter((key) => key.startsWith("chat_"));
    // Map through the chats and return an object with chatId and messages
    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      return item ? { chatId: chat, messages: JSON.parse(item) } : { chatId: '', messages: [] };
    });

    // Sort chats by the createdAt date of the first message of each chat
    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0].createdAt);
      const bDate = new Date(b.messages[0].createdAt);
      return bDate.getTime() - aDate.getTime();
    });
      
    return chatObjects;
  }
  


  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group bg-accent/20 dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
          <div className="flex justify-between p-2 items-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex justify-between w-full h-14 text-base font-normal items-center "
            )}
          >
           <div className="flex gap-3 items-center">
           {!isCollapsed && !isMobile && (
           <Image
              src="/ollama.png"
              alt="AI"
              width={28}
              height={28}
              className="dark:invert hidden lg:block"
            />
           )}
            New chat
           </div>
            <SquarePen size={18} className="shrink-0" />
          </Link>
      </div>


        <div className="flex flex-col px-2 pt-2 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
          {localChats.map(({ chatId, messages }, index) => (
            <Link
            key={index}
            href={`/${chatId.substr(5)}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex justify-between w-full h-14 text-base font-normal items-center "
            )}
          >
            <div className="flex gap-3 items-center truncate">
              <div className="flex flex-col">
                <span className="text-xs font-normal ">
                  {messages.length > 0 ? messages[0].content : ''}
                </span>
              </div>
            </div>
            <MoreHorizontal size={15} className="ml-4 shrink-0 flex" />
          </Link>
        ))}
        </div>


    </div>
  );
}
