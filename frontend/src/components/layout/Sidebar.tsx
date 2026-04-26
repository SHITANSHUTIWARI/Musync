"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/design-system/components/Button";
import {
  Home, Compass, Briefcase, MessageSquare, Settings, Plus
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-low border-r border-white/5 shadow-2xl z-50 flex flex-col py-8 font-headline antialiased tracking-tight">
      <div className="px-8 mb-10">
        <Link href="/dashboard" className="block group">
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text gradient-primary transition-opacity group-hover:opacity-80">
            MUSYNC
          </span>
          <p className="text-[10px] text-secondary-foreground uppercase tracking-widest mt-1 font-body">
            Elite Collaboration
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="block group relative">
              <div
                className={cn(
                  "flex items-center gap-4 px-8 py-4 font-bold transition-all duration-300",
                  active
                    ? "text-primary bg-surface-high border-l-4 border-primary-container"
                    : "text-secondary-foreground hover:text-foreground hover:bg-surface-high border-l-4 border-transparent"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <Button className="w-full gap-2 text-primary-foreground font-body">
          <Plus size={16} />
          Create Project
        </Button>
      </div>
    </aside>
  );
}
