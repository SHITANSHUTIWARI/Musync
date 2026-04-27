"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home, Compass, Briefcase, MessageSquare, Settings,
  Users, Disc3, Plus, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",   icon: Home,          label: "Home",       shortcut: "H" },
  { href: "/discover",    icon: Compass,       label: "Discover",   shortcut: "D" },
  { href: "/projects",    icon: Briefcase,     label: "Projects",   shortcut: "P" },
  { href: "/connections", icon: Users,         label: "Network",    shortcut: "N" },
  { href: "/messages",    icon: MessageSquare, label: "Messages",   shortcut: "M" },
];

const BOTTOM_NAV = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 240 : 68 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden"
      style={{
        background: "rgba(7,7,9,0.95)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-16 px-4 shrink-0 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-9 h-9 shrink-0 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm"
          >
            <Disc3 size={18} className="text-white" strokeWidth={2} />
          </motion.div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <p className="font-display font-bold text-base text-white tracking-tight leading-none">
                  MUSYNC
                </p>
                <p className="text-[9px] text-silver uppercase tracking-widest font-body mt-0.5">
                  Creator Network
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 space-y-1 overflow-hidden">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="block px-2">
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  active
                    ? "text-white"
                    : "text-silver hover:text-white"
                )}
              >
                {/* Active background */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl aurora-bg opacity-15"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Hover background */}
                <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Active left accent */}
                {active && (
                  <motion.div
                    layoutId="sidebar-accent"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 aurora-bg rounded-r-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 2}
                  className={cn(
                    "shrink-0 relative z-10 transition-colors",
                    active ? "text-neon-violet" : "text-silver group-hover:text-mist"
                  )}
                />

                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.12 }}
                      className={cn(
                        "text-sm font-semibold font-body relative z-10 whitespace-nowrap",
                        active ? "text-white" : "text-silver group-hover:text-mist"
                      )}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Create Project CTA ── */}
      <div className="px-2 pb-3 border-t border-white/5 pt-3">
        <Link href="/projects/add" className="block">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer",
              "aurora-bg hover:opacity-90 transition-opacity group"
            )}
          >
            <Plus size={18} className="text-white shrink-0" strokeWidth={2.5} />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.12 }}
                  className="text-sm font-bold text-white whitespace-nowrap font-body"
                >
                  New Project
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="pb-4 px-2 space-y-1">
        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="block">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group",
                  active ? "text-white" : "text-silver hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.12 }}
                      className="text-sm font-semibold font-body whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
