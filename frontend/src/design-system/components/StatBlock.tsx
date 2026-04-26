import * as React from "react";
import { cn } from "@/lib/utils";

interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string; // e.g., "+12% this week"
  trendStatus?: "positive" | "negative" | "neutral";
}

export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, title, value, subtitle, icon, trend, trendStatus = "neutral", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-low rounded-xl p-6 border-l-2 relative overflow-hidden group transition-all duration-300 hover:bg-surface-high border-transparent hover:border-primary/50",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-secondary-foreground font-label uppercase tracking-widest">
            {title}
          </p>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-headline font-black text-foreground">
            {value}
          </p>
          {trend && (
            <span
              className={cn("text-xs font-bold", {
                "text-primary": trendStatus === "positive",
                "text-destructive": trendStatus === "negative",
                "text-secondary-foreground": trendStatus === "neutral",
              })}
            >
              {trend}
            </span>
          )}
        </div>
        
        {subtitle && (
          <p className="text-[10px] text-secondary-foreground mt-2 italic font-medium">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
StatBlock.displayName = "StatBlock";
