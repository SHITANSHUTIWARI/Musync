"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
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
  { href: "/settings",    icon: Settings,        label: "Settings"         },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Music2 size={16} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">MUSYNC</span>
        </div>
      </div>

      {/* User mini card */}
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar name={user.username} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  );
}
