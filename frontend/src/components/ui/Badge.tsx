"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neon-violet/10 text-neon-violet hover:bg-neon-violet/20",
        secondary:
          "border-transparent bg-white/[0.06] text-mist hover:bg-white/[0.1]",
        destructive:
          "border-transparent bg-ruby/10 text-ruby hover:bg-ruby/20",
        outline: "text-mist border-white/[0.06]",
        neon: "border-neon-violet/30 bg-neon-violet/10 text-neon-violet shadow-glow-sm",
        success: "border-emerald/30 bg-emerald/10 text-emerald",
        warning: "border-amber/30 bg-amber/10 text-amber",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className,
        "font-body uppercase tracking-widest text-[10px]"
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
