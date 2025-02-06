"use client";

import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { Attachment, ChatRequestOptions, generateId } from "ai";
import { Message, useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import useChatStore from "@/app/hooks/useChatStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import dynamic from 'next/dynamic'

export interface ChatProps {
  id: string;
  initialMessages: Message[] | [];
  isMobile?: boolean;
}

const DynamicChatComponent = dynamic(() => import('./chat-topbar'), { ssr: false });
const DynamicChatList = dynamic(() => import('./chat-list'), { ssr: false });
const DynamicChatBottombar = dynamic(() => import('./chat-bottombar'), { ssr: false });

export default function Chat({ initialMessages, id, isMobile }: ChatProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
  } = useChat({
    id,
    initialMessages,
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: (message) => {
      const savedMessages = getMessagesById(id);
      saveMessages(id, [...savedMessages, message]);
      setLoadingSubmit(false);
      router.replace(`/c/${id}`);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      router.replace("/");
      console.error(error.message);
      console.error(error.cause);
    },
  });

  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const [isReady, setIsReady] = useState(false);  // Add a state to check if translation is ready
  const formRef = useRef<HTMLFormElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const saveMessages = useChatStore((state) => state.saveMessages);
  const getMessagesById = useChatStore((state) => state.getMessagesById);
  const router = useRouter();
  const { t } = useTranslation("translation"); // 使用 i18n 获取翻译
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // 在客户端渲染时设置 isClient
    setIsReady(true);  // Ensure translation is ready before rendering content
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.history.replaceState({}, "", `/c/${id}`);

    if (!selectedModel) {
      toast.error("Please select a model");
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
    };

    setLoadingSubmit(true);

    const attachments: Attachment[] = base64Images
      ? base64Images.map((image) => ({
          contentType: "image/base64",
          url: image,
        }))
      : [];

    const requestOptions: ChatRequestOptions = {
      body: {
        selectedModel: selectedModel,
      },
      ...(base64Images && {
        data: {
          images: base64Images,
        },
        experimental_attachments: attachments,
      }),
    };

    handleSubmit(e, requestOptions);
    saveMessages(id, [...messages, userMessage]);
    setBase64Images(null);
  };

  const removeLatestMessage = () => {
    const updatedMessages = messages.slice(0, -1);
    setMessages(updatedMessages);
    saveMessages(id, updatedMessages);
    return updatedMessages;
  };

  const handleStop = () => {
    stop();
    saveMessages(id, [...messages]);
    setLoadingSubmit(false);
  };

  if (!isClient) {
    return null; // 在客户端渲染前，不显示组件
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-full">
      <DynamicChatComponent
        isLoading={isLoading}
        chatId={id}
        messages={messages}
        setMessages={setMessages}
      />

      {messages.length === 0 ? (
        <div className="flex flex-col h-full w-full items-center gap-4 justify-center">
          <Image
            src="/ollama.png"
            alt="AI"
            width={40}
            height={40}
            className="h-16 w-14 object-contain dark:invert"
          />
          {isReady ? (  // Ensure translation is ready before rendering the text
            <p className="text-center text-base text-muted-foreground">
              {t("chat.help_welcome_message")}
            </p>
          ) : (
            <p className="text-center text-base text-muted-foreground">
              {t("chat.loading")}
            </p>
          )}
          <DynamicChatBottombar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            stop={handleStop}
            setInput={setInput}
          />
        </div>
      ) : (
        <>
          <DynamicChatList
            messages={messages}
            isLoading={isLoading}
            loadingSubmit={loadingSubmit}
            reload={async () => {
              removeLatestMessage();

              const requestOptions: ChatRequestOptions = {
                body: {
                  selectedModel: selectedModel,
                },
              };

              setLoadingSubmit(true);
              return reload(requestOptions);
            }}
          />
          <DynamicChatBottombar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            stop={handleStop}
            setInput={setInput}
          />
        </>
      )}
    </div>
  );
}
