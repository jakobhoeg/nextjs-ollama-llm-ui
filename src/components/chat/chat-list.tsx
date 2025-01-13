import { Message } from "ai/react";
import React from "react";
import ChatMessage from "./chat-message";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import { ChatRequestOptions } from "ai";

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  loadingSubmit?: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

export default function ChatList({
  messages,
  isLoading,
  loadingSubmit,
  reload,
}: ChatListProps) {
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <ChatMessageList>
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            isLast={index === messages.length - 1}
            isLoading={isLoading}
            reload={reload}
          />
        ))}
        {loadingSubmit && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              src="/ollama.png"
              width={6}
              height={6}
              className="object-contain dark:invert"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
}
