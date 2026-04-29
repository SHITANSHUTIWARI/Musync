"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/design-system/components/Button";
import { ProjectCard } from "@/design-system/components/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import API from "@/lib/api";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import {
  MapPin, Music2, Github, Twitter,
  Youtube, Instagram, Globe, Disc3, FolderOpen, ArrowLeft, MessageSquare, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github:    <Github size={16} />,
  twitter:   <Twitter size={16} />,
  youtube:   <Youtube size={16} />,
  instagram: <Instagram size={16} />,
  website:   <Globe size={16} />,
  spotify:   <Disc3 size={16} />,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { playTrack } = usePlayer();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "about">("projects");
  const [connectionStatus, setConnectionStatus] = useState<string>("none");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, projectsRes] = await Promise.all([
          API.get(`/profile/${id}`),
          API.get(`/projects/user/${id}`)
        ]);

        if (profileRes.data.success) {
          setProfile(profileRes.data.profile);
          // In a real app, connection status would come from the profile or a separate call
          // For now, we'll assume "none" or check if it's the current user
        }
        
        if (projectsRes.data.success) {
          setProjects(projectsRes.data.projects || []);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleConnect = async () => {
    try {
      await API.post("/connections/request", { recipient: id });
      setConnectionStatus("sent");
      toast.success("Connection request sent!");
    } catch (error) {
      toast.error("Failed to send connection request");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-12 h-12 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
          </div>
          <p className="text-silver font-body text-sm">Loading creator identity...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h2 className="text-2xl font-display font-bold text-white">Creator Not Found</h2>
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft size={16} className="mr-2" /> Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isOwnProfile = currentUser?.id === id;
  const socialLinks = Object.entries(profile.socialLinks || {}).filter(([, v]) => v);
  const initials = profile.displayName?.charAt(0).toUpperCase() || "?";

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-silver hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Discovery
        </button>

        {/* ── High-Fidelity Cover & Avatar ── */}
        <motion.div variants={item} className="relative z-10">
          <div className="bg-onyx rounded-[2rem] border border-white/5 shadow-2xl relative">
            
            <div className="h-64 md:h-72 w-full rounded-t-[2rem] relative overflow-hidden bg-carbon group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/20 to-transparent" />
            </div>

            <div className="px-6 md:px-10 pb-10 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 md:-mt-24 mb-6">
                <div className="relative shrink-0 z-20">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-[6px] border-onyx overflow-hidden aurora-bg flex items-center justify-center text-white font-display font-bold text-5xl shadow-glow-sm">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                </div>

                <div className="flex-1 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white mb-2">
                       {profile.displayName}
                    </h1>
                    <div className="flex items-center gap-3">
                       <Badge variant="neon" className="px-3 py-1 text-xs uppercase">
                         {profile.role || "CREATOR"}
                       </Badge>
                       {profile.location && (
                          <span className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-silver font-body">
                            <MapPin size={12} className="text-mist" /> {profile.location}
                          </span>
                       )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                      <Link href="/profile/edit">
                        <Button variant="secondary" className="gap-2 text-sm font-bold shadow-sm">
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button variant="outline" className="gap-2 text-sm font-bold border-white/10 hover:bg-white/5">
                          <MessageSquare size={16} /> Message
                        </Button>
                        <Button 
                          onClick={handleConnect} 
                          disabled={connectionStatus !== "none"}
                          className="gap-2 text-sm font-bold shadow-glow"
                        >
                          {connectionStatus === "sent" ? "Request Sent" : <><UserPlus size={16} /> Connect</>}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-base font-body text-silver leading-relaxed max-w-3xl mb-8">
                {profile.bio || "This creator hasn't shared their story yet."}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/5 pt-6">
                 <div className="flex flex-wrap items-center gap-2">
                   <span className="text-[10px] font-bold text-silver uppercase tracking-widest mr-2 font-body">Soundscape</span>
                   {profile.genres?.length > 0 ? (
                      profile.genres.map((g: string) => (
                         <span key={g} className="px-3 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-mist border border-white/5 uppercase tracking-wide font-body">
                            {g}
                         </span>
                      ))
                   ) : (
                      <span className="text-xs text-silver/50 italic font-body">Unspecified</span>
                   )}
                 </div>

                 {socialLinks.length > 0 && (
                   <div className="flex items-center gap-2">
                     {socialLinks.map(([platform, url]) => (
                       <a
                         key={platform}
                         href={url as string}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-silver hover:bg-neon-violet/20 hover:text-neon-violet hover:border-neon-violet/30 transition-all group"
                       >
                         <div className="group-hover:scale-110 transition-transform">
                            {SOCIAL_ICONS[platform] ?? <Globe size={16} />}
                         </div>
                       </a>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div variants={item} className="flex items-center gap-6 border-b border-white/5 pb-px">
           <button
             onClick={() => setActiveTab("projects")}
             className={`pb-4 text-sm font-bold font-body transition-colors relative ${activeTab === "projects" ? "text-white" : "text-silver hover:text-mist"}`}
           >
             Projects
             {activeTab === "projects" && (
               <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 aurora-bg rounded-t-full shadow-glow-sm" />
             )}
           </button>
           <button
             onClick={() => setActiveTab("about")}
             className={`pb-4 text-sm font-bold font-body transition-colors relative ${activeTab === "about" ? "text-white" : "text-silver hover:text-mist"}`}
           >
             About
             {activeTab === "about" && (
               <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 aurora-bg rounded-t-full shadow-glow-sm" />
             )}
           </button>
        </motion.div>

        {/* ── Tab Content: Projects ── */}
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-2xl text-white flex items-center gap-3">
                   <FolderOpen size={24} className="text-neon-violet" /> Deployed Assets
                </h2>
              </div>

              {projects.length === 0 ? (
                 <Card className="py-20 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-silver mb-6">
                     <Music2 size={32} />
                   </div>
                   <h3 className="text-xl font-headline font-bold text-white mb-2">No Projects</h3>
                   <p className="text-silver font-body max-w-sm mx-auto text-sm">This creator hasn't published any assets yet.</p>
                 </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <ProjectCard
                      key={p._id}
                      title={p.title}
                      description={p.description}
                      imageUrl={p.coverImage}
                      audioUrl={p.audioLink}
                      tag={p.type ? p.type.toUpperCase() : "AUDIO"}
                      status={p.status}
                      creatorName={profile.displayName}
                      onPlay={() => {
                        if (p.audioLink) {
                          playTrack({
                            id: p._id,
                            title: p.title,
                            artist: profile.displayName,
                            url: p.audioLink,
                            cover: p.coverImage
                          });
                        } else {
                          toast.error("No audio file available for this project");
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-8 border-white/5">
                <h3 className="text-lg font-headline font-bold text-white mb-4">Biography</h3>
                <p className="text-silver font-body leading-relaxed max-w-3xl mb-8">
                  {profile.bio || "No biography provided."}
                </p>
                
                <h3 className="text-lg font-headline font-bold text-white mb-4">Network Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="p-4 rounded-xl bg-carbon border border-white/5 text-center">
                     <p className="text-2xl font-display font-bold text-white">{projects.length}</p>
                     <p className="text-[10px] uppercase tracking-widest text-silver font-body mt-1">Projects</p>
                   </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
