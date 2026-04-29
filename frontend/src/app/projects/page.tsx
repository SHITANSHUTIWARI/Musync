"use client";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCard } from "@/design-system/components/ProjectCard";
import { Button } from "@/design-system/components/Button";
import API from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, FolderOpen, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

const TYPES = ["all", "song", "beat", "album", "collab"];
const STATUSES = ["all", "draft", "published"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { playTrack } = usePlayer();

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
    if (!confirm(`Permanently delete "${title}"?`)) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects((p) => p.filter((x) => x._id !== id));
      toast.success("Project wiped from database.");
    } catch { toast.error("Hardware fault: Could not delete it"); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-headline font-black mb-2 flex items-center gap-3">
              <FolderOpen size={32} className="text-primary" /> Active Projects
            </h1>
            <p className="text-secondary-foreground font-body">
              {loading ? "Syncing data arrays..." : `Managing ${filtered.length} of ${projects.length} initialized project${projects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/projects/add">
            <Button className="gap-2 px-8 shadow-glow-sm">
              <Plus size={16} /> Boot New Sequence
            </Button>
          </Link>
        </div>

        {/* Command Center Filters */}
        <div className="bg-surface-low border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-6">
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Search Box */}
          <div className="flex-1 relative z-10">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project title, description..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface border border-white/10 text-foreground placeholder:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body text-lg shadow-inner"
            />
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-4 bg-surface p-2 rounded-2xl border border-white/10">
            <SlidersHorizontal size={14} className="text-secondary-foreground ml-2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent pl-2 pr-6 py-2 text-sm text-foreground font-bold outline-none cursor-pointer placeholder:text-secondary-foreground"
            >
              {TYPES.map((o) => (
                <option key={o} value={o} className="bg-surface-low">{o === "all" ? "All Types" : o.toUpperCase()}</option>
              ))}
            </select>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent pl-2 pr-6 py-2 text-sm text-foreground font-bold outline-none cursor-pointer placeholder:text-secondary-foreground"
            >
               {STATUSES.map((o) => (
                <option key={o} value={o} className="bg-surface-low">{o === "all" ? "All Statuses" : o.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Canvas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-low h-[380px] rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-surface-low/30 backdrop-blur-sm">
            <FolderOpen size={48} className="mx-auto mb-6 text-white/10" />
            <h2 className="text-xl font-headline font-bold text-foreground mb-2">No projects running</h2>
            <p className="text-secondary-foreground font-body max-w-sm mx-auto mb-6">Create your first directory item to begin tracking audio assets.</p>
            {projects.length === 0 && (
              <Link href="/projects/add">
                <Button variant="secondary" className="gap-2 border-white/10">
                  <Plus size={14} /> Initialize Workspace
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <motion.div
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filtered.map((p) => {
                
                // Construct fallback gradient image via unsplash or gradient if none provided
                const imageUrl = p.coverImage || `https://placehold.co/600x400/131313/5d5fef?text=${p.title}`;

                // Our action buttons (Edit, Delete) attached to the top right of ProjectCard
                const ActionOverlay = (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-xl backdrop-blur-md">
                     <Link href={`/projects/${p._id}/edit`}>
                        <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                           <Pencil size={12} />
                        </button>
                     </Link>
                     <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(p._id, p.title); }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/30 flex items-center justify-center text-red-500 transition-all border border-transparent hover:border-red-500/20"
                     >
                        <Trash2 size={12} />
                     </button>
                  </div>
                );

                return (
                  <motion.div key={p._id} variants={item} layout className="h-full">
                    <ProjectCard
                      title={p.title}
                      description={p.description || "No description provided."}
                      imageUrl={imageUrl}
                      audioUrl={p.audioLink}
                      onPlay={() => p.audioLink && playTrack({
                        id: p._id,
                        title: p.title,
                        artist: p.creator?.displayName || p.creator?.username || "You",
                        cover: imageUrl,
                        url: p.audioLink
                      })}
                      tag={p.type ? p.type.toUpperCase() : undefined}
                      budgetOrType={p.status ? p.status.toUpperCase() : undefined}
                      creatorName={p.creator?.displayName || p.creator?.username || "You"}
                      creatorAvatarUrl={p.creator?.avatar}
                      actionNode={ActionOverlay}
                      className="h-full bg-surface-lowest hover:bg-surface-low border border-white/5 transition-colors p-4 pb-6"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
