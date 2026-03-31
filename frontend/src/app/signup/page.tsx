"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Music2 } from "lucide-react";
import { motion } from "framer-motion";

const ROLES = ["artist", "producer", "listener"];

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
    <div className="min-h-screen bg-background flex flex-row-reverse">
      {/* ── Right form column ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-[380px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-10 h-10 rounded-xl signature-gradient flex items-center justify-center shadow-glow-sm">
                <Music2 size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">MUSYNC</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join the ultimate professional network built for modern music creators.
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Username" placeholder="your_name" value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
              
              <Input label="Email address" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              
              <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />

              <div className="flex flex-col gap-2 pt-1 pb-1">
                <label className="text-sm font-bold capitalize tracking-tight">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button key={r} type="button"
                      onClick={() => setForm((p) => ({ ...p, role: r }))}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all capitalize shadow-sm ${
                        form.role === r
                          ? "bg-primary/10 border-primary/40 text-primary ring-1 ring-primary/20"
                          : "bg-surface border-border text-muted-foreground hover:border-primary/30 hover:bg-surface-high"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" loading={loading} className="w-full h-12 text-base">
                  Sign Up
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-container transition-colors font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Left graphic column ── */}
      <div className="hidden lg:flex w-1/2 bg-surface border-r border-border relative overflow-hidden items-center justify-center p-12">
        {/* Background gradient meshes */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[hsl(var(--primary-container)/0.2)] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />

        <div className="relative z-10 max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="flex justify-center gap-4 mb-10 opacity-60">
               {/* Abstract decorative elements */}
               <div className="w-16 h-16 rounded-3xl bg-surface-high border border-border/50 rotate-[-12deg] shadow-xl"></div>
               <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rotate-[12deg] -translate-y-4 shadow-xl shadow-primary/5"></div>
               <div className="w-16 h-16 rounded-full bg-surface-high border border-border/50 translate-y-6 shadow-xl"></div>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-glow">
              Connect. Create. 
              <br/> Collaborate.
            </h2>
            <p className="text-muted-foreground font-medium text-lg text-balance opacity-80">
              Join thousands of artists and producers finding their next big hit on MUSYNC.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
