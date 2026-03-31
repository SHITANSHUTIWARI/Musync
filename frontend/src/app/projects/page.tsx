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
import { Plus, Search, Pencil, Trash2, ExternalLink, Music2, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

const TYPES   = ["all", "song", "beat", "album", "collab"];
const STATUSES = ["all", "draft", "published"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    API.get("/projects")
      .then(({ data }) => setProjects(data.projects || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) &&
      (filterType === "all" || p.type === filterType) &&
      (filterStatus === "all" || p.status === filterStatus)
    );
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading..." : `${projects.length} project${projects.length !== 1 ? "s" : ""} · ${filtered.length} showing`}
            </p>
          </div>
          <Link href="/projects/add">
            <Button className="gap-2">
              <Plus size={15} /> New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 flex-wrap bg-surface-low border border-border rounded-2xl p-3">
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[["Type", TYPES, filterType, setFilterType], ["Status", STATUSES, filterStatus, setFilterStatus]].map(([label, opts, val, setter]: any, i) => (
              <select
                key={i}
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 capitalize cursor-pointer"
              >
                {(opts as string[]).map((o: string) => (
                  <option key={o} value={o}>
                    {o === "all" ? `All ${label}s` : o.charAt(0).toUpperCase() + o.slice(1)}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-high flex items-center justify-center mx-auto mb-4">
                <Music2 size={28} className="text-muted-foreground opacity-60" />
              </div>
              <p className="font-bold text-lg mb-1">{projects.length === 0 ? "No projects yet" : "No results"}</p>
              <p className="text-sm text-muted-foreground mb-5">
                {projects.length === 0
                  ? "Add your first project to showcase your sound and vision."
                  : "Try adjusting your search or filters."}
              </p>
              {projects.length === 0 && (
                <Link href="/projects/add">
                  <Button className="gap-2">
                    <Plus size={14} /> Add First Project
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((p) => (
                <motion.div key={p._id} variants={item} layout>
                  <Card className="overflow-hidden group h-full flex flex-col card-hover p-0">
                    {/* Cover area */}
                    <div className="h-28 bg-gradient-to-br from-primary/25 via-primary/10 to-[hsl(var(--primary-container)/0.15)] flex items-center justify-center relative overflow-hidden">
                      <Music2 size={36} className="text-primary/30" />
                      {/* Hover overlay actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Link href={`/projects/${p._id}/edit`}>
                          <button className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                            <Pencil size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-red-300 hover:bg-red-500/20 transition-all backdrop-blur-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm leading-tight">{p.title}</h3>
                        <Badge
                          variant={p.status === "published" ? "success" : "secondary"}
                          className="text-[10px] shrink-0"
                        >
                          {p.status}
                        </Badge>
                      </div>
                      {p.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">
                          {p.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.type && <Badge variant="default" className="text-[10px]">{p.type}</Badge>}
                        {p.genres?.slice(0, 2).map((g: string) => (
                          <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                        ))}
                      </div>
                      {p.audioLink && (
                        <a
                          href={p.audioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold mt-auto"
                        >
                          <Headphones size={11} /> Listen
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}
