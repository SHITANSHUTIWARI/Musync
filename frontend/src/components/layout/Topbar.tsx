"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/discover?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setIsFocused(false);
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-background/60 backdrop-blur-xl border-b border-border/50 z-30 flex items-center px-8 gap-6 transition-all duration-300">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <motion.div 
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative group"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search artists, projects, genres..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface-low border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface transition-all duration-300 shadow-sm"
          />
        </motion.div>
      </form>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground bg-surface-low border border-border/50 hover:bg-surface-high hover:text-foreground transition-colors relative shadow-sm"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
        </motion.button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-surface-low border border-border/50 hover:border-border hover:bg-surface-high transition-all shadow-sm group"
          >
            {user ? (
              <Avatar name={user.username} size="sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-high animate-pulse" />
            )}
            <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-300 group-hover:text-foreground", open && "rotate-180")} />
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute right-0 top-[calc(100%+8px)] w-60 bg-surface border border-border/80 shadow-2xl rounded-2xl overflow-hidden z-50 backdrop-blur-xl"
              >
                {user ? (
                  <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-b from-surface-low to-transparent">
                    <p className="text-sm font-bold font-display text-foreground">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>
                  </div>
                ) : (
                  <div className="px-5 py-4 border-b border-border/50 space-y-2">
                    <div className="h-4 bg-surface-high rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-surface-high rounded w-full animate-pulse" />
                  </div>
                )}
                
                <div className="p-2 space-y-1">
                  <Link href="/profile" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <User size={16} /> My Profile
                  </Link>
                  <Link href="/settings" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <Settings size={16} /> Account Settings
                  </Link>
                  <div className="h-px bg-border/50 my-1 mx-2" />
                  <button onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
