"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Message, useChat } from "ai/react";
import Chat, { ChatProps } from "./chat";
import ChatList from "./chat-list";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

type MergedProps = ChatLayoutProps & ChatProps;

export function ChatLayout({
  defaultLayout = [30, 160],
  defaultCollapsed = false,
  navCollapsedSize,
  initialMessages,
  id,
}: MergedProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 12}
        maxSize={isMobile ? 0 : 16}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed
            ? "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
            : "hidden md:block"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          messages={initialMessages}
          isMobile={isMobile}
          chatId={id}
        />
      </ResizablePanel>
      <ResizableHandle className={cn("hidden md:flex")} withHandle />
      <ResizablePanel
        className="h-full w-full flex justify-center"
        defaultSize={defaultLayout[1]}
      >
        <Chat id={id} initialMessages={initialMessages} isMobile={isMobile} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
