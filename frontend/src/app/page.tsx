"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { Music2, ArrowRight, Users, FolderOpen, MessageSquare, Zap, Globe, Shield, Play, Mic2, Disc } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Users,         title: "Professional Network",   desc: "Connect with producers, vocalists, beatmakers, and songwriters who match your creative vision." },
  { icon: FolderOpen,    title: "Showcase Projects",      desc: "Present your work professionally. Share beats, songs, albums, and collabs with the right people." },
  { icon: MessageSquare, title: "Direct Collaboration",   desc: "Message connected artists directly. No noise, no algorithms — just meaningful creative conversations." },
  { icon: Zap,           title: "Discover Talent",        desc: "Filter by genre, role, and location. Find exactly the collaborator your next project needs." },
  { icon: Globe,         title: "Global Reach",           desc: "Your next collaborator could be anywhere. MUSYNC connects creators across the world." },
  { icon: Shield,        title: "Professional First",     desc: "No likes, no followers, no viral content. Just serious creators doing serious work." },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 scroll-smooth overflow-x-hidden">
      {/* ── Background Mesh ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[hsl(var(--primary-container)/0.1)] rounded-full blur-[100px] opacity-40" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl signature-gradient flex items-center justify-center shadow-glow-sm">
              <Music2 size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tighter">MUSYNC</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            {loggedIn ? (
              <Link href="/dashboard">
                <Button variant="secondary" className="font-bold border-border/60">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors pr-2">
                  Sign in
                </Link>
                <Link href="/signup">
                  <Button className="font-bold px-6">Join Backstage</Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest mb-10 shadow-glow-sm"
            >
              <Zap size={14} className="fill-primary" />
              The Digital Backstage for Serious Creators
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-glow"
            >
              Where Music <br />
              <span className="signature-gradient-text">Gets Made.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            >
              Build your professional network, find your next collaborator, and showcase your creative vision on the only platform built exclusively for sound.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-5 flex-wrap"
            >
              <Link href={loggedIn ? "/dashboard" : "/signup"}>
                <Button size="lg" className="h-14 px-10 gap-3 text-lg font-bold shadow-glow group">
                  {loggedIn ? "Open Dashboard" : "Start Your Journey"}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {!loggedIn && (
                <Link href="/discover">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-border/80 hover:bg-surface-high">
                    Explore Network
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Floating elements for visual depth */}
        <div className="absolute top-[40%] right-[-5%] w-64 h-64 glass rounded-[3rem] rotate-12 opacity-20 blur-sm pointer-events-none border border-primary/20" />
        <div className="absolute bottom-[10%] left-[-2%] w-48 h-48 signature-gradient rounded-full opacity-10 blur-3xl pointer-events-none" />
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-32 px-6 bg-surface-low/50 relative border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5">Professional-First Workflow.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              We ditched the likes, followers, and noise to focus on what actually moves the needle: your music.
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={item}>
                <div className="glass-card h-full p-8 rounded-3xl card-hover relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors" />
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Showcase Section ── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
              <Play size={14} className="fill-primary" />
              Listen & Connect
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-6 leading-tight">Your Portfolio, <br /> Built for the Ear.</h2>
            <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
              Upload tracks, stems, and demos directly. Let potential collaborators hear exactly what you bring to the session. No more clunky cloud links.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mic2, text: "Showcase your vocal range and style" },
                { icon: Disc, text: "Link SoundCloud, Spotify, and YouTube" },
                { icon: MessageSquare, text: "Direct-to-collaborator messaging" }
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 font-bold text-sm">
                  <div className="w-6 h-6 rounded-lg bg-surface-high flex items-center justify-center border border-border">
                    <point.icon size={12} className="text-primary" />
                  </div>
                  {point.text}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square glass rounded-[4rem] border border-border/60 shadow-2xl overflow-hidden p-8 flex items-center justify-center">
               <div className="w-full h-full rounded-[3rem] shimmer opacity-40" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full signature-gradient flex items-center justify-center shadow-glow animate-pulse">
                     <Music2 size={40} className="text-white" />
                  </div>
               </div>
            </div>
            {/* Decorative badges */}
            <div className="absolute top-10 -right-10 glass px-6 py-4 rounded-2xl shadow-xl border border-primary/20 rotate-12">
               <span className="text-xs font-black text-primary">PROJECT LIVE</span>
            </div>
            <div className="absolute bottom-20 -left-6 glass px-6 py-4 rounded-2xl shadow-xl border border-primary/20 -rotate-6">
               <span className="text-xs font-black text-foreground">NEW COLLABORATOR</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center glass p-16 sm:p-24 rounded-[4rem] border border-primary/20 shadow-glow shadow-primary/5 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-8">Ready to step <br /> <span className="signature-gradient-text">Into the Backstage?</span></h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto font-medium">
            Join the global network of thousands of professional creators already building on MUSYNC.
          </p>
          {!loggedIn && (
            <Link href="/signup">
              <Button size="lg" className="h-14 px-12 text-lg font-bold gap-3 shadow-glow group">
                Create Free Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-primary/10 blur-[130px] rounded-full" />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center">
                <Music2 size={16} className="text-white" />
              </div>
              <span className="font-black text-lg tracking-tight uppercase">MUSYNC</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px]">
              The professional collaboration network for modern music creators.
            </p>
          </div>
          
          <div className="flex gap-12 flex-wrap">
            <div className="space-y-4 text-sm">
               <p className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Platform</p>
               <Link href="/discover" className="block font-semibold hover:text-primary transition-colors">Discover</Link>
               <Link href="/projects" className="block font-semibold hover:text-primary transition-colors">Showcase</Link>
            </div>
            <div className="space-y-4 text-sm">
               <p className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Company</p>
               <Link href="#" className="block font-semibold hover:text-primary transition-colors">About</Link>
               <Link href="#" className="block font-semibold hover:text-primary transition-colors">Legal</Link>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Crafted for Sound</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">© 2026 MUSYNC INC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

