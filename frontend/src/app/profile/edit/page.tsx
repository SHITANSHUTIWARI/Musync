"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { User, MapPin, Music, Link as LinkIcon, Camera, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const BLANK = { displayName: "", bio: "", location: "", genres: "", avatar: "",
  socialLinks: { instagram: "", youtube: "", spotify: "", soundcloud: "" } };

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(BLANK);
  const [isUpdate, setIsUpdate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    API.get("/profile/me").then(({ data }) => {
      if (data.success && data.profile) {
        const p = data.profile;
        setIsUpdate(true);
        setForm({ 
          displayName: p.displayName || "", 
          bio: p.bio || "", 
          location: p.location || "",
          genres: (p.genres || []).join(", "), 
          avatar: p.avatar || "",
          socialLinks: { 
            instagram: p.socialLinks?.instagram || "", 
            youtube: p.socialLinks?.youtube || "",
            spotify: p.socialLinks?.spotify || "", 
            soundcloud: p.socialLinks?.soundcloud || "" 
          } 
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));
  const setSocial = (field: string, val: string) =>
    setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [field]: val } }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Create object URL for preview
      set("avatar", URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) { toast.error("Display name is required"); return; }
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('displayName', form.displayName);
      formData.append('bio', form.bio);
      formData.append('location', form.location);
      
      const genresArray = form.genres.split(",").map((g) => g.trim()).filter(Boolean);
      formData.append('genres', JSON.stringify(genresArray));
      formData.append('socialLinks', JSON.stringify(form.socialLinks));
      
      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }

      if (isUpdate) { 
        await API.put("/profile", formData, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      } else { 
        await API.post("/profile", formData, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      }
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (err: any) {
      const d = err.response?.data;
      toast.error(d?.errors?.[0]?.message || d?.error?.message || "Failed to save profile");
    } finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout><div className="h-96 shimmer rounded-3xl max-w-3xl mx-auto" /></DashboardLayout>;

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
              <ArrowLeft size={14} /> Back to Profile
            </button>
            <h1 className="text-3xl font-bold tracking-tight">{isUpdate ? "Edit Profile" : "Create Your Profile"}</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Define your professional presence in the network.</p>
          </div>
          <Button onClick={handleSubmit} loading={saving} className="gap-2 shadow-glow px-8">
            <Save size={18} /> Save Changes
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <User size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Public Display Name *" 
                value={form.displayName} 
                onChange={(e) => set("displayName", e.target.value)} 
                placeholder="e.g. DJ Shadow" 
                required 
              />
              <Input 
                label="Home Base" 
                value={form.location} 
                onChange={(e) => set("location", e.target.value)} 
                placeholder="City, Country" 
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                Professional Bio
              </label>
              <textarea 
                value={form.bio} 
                onChange={(e) => set("bio", e.target.value)}
                placeholder="What defines your sound? What are you looking for in a collaborator?"
                rows={5} 
                className="w-full rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none shadow-sm" 
              />
            </div>
          </Card>

          {/* Section: Sound & Visuals */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Sound & Style</h2>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="Primary Genres" 
                value={form.genres} 
                onChange={(e) => set("genres", e.target.value)} 
                placeholder="Hip-Hop, Lo-Fi, Cinematic (comma separated)" 
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                      Profile Image
                    </label>
                    <input 
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleAvatarChange}
                      className="w-full rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest px-1">
                    Upload a high-quality JPG or PNG (max 5MB).
                  </p>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-surface-high border border-dashed border-border flex items-center justify-center overflow-hidden shrink-0 mt-7">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-muted-foreground/30" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Section: External Links */}
          <Card className="p-8 border-border/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <LinkIcon size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">External Links</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Instagram" value={form.socialLinks.instagram} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="https://instagram.com/..." />
              <Input label="YouTube" value={form.socialLinks.youtube} onChange={(e) => setSocial("youtube", e.target.value)} placeholder="https://youtube.com/..." />
              <Input label="Spotify" value={form.socialLinks.spotify} onChange={(e) => setSocial("spotify", e.target.value)} placeholder="https://open.spotify.com/..." />
              <Input label="SoundCloud" value={form.socialLinks.soundcloud} onChange={(e) => setSocial("soundcloud", e.target.value)} placeholder="https://soundcloud.com/..." />
            </div>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="h-12 px-10 font-bold border-border" onClick={() => router.push("/profile")}>
              Discard Changes
            </Button>
            <Button type="submit" loading={saving} className="h-12 px-12 font-bold shadow-glow">
              Save Profile
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}

