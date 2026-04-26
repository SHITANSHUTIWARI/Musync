import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "light" | "medium" | "heavy";
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, intensity = "medium", ...props }, ref) => {
    // Variations of glass opacities based on intensity
    const intensityClasses = {
      light: "bg-surface-bright/20 backdrop-blur-md",
      medium: "bg-surface-bright/40 backdrop-blur-2xl",
      heavy: "bg-surface-bright/60 backdrop-blur-3xl"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/5 shadow-2xl overflow-hidden",
          intensityClasses[intensity],
          className
        )}
        {...props}
      />
    );
  }
);
GlassPanel.displayName = "GlassPanel";
