"use client";
import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Disc3, ArrowRight, Music2, Users, Radio, Mic2 } from "lucide-react";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-void text-mist overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzlDMkQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIwaC0ydi0yMEgxdjIwaC0yVjMwaC0zMnYtMmgyMEgxdjIwaDIwdjMyek0zNiAxdjIwaC0yVjFIMXYyMGgtMlYxaC0zMnYyaDIwaC0ydjIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] aurora-bg blur-[120px] opacity-[0.15] rounded-full pointer-events-none" />
      <div className="scan-line absolute inset-0 pointer-events-none opacity-40" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-void/60 backdrop-blur-xl border-b border-white/[0.04] h-20 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
            <Disc3 size={20} className="text-white group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">MUSYNC</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="font-bold font-body">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" className="font-bold font-body">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 flex flex-col items-center justify-center text-center min-h-[90vh]">
        <motion.div style={{ y: y1, opacity }} className="max-w-4xl z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-widest text-silver mb-8 font-body">
              <span className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,214,122,0.8)] animate-pulse" />
              The Digital Backstage
            </div>
            <h1 className="text-6xl md:text-[5.5rem] font-display font-bold text-white tracking-tighter leading-[1.05] mb-6">
              Create.<br />
              Collaborate.<br />
              <span className="aurora-text">Elevate.</span>
            </h1>
            <p className="text-lg md:text-xl text-silver font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              The premier network for elite music professionals. Connect with producers, vocalists, and engineers to build your sonic legacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link href="/signup">
                <Button size="xl" className="font-bold group px-10 shadow-glow-sm hover:shadow-glow text-base">
                  Join the Network
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="secondary" size="xl" className="font-bold px-10 text-base">
                  Explore Creators
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Built for the Modern Creator</h2>
          <p className="text-silver font-body text-lg">Everything you need to take your music from concept to completion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-2 glass-obsidian rounded-[2rem] p-8 md:p-10 border border-white/[0.06] hover:border-neon-violet/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl aurora-bg flex items-center justify-center mb-6 shadow-glow-sm">
              <Users size={28} className="text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Global Network</h3>
            <p className="text-silver font-body text-base leading-relaxed max-w-md">
              Find the perfect vocalist for your beat, or the right engineer for your mix. Our advanced discovery engine connects you with vetted professionals worldwide.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-obsidian rounded-[2rem] p-8 md:p-10 border border-white/[0.06] hover:border-electric-blue/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-electric-blue">
              <Music2 size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-4">Showcase Work</h3>
            <p className="text-silver font-body text-sm leading-relaxed">
              Upload your best tracks with high-fidelity audio playback. Let your work speak for itself.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-obsidian rounded-[2rem] p-8 md:p-10 border border-white/[0.06] hover:border-neon-violet/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-neon-violet">
              <Radio size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-4">Live Collaboration</h3>
            <p className="text-silver font-body text-sm leading-relaxed">
              Pitch ideas, share stems, and communicate in real-time through dedicated project workspaces.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-2 glass-obsidian rounded-[2rem] p-8 md:p-10 border border-white/[0.06] hover:border-emerald/30 transition-all duration-300 group flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-emerald">
                <Mic2 size={28} />
              </div>
              <h3 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Premium Profiles</h3>
              <p className="text-silver font-body text-base leading-relaxed">
                Your MUSYNC profile is your new industry resume. Highlight your roles, genres, past work, and social links in a beautiful, unified view.
              </p>
            </div>
            <div className="w-full md:w-72 h-48 bg-carbon rounded-3xl border border-white/10 overflow-hidden relative shadow-inner-glow">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
               <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
               <div className="absolute bottom-4 left-4">
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-emerald shadow-[0_0_12px_rgba(16,214,122,1)]" />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative mt-12 border-t border-white/[0.04]">
        <div className="absolute inset-0 aurora-bg opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-violet/50 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Ready to make noise?</h2>
          <p className="text-xl text-mist font-body mb-10">Join thousands of creators shaping the future of music.</p>
          <Link href="/signup">
            <Button size="xl" className="shadow-glow hover:shadow-glow-lg font-bold px-12 text-base">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-void z-10 relative">
        <div className="flex items-center gap-2">
          <Disc3 size={18} className="text-neon-violet" />
          <span className="font-display font-bold text-sm tracking-wide text-white">MUSYNC</span>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-silver font-body">© 2026 The Creative Network</p>
      </footer>
    </div>
  );
}
