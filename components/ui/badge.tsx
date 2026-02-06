import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-arcane-crystal/50 focus:ring-offset-2 focus:ring-offset-cosmic-void",
  {
    variants: {
      variant: {
        default: "border-transparent bg-arcane-fire text-white",
        secondary: "border-white/10 bg-white/5 text-text-secondary",
        destructive: "border-transparent bg-red-600 text-white",
        outline: "border-arcane-crystal/20 text-text-secondary",
        crystal: "border-arcane-crystal/20 text-arcane-crystal bg-arcane-crystal/10",
        gold: "border-arcane-gold/20 text-arcane-gold bg-arcane-gold/10",
        void: "border-arcane-void/30 text-arcane-void-bright bg-arcane-void/10",
        fire: "border-arcane-fire/20 text-arcane-fire bg-arcane-fire/10",
        water: "border-arcane-water/20 text-arcane-water bg-arcane-water/10",
        earth: "border-arcane-earth/20 text-arcane-earth bg-arcane-earth/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
