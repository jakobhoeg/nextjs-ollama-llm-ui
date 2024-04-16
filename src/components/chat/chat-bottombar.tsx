'use client';

import React from 'react';
import { ChatProps } from './chat';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '../ui/textarea';
import { EmojiPicker } from '../emoji-picker';
import { ImageIcon, PaperPlaneIcon, StopIcon } from '@radix-ui/react-icons';
import { TiMicrophoneOutline } from 'react-icons/ti';
import useSpeechToText from '@/app/hooks/useSpeechToText';

export default function ChatBottombar({
  messages,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
}: ChatProps) {
  const [message, setMessage] = React.useState(input);
  const [isMobile, setIsMobile] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [isDisabled, setIsDisabled] = React.useState(true);

  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText({ continuous: true });

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const handleClick = () => {
    setIsDisabled((cur) => !cur);
    startStopListening();
  };

  const stopVoiceInput = () => {
    setInput(transcript.length ? transcript : '');
    stopListening();
  };

  React.useEffect(() => {
    if (!isDisabled) {
    }
  }, [isDisabled]);

  React.useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 p-4">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative mb-2 w-full items-center"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full items-center gap-2"
          >
            <div className="flex">
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'icon' }),
                )}
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </Link>
            </div>

            <TextareaAutosize
              autoComplete="off"
              value={
                isListening ? (transcript.length ? transcript : '') : input
              }
              disabled={isListening}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder={
                isDisabled ? 'Ask Ollama anything...' : 'Listening...'
              }
              className="flex h-14 max-h-20 w-full resize-none items-center overflow-hidden rounded-full border border-input px-5 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card/35"
              onClick={() => handleClick()}
            />

            <div
              className="flex border-white hover:border"
              onClick={() => handleClick()}
            >
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                type="submit"
                disabled={isDisabled}
              >
                <TiMicrophoneOutline className=" h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
            {!isLoading ? (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                <PaperPlaneIcon className=" h-6 w-6 text-muted-foreground" />
              </Button>
            ) : (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                onClick={stop}
              >
                <StopIcon className="h-6 w-6  text-muted-foreground" />
              </Button>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
