import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DropdownMenu } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DownloadIcon } from "@radix-ui/react-icons";

export default function PullModel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex gap-2 s cursor-pointer">
          <DownloadIcon className="w-4 h-5" />
          <p>Pull model</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>GG</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
