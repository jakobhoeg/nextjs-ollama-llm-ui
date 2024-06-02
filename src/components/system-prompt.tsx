"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner"
import {Textarea} from "@/components/ui/textarea";


const formSchema = z.object({
    systemPrompt: z.string().min(1, {
    message: "System prompt must be at least 1 characters.",
  }),
});

interface SystemPromptFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SystemPromptForm({ setOpen }: SystemPromptFormProps) {
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
      setSystemPrompt(localStorage.getItem("ollama_system_prompt") || "");
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        systemPrompt: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("ollama_system_prompt", values.systemPrompt);
    window.dispatchEvent(new Event("storage"));
    toast.success("Name updated successfully");
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    form.setValue("systemPrompt", e.currentTarget.value);
    setSystemPrompt(e.currentTarget.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="md:flex gap-4">
                  <Textarea
                    {...field}
                    value={systemPrompt}
                    rows={8}
                    onChange={(e) => handleChange(e)}
                  />
                  <Button type="submit">
                    Update
                  </Button>
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
