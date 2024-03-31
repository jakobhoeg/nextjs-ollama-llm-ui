"use client";

import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please select a model to pull",
  }),
});

export default function PullModelForm() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const env = process.env.NODE_ENV;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Trim whitespace
    data.name = data.name.trim();

    setIsDownloading(true);
    // Send the model name to the server
    if (env === "production") {
      // Make a post request to localhost
      const pullModel = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/pull", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        if (json.error) {
          toast.error("Error: " + json.error);
          setIsDownloading(false);
          return;
        } else if (json.status === "success") {
          toast.success("Model pulled successfully");
          setIsDownloading(false);
          return;
        }
      }
      pullModel();
    } else {
      fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          // Check if response is successful
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          if (!response.body) {
            throw new Error("Something went wrong");
          }
          // Create a new ReadableStream from the response body
          const reader = response.body.getReader();
  
          // Read the data in chunks
          reader.read().then(function processText({ done, value }) {
            if (done) {
              setIsDownloading(false);
              return;
            }
  
            // Convert the chunk of data to a string
            const text = new TextDecoder().decode(value);
  
            // Split the text into individual JSON objects
            const jsonObjects = text.trim().split("\n");
  
            jsonObjects.forEach((jsonObject) => {
              try {
                const responseJson = JSON.parse(jsonObject);
                if (responseJson.error) {
                  // Display an error toast if the response contains an error
                  toast.error("Error: " + responseJson.error);
                  setIsDownloading(false);
                  return;
                } else if (responseJson.status === "success") {
                  // Display a success toast if the response status is success
                  toast.success("Model pulled successfully");
                  setIsDownloading(false);
                  return;
                }
              } catch (error) {
                toast.error("Error parsing JSON");
                setIsDownloading(false);
                return;
              }
            });
  
            // Continue reading the next chunk
            reader.read().then(processText);
          });
        })
        .catch((error) => {
          setIsDownloading(false);
          console.error("Error pulling model:", error);
          toast.error("Error pulling model");
        });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    form.setValue("name", e.currentTarget.value);
    setName(e.currentTarget.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model name</FormLabel>
              <Input
                {...field}
                type="text"
                placeholder="llama2"
                value={name}
                onChange={(e) => handleChange(e)}
              />
              <p className="text-xs pt-1">
                Check the{" "}
                <a
                  href="https://ollama.com/library"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  library
                </a>{" "}
                for a list of available models.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 w-full">
          <Button type="submit" className="w-full " disabled={isDownloading}>
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin w-4 h-4" />
                <span>Pulling model...</span>
              </div>
            ) : (
              "Pull model"
            )}
          </Button>
          <p className="text-xs text-center">
            {isDownloading
              ? "This may take a while. You can safely close this modal and continue using the app"
              : "Pressing the button will download the specified model to your device."}
          </p>
        </div>
      </form>
    </Form>
  );
}
