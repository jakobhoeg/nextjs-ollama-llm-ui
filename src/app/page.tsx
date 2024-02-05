'use client'

import { ChatLayout } from "@/components/chat/chat-layout";
import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="flex h-screen flex-col items-center justify-between ">
      <div className="z-10 w-full items-center text-sm lg:flex">

      <ChatLayout 
      navCollapsedSize={8}
      defaultLayout={[320, 480]}
      />

      </div>
    </main>
  );
}
