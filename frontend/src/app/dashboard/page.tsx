"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/design-system/components/ProjectCard";
import API from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Activity, Users, Plus, Music2, Disc3 } from "lucide-react";
import toast from "react-hot-toast";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

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
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-12 h-12 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
          </div>
          <p className="text-silver font-body text-sm">Loading workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  const initials = profile?.displayName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white tracking-tight mb-2">Workspace</h1>
        <p className="font-body text-silver">Welcome back to the studio, <span className="text-white font-semibold">{user?.username}</span>.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN: Profile & Stats ── */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div variants={item}>
            <Card className="p-6 relative overflow-hidden group border-white/5">
              <div className="absolute -top-10 -right-10 w-32 h-32 aurora-bg blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden aurora-bg flex items-center justify-center text-white font-display font-bold text-2xl mb-4 shadow-glow-sm">
                   {profile?.avatar ? (
                     <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     initials
                   )}
                </div>
                <h3 className="font-headline font-bold text-white text-lg leading-tight">{profile?.displayName || user?.username}</h3>
                <p className="text-[11px] text-silver font-body mt-1 mb-5">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Creator"}</p>
                
                <div className="h-1 w-full bg-white/5 rounded-full mb-6 overflow-hidden">
                  <div className="h-full aurora-bg w-2/3" />
                </div>
                
                <Link href="/profile/edit">
                  <Button variant="secondary" fullWidth className="text-xs font-bold gap-2">
                    Edit Profile <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item} className="grid gap-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[11px] text-silver font-body uppercase tracking-wider mb-0.5">Network</p>
                <p className="text-xl font-headline font-bold text-white leading-none">{connections.length}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center text-electric-blue">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[11px] text-silver font-body uppercase tracking-wider mb-0.5">Projects</p>
                <p className="text-xl font-headline font-bold text-white leading-none">{projects.length}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── CENTER COLUMN: Activity Feed ── */}
        <div className="lg:col-span-6 space-y-6">
           <motion.div variants={item}>
              <div className="glass-obsidian rounded-2xl p-4 flex items-center gap-4 cursor-pointer group hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl aurora-bg flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                  {initials}
                </div>
                <Link href="/projects/add" className="flex-1 text-sm font-body text-silver group-hover:text-mist transition-colors">
                  Share a new beat, song, or project...
                </Link>
                <Link href="/projects/add">
                  <Button variant="default" size="icon" className="shrink-0 rounded-xl w-10 h-10">
                    <Plus size={18} />
                  </Button>
                </Link>
              </div>
           </motion.div>

           <motion.div variants={item} className="space-y-4">
              <h2 className="font-headline font-bold text-white text-lg mb-2">Recent Activity</h2>
              
              {projects.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-silver mb-4">
                    <Music2 size={24} />
                  </div>
                  <h3 className="text-white font-bold font-headline mb-2 text-lg">No active transmissions</h3>
                  <p className="text-sm text-silver font-body max-w-xs mb-6">Start a new project to broadcast to your curated network.</p>
                  <Link href="/projects/add">
                    <Button variant="outline" className="font-bold">Boot Project</Button>
                  </Link>
                </Card>
              ) : (
                <AnimatePresence>
                   {projects.map((p) => (
                     <motion.div key={p._id} variants={item} layout>
                       <Card hover className="p-5">
                          <div className="flex justify-between items-start mb-3">
                             <div>
                               <div className="flex items-center gap-2 mb-2">
                                 <Badge variant={p.status === "published" ? "success" : "warning"}>
                                   {p.status}
                                 </Badge>
                                 <span className="text-[10px] text-silver font-body uppercase tracking-wider">{new Date().toLocaleDateString()}</span>
                               </div>
                               <h3 className="font-headline font-bold text-white text-xl mb-1">{p.title}</h3>
                               <p className="text-sm font-body text-silver line-clamp-2">{p.description}</p>
                             </div>
                          </div>
                          {p.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                               {p.genres.map((g: string) => (
                                 <span key={g} className="text-[10px] font-body text-silver bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-wide">
                                   {g}
                                 </span>
                               ))}
                            </div>
                          )}
                       </Card>
                     </motion.div>
                   ))}
                </AnimatePresence>
              )}
           </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Curated Network ── */}
        <div className="lg:col-span-3 space-y-8">
           <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline font-bold text-white text-sm">Suggested Creators</h2>
                <Link href="/discover" className="text-[11px] text-neon-violet hover:text-white font-body uppercase tracking-wider transition-colors">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                 {suggestions.length === 0 ? (
                   <Card className="p-6 text-center border-white/5">
                      <p className="text-sm text-silver font-body">Network frequency is clear.</p>
                   </Card>
                 ) : (
                   suggestions.map(s => (
                     <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-onyx border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl overflow-hidden bg-carbon shrink-0">
                              {s.avatar ? (
                                <img src={s.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full aurora-bg flex items-center justify-center text-xs font-bold text-white">
                                  {s.displayName?.charAt(0) || '?'}
                                </div>
                              )}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{s.displayName}</p>
                              <p className="text-[10px] text-silver font-body capitalize truncate mt-0.5">{s.role}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleConnect(s.userId)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-neon-violet/20 flex items-center justify-center text-silver hover:text-neon-violet transition-colors shrink-0"
                          aria-label="Connect"
                        >
                           <Plus size={16} />
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </motion.div>

           <motion.div variants={item}>
             <h2 className="font-headline font-bold text-white text-sm mb-4">Spotlight Project</h2>
             <ProjectCard 
               title="Neon Horizon EP"
               description="Looking for an elite session bassist with jazz fusion experience for an upcoming cyber-funk EP."
               imageUrl="https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
               tag="PAID GIG"
               creatorName="Alex V"
               budgetOrType="$1k Flat"
             />
           </motion.div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
}
