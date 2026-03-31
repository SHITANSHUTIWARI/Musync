"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Music, FileAudio, Disc, Users as UsersIcon, LayoutGrid, Globe, Save, ArrowLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";

const TYPES = [
  { id: "song", label: "Single / Song", icon: Music },
  { id: "beat", label: "Beat / Instrumental", icon: FileAudio },
  { id: "album", label: "Album / EP", icon: Disc },
  { id: "collab", label: "Collaboration", icon: UsersIcon },
];

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats", "Other"];
const STATUSES = ["draft", "published"];

export default function AddProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: "", 
    type: "", 
    description: "", 
    genres: "", 
    status: "published", 
    coverImage: "", 
    audioLink: "" 
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Please enter a project title"); return; }
    if (!form.type) { toast.error("Please select a project type"); return; }
    setSaving(true);
    try {
      await API.post("/projects", {
        ...form,
        genres: form.genres ? [form.genres] : [],
        coverImage: form.coverImage || undefined,
        audioLink: form.audioLink || undefined,
      });
      toast.success("Project launched successfully!");
      router.push("/projects");
    } catch (err: any) {
      const d = err.response?.data;
      toast.error(d?.errors?.[0]?.message || d?.error?.message || "Failed to create project");
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto pb-20"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={14} /> Back to Projects
            </button>
            <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Showcase your latest work to the network.</p>
          </div>
          <Button onClick={handleSubmit} loading={saving} className="gap-2 shadow-glow px-8">
            <Plus size={18} /> Launch Project
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Type Selection */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <LayoutGrid size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Project Type</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set("type", t.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3 ${
                    form.type === t.id 
                      ? "border-primary bg-primary/5 text-primary shadow-glow-sm" 
                      : "border-border/60 bg-surface hover:border-primary/20 hover:bg-surface-high text-muted-foreground"
                  }`}
                >
                  <t.icon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Section: Basic Details */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Details</h2>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="Project Title *" 
                value={form.title} 
                onChange={(e) => set("title", e.target.value)} 
                placeholder="e.g. Midnight Melodies" 
                required 
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                  Description
                </label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tell potential collaborators about the vision, role, or background of this project..."
                  rows={4} 
                  className="w-full rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Primary Genre</label>
                  <select 
                    value={form.genres} 
                    onChange={(e) => set("genres", e.target.value)}
                    className="h-11 px-4 rounded-xl border border-border/60 bg-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 cursor-pointer shadow-sm"
                  >
                    <option value="">Select genre</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Visibility</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => set("status", e.target.value)}
                    className="h-11 px-4 rounded-xl border border-border/60 bg-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 capitalize cursor-pointer shadow-sm"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Assets */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Globe size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Media Assets</h2>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="Cover Image URL" 
                value={form.coverImage} 
                onChange={(e) => set("coverImage", e.target.value)} 
                placeholder="https://images.com/art.jpg" 
              />
              <Input 
                label="Audio / Media Link" 
                value={form.audioLink} 
                onChange={(e) => set("audioLink", e.target.value)} 
                placeholder="SoundCloud, YouTube, or Google Drive link" 
              />
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
                Provide links so others in the network can experience your work directly.
              </p>
            </div>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="h-12 px-10 font-bold border-border" onClick={() => router.push("/projects")}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="h-12 px-12 font-bold shadow-glow">
              Launch Project
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}

