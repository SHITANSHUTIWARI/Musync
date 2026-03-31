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
import { Plus, ArrowRight, Music2, Users, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.success("Connection request sent");
      setSuggestions((p) => p.filter((a) => a.userId !== userId));
    } catch (e: any) {
      toast.error(e.response?.data?.error?.message || "Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6">

        {/* Left — Profile summary */}
        <aside className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-primary/30 to-primary/10" />
            <div className="px-4 pb-4 -mt-7">
              <Avatar name={profile?.displayName || user?.username || "?"} src={profile?.avatar} size="lg"
                className="ring-4 ring-card" />
              <div className="mt-2">
                <p className="font-semibold">{profile?.displayName || user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                {profile?.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {profile.location}</p>}
              </div>
              {profile?.genres?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {profile.genres.slice(0, 3).map((g: string) => (
                    <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border text-center">
                <div>
                  <p className="font-bold text-sm">{connections.length}</p>
                  <p className="text-[10px] text-muted-foreground">Connections</p>
                </div>
                <div>
                  <p className="font-bold text-sm">{projects.length}</p>
                  <p className="text-[10px] text-muted-foreground">Projects</p>
                </div>
              </div>
              <Link href="/profile/edit" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-3 space-y-0.5">
            {[
              { href: "/projects", icon: FolderOpen, label: "My Projects" },
              { href: "/connections", icon: Users, label: "Connections" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                <Icon size={15} /> {label}
              </Link>
            ))}
          </Card>
        </aside>

        {/* Center — Feed */}
        <main className="space-y-4">
          {/* Post box */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={user?.username || "?"} size="sm" />
              <Link href="/projects/add" className="flex-1 h-10 px-4 rounded-xl bg-muted text-sm text-muted-foreground flex items-center hover:bg-accent transition-all cursor-pointer">
                Share a project or update...
              </Link>
              <Link href="/projects/add">
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Add Project</Button>
              </Link>
            </div>
          </Card>

          {/* Projects feed */}
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : projects.length === 0 ? (
            <Card className="p-10 text-center">
              <Music2 size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold mb-1">No projects yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add your first project to get started.</p>
              <Link href="/projects/add"><Button size="sm" className="gap-1.5"><Plus size={14} /> Add Project</Button></Link>
            </Card>
          ) : (
            projects.map((p) => (
              <Card key={p._id} className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={profile?.displayName || user?.username || "?"} src={profile?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{profile?.displayName || user?.username}</p>
                      <Badge variant={p.status === "published" ? "success" : "secondary"} className="text-[10px]">
                        {p.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base mb-1">{p.title}</h3>
                    {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.type && <Badge variant="default" className="text-[10px]">{p.type}</Badge>}
                      {p.genres?.map((g: string) => <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>)}
                    </div>
                    {p.audioLink && (
                      <a href={p.audioLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                        🎧 Listen <ArrowRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </main>

        {/* Right — Suggestions */}
        <aside>
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">People you may know</h3>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 rounded-full shimmer" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 shimmer rounded" />
                    <div className="h-2.5 w-16 shimmer rounded" />
                  </div>
                </div>
              ))
            ) : suggestions.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No suggestions right now.</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((a) => (
                  <div key={a._id} className="flex items-center gap-2.5">
                    <Avatar name={a.displayName || "?"} src={a.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{a.displayName}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{a.role}</p>
                    </div>
                    <button onClick={() => handleConnect(a.userId)}
                      className="text-[10px] font-semibold text-primary border border-primary/30 rounded-full px-2.5 py-1 hover:bg-primary/10 transition-all">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Link href="/discover" className="flex items-center gap-1 text-xs text-primary mt-4 hover:underline font-medium">
              See all <ArrowRight size={11} />
            </Link>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
