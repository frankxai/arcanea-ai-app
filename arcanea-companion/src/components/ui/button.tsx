import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "arcane";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-arcane text-white hover:bg-arcane-glow shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]":
                            variant === "primary",
                        "bg-surface hover:bg-surface-hover text-text-primary border border-border":
                            variant === "secondary",
                        "bg-transparent hover:bg-surface/50 text-text-secondary hover:text-text-primary":
                            variant === "ghost",
                        "bg-gradient-to-r from-arcane to-pink-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/20":
                            variant === "arcane",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-10 px-6 py-2": size === "md",
                        "h-12 px-8 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, cn };
