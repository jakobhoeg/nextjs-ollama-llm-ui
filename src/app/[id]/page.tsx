"use client";

import React from "react";
import { ChatRequestOptions } from "ai";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { ChatLayout } from "@/components/chat/chat-layout";

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
    setInput,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onError: () => {
      setLoadingSubmit(false);
      toast.error("An error occurred. Please try again.");
    },
  });
  const [chatId, setChatId] = React.useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  React.useEffect(() => {
    if (params.id) {
      const item = localStorage.getItem(`chat_${params.id}`);
      if (item) {
        setMessages(JSON.parse(item));
      }
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    setMessages([...messages]);
    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          chainType: localStorage.getItem("selectedChain"),
        },
      },
    };

    // use the /api/chat route
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
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        stop={stop}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
        setMessages={setMessages}
        setInput={setInput}
      />
    </main>
  );
}
