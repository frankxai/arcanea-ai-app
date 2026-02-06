import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane-crystal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-void disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-semibold shadow-glow-sm hover:shadow-glow-md",
        destructive: "bg-red-600 text-white hover:bg-red-600/80",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:border-arcane-crystal/30 text-text-secondary hover:text-white",
        secondary: "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white",
        ghost: "text-text-secondary hover:bg-white/5 hover:text-white",
        link: "text-arcane-crystal underline-offset-4 hover:underline",
        crystal: "bg-arcane-crystal text-cosmic-void font-semibold hover:bg-arcane-crystal/80 shadow-glow-sm",
        gold: "bg-arcane-gold text-cosmic-void font-semibold hover:bg-arcane-gold/80",
        void: "bg-arcane-void text-white hover:bg-arcane-void/80",
        fire: "bg-gradient-to-r from-arcane-fire to-orange-500 text-white font-semibold shadow-glow-fire hover:shadow-glow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
