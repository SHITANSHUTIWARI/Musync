"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell, Mail, ChevronLeft, ChevronRight } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/discover?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-10 border-b border-white/5 font-body font-medium text-sm tracking-wide">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()} 
            className="w-8 h-8 rounded-full bg-surface-low hover:bg-surface-high flex items-center justify-center text-secondary-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => router.forward()} 
            className="w-8 h-8 rounded-full bg-surface-low hover:bg-surface-high flex items-center justify-center text-secondary-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="relative w-full group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search elite creators or projects..."
            className="w-full bg-surface-low border-none rounded-full py-2.5 pl-12 pr-4 text-foreground placeholder:text-secondary-foreground focus:ring-1 focus:ring-primary/50 transition-all font-body font-medium"
          />
        </form>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="text-secondary-foreground hover:text-foreground transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
        </button>
        <button className="text-secondary-foreground hover:text-foreground transition-colors">
          <Mail size={18} />
        </button>
        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
        
        <div 
          onClick={() => router.push('/profile')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="text-right">
            <p className="text-xs font-bold text-foreground">
              {user ? user.username : "Studio Access"}
            </p>
            <p className="text-[10px] text-secondary-foreground uppercase tracking-tighter">
              {user ? user.role : "Connecting..."}
            </p>
          </div>
          {user ? (
            <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary transition-colors bg-surface-high flex justify-center items-center text-xs font-bold font-headline text-primary">
              {user.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-highest animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
