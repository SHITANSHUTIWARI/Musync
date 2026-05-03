"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/design-system/components/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Music, FileAudio, Disc, Users as UsersIcon, LayoutGrid, Globe, ArrowLeft, Save, UploadCloud, Disc3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "song", label: "Single / Song", icon: Music },
  { id: "beat", label: "Beat / Instrumental", icon: FileAudio },
  { id: "album", label: "Album / EP", icon: Disc },
  { id: "collab", label: "Collaboration", icon: UsersIcon },
];

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats", "Other"];
const STATUSES = ["draft", "published"];

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ 
    title: "", 
    type: "", 
    description: "", 
    genres: "", 
    status: "published", 
    coverImage: "", 
    audioLink: "" 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    API.get(`/api/projects/${id}`)
      .then(({ data }) => {
        const project = data.project;
        if (project) {
          setForm({
            title: project.title || "",
            type: project.type || "",
            description: project.description || "",
            genres: project.genres?.[0] || "",
            status: project.status || "published",
            coverImage: project.coverImage || "",
            audioLink: project.audioLink || ""
          });
        }
      })
      .catch(() => toast.error("Failed to load project details"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Please enter a project title"); return; }
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('status', form.status);
      
      if (form.genres) {
        formData.append('genres[]', form.genres);
      }
      
      if (coverImageFile) {
        formData.append('coverImageFile', coverImageFile);
      }
      
      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      await API.put(`/api/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (err: any) {
      toast.error("Failed to update project");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <Disc3 size={40} className="animate-spin-slow text-neon-violet opacity-50" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-silver hover:text-white transition-colors mb-6 font-body"
            >
              <ArrowLeft size={14} /> Back to Projects
            </button>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white flex items-center gap-3">
               Edit Asset
            </h1>
            <p className="text-sm text-silver mt-2 font-body">Modify your deployed asset metadata and files.</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={handleSubmit} disabled={saving} className="gap-2 shadow-glow-sm px-8 h-12 font-bold">
               {saving ? <Disc3 size={18} className="animate-spin-slow" /> : <Save size={18} />} 
               {saving ? "Saving..." : "Save Changes"}
             </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Type Selection */}
          <Card className="p-8 border-white/5 relative overflow-hidden bg-onyx">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight text-white">Asset Protocol</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set("type", t.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-4",
                    form.type === t.id 
                      ? "border-neon-violet bg-neon-violet/10 text-white shadow-[0_0_20px_rgba(138,43,226,0.15)]" 
                      : "border-white/5 bg-carbon hover:border-white/20 hover:bg-white/5 text-silver"
                  )}
                >
                  <t.icon size={28} className={form.type === t.id ? "text-neon-violet" : "opacity-80"} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center font-body">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Section: Basic Details */}
          <Card className="p-8 border-white/5 relative bg-onyx">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Music size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight text-white">Metadata</h2>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex flex-col gap-2">
                 <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Title</label>
                 <input
                   value={form.title}
                   onChange={(e) => set("title", e.target.value)}
                   className="w-full h-14 rounded-xl bg-carbon border border-white/10 px-4 text-white placeholder:text-silver/50 focus:outline-none focus:border-neon-violet/50 transition-all font-body text-base"
                 />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => set("description", e.target.value)}
                  rows={4} 
                  className="w-full rounded-xl bg-carbon border border-white/10 px-4 py-3 text-white placeholder:text-silver/50 focus:outline-none focus:border-neon-violet/50 transition-all resize-none font-body text-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Genre</label>
                  <select 
                    value={form.genres} 
                    onChange={(e) => set("genres", e.target.value)}
                    className="h-14 px-4 rounded-xl bg-carbon border border-white/10 text-white font-body text-sm focus:outline-none focus:border-neon-violet/50"
                  >
                    <option value="">Unspecified</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Status</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => set("status", e.target.value)}
                    className="h-14 px-4 rounded-xl bg-carbon border border-white/10 text-white font-body text-sm capitalize focus:outline-none focus:border-neon-violet/50"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s === "published" ? "Public Network" : "Private Draft"}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Assets */}
          <Card className="p-8 border-white/5 relative bg-onyx">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Globe size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight text-white">Payload Update</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Cover Image Upload */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Cover Art</label>
                <label className="flex-1 min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-carbon hover:border-neon-violet/50 hover:bg-white/5 transition-all cursor-pointer group p-4 text-center relative overflow-hidden">
                   <input 
                     type="file"
                     accept=".jpg,.jpeg,.png,.webp"
                     className="hidden"
                     onChange={(e) => {
                       if (e.target.files && e.target.files[0]) {
                         setCoverImageFile(e.target.files[0]);
                         set("coverImage", URL.createObjectURL(e.target.files[0]));
                       }
                     }}
                   />
                   {form.coverImage ? (
                     <div className="absolute inset-0">
                       <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover opacity-60" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs font-bold text-white font-body">Replace Image</span>
                       </div>
                     </div>
                   ) : (
                     <>
                       <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                         <UploadCloud size={20} className="text-silver" />
                       </div>
                       <span className="text-sm font-bold text-white font-body mb-1">Upload Cover</span>
                     </>
                   )}
                </label>
              </div>

              {/* Audio Upload */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-silver font-body">Audio Track</label>
                <label className="flex-1 min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-carbon hover:border-neon-violet/50 hover:bg-white/5 transition-all cursor-pointer group p-4 text-center">
                   <input 
                     type="file"
                     accept=".mp3,.wav,.ogg,.m4a"
                     className="hidden"
                     onChange={(e) => {
                       if (e.target.files && e.target.files[0]) {
                         setAudioFile(e.target.files[0]);
                       }
                     }}
                   />
                   {audioFile ? (
                     <>
                       <div className="w-12 h-12 rounded-full bg-neon-violet/20 flex items-center justify-center mb-3 text-neon-violet">
                         <FileAudio size={20} />
                       </div>
                       <span className="text-sm font-bold text-white font-body mb-1 truncate max-w-full px-4">{audioFile.name}</span>
                     </>
                   ) : (
                     <>
                       <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                         <Music size={20} className="text-silver" />
                       </div>
                       <span className="text-sm font-bold text-white font-body mb-1">
                          {form.audioLink ? "Replace Audio" : "Upload Audio"}
                       </span>
                    </>
                   )}
                </label>
              </div>
            </div>
          </Card>

          <div className="flex gap-4 pt-4 justify-end">
            <Button type="button" variant="outline" className="h-12 px-8 font-bold border-white/10 text-silver hover:text-white" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="h-12 px-12 font-bold shadow-glow-sm">
              {saving ? "Saving..." : "Update Asset"}
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
