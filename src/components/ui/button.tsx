import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-gray-300",
          "h-9 px-4 py-2",
          "bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 