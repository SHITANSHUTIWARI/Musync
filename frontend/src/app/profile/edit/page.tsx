"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";

const BLANK = { displayName: "", bio: "", location: "", genres: "", avatar: "",
  socialLinks: { instagram: "", youtube: "", spotify: "", soundcloud: "" } };

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(BLANK);
  const [isUpdate, setIsUpdate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile/me").then(({ data }) => {
      if (data.success && data.profile) {
        const p = data.profile;
        setIsUpdate(true);
        setForm({ displayName: p.displayName || "", bio: p.bio || "", location: p.location || "",
          genres: (p.genres || []).join(", "), avatar: p.avatar || "",
          socialLinks: { instagram: p.socialLinks?.instagram || "", youtube: p.socialLinks?.youtube || "",
            spotify: p.socialLinks?.spotify || "", soundcloud: p.socialLinks?.soundcloud || "" } });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));
  const setSocial = (field: string, val: string) =>
    setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [field]: val } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) { toast.error("Display name is required"); return; }
    setSaving(true);
    const payload = { ...form, genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean) };
    try {
      if (isUpdate) { await API.put("/profile", payload); }
      else { await API.post("/profile", payload); }
      toast.success("Profile saved!");
      router.push("/profile");
    } catch (err: any) {
      const d = err.response?.data;
      toast.error(d?.errors?.[0]?.message || d?.error?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout><div className="h-64 shimmer rounded-2xl max-w-2xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{isUpdate ? "Edit Profile" : "Create Profile"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Your professional music creator profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Display Name *" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Your artist name" required />
              <Input label="Location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)}
                placeholder="Tell the world about your music and what you're looking for..."
                rows={4} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            </div>
            <Input label="Genres (comma separated)" value={form.genres} onChange={(e) => set("genres", e.target.value)} placeholder="Hip-Hop, R&B, Electronic" />
            <Input label="Avatar URL" value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://example.com/photo.jpg" />
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Instagram" value={form.socialLinks.instagram} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="https://instagram.com/..." />
              <Input label="YouTube" value={form.socialLinks.youtube} onChange={(e) => setSocial("youtube", e.target.value)} placeholder="https://youtube.com/..." />
              <Input label="Spotify" value={form.socialLinks.spotify} onChange={(e) => setSocial("spotify", e.target.value)} placeholder="https://spotify.com/..." />
              <Input label="SoundCloud" value={form.socialLinks.soundcloud} onChange={(e) => setSocial("soundcloud", e.target.value)} placeholder="https://soundcloud.com/..." />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")}>Cancel</Button>
            <Button type="submit" loading={saving}>{isUpdate ? "Save Changes" : "Create Profile"}</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
