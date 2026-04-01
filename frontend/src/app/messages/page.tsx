"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";
import Avatar from "@/components/ui/Avatar";
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
  CheckCheck, Clock, File, Image as ImageIcon, X,
  ChevronRight, MoreHorizontal, Mic, Hash,
} from "lucide-react";

// ─── Compact Sidebar ────────────────────────────────────────────────────────
const NAV = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Workbench" },
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
        "h-screen fixed left-0 top-0 z-40 flex flex-col py-6 px-3 border-r border-border/40 bg-surface transition-all duration-300 overflow-hidden",
        hovered ? "w-52" : "w-[60px]"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-1.5 mb-8 shrink-0">
        <div className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
          <Music2 size={16} className="text-white" />
        </div>
        <span className={cn(
          "font-extrabold text-sm tracking-tight whitespace-nowrap transition-all duration-200 signature-gradient-text",
          hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
        )}>
          MUSYNC
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-3.5 px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
              )}>
                {active && (
                  <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />
                )}
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} className={cn("shrink-0", active ? "text-primary" : "")} />
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

      {/* Bottom */}
      <div className="flex flex-col gap-1 mt-auto">
        <Link href="/settings">
          <div className="flex items-center gap-3.5 px-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-surface-low hover:text-foreground transition-all duration-200 cursor-pointer">
            <Settings size={18} strokeWidth={1.8} className="shrink-0" />
            <span className={cn("whitespace-nowrap transition-all duration-200", hovered ? "opacity-100" : "opacity-0 w-0")}>
              Settings
            </span>
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-3.5 px-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full">
          <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
          <span className={cn("whitespace-nowrap transition-all duration-200", hovered ? "opacity-100" : "opacity-0 w-0")}>
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

// ─── Waveform visual ────────────────────────────────────────────────────────
const WAVE = [20, 40, 70, 50, 85, 60, 90, 45, 75, 30, 60, 40, 80, 25, 55, 95, 35, 65, 45, 85, 20, 40, 70, 50, 85, 60, 90, 45, 75, 30];

function WaveformBar({ height, active }: { height: number; active: boolean }) {
  return (
    <div
      className={cn("w-[2px] rounded-sm transition-colors shrink-0", active ? "bg-primary" : "bg-border")}
      style={{ height: `${height}%` }}
    />
  );
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-center gap-2 ml-10"
    >
      <div className="flex gap-1 bg-surface-low border border-border/60 rounded-2xl rounded-bl-sm px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground font-medium">{name} is typing…</span>
    </motion.div>
  );
}

// ─── Main content ────────────────────────────────────────────────────────────
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
  const [tab, setTab]                     = useState<"all" | "unread">("all");

  const socketRef   = useRef<Socket | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout>();
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  // Socket init
  useEffect(() => {
    const token = getToken();
    const url   = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    socketRef.current = io(url, { auth: { token } });
    socketRef.current.on("message:receive", (msg: any) => {
      if (msg.sender?._id === active?.userId || msg.sender === active?.userId) {
        setMessages((p) => [...p, msg]);
      }
    });
    socketRef.current.on("typing",      ({ userId }: any) => { if (userId === active?.userId) setTyping(true);  });
    socketRef.current.on("stop_typing", ({ userId }: any) => { if (userId === active?.userId) setTyping(false); });
    return () => { socketRef.current?.disconnect(); };
  }, [active?.userId]);

  // Load conversations
  useEffect(() => {
    API.get("/connections").then(({ data }) => {
      const convs = (data.connections || []).map((c: any) => ({
        userId: c.user._id,
        name:   c.user.displayName || c.user.username,
        avatar: c.user.avatar || null,
        role:   c.user.role,
      }));
      setConversations(convs);
      const targetId = searchParams.get("user");
      if (targetId) {
        const found = convs.find((c: any) => c.userId === targetId);
        if (found) setActive(found);
      }
    }).catch(() => {});
  }, [searchParams]);

  // Load messages
  useEffect(() => {
    if (!active) return;
    API.get(`/chat/${active.userId}`)
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => {});
  }, [active?.userId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || !active) return;
    setSending(true);
    try {
      const { data } = await API.post("/chat/send", { receiver: active.userId, content: text.trim() });
      setMessages((p) => [...p, data.data]);
      setText("");
      inputRef.current?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socketRef.current?.emit("typing", { to: active?.userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socketRef.current?.emit("stop_typing", { to: active?.userId }),
      1500
    );
  };

  const currentUserId     = user?._id || user?.id;
  const filteredConvs     = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Compact Sidebar */}
      <CompactSidebar />

      {/* Main – offset by compact sidebar width */}
      <main className="flex flex-1 ml-[60px] h-full overflow-hidden">

        {/* ── Conversations Panel ────────────────────────────── */}
        <section className="w-72 shrink-0 h-full bg-surface border-r border-border/50 flex flex-col">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-border/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Messages</h2>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-low text-muted-foreground hover:text-foreground transition-colors">
                <Plus size={15} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find people or files…"
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-low border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="flex p-0.5 bg-surface-low rounded-lg border border-border/40">
              {(["all", "unread"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all",
                    tab === t
                      ? "bg-surface text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "all" ? "All Chats" : "Unread"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-low border border-border flex items-center justify-center">
                  <MessageSquare size={20} className="text-muted-foreground opacity-50" />
                </div>
                <p className="text-sm font-semibold">No conversations yet</p>
                <p className="text-xs text-muted-foreground">Connect with artists to start messaging.</p>
              </div>
            ) : (
              filteredConvs.map((c) => {
                const isActive = active?.userId === c.userId;
                return (
                  <button
                    key={c.userId}
                    onClick={() => setActive(c)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 relative border-l-2",
                      isActive
                        ? "bg-surface-low border-primary"
                        : "border-transparent hover:bg-surface-low/50 hover:border-border"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={c.name} src={c.avatar} size="md" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className={cn("text-sm font-semibold truncate", isActive ? "text-foreground" : "text-foreground/90")}>
                          {c.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium ml-2 shrink-0">Now</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate capitalize">{c.role || "Artist"}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ── Chat Window ────────────────────────────────────── */}
        <section className="flex-1 h-full flex flex-col overflow-hidden bg-background relative">
          {!active ? (
            // Empty state
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-24 h-24 rounded-3xl signature-gradient flex items-center justify-center shadow-glow opacity-90">
                  <MessageSquare size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Collaboration Workcenter</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a collaborator to open your workspace, share files, and make music together in real time.
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="px-3 py-1.5 rounded-full border border-border/60 bg-surface">📁 File sharing</span>
                  <span className="px-3 py-1.5 rounded-full border border-border/60 bg-surface">⚡ Real-time sync</span>
                  <span className="px-3 py-1.5 rounded-full border border-border/60 bg-surface">🎵 Audio preview</span>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <header className="h-[60px] px-6 flex items-center justify-between border-b border-border/50 bg-surface/60 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={active.name} src={active.avatar} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-surface" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight leading-none">{active.name}</h3>
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mt-0.5">{active.role || "Artist"}</p>
                  </div>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary/80 uppercase tracking-widest font-semibold">
                    Live Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low text-muted-foreground hover:text-foreground transition-colors">
                    <Search size={15} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low text-muted-foreground hover:text-foreground transition-colors">
                    <Phone size={15} />
                  </button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
                    <Video size={13} />
                    Join Studio
                  </button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-container)/0.04),transparent_70%)]">
                {/* Date divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-surface-low border border-border flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} className="text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Start the collaboration</p>
                    <p className="text-xs text-muted-foreground">Send a message or drop a file to begin working with {active.name}.</p>
                  </div>
                )}

                {messages.map((msg, i) => {
                  const mine = (msg.sender?._id || msg.sender) === currentUserId;
                  const showAvatar = !mine && (i === 0 || (messages[i - 1]?.sender?._id || messages[i - 1]?.sender) !== (msg.sender?._id || msg.sender));

                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn("flex gap-3 max-w-3xl", mine ? "ml-auto flex-row-reverse" : "")}
                    >
                      {/* Avatar for incoming */}
                      {!mine && (
                        <div className="w-8 shrink-0 mt-0.5">
                          {showAvatar && <Avatar name={active.name} src={active.avatar} size="sm" />}
                        </div>
                      )}

                      <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
                        {showAvatar && !mine && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="text-xs font-bold">{active.name}</span>
                            <span className="text-[10px] text-muted-foreground">{formatTime(msg.createdAt)}</span>
                          </div>
                        )}
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                          mine
                            ? "signature-gradient text-primary-foreground rounded-tr-sm"
                            : "bg-surface-low border border-border/50 text-foreground rounded-tl-sm"
                        )}>
                          {msg.content}
                        </div>
                        {mine && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                              {formatTime(msg.createdAt)}
                            </span>
                            <CheckCheck size={12} className="text-primary" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                <AnimatePresence>
                  {typing && <TypingIndicator name={active.name} />}
                </AnimatePresence>

                <div ref={bottomRef} className="h-1" />
              </div>

              {/* Input Bar */}
              <footer className="px-6 py-4 bg-surface/70 backdrop-blur-xl border-t border-border/50 shrink-0">
                <form onSubmit={handleSend}>
                  <div className="flex items-center gap-2 bg-surface-low border border-border/60 rounded-2xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                    <button
                      type="button"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <Paperclip size={16} />
                    </button>
                    <textarea
                      ref={inputRef}
                      value={text}
                      onChange={(e) => { setText(e.target.value); handleTyping(); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder={`Message ${active.name}…`}
                      rows={1}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground/60 resize-none py-1.5 min-h-[32px] max-h-32 leading-relaxed"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Smile size={16} />
                      </button>
                      <button
                        type="submit"
                        disabled={!text.trim() || sending}
                        className="w-9 h-9 rounded-xl signature-gradient text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
                      >
                        <Send size={15} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </footer>
            </>
          )}
        </section>

        {/* ── Workspace Sidebar ──────────────────────────────── */}
        {active && (
          <aside className="w-72 shrink-0 h-full bg-surface border-l border-border/50 flex flex-col overflow-y-auto">
            <div className="p-5 flex flex-col gap-8">

              {/* Workspace Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Workspace Files</h4>
                  <span className="text-[10px] text-primary font-bold">12 Total</span>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Audio file with waveform */}
                  <div className="p-3 bg-surface-low border border-border/50 rounded-xl hover:border-primary/30 cursor-pointer transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Mic size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold truncate">Neon_Drift_V3_Final.mp3</p>
                        <p className="text-[9px] text-muted-foreground">14.2 MB · Stereo 48kHz</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-0.5 h-10 px-1">
                      {WAVE.map((h, i) => (
                        <WaveformBar key={i} height={h} active={i >= 3 && i <= 8} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-surface-low border border-border/50 rounded-xl hover:border-primary/30 cursor-pointer transition-all group">
                    <div className="w-9 h-9 bg-surface-high border border-border rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      <File size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate">Lyrics_Draft_v2.pdf</p>
                      <p className="text-[9px] text-muted-foreground">Added 2h ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-surface-low border border-border/50 rounded-xl hover:border-primary/30 cursor-pointer transition-all group">
                    <div className="w-9 h-9 bg-surface-high border border-border rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                      <ImageIcon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate">CoverArt_Sketch.png</p>
                      <p className="text-[9px] text-muted-foreground">Added Yesterday</p>
                    </div>
                  </div>

                  <button className="w-full py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-dashed border-border/60 rounded-xl hover:border-primary/30 transition-all">
                    View All Assets
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/40" />

              {/* Action Items */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">Action Items</h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Finalize vocal EQ on bridge",    done: false },
                    { label: "Sync stems to master project",   done: true  },
                    { label: "Prepare distribution metadata",  done: false },
                  ].map(({ label, done }) => (
                    <label key={label} className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={done}
                        className="mt-0.5 w-3.5 h-3.5 rounded border-border bg-transparent accent-primary focus:ring-primary/40 shrink-0"
                      />
                      <span className={cn(
                        "text-[12px] transition-colors group-hover:text-foreground",
                        done ? "line-through text-muted-foreground/50" : "text-muted-foreground"
                      )}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/40" />

              {/* Upcoming */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">Upcoming</h4>
                <div className="flex flex-col gap-4">
                  <div className="pl-3 border-l-2 border-primary/60">
                    <p className="text-[11px] font-bold">Vocal Session @ Studio A</p>
                    <p className="text-[10px] text-muted-foreground">Tomorrow, 10:00 AM</p>
                  </div>
                  <div className="pl-3 border-l-2 border-border/40">
                    <p className="text-[11px] font-medium text-muted-foreground">Final Master Review</p>
                    <p className="text-[10px] text-muted-foreground/60">Fri, Aug 26, 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/40" />

              {/* Real-time Sync Status */}
              <div className="bg-surface-low border border-border/50 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0" />
                  <h5 className="text-[11px] font-bold text-foreground uppercase tracking-tighter">Real-time Sync Active</h5>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your session is linked with {active.name}. Messages and files sync instantly.
                </p>
              </div>

            </div>
          </aside>
        )}
      </main>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-background">
          <div className="w-[60px] h-full bg-surface border-r border-border/40 shrink-0" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
