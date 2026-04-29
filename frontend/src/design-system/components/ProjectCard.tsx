"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Music2, Clock } from "lucide-react";

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  imageUrl?: string;
  genres?: string[];
  tag?: string;
  creatorName?: string;
  budgetOrType?: string;
  status?: string;
  audioUrl?: string;
  onPlay?: () => void;
  actionNode?: React.ReactNode;
}

// Static waveform bars for visual interest
const Waveform = () => (
  <div className="flex items-end gap-[2px] h-5">
    {[3, 7, 5, 9, 4, 8, 6, 10, 5, 7, 4, 8, 6, 9, 3, 7, 5, 8, 4, 6].map((h, i) => (
      <div
        key={i}
        className="w-[2px] rounded-full bg-white/40"
        style={{ height: `${h * 10}%`, animationDelay: `${i * 0.06}s` }}
      />
    ))}
  </div>
);

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, title, description, imageUrl, genres = [], tag, creatorName, budgetOrType, status, audioUrl, onPlay, onClick, actionNode, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false);

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onClick}
        className={cn(
          "relative rounded-2xl overflow-hidden cursor-pointer group",
          "bg-onyx border border-white/[0.06] hover:border-neon-violet/25 transition-colors duration-300",
          className
        )}
        {...(props as any)}
      >
        {/* Cover art */}
        <div className="relative h-44 overflow-hidden bg-carbon">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full aurora-bg opacity-30 flex items-center justify-center">
              <Music2 size={40} className="text-white/40" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />

          {/* Play button */}
          <motion.button
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full aurora-bg shadow-glow flex items-center justify-center"
          >
            <Play size={18} className="text-white ml-0.5" fill="white" />
          </motion.button>

          {/* Status / tag badge */}
          {(tag || status) && (
            <div className="absolute top-3 left-3">
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border font-body",
                status === "published" || tag === "LIVE"
                  ? "text-emerald border-emerald/30 bg-emerald/10"
                  : "text-amber border-amber/30 bg-amber/10"
              )}>
                {tag || status}
              </span>
            </div>
          )}

          {/* Action Overlay */}
          {actionNode && (
            <div className="absolute top-3 right-3 z-20">
              {actionNode}
            </div>
          )}

          {/* Waveform at bottom of cover */}
          {audioUrl && (
            <div className="absolute bottom-3 left-4 right-4">
              <Waveform />
            </div>
          )}
        </div>

        {/* Info area */}
        <div className="p-4">
          <h3 className="font-headline font-bold text-white text-sm leading-tight line-clamp-1">{title}</h3>

          {description && (
            <p className="text-[12px] text-silver mt-1.5 line-clamp-2 font-body leading-relaxed">{description}</p>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {genres.slice(0, 3).map((g) => (
                <span key={g} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07] text-silver font-body uppercase tracking-wide">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          {(creatorName || budgetOrType) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
              {creatorName && (
                <span className="text-[11px] text-silver font-body">{creatorName}</span>
              )}
              {budgetOrType && (
                <span className="text-[11px] text-neon-violet font-bold font-body">{budgetOrType}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";
