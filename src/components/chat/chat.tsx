import React from 'react';
import ChatTopbar from './chat-topbar';
import ChatList from './chat-list';
import ChatBottombar from './chat-bottombar';
import { Message, useChat } from 'ai/react';
import { ChatRequestOptions } from 'ai';
import { v4 as uuidv4 } from 'uuid';

export interface ChatProps {
  chatId?: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  isLoading: boolean;
  loadingSubmit?: boolean;
  error: undefined | Error;
  stop: () => void;
}

export default function Chat({
  messages,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  setSelectedModel,
  chatId,
  loadingSubmit,
}: ChatProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between  ">
      <ChatTopbar
        setSelectedModel={setSelectedModel}
        isLoading={isLoading}
        chatId={chatId}
        messages={messages}
      />

      <ChatList
        setSelectedModel={setSelectedModel}
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        stop={stop}
      />

      <ChatBottombar
        setSelectedModel={setSelectedModel}
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
      />
    </div>
  );
}
