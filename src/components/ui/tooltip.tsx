import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-white px-3 py-1.5 text-sm text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:bg-gray-800 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const Tooltip = TooltipPrimitive.Root

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} 