"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/design-system/components/Button";
import { Music2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROLES = ["artist", "producer", "listener", "rapper", "musician", "engineer"];

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "artist" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const result = await signup(form);
    if (!result.success) setError(result.message || "Signup failed");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex flex-row-reverse font-body">
      {/* ── Right form column ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-[380px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl aurora-bg flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.4)]">
                <Music2 size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-display">MUSYNC</span>
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">Request Entry.</h1>
              <p className="text-sm text-silver leading-relaxed font-body">
                Join the ultimate professional network built for modern music creators.
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3 font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-silver font-body">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_name"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  required
                  className="w-full h-14 bg-onyx border border-white/10 rounded-xl px-4 text-white placeholder:text-silver/30 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all font-body text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-silver font-body">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full h-14 bg-onyx border border-white/10 rounded-xl px-4 text-white placeholder:text-silver/30 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all font-body text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-silver font-body">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="w-full h-14 bg-onyx border border-white/10 rounded-xl px-4 text-white placeholder:text-silver/30 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all font-body text-base"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 pb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-silver font-body">
                  Primary Designation
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((r) => (
                    <button 
                      key={r} 
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, role: r }))}
                      className={cn(
                        "h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all font-body",
                        form.role === r
                          ? "border-neon-violet bg-neon-violet/10 text-white shadow-[0_0_15px_rgba(138,43,226,0.15)]"
                          : "bg-carbon border-white/5 text-silver hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-14 text-base font-bold shadow-glow flex justify-between items-center px-6">
                  {loading ? "Authenticating..." : "Establish Connection"}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-silver mt-8 font-body">
              Already connected?{" "}
              <Link href="/login" className="text-neon-violet hover:text-electric-blue transition-colors font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Left graphic column ── */}
      <div className="hidden lg:flex w-1/2 bg-onyx border-r border-white/5 relative overflow-hidden items-center justify-center p-12">
        {/* Background gradient meshes */}
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-electric-blue/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-neon-violet/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="relative w-64 h-64 mx-auto mb-12">
               {/* Abstract decorative elements */}
               <div className="absolute inset-0 rounded-full glass-obsidian border border-white/10 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                 <div className="w-[120%] h-8 bg-gradient-to-r from-neon-violet to-electric-blue opacity-50 blur-xl rotate-45" />
                 <div className="absolute w-2/3 h-2/3 border-2 border-white/10 rounded-full" />
                 <div className="absolute w-1/3 h-1/3 border border-white/20 rounded-full bg-white/5" />
               </div>
               <div className="absolute -right-4 -top-4 w-20 h-20 rounded-3xl bg-gradient-to-br from-electric-blue/20 to-transparent border border-electric-blue/30 backdrop-blur-xl rotate-[12deg] shadow-[0_20px_40px_rgba(0,255,255,0.15)] flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-electric-blue/40" />
               </div>
            </div>
            <h2 className="text-5xl font-display font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-silver">
              Connect. Create.<br/>Collaborate.
            </h2>
            <p className="text-silver font-body text-lg text-balance opacity-80 leading-relaxed max-w-sm mx-auto">
              Join thousands of artists and producers finding their next big hit on MUSYNC.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
