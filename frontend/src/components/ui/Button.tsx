import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const variants = {
  primary:
    "signature-gradient text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110",
  secondary:
    "bg-surface-high text-foreground border border-border hover:bg-surface-highest hover:border-border/80",
  ghost:
    "text-muted-foreground hover:bg-surface-high hover:text-foreground",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
  outline:
    "border border-border bg-transparent hover:bg-surface-high hover:border-border/80 text-foreground",
};

const sizes = {
  sm:   "h-8 px-3.5 text-xs rounded-xl font-semibold tracking-tight",
  md:   "h-10 px-5 text-sm rounded-xl font-semibold tracking-tight",
  lg:   "h-12 px-7 text-base rounded-2xl font-bold",
  icon: "h-9 w-9 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        "active:scale-[0.97]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin shrink-0" /> : null}
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
