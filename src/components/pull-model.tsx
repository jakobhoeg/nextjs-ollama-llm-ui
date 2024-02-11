import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DownloadIcon } from "@radix-ui/react-icons";
import PullModelForm from "./pull-model-form";

export default function PullModel() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
          <DownloadIcon className="w-4 h-4" />
          <p>Pull model</p>
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-2">
      <DialogTitle>Pull Model</DialogTitle>
          <PullModelForm />
      </DialogContent>
    </Dialog>
  );
}
