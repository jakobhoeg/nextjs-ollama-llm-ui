import React from 'react'
import ChatTopbar from './chat-topbar'
import ChatList from './chat-list'
import ChatBottombar from './chat-bottombar'
import { Message, useChat } from 'ai/react';
import { ChatRequestOptions } from 'ai';

export interface ChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
  isLoading: boolean;
  error: undefined | Error;
  stop: () => void;
  }

export default function Chat() {

const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop  } = useChat();

  return (
    <div className="flex flex-col justify-between w-full h-full  ">
        <ChatTopbar />

        <ChatList  
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
        />

        <ChatBottombar 
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
        />

    </div>
  )
}
