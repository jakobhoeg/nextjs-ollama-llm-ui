import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

import { DownloadIcon } from "@radix-ui/react-icons";
import PullModelForm from "./pull-model-form";
import { useTranslation } from "react-i18next";

export default function PullModel() {
  const { t } = useTranslation("translation"); // 使用 i18n 获取翻译
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
          <DownloadIcon className="w-4 h-4" />
          <p>{t("model.pull_model")}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogTitle>{t("model.pull_model")}</DialogTitle>
        <PullModelForm />
      </DialogContent>
    </Dialog>
  );
}
