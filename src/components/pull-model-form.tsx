"use client";

import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";
import { throttle } from "lodash";
import useChatStore from "@/app/hooks/useChatStore";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";  // 引入 i18n

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please select a model to pull",
  }),
});

export default function PullModelForm() {
  const {
    isDownloading,
    downloadProgress,
    downloadingModel,
    startDownload,
    stopDownload,
    setDownloadProgress,
  } = useChatStore();

  const router = useRouter();
  const { t } = useTranslation();  // 使用翻译函数

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handlePullModel = async (data: z.infer<typeof formSchema>) => {
    const modelName = data.name.trim();
    startDownload(modelName);

    const throttledSetProgress = throttle((progress: number) => {
      setDownloadProgress(progress);
    }, 200);

    let lastStatus: string | null = null;

    try {
      const response = await fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) {
        throw new Error("Something went wrong");
      }

      await processStream(response.body, throttledSetProgress, lastStatus);

      toast.success(t("model.model_pull_success"));  // 使用翻译
      router.refresh();
    } catch (error) {
      toast.error(
        `Error: ${
          error instanceof Error ? error.message : "Failed to pull model"
        }`
      );
    } finally {
      stopDownload();
      throttledSetProgress.cancel();
    }
  };

  const processStream = async (
    body: ReadableStream<Uint8Array>,
    throttledSetProgress: (progress: number) => void,
    lastStatus: string | null
  ) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const jsonObjects = text.trim().split("\n");

      for (const jsonObject of jsonObjects) {
        try {
          const responseJson = JSON.parse(jsonObject);

          if (responseJson.error) {
            throw new Error(responseJson.error);
          }

          if (
            responseJson.completed !== undefined &&
            responseJson.total !== undefined
          ) {
            const progress =
              (responseJson.completed / responseJson.total) * 100;
            throttledSetProgress(progress);
          }

          if (responseJson.status && responseJson.status !== lastStatus) {
            toast.info(`${t("model.status")}: ${responseJson.status}`);  // 使用翻译
            lastStatus = responseJson.status;
          }
        } catch (error) {
          throw new Error("Error parsing JSON");
        }
      }
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handlePullModel(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("model.model_select")}</FormLabel> {/* 使用翻译 */}
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="llama2"
                  value={field.value || ""}
                />
              </FormControl>
              <p className="text-xs pt-1">
                {t("model.library_check")}{" "}
                <a
                  href="https://ollama.com/library"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {t("model.library_link")}
                </a>
              </p>
              <FormMessage />
              <div className="space-y-2 w-full">
                <Button
                  type="submit"
                  className="w-full "
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <Loader2Icon className="animate-spin w-4 h-4" />
                      <span>
                        {t("model.pulling")} {downloadingModel}...{" "}
                        {downloadProgress.toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    t("model.start_pull_model")
                  )}
                </Button>
                <p className="text-xs text-center">
                  {isDownloading
                    ? t("model.download_in_progress")
                    : t("model.download_info")}
                </p>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
