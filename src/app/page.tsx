"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UsernameForm from "@/components/username-form";
import { ChatRequestOptions } from "ai";
import { useChat } from "ai/react";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
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
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, chatId, isLoading, error]);

  useEffect(() => {
    if (!localStorage.getItem("ollama_user")) {
      setOpen(true);
    }
  }, []);


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messages.length === 0) {
      // Generate a random id for the chat
      const id = uuidv4();
      setChatId(id);
    }

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          selectedModel: selectedModel
        }
      }
    };

    // Call the handleSubmit function with the options
    handleSubmit(e, requestOptions);
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
        <Dialog open={open} onOpenChange={setOpen} >
      <ChatLayout
        chatId=""
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
      <DialogContent className="flex flex-col space-y-4">
    <DialogHeader className="space-y-2">
      <DialogTitle>Welcome to Ollama!</DialogTitle>
      <DialogDescription>
        Enter your name to get started. This is just to personalize your experience.
      </DialogDescription>
      <UsernameForm setOpen={setOpen} />
    </DialogHeader>
  </DialogContent>
    </Dialog>
    </main>
  );
}
