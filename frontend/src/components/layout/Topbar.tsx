"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronLeft, ChevronRight, LogOut, User, Settings, X } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch]           = useState("");
  const [searchOpen, setSearchOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/discover?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchOpen(false);
    }
  };

  const initials = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 gap-4"
      style={{
        left: 68,
        background: "rgba(11,11,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── Nav arrows ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-silver hover:text-mist transition-all"
          aria-label="Go back"
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-silver hover:text-mist transition-all"
          aria-label="Go forward"
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Search ── */}
      <div className="flex-1 max-w-sm">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.form
              key="search-open"
              initial={{ opacity: 0, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.9 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSearch}
              className="relative"
            >
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creators, projects..."
                className="w-full h-9 bg-white/[0.06] border border-white/10 rounded-xl pl-9 pr-9 text-sm text-mist placeholder:text-silver font-body input-focus"
                style={{ outline: "none" }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-mist"
              >
                <X size={14} />
              </button>
            </motion.form>
          ) : (
            <motion.button
              key="search-closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="w-full h-9 flex items-center gap-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/10 rounded-xl text-sm text-silver font-body transition-all"
            >
              <Search size={14} />
              <span>Search creators, projects...</span>
              <span className="ml-auto text-[10px] text-silver/60 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">⌘K</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <button className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-silver hover:text-mist transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-neon-violet rounded-full" />
        </button>

        <div className="w-px h-5 bg-white/[0.08] mx-1" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-2.5 group"
          >
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-mist leading-none">{user.username}</p>
                  <p className="text-[10px] text-silver capitalize mt-0.5">{user.role}</p>
                </div>
                <div className="w-8 h-8 rounded-xl aurora-bg flex items-center justify-center text-white text-xs font-bold font-display shadow-glow-sm group-hover:opacity-90 transition-opacity">
                  {initials}
                </div>
              </>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-ash shimmer" />
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-12 w-52 glass-obsidian rounded-2xl py-1.5 shadow-card-lg"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white">{user?.username}</p>
                  <p className="text-xs text-silver capitalize">{user?.role}</p>
                </div>
                {[
                  { icon: User,     label: "View Profile", href: "/profile" },
                  { icon: Settings, label: "Settings",     href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-silver hover:text-white hover:bg-white/[0.04] transition-colors font-body"
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                ))}
                <div className="border-t border-white/[0.06] mt-1 pt-1">
                  <button
                    onClick={() => { logout?.(); router.push("/"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ruby hover:bg-ruby/10 transition-colors font-body"
                  >
                    <LogOut size={14} />
                    Sign Out
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
