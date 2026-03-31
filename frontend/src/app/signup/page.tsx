"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Music2 } from "lucide-react";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Music2 size={18} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">MUSYNC</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join the professional music network</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Username" placeholder="yourname" value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button key={r} type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                    className={`py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                      form.role === r
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
