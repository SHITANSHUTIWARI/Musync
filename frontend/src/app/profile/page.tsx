"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/design-system/components/Button";
import { ProjectCard } from "@/design-system/components/ProjectCard";
import API from "@/lib/api";
import Link from "next/link";
import {
  MapPin, Link2, Pencil, Music2, Plus, Github, Twitter,
  Youtube, Instagram, ExternalLink, Headphones, Globe
} from "lucide-react";
import { motion } from "framer-motion";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github:    <Github size={16} />,
  twitter:   <Twitter size={16} />,
  youtube:   <Youtube size={16} />,
  instagram: <Instagram size={16} />,
  website:   <Globe size={16} />,
  spotify:   <Headphones size={16} />,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

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
        <div className="max-w-5xl mx-auto space-y-6 mt-10">
          <div className="h-64 animate-pulse bg-surface-low rounded-3xl border border-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-[320px] animate-pulse bg-surface-low rounded-2xl border border-white/5" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-surface-low border border-white/5 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow relative z-10">
                <Music2 size={36} className="text-white" />
              </div>
              <h2 className="text-3xl font-headline font-black mb-3 tracking-tight text-foreground relative z-10">Identity Missing</h2>
              <p className="text-secondary-foreground font-body leading-relaxed mb-8 relative z-10">
                Establish your creator identity to unlock network connectivity, asset publishing, and global discovery.
              </p>
              <Link href="/profile/edit" className="relative z-10 block">
                <Button size="lg" className="gap-2 w-full text-md shadow-glow-sm">
                  <Plus size={16} /> Initialize Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const socialLinks = Object.entries(profile.socialLinks || {}).filter(([, v]) => v);

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8 mt-4">

        {/* ── High-Fidelity Profile Header ── */}
        <motion.div variants={item} className="relative z-10">
          <div className="bg-surface-lowest rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
            
            {/* Cinematic Cover Background */}
            <div className="h-64 relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-surface-lowest group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.4),transparent_60%)] opacity-80 mix-blend-screen" />
              <div className="absolute inset-0 backdrop-blur-2xl bg-surface-lowest/40" />
              <div className="absolute -inset-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
              
              {/* Animated decorative rings */}
              <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full border border-primary/20 scale-[2] group-hover:scale-[2.1] transition-transform duration-1000 ease-out" />
              <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full border border-primary/10 scale-[2.5] group-hover:scale-[2.6] transition-transform duration-1000 ease-out" />
            </div>

            {/* Profile Content Container */}
            <div className="px-8 pb-10 -mt-24 relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-row lg:gap-10">
              
              {/* Avatar Box */}
              <div className="relative shrink-0 mb-6 lg:mb-0">
                <Avatar
                  name={profile.displayName}
                  src={profile.avatar}
                  size="xl"
                  className="w-40 h-40 ring-8 ring-surface-lowest shadow-2xl"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-surface-lowest shadow-md animate-pulse" />
              </div>

              {/* Data payload */}
              <div className="flex-1 w-full pt-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black tracking-tight text-foreground mb-1">
                       {profile.displayName}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                       <span>{user?.role || "CREATOR"}</span>
                       {profile.location && (
                          <>
                             <span className="w-1 h-1 bg-white/20 rounded-full" />
                             <span className="flex items-center gap-1.5 text-secondary-foreground"><MapPin size={14} />{profile.location}</span>
                          </>
                       )}
                    </div>
                  </div>

                  <Link href="/profile/edit" className="shrink-0">
                    <Button variant="secondary" className="gap-2 px-6 h-12 text-sm">
                      <Pencil size={15} /> Edit Identity
                    </Button>
                  </Link>
                </div>

                <p className="text-lg font-body text-secondary-foreground leading-relaxed max-w-3xl mb-8 mx-auto lg:mx-0">
                  {profile.bio || "No biography data logged in the mainframe."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6">
                   {/* Tags / Genres */}
                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                     <span className="text-[10px] font-bold text-secondary-foreground uppercase tracking-widest mr-2">Frequencies</span>
                     {profile.genres?.length > 0 ? (
                        profile.genres.map((g: string) => (
                           <span key={g} className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground border border-primary/20 shadow-glow-sm">
                              {g}
                           </span>
                        ))
                     ) : (
                        <span className="text-xs text-secondary-foreground italic">None added</span>
                     )}
                   </div>

                   {/* Social Links */}
                   {socialLinks.length > 0 && (
                     <div className="flex items-center gap-3">
                       {socialLinks.map(([platform, url]) => (
                         <a
                           key={platform}
                           href={url as string}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-10 h-10 rounded-xl bg-surface-low border border-white/5 flex items-center justify-center text-secondary-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all shadow-sm group"
                         >
                           <div className="group-hover:scale-110 transition-transform">
                              {SOCIAL_ICONS[platform] ?? <Link2 size={16} />}
                           </div>
                         </a>
                       ))}
                     </div>
                   )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* ── Asset Matrix (Projects) ── */}
        <motion.div variants={item} className="pt-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-headline font-black text-3xl tracking-tight flex items-center gap-3">
                 <FolderOpenIcon className="text-primary" /> Deployed Assets
              </h2>
              <p className="text-secondary-foreground font-body mt-1">
                 {projects.length} localized project{projects.length !== 1 ? "s" : ""} registered in your domain.
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
             <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-surface-low/30 backdrop-blur-sm">
               <Music2 size={48} className="mx-auto mb-6 text-white/10" />
               <h3 className="text-xl font-headline font-bold text-foreground mb-2">Matrix is empty</h3>
               <p className="text-secondary-foreground font-body max-w-sm mx-auto mb-6">No audio projects have been compiled to your profile.</p>
               <Link href="/projects/add">
                 <Button variant="secondary" className="gap-2 border-white/10">
                   <Plus size={14} /> Distribute Asset
                 </Button>
               </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => {
                 const imageUrl = p.coverImage || `https://placehold.co/600x400/131313/5d5fef?text=${p.title}`;
                 
                 const ViewAction = (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-xl backdrop-blur-md">
                       <Link href={`/projects/${p._id}`}>
                          <button className="w-8 h-8 rounded-lg bg-surface border border-white/10 hover:border-primary/50 flex items-center justify-center text-foreground hover:text-primary transition-all">
                             <ExternalLink size={12} />
                          </button>
                       </Link>
                    </div>
                 );

                 return (
                   <motion.div key={p._id} variants={item} className="h-full">
                     <ProjectCard
                       title={p.title}
                       description={p.description || "No transmission notes."}
                       imageUrl={imageUrl}
                       tag={p.type ? p.type.toUpperCase() : "AUDIO"}
                       budgetOrType={p.status ? p.status.toUpperCase() : "LIVE"}
                       creatorName={profile.displayName}
                       creatorAvatarUrl={profile.avatar}
                       actionNode={ViewAction}
                       className="h-full bg-surface-lowest hover:bg-surface-low border border-white/5 transition-colors p-4 pb-6"
                     />
                   </motion.div>
                 );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

function FolderOpenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}
