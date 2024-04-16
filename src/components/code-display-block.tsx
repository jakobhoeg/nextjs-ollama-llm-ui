'use client';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import React from 'react';
import { CodeBlock, dracula, github } from 'react-code-blocks';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface ButtonCodeblockProps {
  code: string;
  lang: string;
}

export default function CodeDisplayBlock({ code, lang }: ButtonCodeblockProps) {
  const [isCopied, setisCopied] = React.useState(false);
  const { theme } = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setisCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => {
      setisCopied(false);
    }, 1500);
  };

  return (
    <div className="relative my-4 flex flex-col  overflow-scroll overflow-x-scroll   text-start  ">
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-5 w-5"
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 scale-100 transition-all" />
        ) : (
          <CopyIcon className="h-4 w-4 scale-100 transition-all" />
        )}
      </Button>
      <CodeBlock
        customStyle={
          theme === 'dark'
            ? { background: '#303033' }
            : { background: '#fcfcfc' }
        }
        text={code}
        language="tsx"
        showLineNumbers={false}
        theme={theme === 'dark' ? dracula : github}
      />
    </div>
  );
}
