import React from 'react'
import ChatTopbar from './chat-topbar'
import ChatList from './chat-list'
import ChatBottombar from './chat-bottombar'
import { Message, useChat } from 'ai/react';
import { ChatRequestOptions } from 'ai';
import { v4 as uuidv4 } from 'uuid';

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

const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop, setMessages  } = useChat();
const [chatId, setChatId] = React.useState<string>('');

React.useEffect(() => {
  console.log('chatId', chatId);
}, [chatId]);

React.useEffect(() => {
  
  if (!isLoading && !error) {
    // Save messages to local storage
  localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  }

}, [messages, chatId, isLoading, error]);

const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (messages.length === 0) {
    // Generate a random id for the chat
  const id = uuidv4();
  setChatId(id);
  }

  setMessages([
    ...messages,
  ]);

  handleSubmit(e);
}

  return (
    <div className="flex flex-col justify-between w-full h-full  ">
        <ChatTopbar />

        <ChatList  
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
        />

        <ChatBottombar 
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
        />

    </div>
  )
}
