"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { Suspense } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import PullModel from "./pull-model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // 导入 DialogClose
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import useChatStore from "@/app/hooks/useChatStore";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
  chatId: string;
  closeSidebar?: () => void;
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();

  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);

  const { t } = useTranslation("translation");

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <Button
          onClick={() => {
            router.push("/");
            if (closeSidebar) {
              closeSidebar();
            }
          }}
          variant="ghost"
          className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center "
        >
          <div className="flex gap-3 items-center ">
            {!isCollapsed && !isMobile && (
              <Image
                src="/ollama.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden 2xl:block"
              />
            )}
            {t("chat.new_chat")}
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>

        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">{t("chat.user_chats")}</p>
          <Suspense fallback={<SidebarSkeleton />}>
            {chats &&
              Object.entries(chats)
                .sort(
                  ([, a], [, b]) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map(([id, chat]) => (
                  <Link
                    key={id}
                    href={`/c/${id}`}
                    className={cn(
                      {
                        [buttonVariants({ variant: "secondaryLink" })]:
                          id === chatId,
                        [buttonVariants({ variant: "ghost" })]: id !== chatId,
                      },
                      "flex justify-between w-full h-14 text-base font-normal items-center "
                    )}
                  >
                    <div className="flex gap-3 items-center truncate">
                      <div className="flex flex-col">
                        <span className="text-xs font-normal ">
                          {chat.messages.length > 0
                            ? chat.messages[0].content
                            : ""}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex justify-end items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={15} className="shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="shrink-0 w-4 h-4" />
                              {t("chat.delete_chat")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="space-y-4">
                              <DialogTitle>{t("chat.delete_confirmation_title")}</DialogTitle>
                              <DialogDescription>{t("chat.delete_confirmation_description")}</DialogDescription>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">
                                  {/* 使用DialogClose来自动关闭对话框 */}
                                  <DialogClose>{t("chat.cancel")}</DialogClose>
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(id);
                                    router.push("/");
                                  }}
                                >
                                  {t("chat.delete")}
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Link>
                ))}
          </Suspense>
        </div>
      </div>

      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
