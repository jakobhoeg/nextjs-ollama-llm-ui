"use client";

import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";

interface ChatTopbarProps {
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
}

export default function ChatTopbar({
  setSelectedModel,
  isLoading,
  chatId,
  messages,
}: ChatTopbarProps) {
  const [models, setModels] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState<string | null>(null);

  useEffect(() => {
    const getLocalStorageModel = localStorage.getItem("selectedModel");
    if (getLocalStorageModel) {
      setCurrentModel(getLocalStorageModel);
      setSelectedModel(getLocalStorageModel);
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
        );
        const data = await res.json();
        // Extract the "name" field from each model object and store them in the state
        const modelNames = data.models.map((model: any) => model.name);
        setModels(modelNames);

        if (!localStorage.getItem("selectedModel")) {
          // save the first model in the list as selectedModel in localstorage
          setCurrentModel(modelNames[0]);
          setSelectedModel(modelNames[0]);

          localStorage.setItem("selectedModel", modelNames[0]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setCurrentModel("Select model");
        setModels([]);
      }
    };
    fetchData();
  }, []);

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    setSelectedModel(model);
    localStorage.setItem("selectedModel", model);
    setOpen(false);
  };

  return (
    <div className="w-full flex px-4 py-6  items-center justify-between lg:justify-center ">
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="lg:hidden w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatId={chatId || ""}
            isCollapsed={false}
            isMobile={false}
            messages={messages}
          />
        </SheetContent>
      </Sheet>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[170px] justify-between"
          >
            {currentModel || "Select model"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[170px] p-1">
          {models.length > 0 ? (
            models.map((model) => (
              <Button
                key={model}
                variant="ghost"
                className="w-full"
                onClick={() => {
                  handleModelChange(model);
                }}
              >
                {model}
              </Button>
            ))
          ) : (
            <Button variant="ghost" disabled className=" w-full">
              No models available
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
