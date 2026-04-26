import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Assuming Next.js

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  imageUrl: string;
  tag?: string; // e.g., "ELECTRONIC", "CINEMATIC"
  creatorName: string;
  creatorAvatarUrl?: string;
  budgetOrType?: string; // e.g., "$2.5k - $5k", "Revenue Share"
  actionNode?: React.ReactNode;
}

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, title, description, imageUrl, tag, creatorName, creatorAvatarUrl, budgetOrType, actionNode, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("group cursor-pointer flex flex-col", className)}
        {...props}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 group-hover:border-primary/50 transition-colors">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-lowest via-transparent to-transparent opacity-80" />
          
          {tag && (
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/20 uppercase tracking-wider">
                {tag}
              </span>
            </div>
          )}

          {actionNode && (
            <div className="absolute top-4 right-4 z-10">
              {actionNode}
            </div>
          )}
        </div>
        
        <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-secondary-foreground text-sm line-clamp-2 mt-1 font-body">
          {description}
        </p>
        
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            {creatorAvatarUrl ? (
              <img
                src={creatorAvatarUrl}
                alt={creatorName}
                className="w-6 h-6 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center text-[10px] font-bold">
                {creatorName[0]}
              </div>
            )}
            <span className="text-[10px] text-secondary-foreground font-bold uppercase tracking-wider">
              {creatorName}
            </span>
          </div>
          {budgetOrType && (
            <span className="text-xs font-bold text-on-surface">
              {budgetOrType}
            </span>
          )}
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";
