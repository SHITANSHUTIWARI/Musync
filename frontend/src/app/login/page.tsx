"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Music2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-background flex">
      {/* ── Left form column ── */}
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
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log in to access your digital backstage and connect with the music network.
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
              <div className="pt-2">
                <Button type="submit" loading={loading} className="w-full h-12 text-base">
                  Sign In
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary-container transition-colors font-bold hover:underline underline-offset-4">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Right graphic column ── */}
      <div className="hidden lg:flex w-1/2 bg-surface-low border-l border-border relative overflow-hidden items-center justify-center p-12">
        {/* Background gradient meshes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[hsl(var(--primary-container)/0.2)] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />

        <div className="relative z-10 max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="grid grid-cols-2 gap-4 mb-10 opacity-60">
               {/* Abstract decorative cards */}
               <div className="h-32 rounded-3xl bg-surface-high border border-border/50 p-4 rotate-[-6deg] shadow-xl"></div>
               <div className="h-40 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-4 rotate-[4deg] translate-y-4 shadow-xl shadow-primary/5"></div>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-glow">
              Your Sound, 
              <br/> Your Network
            </h2>
            <p className="text-muted-foreground font-medium text-lg text-balance opacity-80">
              The professional collaboration platform built exclusively for modern music creators.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
