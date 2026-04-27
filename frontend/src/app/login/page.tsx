"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/design-system/components/Button";
import { Music2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    if (!result.success) setError(result.message || "Login failed");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex font-body">
      {/* ── Left form column ── */}
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
              <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">Welcome Back.</h1>
              <p className="text-sm text-silver leading-relaxed font-body">
                Re-enter the digital backstage and command your network.
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="w-full h-14 bg-onyx border border-white/10 rounded-xl px-4 text-white placeholder:text-silver/30 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all font-body text-base"
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-14 text-base font-bold shadow-glow flex justify-between items-center px-6">
                  {loading ? "Authenticating..." : "Establish Connection"}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-silver mt-8 font-body">
              Don&apos;t have access?{" "}
              <Link href="/signup" className="text-neon-violet hover:text-electric-blue transition-colors font-bold hover:underline underline-offset-4">
                Request entry
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Right graphic column ── */}
      <div className="hidden lg:flex w-1/2 bg-onyx border-l border-white/5 relative overflow-hidden items-center justify-center p-12">
        {/* Background gradient meshes */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-neon-violet/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="relative w-64 h-64 mx-auto mb-12">
              {/* Abstract decorative interface elements */}
              <div className="absolute inset-0 rounded-3xl glass-obsidian border border-white/10 p-6 rotate-[-4deg] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col gap-3">
                 <div className="w-1/3 h-2 bg-white/10 rounded-full" />
                 <div className="w-full h-12 bg-white/5 rounded-xl border border-white/5" />
                 <div className="w-2/3 h-12 bg-white/5 rounded-xl border border-white/5" />
                 <div className="flex gap-2 mt-auto pt-4">
                   <div className="w-8 h-8 rounded-full bg-neon-violet/20" />
                   <div className="w-8 h-8 rounded-full bg-electric-blue/20" />
                 </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-violet/20 to-transparent border border-neon-violet/30 p-6 rotate-[6deg] translate-x-4 translate-y-4 shadow-[0_20px_40px_rgba(138,43,226,0.15)] flex flex-col justify-end backdrop-blur-xl">
                 <div className="w-full h-1/2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md" />
              </div>
            </div>
            <h2 className="text-5xl font-display font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-silver">
              Command Your<br/>Frequency
            </h2>
            <p className="text-silver font-body text-lg text-balance opacity-80 leading-relaxed max-w-sm mx-auto">
              The premier collaboration protocol built exclusively for modern music creators.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
