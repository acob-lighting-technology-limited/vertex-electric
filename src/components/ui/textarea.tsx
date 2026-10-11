import * as React from "react"
import { cn } from "@vertex/ui/lib/cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-transparent bg-surface-2/70 px-4 py-3 text-base hover:bg-surface-2 dark:bg-white/[0.05] transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-accent-text focus-visible:bg-surface focus-visible:shadow-[0_0_0_4px_var(--vx-glow)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
