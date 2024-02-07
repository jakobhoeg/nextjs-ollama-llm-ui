'use client'

import { ChatLayout } from "@/components/chat/chat-layout";
import { useChat } from "ai/react";
import React from "react";
import { v4 as uuidv4 } from 'uuid';


export default function Page({ params }: { params: { id: string } }) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop, setMessages  } = useChat();
    const [chatId, setChatId] = React.useState<string>('');
  
    React.useEffect(() => {
      if (params.id) {
        const item = localStorage.getItem(`chat_${params.id}`);
        if (item) {
          setMessages(JSON.parse(item));
        }
      }
    }, [params.id, setMessages]);
  
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      setMessages([...messages]);
      handleSubmit(e);
    }
  
    // When starting a new chat or accessing an existing one, save messages to local storage
    React.useEffect(() => {
      if (!isLoading && !error && messages.length > 0) {
        localStorage.setItem(`chat_${params.id}`, JSON.stringify(messages));
      }
    }, [messages, chatId, isLoading, error]);
  
    return (
      <main className="flex h-screen flex-col items-center">
        <ChatLayout 
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
          navCollapsedSize={8}
          defaultLayout={[120, 200]}
        />
      </main>
    );
  }
  