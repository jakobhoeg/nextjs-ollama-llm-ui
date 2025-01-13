import React, { forwardRef } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ButtonWithTooltipProps {
  children: React.ReactElement;
  side: "top" | "bottom" | "left" | "right";
  toolTipText: string;
}

const ButtonWithTooltip = forwardRef<HTMLDivElement, ButtonWithTooltipProps>(
  ({ children, side, toolTipText }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {React.cloneElement(children, { ref })}
          </TooltipTrigger>
          <TooltipContent side={side}>
            <div>{toolTipText}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ButtonWithTooltip.displayName = "ButtonWithTooltip";

export default ButtonWithTooltip;
