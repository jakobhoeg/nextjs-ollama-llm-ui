"use client";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import React, { useMemo, useRef, useState } from "react";
import { CodeBlock, dracula, github } from "react-code-blocks";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface ButtonCodeblockProps {
  code: string;
}

export default function CodeDisplayBlock({ code }: ButtonCodeblockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isCopiedRef = useRef(false);
  const { theme } = useTheme();

  const filteredCode = useMemo(
    () => code.split("\n").slice(1).join("\n") || code,
    [code]
  );
  const trimmedCode = useMemo(() => filteredCode.trim(), [filteredCode]);
  const language = useMemo(
    () =>
      ["tsx", "js", "python", "css", "html", "cs"].includes(code.split("\n")[0])
        ? code.split("\n")[0]
        : "tsx",
    [code]
  );

  const customStyle = useMemo(
    () =>
      theme === "dark" ? { background: "#303033" } : { background: "#fcfcfc" },
    [theme]
  );
  const codeTheme = useMemo(
    () => (theme === "dark" ? dracula : github),
    [theme]
  );

  const copyToClipboard = () => {
    if (isCopiedRef.current) return; // Prevent multiple triggers
    navigator.clipboard.writeText(trimmedCode);
    isCopiedRef.current = true;
    setIsCopied(true);
    toast.success("Code copied to clipboard!");

    setTimeout(() => {
      isCopiedRef.current = false;
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div className="relative my-4 overflow-hidden flex flex-col text-start">
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="icon"
        className="h-5 w-5 absolute top-2 right-2"
      >
        {isCopied ? (
          <CheckIcon className="w-4 h-4 scale-100 transition-all" />
        ) : (
          <CopyIcon className="w-4 h-4 scale-100 transition-all" />
        )}
      </Button>
      <CodeBlock
        customStyle={customStyle}
        text={trimmedCode}
        language={language}
        showLineNumbers={false}
        theme={codeTheme}
      />
    </div>
  );
}
