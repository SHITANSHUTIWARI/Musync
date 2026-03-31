"use client";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, ExternalLink, Music2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    API.get("/projects").then(({ data }) => setProjects(data.projects || [])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => projects.filter((p) => {
    const q = search.toLowerCase();
    return (!q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      && (filterType === "all" || p.type === filterType)
      && (filterStatus === "all" || p.status === filterStatus);
  }), [projects, search, filterType, filterStatus]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects((p) => p.filter((x) => x._id !== id));
      toast.success("Project deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/projects/add"><Button className="gap-2"><Plus size={15} /> Add Project</Button></Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {[["all","song","beat","album","collab"], ["all","draft","published"]].map((opts, i) => (
            <select key={i} value={i === 0 ? filterType : filterStatus}
              onChange={(e) => i === 0 ? setFilterType(e.target.value) : setFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-xl bg-muted text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring capitalize cursor-pointer">
              {opts.map((o) => <option key={o} value={o}>{o === "all" ? (i === 0 ? "All Types" : "All Status") : o}</option>)}
            </select>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Music2 size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold mb-1">{projects.length === 0 ? "No projects yet" : "No results"}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {projects.length === 0 ? "Add your first project to showcase your work." : "Try adjusting your filters."}
            </p>
            {projects.length === 0 && <Link href="/projects/add"><Button size="sm" className="gap-1.5"><Plus size={13} /> Add Project</Button></Link>}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card key={p._id} className="overflow-hidden group">
                <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Music2 size={28} className="text-primary/40" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                    <Badge variant={p.status === "published" ? "success" : "secondary"} className="text-[10px] shrink-0">{p.status}</Badge>
                  </div>
                  {p.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.type && <Badge variant="default" className="text-[10px]">{p.type}</Badge>}
                    {p.genres?.slice(0, 2).map((g: string) => <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between">
                    {p.audioLink ? (
                      <a href={p.audioLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <ExternalLink size={11} /> Listen
                      </a>
                    ) : <span />}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/projects/${p._id}/edit`}>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                          <Pencil size={13} />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.title)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
