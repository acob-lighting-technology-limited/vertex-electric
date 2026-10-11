import * as React from "react"
import { cn } from "@vertex/ui/lib/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-transparent bg-surface-2/70 px-4 py-2 text-base transition-[color,background-color,border-color,box-shadow] duration-300 outline-none hover:bg-surface-2 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/[0.05] dark:hover:bg-white/[0.07]",
        "focus-visible:border-accent-text focus-visible:bg-surface focus-visible:shadow-[0_0_0_4px_var(--vx-glow)]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
