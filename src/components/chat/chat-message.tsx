import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "../code-display-block";
import { Message } from "ai/react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import ButtonWithTooltip from "../button-with-tooltip";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { ChatRequestOptions } from "ai";
import { RefreshCcw } from "lucide-react";

export type ChatMessageProps = {
  message: Message;
  isLast: boolean;
  isLoading: boolean | undefined;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

function ChatMessage({ message, isLast, isLoading, reload }: ChatMessageProps) {
  const contentParts = useMemo(
    () => message.content.split("```"),
    [message.content]
  );

  const variant = message.role === "user" ? "sent" : "received";

  const [isCopied, setisCopied] = React.useState<boolean>(false);

  const copyToClipboard = (response: string) => () => {
    navigator.clipboard.writeText(response);
    setisCopied(true);
    setTimeout(() => {
      setisCopied(false);
    }, 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: 0.2,
        },
      }}
      className={`flex flex-col gap-2 whitespace-pre-wrap `}
    >
      <ChatBubble variant={variant}>
        <ChatBubbleAvatar
          src={message.role === "assistant" ? "/ollama.png" : ""}
          width={6}
          height={6}
          className="object-contain dark:invert"
          fallback={message.role == "user" ? "US" : ""}
        />
        <ChatBubbleMessage>
          <div className="flex gap-2">
            {message.experimental_attachments
              ?.filter((attachment) =>
                attachment.contentType?.startsWith("image/")
              )
              .map((attachment, index) => (
                <Image
                  key={`${message.id}-${index}`}
                  src={attachment.url}
                  width={200}
                  height={200}
                  alt="attached image"
                  className="rounded-md object-contain"
                />
              ))}
          </div>
          {contentParts.map((part, index) => {
            if (index % 2 === 0) {
              return (
                <Markdown key={index} remarkPlugins={[remarkGfm]}>
                  {part}
                </Markdown>
              );
            } else {
              return (
                <pre className="whitespace-pre-wrap" key={index}>
                  <CodeDisplayBlock code={part} />
                </pre>
              );
            }
          })}

          {message.role === "assistant" && (
            <div>
              {/* Action buttons */}
              <div className="pt-2 flex gap-1 items-center text-muted-foreground">
                {/* Copy button */}
                {!isLoading && (
                  <ButtonWithTooltip side="bottom" toolTipText="Copy">
                    <Button
                      onClick={copyToClipboard(message.content)}
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                    >
                      {isCopied ? (
                        <CheckIcon className="w-3.5 h-3.5 transition-all" />
                      ) : (
                        <CopyIcon className="w-3.5 h-3.5 transition-all" />
                      )}
                    </Button>
                  </ButtonWithTooltip>
                )}

                {/* Only show regenerate button on the last ai message */}
                {!isLoading && isLast && (
                  <ButtonWithTooltip side="bottom" toolTipText="Regenerate">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => reload()}
                    >
                      <RefreshCcw className="w-3.5 h-3.5 scale-100 transition-all" />
                    </Button>
                  </ButtonWithTooltip>
                )}
              </div>
            </div>
          )}
        </ChatBubbleMessage>
      </ChatBubble>
    </motion.div>
  );
}

export default memo(ChatMessage, (prevProps, nextProps) => {
  // Always re-render the last message
  if (nextProps.isLast) return false;

  // Otherwise, shallow compare
  return (
    prevProps.isLast === nextProps.isLast &&
    prevProps.message === nextProps.message
  );
});
