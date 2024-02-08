"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GearIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { set } from "zod";

export default function UserSettings() {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleStorageChange = () => {
          const username = localStorage.getItem("ollama_user");
          if (username) {
            setName(username);
            setIsLoading(false);
          }
        };
      
        const fetchData = () => {
          const username = localStorage.getItem("ollama_user");
          if (username) {
            setName(username);
            setIsLoading(false);
          }
        };
      
        // Initial fetch
        fetchData();
      
        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);
      
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);
        

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex justify-start gap-3 w-full h-14 text-base font-normal items-center "
          >
            <Avatar className="flex justify-start items-center overflow-hidden">
              <AvatarImage
                src=""
                alt="AI"
                width={4}
                height={4}
                className="object-contain"
              />
              <AvatarFallback>
                {name && name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs">
            {isLoading ? (
                <Skeleton className="w-20 h-4" />
            ) : (
                name || "Anonymous"
            )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuItem className="text-xs">
            <DialogTrigger asChild>
              <div
                className="flex w-full gap-2 items-center cursor-pointer"
              >
                <GearIcon className="w-4 h-4" />
                Settings
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Do you want to delete the entry? Deleting this entry cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </DropdownMenu>
    </Dialog>
  );
}
