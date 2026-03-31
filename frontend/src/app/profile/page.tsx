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
import { MapPin, Link2, Pencil, Music2, Plus } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([API.get("/profile/me"), API.get("/projects")]).then(([p, pr]) => {
      if (p.status === "fulfilled") setProfile(p.value.data.profile);
      if (pr.status === "fulfilled") setProjects(pr.value.data.projects || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div></DashboardLayout>;

  if (!profile) return (
    <DashboardLayout>
      <Card className="p-12 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Music2 size={28} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Complete your profile</h2>
        <p className="text-sm text-muted-foreground mb-6">Set up your artist profile to start connecting with other creators.</p>
        <Link href="/profile/edit"><Button className="gap-2"><Plus size={15} /> Create Profile</Button></Link>
      </Card>
    </DashboardLayout>
  );

  const socialLinks = Object.entries(profile.socialLinks || {}).filter(([, v]) => v);

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-5">
        {/* Header card */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex items-end justify-between mb-4">
              <Avatar name={profile.displayName} src={profile.avatar} size="xl" className="ring-4 ring-card" />
              <Link href="/profile/edit">
                <Button variant="outline" size="sm" className="gap-2"><Pencil size={13} /> Edit Profile</Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
            <p className="text-muted-foreground capitalize mt-0.5">{user?.role}</p>
            {profile.location && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <MapPin size={13} /> {profile.location}
              </p>
            )}
            {profile.bio && <p className="text-sm text-foreground/80 mt-3 leading-relaxed max-w-xl">{profile.bio}</p>}

            {/* Genres */}
            {profile.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.genres.map((g: string) => <Badge key={g} variant="default">{g}</Badge>)}
              </div>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {socialLinks.map(([platform, url]) => (
                  <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline capitalize">
                    <Link2 size={12} /> {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Projects</h2>
            <Link href="/projects/add"><Button size="sm" variant="outline" className="gap-1.5"><Plus size={13} /> Add</Button></Link>
          </div>
          {projects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <Card key={p._id} className="p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{p.title}</h3>
                    <Badge variant={p.status === "published" ? "success" : "secondary"} className="text-[10px] shrink-0">{p.status}</Badge>
                  </div>
                  {p.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>}
                  <div className="flex flex-wrap gap-1">
                    {p.type && <Badge variant="default" className="text-[10px]">{p.type}</Badge>}
                    {p.genres?.slice(0, 2).map((g: string) => <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
