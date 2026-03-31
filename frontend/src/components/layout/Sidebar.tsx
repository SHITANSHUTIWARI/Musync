"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, FolderOpen, Compass,
  Users, MessageSquare, Settings, LogOut, Music2,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Home"             },
  { href: "/profile",     icon: User,            label: "My Profile"       },
  { href: "/projects",    icon: FolderOpen,      label: "Projects"         },
  { href: "/discover",    icon: Compass,         label: "Discover"         },
  { href: "/connections", icon: Users,           label: "Connections"      },
  { href: "/messages",    icon: MessageSquare,   label: "Messages"         },
];

const SETTINGS_NAV = [
  { href: "/settings",    icon: Settings,        label: "Settings"         },
]

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col z-40 shadow-xl shadow-black/10">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl signature-gradient flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Music2 size={18} className="text-primary-foreground drop-shadow-sm relative z-10" />
          </motion.div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            MUSYNC
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Menu</p>
        
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="block group">
              <div className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                active
                  ? "text-foreground bg-primary/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
              )}>
                {active && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className={cn("relative z-10 transition-colors duration-300", active ? "text-primary text-glow" : "group-hover:text-foreground")} />
                <span className="relative z-10">{label}</span>
              </div>
            </Link>
          );
        })}

        <div className="mt-8 pt-8 border-t border-border/50 space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Account</p>
          {SETTINGS_NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="block group">
                <div className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  active
                    ? "text-foreground bg-surface-high"
                    : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
                )}>
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} className={cn("transition-colors", active ? "text-primary" : "group-hover:text-foreground")} />
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 mt-auto border-t border-border/50 bg-surface/50 backdrop-blur-md">
        <div className="bg-surface-low rounded-2xl p-3 border border-border/40 shadow-sm flex flex-col gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar name={user.username} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate tracking-tight text-foreground">{user.username}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user.role}</p>
              </div>
            </div>
          ) : (
             <div className="h-10 flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-surface-high animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-high rounded w-20 animate-pulse" />
                  <div className="h-2 bg-surface-high rounded w-12 animate-pulse" />
                </div>
             </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors w-full border border-transparent hover:border-border/60 bg-surface"
          >
            <LogOut size={14} className="opacity-80" />
            Sign out
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
