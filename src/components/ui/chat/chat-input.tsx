import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={(ref) => {
        if (ref) {
          ref.style.height = "0px";
          ref.style.height = ref.scrollHeight + "px";
        }
      }}
      name="message"
      className={cn(
        "px-4 py-3 min-h-12 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-12",
        className
      )}
      {...props}
    />
  )
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
