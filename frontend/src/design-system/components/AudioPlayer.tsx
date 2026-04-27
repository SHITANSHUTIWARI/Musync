"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from "lucide-react";

export interface Track {
  title: string;
  artist: string;
  cover?: string;
  url?: string;
}

interface AudioPlayerProps {
  track?: Track;
  onClose?: () => void;
}

export function AudioPlayer({ track, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(30); // Mock progress

  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl glass-obsidian rounded-2xl shadow-glow-sm overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-[2px] bg-white/10 w-full">
          <div className="h-full aurora-bg" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Cover Art */}
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-carbon shrink-0 border border-white/5">
            {track.cover ? (
               <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full aurora-bg flex items-center justify-center opacity-30" />
            )}
          </div>
          
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate font-headline leading-tight">{track.title}</h4>
            <p className="text-[11px] text-silver truncate font-body mt-0.5">{track.artist}</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="text-silver hover:text-white transition-colors" aria-label="Previous">
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full aurora-bg flex items-center justify-center shadow-glow-sm hover:shadow-glow transition-all text-white active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-silver hover:text-white transition-colors" aria-label="Next">
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>
          
          <div className="w-px h-6 bg-white/[0.08] mx-2 hidden sm:block" />
          
          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 text-silver shrink-0">
            <Volume2 size={14} />
            <div className="w-16 h-1 rounded-full bg-white/10">
              <div className="w-2/3 h-full rounded-full bg-white/40" />
            </div>
          </div>
          
          {/* Close */}
          {onClose && (
            <button onClick={onClose} className="ml-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-silver hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
