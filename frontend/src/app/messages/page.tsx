"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/design-system/components/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, FolderOpen, Compass,
  Users, MessageSquare, Settings, LogOut, Music2,
  Search, Send, Plus, Paperclip, Smile, Phone, Video,
  CheckCheck, Clock, File, Mic, Disc3
} from "lucide-react";

const NAV = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Workspace" },
  { href: "/messages",    icon: MessageSquare,   label: "Messages"  },
  { href: "/projects",    icon: FolderOpen,      label: "Assets"    },
  { href: "/discover",    icon: Compass,         label: "Discover"  },
  { href: "/connections", icon: Users,           label: "Network"   },
];

function CompactSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col py-6 px-3 border-r border-white/5 bg-carbon transition-all duration-300 overflow-hidden font-body shadow-[0_0_40px_rgba(0,0,0,0.5)]",
        hovered ? "w-52" : "w-[68px]"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href="/dashboard" className="flex items-center gap-3 px-1.5 mb-8 shrink-0">
        <div className="w-10 h-10 rounded-xl aurora-bg flex items-center justify-center shrink-0 shadow-glow-sm">
          <Music2 size={18} className="text-white" />
        </div>
        <span className={cn(
          "font-display font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-200 text-white",
          hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0"
        )}>
          MUSYNC
        </span>
      </Link>

      <nav className="flex flex-col gap-2 flex-1 mt-4">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer relative group",
                active
                  ? "bg-white/5 text-white border-white/10 shadow-sm"
                  : "text-silver hover:bg-white/5 hover:text-white border-transparent"
              )}>
                {active && <div className="absolute left-0 w-1 h-6 aurora-bg rounded-r-full shadow-glow-sm" />}
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className="shrink-0 group-hover:scale-110 transition-transform" />
                <span className={cn(
                  "whitespace-nowrap transition-all duration-200",
                  hovered ? "opacity-100" : "opacity-0 w-0"
                )}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 mt-auto">
        <Link href="/settings">
          <div className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold text-silver hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer group">
            <Settings size={18} strokeWidth={2} className="shrink-0 group-hover:rotate-90 transition-transform" />
            <span className={cn("whitespace-nowrap transition-all duration-200", hovered ? "opacity-100" : "opacity-0 w-0")}>
              Settings
            </span>
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold text-silver hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full text-left focus:outline-none">
          <LogOut size={18} strokeWidth={2} className="shrink-0" />
          <span className={cn("whitespace-nowrap transition-all duration-200", hovered ? "opacity-100" : "opacity-0 w-0")}>
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

const WAVE = [20, 40, 70, 50, 85, 60, 90, 45, 75, 30, 60, 40, 80, 25, 55, 95, 35, 65, 45, 85, 20, 40, 70, 50, 85, 60, 90, 45, 75, 30];

function WaveformBar({ height, active }: { height: number; active: boolean }) {
  return (
    <div
      className={cn("w-[2px] rounded-full transition-colors shrink-0", active ? "aurora-bg" : "bg-white/20")}
      style={{ height: `${height}%` }}
    />
  );
}

function TypingIndicator({ name }: { name: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex items-center gap-3 ml-12">
      <div className="flex gap-1 bg-onyx border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 bg-silver/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-xs text-silver font-bold font-body">{name} is transmitting...</span>
    </motion.div>
  );
}

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive]               = useState<any>(null);
  const [messages, setMessages]           = useState<any[]>([]);
  const [text, setText]                   = useState("");
  const [sending, setSending]             = useState(false);
  const [typing, setTyping]               = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");

  const socketRef   = useRef<Socket | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout>();
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const token = getToken();
    const url   = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) return; // Wait for URL or handle failure
    socketRef.current = io(url, { auth: { token } });
    socketRef.current.on("message:receive", (msg: any) => {
      if (msg.sender?._id === active?.userId || msg.sender === active?.userId) setMessages((p) => [...p, msg]);
    });
    socketRef.current.on("typing",      ({ userId }: any) => { if (userId === active?.userId) setTyping(true);  });
    socketRef.current.on("stop_typing", ({ userId }: any) => { if (userId === active?.userId) setTyping(false); });
    return () => { socketRef.current?.disconnect(); };
  }, [active?.userId]);

  useEffect(() => {
    API.get("/api/connections").then(({ data }) => {
      const convs = (data.connections || []).map((c: any) => ({
        userId: c.user._id, name: c.user.displayName || c.user.username, avatar: c.user.avatar || null, role: c.user.role,
      }));
      setConversations(convs);
      const targetId = searchParams.get("user");
      if (targetId) {
        const found = convs.find((c: any) => c.userId === targetId);
        if (found) setActive(found);
      }
    }).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    if (!active) return;
    API.get(`/api/chat/${active.userId}`).then(({ data }) => setMessages(data.messages || [])).catch(() => {});
  }, [active?.userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || !active) return;
    setSending(true);
    try {
      const { data } = await API.post("/api/chat/send", { receiver: active.userId, content: text.trim() });
      setMessages((p) => [...p, data.data]);
      setText("");
      inputRef.current?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to transmit message");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socketRef.current?.emit("typing", { to: active?.userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socketRef.current?.emit("stop_typing", { to: active?.userId }), 1500);
  };

  const currentUserId = user?._id || user?.id;
  const filteredConvs = conversations.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-space font-body">
      <CompactSidebar />

      <main className="flex flex-1 ml-[68px] h-full overflow-hidden">
        
        {/* --- INBOX SIDEBAR --- */}
        <section className="w-80 shrink-0 h-full bg-carbon border-r border-white/5 flex flex-col relative z-10 shadow-2xl">
          <div className="px-6 pt-8 pb-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl text-white tracking-tight">Threads</h2>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white">
                <Plus size={16} />
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connections..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-onyx border border-white/10 text-sm text-white placeholder:text-silver/60 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.2)] transition-all shadow-inner font-body"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 hide-scrollbar">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-silver">
                  <MessageSquare size={24} />
                </div>
                <p className="text-sm font-bold text-silver">No channels active</p>
              </div>
            ) : (
              filteredConvs.map((c) => {
                const isActive = active?.userId === c.userId;
                return (
                  <button
                    key={c.userId}
                    onClick={() => setActive(c)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 text-left transition-all duration-300 rounded-2xl relative group border",
                      isActive
                        ? "bg-onyx text-white border-neon-violet/30 shadow-[0_0_20px_rgba(138,43,226,0.1)]"
                        : "border-transparent text-silver hover:bg-white/5 hover:border-white/5 hover:text-white"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={c.name} src={c.avatar} size="md" className={isActive ? "ring-2 ring-neon-violet ring-offset-2 ring-offset-carbon" : ""} />
                      {isActive && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald rounded-full border-2 border-carbon" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                         <span className="text-sm font-bold truncate tracking-tight">{c.name}</span>
                         <span className={cn("text-[10px] font-bold uppercase tracking-widest", isActive ? "text-neon-violet" : "text-silver/50")}>
                           LIVE
                         </span>
                      </div>
                      <p className="text-[11px] text-silver truncate uppercase tracking-widest font-body">{c.role || "Creator"}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* --- CHAT CANVAS --- */}
        <section className="flex-1 h-full flex flex-col overflow-hidden bg-space relative z-0">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-center p-10 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.05),transparent_60%)]">
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center max-w-sm">
                <div className="w-24 h-24 rounded-3xl aurora-bg flex items-center justify-center shadow-glow mb-8 relative">
                   <Compass size={36} className="text-white relative z-10" />
                   <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 text-white">No Channel Selected</h3>
                <p className="text-sm font-body text-silver leading-relaxed mb-8">
                  Select a collaborator from the thread list to open a secure direct channel. Voice, video, and stems syncing supported.
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Session Header */}
              <header className="h-24 px-8 flex items-center justify-between border-b border-white/5 glass-obsidian shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar name={active.name} src={active.avatar} size="lg" className="ring-2 ring-white/10 shadow-sm" />
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-tight leading-none mb-2 text-white">{active.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse shadow-[0_0_10px_rgba(16,214,122,0.8)]" />
                      <p className="text-[10px] font-bold text-silver uppercase tracking-widest">{active.role || "Creator"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 text-silver hover:text-white">
                    <Phone size={16} />
                  </Button>
                  <Button className="h-10 text-xs px-6 gap-2 font-bold">
                    <Video size={16} /> Initiate Session
                  </Button>
                </div>
              </header>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6 relative hide-scrollbar">
                
                {messages.length === 0 && (
                  <div className="text-center py-20">
                     <p className="text-sm text-silver/60 font-bold tracking-widest uppercase">Channel Established. History clear.</p>
                  </div>
                )}

                {messages.map((msg, i) => {
                  const mine = (msg.sender?._id || msg.sender) === currentUserId;
                  const showAvatar = !mine && (i === 0 || (messages[i - 1]?.sender?._id || messages[i - 1]?.sender) !== (msg.sender?._id || msg.sender));

                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex gap-4 max-w-2xl", mine ? "ml-auto flex-row-reverse" : "")}
                    >
                      {!mine && (
                        <div className="w-10 shrink-0 mt-auto mb-2">
                          {showAvatar && <Avatar name={active.name} src={active.avatar} size="md" className="shadow-lg border border-white/10" />}
                        </div>
                      )}

                      <div className={cn("flex flex-col gap-1.5", mine ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-5 py-3.5 text-[15px] leading-relaxed relative isolate font-body",
                          mine
                            ? "aurora-bg text-white rounded-2xl rounded-tr-sm shadow-glow-sm"
                            : "bg-onyx border border-white/5 text-white rounded-2xl rounded-tl-sm shadow-md"
                        )}>
                          {msg.content}
                        </div>
                        {mine && (
                           <div className="flex items-center gap-1.5 mt-0.5 px-1">
                             <CheckCheck size={12} className="text-neon-violet" />
                             <span className="text-[10px] text-silver uppercase font-bold tracking-wider">
                               {formatTime(msg.createdAt)}
                             </span>
                           </div>
                        )}
                        {!mine && showAvatar && (
                           <div className="flex items-center gap-1.5 mt-0.5 px-1">
                             <span className="text-[10px] text-silver uppercase font-bold tracking-wider">
                               {formatTime(msg.createdAt)}
                             </span>
                           </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                <AnimatePresence>
                  {typing && <TypingIndicator name={active.name} />}
                </AnimatePresence>
                
                <div ref={bottomRef} className="h-4" />
              </div>

              {/* Chat Input Console */}
              <footer className="px-8 flex-shrink-0 h-32 flex items-center justify-center bg-space relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <form onSubmit={handleSend} className="w-full flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-carbon border border-white/10 rounded-2xl pl-4 pr-2 py-2 focus-within:border-neon-violet/50 focus-within:ring-1 focus-within:ring-neon-violet/30 transition-all shadow-xl">
                    <button type="button" className="text-silver hover:text-white transition-colors shrink-0">
                      <Paperclip size={20} />
                    </button>
                    <textarea
                      ref={inputRef}
                      value={text}
                      onChange={(e) => { setText(e.target.value); handleTyping(); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                      }}
                      placeholder={`Transmit to ${active.name}...`}
                      rows={1}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-md placeholder:text-silver/60 text-white resize-none py-2 outline-none font-body"
                    />
                    <button type="button" className="text-silver hover:text-white transition-colors shrink-0 mr-2">
                       <Smile size={20} />
                    </button>
                    <Button type="submit" disabled={!text.trim() || sending} className="h-12 w-12 rounded-xl shrink-0 px-0 shadow-glow-sm">
                      {sending ? <Disc3 size={18} className="animate-spin-slow" /> : <Send size={18} className="translate-x-[2px]" />}
                    </Button>
                  </div>
                </form>
              </footer>
            </>
          )}
        </section>

        {/* --- WORKSPACE NODE --- */}
        {active && (
          <aside className="w-80 shrink-0 h-full bg-onyx border-l border-white/5 flex flex-col z-10 shadow-2xl overflow-hidden">
             <div className="p-8 flex flex-col h-full overflow-y-auto gap-8 hide-scrollbar">
                
                <div>
                   <h4 className="font-display font-bold text-lg mb-4 text-white">Asset Node</h4>
                   <div className="space-y-3">
                      <div className="p-4 bg-carbon rounded-2xl border border-white/5 hover:border-neon-violet/30 cursor-pointer transition-all group shadow-sm">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 aurora-bg rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform"><Mic size={18} /></div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold truncate text-white">Cyber Vox Stem</p>
                               <p className="text-[10px] text-silver mt-0.5 uppercase tracking-widest font-bold">14.2 MB</p>
                            </div>
                         </div>
                         <div className="flex items-end gap-[3px] h-8">
                            {WAVE.slice(0, 20).map((h, i) => <WaveformBar key={i} height={h} active={i >= 5 && i <= 8} />)}
                         </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-carbon rounded-2xl border border-white/5 hover:border-electric-blue/30 cursor-pointer transition-all group">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-silver group-hover:text-white">
                          <File size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">Contract_Draft.pdf</p>
                          <p className="text-[10px] text-silver uppercase mt-0.5 tracking-widest font-bold">Updated Now</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div>
                   <h4 className="font-display font-bold text-lg mb-4 text-white">Checklist</h4>
                   <div className="space-y-4">
                     {[
                       { label: "Finalize vocal EQ on bridge",    done: false },
                       { label: "Sync stems to master project",   done: true  },
                     ].map(({ label, done }) => (
                       <label key={label} className="flex items-start gap-3 cursor-pointer group">
                         <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors shrink-0",
                            done ? "bg-neon-violet border-neon-violet text-white" : "border-white/20 bg-carbon group-hover:border-neon-violet/50"
                         )}>
                            {done && <CheckCheck size={12} />}
                         </div>
                         <span className={cn("text-xs font-bold transition-colors mt-0.5 leading-tight", done ? "line-through text-silver/50" : "text-silver group-hover:text-white")}>{label}</span>
                       </label>
                     ))}
                   </div>
                </div>

             </div>
          </aside>
        )}

      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
       <div className="flex h-screen bg-space items-center justify-center">
         <div className="w-12 h-12 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
         </div>
       </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
