"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 font-semibold font-body text-sm rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50 disabled:opacity-40 disabled:pointer-events-none select-none shrink-0",
  {
    variants: {
      variant: {
        // Aurora gradient primary
        primary:
          "aurora-bg text-white shadow-glow-sm hover:shadow-glow hover:opacity-95 active:scale-[0.97]",
        default:
          "aurora-bg text-white shadow-glow-sm hover:shadow-glow hover:opacity-95 active:scale-[0.97]",
        // Ghost: transparent until hovered
        ghost:
          "text-silver hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 active:scale-[0.97]",
        // Outline: subtle border
        outline:
          "bg-transparent border border-white/10 text-mist hover:border-neon-violet/40 hover:text-white hover:bg-neon-violet/5 active:scale-[0.97]",
        // Destructive
        destructive:
          "bg-ruby/10 border border-ruby/20 text-ruby hover:bg-ruby/20 active:scale-[0.97]",
        // Secondary surface
        secondary:
          "bg-white/[0.06] border border-white/[0.08] text-mist hover:bg-white/[0.1] hover:text-white active:scale-[0.97]",
        // Success
        success:
          "bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 active:scale-[0.97]",
        // Link style
        link:
          "text-neon-violet hover:text-electric-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:   "h-7  px-3  text-xs  rounded-lg",
        sm:   "h-8  px-4  text-xs",
        md:   "h-9  px-5  text-sm",
        DEFAULT: "h-10 px-5  text-sm",
        lg:   "h-12 px-7  text-base",
        xl:   "h-14 px-9  text-lg",
        icon: "h-9  w-9   p-0 rounded-xl",
        "icon-sm": "h-7 w-7 p-0 rounded-lg",
        "icon-lg": "h-11 w-11 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "DEFAULT",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-current opacity-70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="opacity-70">Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
