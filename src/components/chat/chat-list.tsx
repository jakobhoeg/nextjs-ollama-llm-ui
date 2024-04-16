import { Message, useChat } from 'ai/react';
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChatProps } from './chat';
import Image from 'next/image';
import CodeDisplayBlock from '../code-display-block';

export default function ChatList({
  messages,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  loadingSubmit,
}: ChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = React.useState<string>('');
  const [localStorageIsLoading, setLocalStorageIsLoading] =
    React.useState(true);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const username = localStorage.getItem('ollama_user');
    if (username) {
      setName(username);
      setLocalStorageIsLoading(false);
    }
  }, []);

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/ollama.png"
            alt="AI"
            width={60}
            height={60}
            className="h-20 w-14 object-contain dark:invert"
          />
          <p className="text-center text-lg text-muted-foreground">
            How can I help you today?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scroller"
      className="h-full w-full justify-end overflow-x-hidden overflow-y-scroll"
    >
      <div className="flex min-h-full w-full flex-col justify-end overflow-x-hidden overflow-y-hidden">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: 'spring',
                bounce: 0.3,
                duration: messages.indexOf(message) * 0.05 + 0.2,
              },
            }}
            className={cn(
              'flex flex-col gap-2 whitespace-pre-wrap p-4',
              message.role === 'user' ? 'items-end' : 'items-start',
            )}
          >
            <div className="flex items-center gap-3">
              {message.role === 'user' && (
                <div className="flex items-end gap-3">
                  <span className="max-w-xs overflow-x-auto rounded-md bg-accent p-3 sm:max-w-2xl">
                    {message.content}
                  </span>
                  <Avatar className="flex items-center justify-start overflow-hidden">
                    <AvatarImage
                      src="/"
                      alt="user"
                      width={6}
                      height={6}
                      className="object-contain"
                    />
                    <AvatarFallback>
                      {name && name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              {message.role === 'assistant' && (
                <div className="flex items-end gap-2">
                  <Avatar className="flex items-center justify-start">
                    <AvatarImage
                      src="/ollama.png"
                      alt="AI"
                      width={6}
                      height={6}
                      className="object-contain dark:invert"
                    />
                  </Avatar>
                  <span className="max-w-xs overflow-x-auto rounded-md bg-accent p-3 sm:max-w-2xl">
                    {/* Check if the message content contains a code block */}
                    {message.content.split('```').map((part, index) => {
                      if (index % 2 === 0) {
                        return (
                          <React.Fragment key={index}>{part}</React.Fragment>
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap" key={index}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}
                    {isLoading &&
                      messages.indexOf(message) === messages.length - 1 && (
                        <span className="animate-pulse" aria-label="Typing">
                          ...
                        </span>
                      )}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loadingSubmit && (
          <div className="flex items-center gap-2 pb-4 pl-4">
            <Avatar className="flex items-center justify-start">
              <AvatarImage
                src="/ollama.png"
                alt="AI"
                width={6}
                height={6}
                className="object-contain dark:invert"
              />
            </Avatar>
            <div className="max-w-xs overflow-x-auto rounded-md bg-accent p-3 sm:max-w-2xl">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
