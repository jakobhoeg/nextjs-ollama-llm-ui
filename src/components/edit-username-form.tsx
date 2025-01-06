"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner";
import useChatStore from "@/app/hooks/useChatStore";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

interface EditUsernameFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUsernameForm({ setOpen }: EditUsernameFormProps) {
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userName,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUserName(values.username); // Update the userName in the store
    toast.success("Name updated successfully");
  }

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-4 pt-4">
        <FormLabel>Theme</FormLabel>
        <ModeToggle />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="md:flex gap-4">
                  <Input {...field} type="text" placeholder="Enter your name" />
                  <Button type="submit">Change name</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
