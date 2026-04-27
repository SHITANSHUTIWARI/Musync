"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Users, Check, X, Clock, MessageSquare, Search, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { key: "connections", label: "My Connections", icon: Users },
  { key: "pending",     label: "Pending",        icon: Clock  },
  { key: "sent",        label: "Sent",            icon: Clock  },
];

export default function ConnectionsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("connections");
  const [connections, setConnections] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [c, p] = await Promise.all([API.get("/connections"), API.get("/connections/pending")]);
      setConnections(c.data.connections || []);
      const all = p.data.connections || [];
      setPending(all.filter((x: any) => x.type === "received"));
      setSent(all.filter((x: any) => x.type === "sent"));
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const respond = async (id: string, status: string) => {
    try {
      await API.put(`/connections/respond/${id}`, { status });
      toast.success(status === "accepted" ? "Connection accepted!" : "Request ignored");
      fetchAll();
    } catch (e: any) { toast.error(e.response?.data?.error?.message || "Failed"); }
  };

  const current = tab === "connections" ? connections : tab === "pending" ? pending : sent;

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Network</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Manage your professional connections and collaborations.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-high border border-border/60 rounded-xl p-1">
            {TABS.map(({ key, label }) => (
              <button 
                key={key} 
                onClick={() => setTab(key)}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg overflow-hidden ${
                  tab === key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === key && (
                   <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary/10 -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                {label}
                {key === "pending" && pending.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full inline-block scale-90">
                    {pending.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : current.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            >
              <Card className="p-20 text-center glass border-dashed flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-surface-high border border-border flex items-center justify-center mb-6">
                  <UserPlus size={32} className="text-muted-foreground/60" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {tab === "connections" ? "Silence on Stage" : tab === "pending" ? "All Caught Up" : "No Pending Invites"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-sm font-medium">
                  {tab === "connections" && "Building a network is the first step to a hit. Start connecting with artists around you."}
                  {tab === "pending" && "You've addressed all your incoming connection requests. Check back later!"}
                  {tab === "sent" && "When you find creators you want to work with, your sent invitations will appear here."}
                </p>
                {tab === "connections" && (
                  <Button size="lg" className="font-bold px-8" onClick={() => router.push("/discover")}>
                    Discover Talent
                  </Button>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {current.map((conn, idx) => {
                const u = conn.user || {};
                const name = u.displayName || u.username || "Unknown";
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={conn._id}
                  >
                    <Card className="p-5 flex items-center gap-4 card-hover overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <Avatar name={name} src={u.avatar} size="lg" className="ring-2 ring-border/20 group-hover:ring-primary/20 transition-all" />
                      
                      <div className="flex-1 min-w-0 z-10">
                        <p className="font-bold text-base tracking-tight">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="px-1.5 py-0 capitalize text-[10px] font-black">{u.role || "Creator"}</Badge>
                          {u.location && (
                             <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                               <span className="w-1 h-1 rounded-full bg-border" /> {u.location}
                             </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 z-10">
                        {tab === "connections" && (
                          <Button size="icon" variant="secondary" className="rounded-full w-9 h-9"
                            onClick={() => router.push(`/messages?user=${u._id}`)}>
                            <MessageSquare size={16} />
                          </Button>
                        )}
                        {tab === "pending" && (
                          <>
                            <Button size="icon" className="rounded-full w-9 h-9" onClick={() => respond(conn._id, "accepted")}>
                              <Check size={16} />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full w-9 h-9" onClick={() => respond(conn._id, "rejected")}>
                              <X size={16} />
                            </Button>
                          </>
                        )}
                        {tab === "sent" && (
                          <Badge variant="warning" className="gap-1.5 px-3 py-1 font-bold text-[10px]"><Clock size={12} /> Pending</Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}

