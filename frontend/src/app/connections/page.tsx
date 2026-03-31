"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Users, Check, X, Clock, MessageSquare } from "lucide-react";

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
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Connections</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{connections.length} connection{connections.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {label}
              {key === "pending" && pending.length > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : current.length === 0 ? (
          <Card className="p-10 text-center">
            <Users size={28} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold mb-1">
              {tab === "connections" ? "No connections yet" : tab === "pending" ? "No pending requests" : "No sent requests"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {tab === "connections" && "Discover artists and send connection requests."}
              {tab === "pending" && "You're all caught up!"}
              {tab === "sent" && "Your sent requests will appear here."}
            </p>
            {tab === "connections" && (
              <Button size="sm" onClick={() => router.push("/discover")}>Discover Artists</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {current.map((conn) => {
              const u = conn.user || {};
              const name = u.displayName || u.username || "Unknown";
              return (
                <Card key={conn._id} className="p-4 flex items-center gap-4">
                  <Avatar name={name} src={u.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{u.role || "Creator"}</p>
                    {u.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {u.location}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tab === "connections" && (
                      <Button size="sm" variant="outline" className="gap-1.5"
                        onClick={() => router.push(`/messages?user=${u._id}`)}>
                        <MessageSquare size={13} /> Message
                      </Button>
                    )}
                    {tab === "pending" && (
                      <>
                        <Button size="sm" className="gap-1.5" onClick={() => respond(conn._id, "accepted")}>
                          <Check size={13} /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => respond(conn._id, "rejected")}>
                          <X size={13} /> Ignore
                        </Button>
                      </>
                    )}
                    {tab === "sent" && (
                      <Badge variant="secondary" className="gap-1"><Clock size={10} /> Pending</Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
