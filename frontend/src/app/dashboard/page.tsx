"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import Link from "next/link";
import { Plus, ArrowRight, Music2, Users, FolderOpen, Headphones, Compass, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } } };

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      API.get("/profile/me"),
      API.get("/projects"),
      API.get("/discover/artists?limit=4"),
      API.get("/connections"),
    ]).then(([p, pr, d, c]) => {
      if (p.status === "fulfilled") setProfile(p.value.data.profile);
      if (pr.status === "fulfilled") setProjects(pr.value.data.projects || []);
      if (d.status === "fulfilled") setSuggestions(d.value.data.results || []);
      if (c.status === "fulfilled") setConnections(c.value.data.connections || []);
      setLoading(false);
    });
  }, []);

  const handleConnect = async (userId: string) => {
    try {
      await API.post("/connections/request", { recipient: userId });
      toast.success("Connection request sent!");
      setSuggestions((p) => p.filter((a) => a.userId !== userId));
    } catch (e: any) {
      toast.error(e.response?.data?.error?.message || "Could not send request");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">
          <div className="space-y-4"><div className="h-80 shimmer rounded-2xl" /></div>
          <div className="space-y-4"><div className="h-24 shimmer rounded-2xl" /><div className="h-48 shimmer rounded-2xl" /></div>
          <div className="space-y-4"><div className="h-64 shimmer rounded-2xl" /></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6 xl:gap-8 min-h-screen">

        {/* ── LEFT COLUMN: Profile Summary ── */}
        <aside className="space-y-5">
          <motion.div variants={item}>
            <Card className="overflow-hidden p-0">
              <div className="h-20 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                 <Music2 size={40} className="absolute text-primary/10 -right-2 top-2" />
              </div>
              <div className="px-5 pb-5 -mt-10 relative">
                <Avatar
                  name={profile?.displayName || user?.username || "?"}
                  src={profile?.avatar}
                  size="xl"
                  className="ring-4 ring-surface shadow-glow bg-surface-lowest"
                />
                <div className="mt-3">
                  <Link href="/profile" className="font-bold text-lg hover:text-primary transition-colors tracking-tight block">
                    {profile?.displayName || user?.username}
                  </Link>
                  <p className="text-[11px] text-primary uppercase font-bold tracking-widest mt-0.5 relative inline-block">
                    {user?.role}
                  </p>
                  {profile?.location && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 font-medium">
                      <MapPin size={11} className="text-primary/70" /> {profile.location}
                    </p>
                  )}
                </div>

                {profile?.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {profile.genres.slice(0, 3).map((g: string) => (
                      <Badge key={g} variant="outline" className="text-[9px] text-muted-foreground border-border bg-surface-low px-2 py-0.5">
                        {g}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-border/60 text-center">
                  <div className="flex-1 bg-surface py-2 rounded-xl">
                    <p className="font-extrabold text-base">{connections.length}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Network</p>
                  </div>
                  <div className="flex-1 bg-surface py-2 rounded-xl">
                    <p className="font-extrabold text-base">{projects.length}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Projects</p>
                  </div>
                </div>

                <Link href="/profile/edit" className="block mt-4">
                  <Button variant="secondary" size="sm" className="w-full h-8 text-xs font-bold bg-surface hover:bg-surface-high border-border">
                    Edit Setup
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={item}>
            <Card className="p-2.5">
              {[
                { href: "/projects", icon: FolderOpen, label: "My Projects", count: projects.length },
                { href: "/connections", icon: Users, label: "Connections", count: connections.length },
                { href: "/discover", icon: Compass, label: "Discover", count: null },
              ].map(({ href, icon: Icon, label, count }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-surface-high hover:text-foreground transition-all group"
                >
                  <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="flex-1">{label}</span>
                  {count !== null && count > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{count}</span>
                  )}
                </Link>
              ))}
            </Card>
          </motion.div>
        </aside>

        {/* ── CENTER COLUMN: Feed ── */}
        <main className="space-y-6">
          {/* Post box */}
          <motion.div variants={item}>
            <Card className="p-4 bg-surface/50 backdrop-blur-md border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-4">
                <Avatar name={user?.username || "?"} size="md" className="ring-2 ring-primary/20 shrink-0" />
                <Link
                  href="/projects/add"
                  className="flex-1 h-12 px-5 rounded-2xl bg-surface border border-border text-sm font-medium text-muted-foreground flex items-center hover:border-primary/40 hover:bg-surface-high transition-all cursor-pointer shadow-inner"
                >
                  Share a new beat, song, or project...
                </Link>
                <Link href="/projects/add">
                  <Button size="icon" className="shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-0">
                    <Plus size={18} />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          <div>
             <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                <h3 className="font-bold text-lg tracking-tight">Recent Projects</h3>
             </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-border/60 bg-transparent">
                  <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mx-auto mb-4 border border-border">
                    <Music2 size={24} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="font-bold text-base mb-1">Your timeline is empty</p>
                  <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                    Once you upload a project or update a song, it will appear here for your network to see.
                  </p>
                  <Link href="/projects/add">
                    <Button size="sm" className="gap-2 shadow-glow-sm">
                      <Plus size={14} /> Start Uploading
                    </Button>
                  </Link>
                </Card>
              ) : (
                <AnimatePresence>
                  {projects.map((p) => (
                    <motion.div key={p._id} variants={item} layout>
                      <Card className="p-0 overflow-hidden group">
                        <div className="p-5 flex items-start gap-4">
                          <Avatar name={profile?.displayName || user?.username || "?"} src={profile?.avatar} size="md" className="outline outline-1 outline-border/50" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <p className="text-sm font-bold text-foreground hover:underline cursor-pointer">
                                {profile?.displayName || user?.username}
                              </p>
                              <span className="text-xs text-muted-foreground/60">•</span>
                              <Badge variant={p.status === "published" ? "success" : "secondary"} className="text-[9px] uppercase tracking-wider px-1.5 py-0">
                                {p.status}
                              </Badge>
                            </div>
                            <h3 className="font-extrabold text-lg mb-1.5 leading-tight">{p.title}</h3>
                            {p.description && (
                              <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed bg-surface px-4 py-3 rounded-xl border border-border/30 mb-4 mt-2">
                                {p.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1.5 mt-3 mb-2">
                              {p.type && <Badge variant="default" className="text-[10px] bg-primary/10 text-primary border-primary/20">{p.type}</Badge>}
                              {p.genres?.map((g: string) => <Badge key={g} variant="outline" className="text-[10px] bg-surface border-border">{g}</Badge>)}
                            </div>
                            {p.audioLink && (
                              <a
                                href={p.audioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold text-primary mt-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-xl transition-all"
                              >
                                <Headphones size={13} /> Listen Track
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </main>

        {/* ── RIGHT COLUMN: Suggestions ── */}
        <aside>
          <motion.div variants={item}>
            <Card className="p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                 <Users size={16} className="text-primary/70" />
                 <h3 className="text-sm font-bold tracking-tight">People to follow</h3>
              </div>

              {suggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground p-4 text-center border border-dashed border-border rounded-xl">
                  No suggestions right now.
                </p>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((a) => (
                    <div key={a._id} className="flex items-center gap-3 group">
                      <Avatar name={a.displayName || "?"} src={a.avatar} size="sm" className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{a.displayName}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">{a.role}</p>
                      </div>
                      <button
                        onClick={() => handleConnect(a.userId)}
                        className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/discover" className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold mt-6 py-2.5 rounded-xl border border-border hover:bg-primary/5 transition-all text-center w-full">
                Explore Network <ArrowRight size={12} />
              </Link>
            </Card>
          </motion.div>
        </aside>
      </motion.div>
    </DashboardLayout>
  );
}
