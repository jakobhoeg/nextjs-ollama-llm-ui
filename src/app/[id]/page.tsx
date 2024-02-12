"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatRequestOptions } from "ai";
import { useChat } from "ai/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function Page({ params }: { params: { id: string } }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  } = useChat();
  const [chatId, setChatId] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>("mistral");

  React.useEffect(() => {
    if (params.id) {
      const item = localStorage.getItem(`chat_${params.id}`);
      if (item) {
        setMessages(JSON.parse(item));
      }
    }
  }, [setMessages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          selectedModel: selectedModel,
        },
      },
    };

    // Call the handleSubmit function with the options
    handleSubmit(e, requestOptions);
  };

  // When starting a new chat, append the messages to the local storage
  React.useEffect(() => {
    if (!isLoading && !error && messages.length > 0) {
      localStorage.setItem(`chat_${params.id}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, chatId, isLoading, error]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        chatId={params.id}
        setSelectedModel={setSelectedModel}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
