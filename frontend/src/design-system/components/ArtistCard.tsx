"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserPlus, Check, MapPin, Music2 } from "lucide-react";

interface ArtistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  imageUrl?: string;
  location?: string;
  tags?: string[];
  isConnected?: boolean;
  onConnect?: () => void;
  userId?: string;
  endorsements?: number;
  action?: React.ReactNode;
}

const ROLE_COLORS: Record<string, string> = {
  artist:   "text-neon-violet border-neon-violet/30 bg-neon-violet/10",
  producer: "text-electric-blue border-electric-blue/30 bg-electric-blue/10",
  rapper:   "text-amber border-amber/30 bg-amber/10",
  musician: "text-emerald border-emerald/30 bg-emerald/10",
  engineer: "text-mist border-white/20 bg-white/5",
  listener: "text-silver border-silver/20 bg-white/[0.04]",
};

export const ArtistCard = React.forwardRef<HTMLDivElement, ArtistCardProps>(
  ({ className, name, role, imageUrl, location, tags = [], isConnected, onConnect, userId, onClick, endorsements, action, ...props }, ref) => {
    const [connecting, setConnecting] = React.useState(false);
    const roleKey = role?.toLowerCase() ?? "artist";
    const roleClass = ROLE_COLORS[roleKey] ?? ROLE_COLORS.artist;
    const initials = name?.slice(0, 2).toUpperCase() ?? "??";

    const handleConnect = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onConnect || isConnected) return;
      setConnecting(true);
      await onConnect();
      setConnecting(false);
    };

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={onClick}
        className={cn(
          "relative rounded-2xl overflow-hidden cursor-pointer group",
          "bg-onyx border border-white/[0.06] hover:border-neon-violet/25",
          "transition-colors duration-300",
          className
        )}
        {...(props as any)}
      >
        {/* Background glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/5 to-transparent" />
        </div>

        {/* Avatar area */}
        <div className="relative h-32 overflow-hidden bg-carbon flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full aurora-bg opacity-20 flex items-center justify-center">
              <Music2 size={32} className="text-white/30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />

          {/* Avatar circle overlapping the gradient */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-16 h-16 rounded-2xl border-2 border-onyx overflow-hidden aurora-bg flex items-center justify-center shadow-glow-sm">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-display font-bold text-lg">{initials}</span>
              )}
            </div>
          </div>
        </div>

        {/* Info area */}
        <div className="pt-10 pb-5 px-5 text-center">
          <h3 className="font-headline font-bold text-white text-base leading-tight">{name}</h3>

          <div className="flex flex-col items-center gap-1 mt-2">
            <span className={cn(
              "inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border font-body",
              roleClass
            )}>
              {role}
            </span>
            {endorsements !== undefined && (
              <span className="text-[10px] text-mist/60 font-medium">
                {endorsements} Endorsements
              </span>
            )}
          </div>

          {location && (
            <p className="flex items-center justify-center gap-1 text-[11px] text-silver mt-2 font-body">
              <MapPin size={10} />
              {location}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07] text-silver font-body uppercase tracking-wide">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[10px] text-neon-violet font-bold">+{tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Action area */}
          <div className="mt-4 overflow-hidden">
            {action ? (
              <div onClick={(e) => e.stopPropagation()}>{action}</div>
            ) : (
              <motion.button
                initial={false}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConnect}
                disabled={isConnected || connecting}
                className={cn(
                  "w-full py-2 rounded-xl text-xs font-bold font-body transition-all duration-200",
                  isConnected
                    ? "bg-emerald/10 border border-emerald/20 text-emerald cursor-default"
                    : "aurora-bg text-white shadow-glow-sm hover:shadow-glow"
                )}
              >
                {isConnected ? (
                  <span className="flex items-center justify-center gap-1.5"><Check size={12} />Connected</span>
                ) : connecting ? (
                  "Connecting..."
                ) : (
                  <span className="flex items-center justify-center gap-1.5"><UserPlus size={12} />Connect</span>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);
ArtistCard.displayName = "ArtistCard";
