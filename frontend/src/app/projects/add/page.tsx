"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";

const TYPES = ["song", "beat", "album", "collab"];
const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats", "Other"];
const STATUSES = ["draft", "published"];

export default function AddProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", type: "", description: "", genres: "", status: "draft", coverImage: "", audioLink: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.type) { toast.error("Project type is required"); return; }
    setSaving(true);
    try {
      await API.post("/projects", {
        ...form,
        genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
        coverImage: form.coverImage || undefined,
        audioLink: form.audioLink || undefined,
      });
      toast.success("Project created!");
      router.push("/projects");
    } catch (err: any) {
      const d = err.response?.data;
      toast.error(d?.errors?.[0]?.message || d?.error?.message || "Failed");
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Add Project</h1>
          <p className="text-sm text-muted-foreground mt-1">Showcase your musical work</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title *" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Summer EP" required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Type *</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} required
                  className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize cursor-pointer">
                  <option value="">Select type</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="What's this project about?" rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Genre</label>
                <select value={form.genres} onChange={(e) => set("genres", e.target.value)}
                  className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                  <option value="">Select genre</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}
                  className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize cursor-pointer">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Media Links</h2>
            <Input label="Cover Image URL" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." />
            <Input label="Audio Link" value={form.audioLink} onChange={(e) => set("audioLink", e.target.value)} placeholder="https://soundcloud.com/..." />
          </Card>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/projects")}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Project</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
