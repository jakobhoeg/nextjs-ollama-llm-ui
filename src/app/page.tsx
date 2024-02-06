'use client'

import { ChatLayout } from "@/components/chat/chat-layout";
import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="flex h-screen flex-col items-center ">
      

      <ChatLayout 
      navCollapsedSize={8}
      defaultLayout={[120, 200]}
      />


    </main>
  );
}
