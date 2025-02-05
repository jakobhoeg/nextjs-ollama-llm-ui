"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import UsernameForm from "@/components/username-form";
import { generateUUID } from "@/lib/utils";
import React from "react";
import useChatStore from "../hooks/useChatStore";
import { useTranslation } from "react-i18next";  // 导入 i18n hook

export default function Home() {
  const { t } = useTranslation("translation"); // 使用 i18n 获取翻译
  const id = generateUUID();
  const [open, setOpen] = React.useState(false);
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);

  const onOpenChange = (isOpen: boolean) => {
    if (userName) return setOpen(isOpen);

    setUserName(t("Home.anonymous"));
    setOpen(isOpen);
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ChatLayout
          key={id}
          id={id}
          initialMessages={[]}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
        />
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            {/* 使用翻译文件中的 "Home" 分类键 */}
            <DialogTitle>{t("Home.welcome_title")}</DialogTitle>
            <DialogDescription>
              {t("Home.welcome_description")}
            </DialogDescription>
            <UsernameForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
