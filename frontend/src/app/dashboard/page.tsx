"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/design-system/components/Button";
import { Card, CardContent } from "@/design-system/components/Card";
import { StatBlock } from "@/design-system/components/StatBlock";
import { ProjectCard } from "@/design-system/components/ProjectCard";
import API from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Activity, Users, Zap, Plus, Music2 } from "lucide-react";
import toast from "react-hot-toast";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } } };

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse text-center pt-20">
           <p className="text-secondary-foreground font-headline text-xl w-full col-span-12">Loading Workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="font-headline font-black text-4xl mb-2">Workspace</h1>
        <p className="font-body text-secondary-foreground">Welcome back to the studio, <span className="text-primary font-bold">{user?.username}</span>.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Collaboration Node & Actions */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div variants={item}>
            <Card className="bg-gradient-to-b from-surface-highest to-surface-low border-none relative overflow-hidden p-6 rounded-2xl group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 bg-surface-lowest flex items-center justify-center text-primary font-bold text-2xl mb-4 p-1">
                   {profile?.avatar ? (
                     <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <span className="font-headline">{user?.username.charAt(0).toUpperCase()}</span>
                   )}
                </div>
                <h3 className="font-headline font-bold text-xl">{profile?.displayName || user?.username}</h3>
                <p className="text-[10px] text-secondary-foreground uppercase tracking-widest font-bold mt-1 mb-6">
                  {user?.role}
                </p>
                
                <Link href="/profile/edit">
                  <Button variant="outline" fullWidth className="gap-2 text-xs border-white/10 hover:border-primary/50">
                    Elevate Profile <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div variants={item} className="grid grid-cols-1 gap-4">
            <StatBlock 
              title="Network Size" 
              value={connections.length} 
              icon={<Users size={16} />}
              trend="+2 this week"
              trendStatus="positive"
            />
            <StatBlock 
              title="Active Projects" 
              value={projects.length} 
              icon={<Activity size={16} />} 
              subtitle="2 pending tasks"
            />
          </motion.div>
        </div>

        {/* CENTER COLUMN: Pulse & Activity */}
        <div className="lg:col-span-6 space-y-8">
           <motion.div variants={item} className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between">
                 <h2 className="font-headline text-xl font-bold flex items-center gap-2">
                   <Zap size={18} className="text-primary" /> Collaborative Pulse
                 </h2>
              </div>
              
              {/* Post Box */}
              <div className="bg-surface-low rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-text group">
                <div className="w-10 h-10 rounded-full bg-surface-high flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                  {user?.username.charAt(0)}
                </div>
                <Link href="/projects/add" className="flex-1 text-sm font-medium text-secondary-foreground group-hover:text-foreground transition-colors">
                  Share a new beat, song, or project...
                </Link>
                <Link href="/projects/add">
                  <Button size="icon" className="shrink-0 rounded-full w-10 h-10">
                    <Plus size={16} />
                  </Button>
                </Link>
              </div>

              {/* Activity Feed / Projects */}
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="py-12 text-center border border-white/5 rounded-2xl bg-surface-lowest/50">
                    <Music2 size={32} className="mx-auto text-white/10 mb-4" />
                    <h3 className="text-secondary-foreground font-bold font-headline mb-2">No active transmissions</h3>
                    <p className="text-xs text-secondary-foreground/60 max-w-xs mx-auto mb-6">Start a new project to broadcast to your curated network.</p>
                    <Link href="/projects/add">
                      <Button variant="secondary" className="px-8 text-xs font-bold uppercase tracking-widest">Boot Project</Button>
                    </Link>
                  </div>
                ) : (
                  <AnimatePresence>
                     {projects.map((p) => (
                       <motion.div key={p._id} variants={item} layout>
                         <Card className="bg-transparent border-white/5 p-6 hover:bg-surface-low">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                 <div className="flex items-center gap-2 mb-2">
                                   <span className="bg-surface-high text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded text-primary border border-white/5">
                                     {p.status}
                                   </span>
                                   <span className="text-[10px] text-secondary-foreground uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                                 </div>
                                 <h3 className="font-headline font-black text-xl mb-1">{p.title}</h3>
                                 <p className="text-sm font-body text-secondary-foreground line-clamp-2">{p.description}</p>
                               </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                               {p.genres?.map((g: string) => (
                                 <span key={g} className="text-[10px] font-bold text-secondary-foreground bg-surface uppercase px-2 py-1 rounded tracking-wider border border-white/5">{g}</span>
                               ))}
                            </div>
                         </Card>
                       </motion.div>
                     ))}
                  </AnimatePresence>
                )}
              </div>
           </motion.div>
        </div>

        {/* RIGHT COLUMN: Curated Opportunities & Network */}
        <div className="lg:col-span-3 space-y-8">
           
           <motion.div variants={item}>
              <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-secondary-foreground mb-4">Curated Network</h2>
              <div className="space-y-3">
                 {suggestions.length === 0 ? (
                   <div className="text-center p-6 border border-white/5 rounded-2xl bg-surface-low">
                      <p className="text-xs text-secondary-foreground">Your frequency is clear.</p>
                   </div>
                 ) : (
                   suggestions.map(s => (
                     <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-low border border-white/5 group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-surface-high flex-shrink-0 flow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                              {s.avatar ? <img src={s.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-primary">{s.displayName?.charAt(0) || '?'}</div>}
                           </div>
                           <div>
                              <p className="text-xs font-bold group-hover:text-primary transition-colors">{s.displayName}</p>
                              <p className="text-[9px] text-secondary-foreground uppercase tracking-wider">{s.role}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleConnect(s.userId)}
                          className="w-6 h-6 rounded bg-surface border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        >
                           <Plus size={12} />
                        </button>
                     </div>
                   ))
                 )}
              </div>
              <Link href="/discover" className="block mt-4 text-center text-xs font-bold text-primary uppercase tracking-widest hover:text-white transition-colors">
                 Deep Scan Network &rarr;
              </Link>
           </motion.div>

           <motion.div variants={item}>
             <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-secondary-foreground mb-4">Spotlight</h2>
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
