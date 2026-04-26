import * as React from "react";
import { cn } from "@/lib/utils";

interface ArtistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  imageUrl: string;
  location?: string;
  tags?: string[];
  endorsements?: number;
  action?: React.ReactNode;
}

export const ArtistCard = React.forwardRef<HTMLDivElement, ArtistCardProps>(
  ({ className, name, role, imageUrl, location, tags = [], endorsements = 0, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-low rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="absolute top-0 right-0 p-4">
          {endorsements > 0 && (
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">verified</span>
              {endorsements}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full p-1 border border-white/10 group-hover:border-primary/50 transition-colors">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          
          <h3 className="font-headline text-lg font-bold text-foreground">
            {name}
          </h3>
          <p className="text-secondary-foreground text-xs font-medium uppercase tracking-wider mt-1">
            {role}
          </p>
          
          {location && (
            <p className="text-[10px] text-secondary-foreground/60 mt-1 uppercase tracking-widest">
              {location}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-surface-high rounded-sm text-[10px] font-bold text-secondary-foreground tracking-wider uppercase border border-white/5"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-primary font-bold">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {action && (
            <div className="mt-6 w-full relative z-10">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ArtistCard.displayName = "ArtistCard";
