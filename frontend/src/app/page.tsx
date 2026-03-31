"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { Music2, ArrowRight, Users, FolderOpen, MessageSquare, Zap, Globe, Shield } from "lucide-react";
import Button from "@/components/ui/Button";

const FEATURES = [
  { icon: Users,         title: "Professional Network",   desc: "Connect with producers, vocalists, beatmakers, and songwriters who match your creative vision." },
  { icon: FolderOpen,    title: "Showcase Projects",      desc: "Present your work professionally. Share beats, songs, albums, and collabs with the right people." },
  { icon: MessageSquare, title: "Direct Collaboration",   desc: "Message connected artists directly. No noise, no algorithms — just meaningful creative conversations." },
  { icon: Zap,           title: "Discover Talent",        desc: "Filter by genre, role, and location. Find exactly the collaborator your next project needs." },
  { icon: Globe,         title: "Global Reach",           desc: "Your next collaborator could be anywhere. MUSYNC connects creators across the world." },
  { icon: Shield,        title: "Professional First",     desc: "No likes, no followers, no viral content. Just serious creators doing serious work." },
];

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Music2 size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">MUSYNC</span>
          </div>
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
            <Zap size={12} />
            Professional networking for music creators
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Where music creators
            <br />
            <span className="text-primary">connect and collaborate</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            MUSYNC is the professional network built exclusively for musicians, producers, and beatmakers.
            Find collaborators, showcase your work, and build your creative career.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {loggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Start for free <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Built for serious creators</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature is designed around professional music collaboration — nothing more, nothing less.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to find your collaborators?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of music creators already building their professional network on MUSYNC.
          </p>
          {!loggedIn && (
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Create your profile <ArrowRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Music2 size={12} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">MUSYNC</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MUSYNC. Built for music creators.</p>
        </div>
      </footer>
    </div>
  );
}
