import * as React from "react"
import * as LucideIcons from "lucide-react"

import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, "icon"> {
  icon?: keyof typeof LucideIcons;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = "left", ...props }, ref) => {
    if (!icon) {
      return (
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "w-full min-w-0 border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[4px]",
            "border-[var(--Stone-200)]",
            "placeholder:text-[var(--Stone-500)]",
            "aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
      )
    }

    const IconComponent = LucideIcons[icon] as React.ComponentType<{ className?: string }>;

    return (
      <div className="relative w-full">
        {iconPosition === "left" && IconComponent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--Stone-500)]">
            <IconComponent className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "w-full min-w-0 border bg-transparent py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[4px]",
            "border-[var(--Stone-200)]",
            "placeholder:text-[var(--Stone-500)]",
            "aria-invalid:border-destructive",
            iconPosition === "left" && "pl-9 pr-3",
            iconPosition === "right" && "pl-3 pr-9",
            className
          )}
          {...props}
        />
        {iconPosition === "right" && IconComponent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Stone-500)]">
            <IconComponent className="h-4 w-4" />
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
