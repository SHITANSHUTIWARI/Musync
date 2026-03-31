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
import {
  MapPin, Link2, Pencil, Music2, Plus, Github, Twitter,
  Youtube, Instagram, ExternalLink, Headphones
} from "lucide-react";
import { motion } from "framer-motion";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github:    <Github size={14} />,
  twitter:   <Twitter size={14} />,
  youtube:   <Youtube size={14} />,
  instagram: <Instagram size={14} />,
  website:   <ExternalLink size={14} />,
  spotify:   <Headphones size={14} />,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl space-y-5">
          <div className="h-52 shimmer rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-12 text-center max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl signature-gradient flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Music2 size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">Complete Your Profile</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Set up your artist profile to start connecting with other creators and collaborators.
              </p>
              <Link href="/profile/edit">
                <Button className="gap-2 w-full">
                  <Plus size={15} /> Create Profile
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const socialLinks = Object.entries(profile.socialLinks || {}).filter(([, v]) => v);

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl space-y-5">

        {/* ── Profile Header Card ── */}
        <motion.div variants={item}>
          <Card className="overflow-hidden p-0">
            {/* Banner */}
            <div className="h-36 relative overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-[hsl(var(--primary-container)/0.2)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.3),transparent_70%)]" />
              <div className="absolute inset-0 backdrop-blur-sm" />
              {/* Decorative music notes pattern */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <Music2
                    key={i}
                    size={24 + i * 8}
                    className="absolute text-primary"
                    style={{ top: `${10 + i * 15}%`, left: `${5 + i * 18}%`, transform: `rotate(${i * 15}deg)` }}
                  />
                ))}
              </div>
            </div>

            {/* Profile info */}
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-end gap-4">
                  <Avatar
                    name={profile.displayName}
                    src={profile.avatar}
                    size="xl"
                    className="ring-4 ring-surface-low shadow-xl"
                  />
                  <div className="mb-1.5">
                    <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
                    <p className="text-muted-foreground capitalize text-sm font-medium mt-0.5">{user?.role}</p>
                  </div>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                    <Pencil size={13} /> Edit Profile
                  </Button>
                </Link>
              </div>

              {/* Location */}
              {profile.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin size={13} className="text-primary" /> {profile.location}
                </p>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-foreground/80 leading-relaxed max-w-xl mb-4">
                  {profile.bio}
                </p>
              )}

              {/* Genre Chips */}
              {profile.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.genres.map((g: string) => (
                    <Badge key={g} variant="outline" className="border-primary/30 text-primary bg-primary/5 font-semibold">
                      {g}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {socialLinks.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-surface-high border border-border hover:border-primary/40 hover:text-primary px-3 py-1.5 rounded-xl transition-all capitalize"
                    >
                      {SOCIAL_ICONS[platform] ?? <Link2 size={12} />}
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* ── Projects Section ── */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg tracking-tight">Projects</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
            </div>
            <Link href="/projects/add">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Plus size={13} /> Add Project
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card className="p-10 text-center">
              <Music2 size={28} className="text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="font-semibold mb-1 text-sm">No projects yet</p>
              <p className="text-xs text-muted-foreground">Showcase your work — add your first project.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <motion.div key={p._id} variants={item}>
                  <Card className="p-0 overflow-hidden group card-hover h-full flex flex-col">
                    {/* Card color accent */}
                    <div className="h-1 signature-gradient w-full opacity-60" />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2.5">
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
                      <div className="flex flex-wrap gap-1.5">
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
                          className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 hover:underline font-semibold"
                        >
                          <Headphones size={12} /> Listen
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
