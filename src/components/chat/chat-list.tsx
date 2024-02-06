import { Message, useChat } from "ai/react";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ChatProps } from "./chat";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatList({ messages, input, handleInputChange, handleSubmit, isLoading, error, stop }: ChatProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const lastMessage = messagesContainerRef.current?.lastElementChild as HTMLElement;
    if (lastMessage) {
      lastMessage.scrollIntoView({  });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full flex flex-col min-h-full"
      >
        {messages?.map((message, index) => (
          <motion.div
            key={index}
            layout="position"
            initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: messages.indexOf(message) * 0.05 + 0.2,
              },
            }}
            style={{
              originX: 0.5,
              originY: 0.5,
            }}
            className={cn(
              "flex flex-col gap-2 p-4 whitespace-pre-wrap",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className="flex gap-3 items-center">
              {message.role === "user" && (
                <>
                  <span className="bg-accent p-3 rounded-md max-w-2xl">
                    {message.content}
                  </span>
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src="/user.jpg"
                      alt="AI"
                      width={6}
                      height={6}
                      className="object-contain"
                    />
                  </Avatar>
                </>
              )}
              {message.role === "assistant" && (
                <>
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src="/ollama.png"
                      alt="AI"
                      width={6}
                      height={6}
                      className="object-contain invert"
                    />
                  </Avatar>
                  <span className="bg-accent p-3 rounded-md max-w-2xl">
                    {message.content}
                    {isLoading && messages.indexOf(message) === messages.length - 1 && (
                      <span className="animate-pulse" aria-label="Typing">
                        ...
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}