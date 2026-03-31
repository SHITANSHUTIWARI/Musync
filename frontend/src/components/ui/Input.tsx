import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full relative flex flex-col gap-1.5 min-w-0">
        {label && (
          <label className="text-sm font-bold text-foreground capitalize tracking-tight">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full rounded-xl bg-surface border border-border px-4 py-2 text-sm",
              "transition-all duration-200 ease-out",
              "placeholder:text-muted-foreground/60 text-foreground font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50",
              "disabled:cursor-not-allowed disabled:bg-surface-low disabled:text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive/30",
              isPassword && "pr-11",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              disabled={disabled}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {(error || hint) && (
          <p className={cn("text-[11px] font-medium leading-relaxed mt-0.5", error ? "text-destructive" : "text-muted-foreground")}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
