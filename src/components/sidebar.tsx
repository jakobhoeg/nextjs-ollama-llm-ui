"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Message } from "ai/react";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
}

export function Sidebar({ messages, isCollapsed, isMobile }: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
        <div className="flex justify-between p-2 items-center">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex justify-between w-full h-14 text-lg font-normal items-center "
              )}
            >
             <div className="flex gap-4 items-center">
             <Image
                src="/ollama.png"
                alt="AI"
                width={28}
                height={28}
                className="invert"
              />
              New chat
             </div>
              <SquarePen size={18} />
            </Link>
        </div>
    </div>
  );
}
