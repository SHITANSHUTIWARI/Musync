"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface AudioPlayerProps {
  onClose?: () => void;
}

export function AudioPlayer({ onClose }: AudioPlayerProps) {
  const { currentTrack, isPlaying, togglePlay, duration, currentTime, seek, volume, setVolume } = usePlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl glass-obsidian rounded-2xl shadow-glow-sm overflow-hidden border border-white/10"
      >
        {/* Progress Bar (Clickable Container) */}
        <div className="relative h-1 w-full bg-white/5 cursor-pointer group">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime || 0}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full aurora-bg group-hover:h-1.5 transition-all" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Cover Art */}
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-carbon shrink-0 border border-white/5 shadow-inner">
            {currentTrack.cover ? (
               <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full aurora-bg flex items-center justify-center opacity-30" />
            )}
          </div>
          
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate font-headline leading-tight">{currentTrack.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-silver truncate font-body">{currentTrack.artist}</p>
              <span className="text-[10px] text-white/20">•</span>
              <span className="text-[10px] text-silver/60 font-body">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button className="text-silver/60 hover:text-white transition-colors p-1" aria-label="Previous">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-11 h-11 rounded-full aurora-bg flex items-center justify-center shadow-glow hover:scale-105 transition-all text-white active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-silver/60 hover:text-white transition-colors p-1" aria-label="Next">
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>
          
          <div className="w-px h-8 bg-white/[0.08] mx-2 hidden sm:block" />
          
          {/* Volume */}
          <div className="hidden sm:flex items-center gap-3 text-silver shrink-0 group/volume">
            <Volume2 size={16} className="opacity-60 group-hover/volume:opacity-100 transition-opacity" />
            <div className="w-20 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
               <input
                 type="range"
                 min={0}
                 max={1}
                 step={0.01}
                 value={volume}
                 onChange={(e) => setVolume(parseFloat(e.target.value))}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="absolute inset-y-0 left-0 bg-white/40" style={{ width: `${volume * 100}%` }} />
            </div>
          </div>
          
          {/* Close */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-silver hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
