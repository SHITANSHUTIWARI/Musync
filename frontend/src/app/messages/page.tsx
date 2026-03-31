"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Send, MessageSquare, Search } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout>();

  // Init socket
  useEffect(() => {
    const token = getToken();
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    socketRef.current = io(url, { auth: { token } });
    socketRef.current.on("message:receive", (msg: any) => {
      if (msg.sender?._id === active?.userId || msg.sender === active?.userId) {
        setMessages((p) => [...p, msg]);
      }
    });
    socketRef.current.on("typing", ({ userId }: any) => { if (userId === active?.userId) setTyping(true); });
    socketRef.current.on("stop_typing", ({ userId }: any) => { if (userId === active?.userId) setTyping(false); });
    return () => { socketRef.current?.disconnect(); };
  }, [active?.userId]);

  // Load conversations from connections
  useEffect(() => {
    API.get("/connections").then(({ data }) => {
      const convs = (data.connections || []).map((c: any) => ({
        userId: c.user._id, name: c.user.displayName || c.user.username, avatar: c.user.avatar || null, role: c.user.role
      }));
      setConversations(convs);
      const targetId = searchParams.get("user");
      if (targetId) { const found = convs.find((c: any) => c.userId === targetId); if (found) setActive(found); }
    }).catch(() => {});
  }, [searchParams]);

  // Load messages when active changes
  useEffect(() => {
    if (!active) return;
    API.get(`/chat/${active.userId}`).then(({ data }) => setMessages(data.messages || [])).catch(() => {});
  }, [active?.userId]);

  // Auto scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || !active) return;
    setSending(true);
    try {
      const { data } = await API.post("/chat/send", { receiver: active.userId, content: text.trim() });
      setMessages((p) => [...p, data.data]);
      setText("");
    } catch (err: any) { toast.error(err.response?.data?.error?.message || "Failed to send"); }
    finally { setSending(false); }
  };

  const handleTyping = () => {
    socketRef.current?.emit("typing", { to: active?.userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socketRef.current?.emit("stop_typing", { to: active?.userId }), 1500);
  };

  const currentUserId = user?._id || user?.id;

  const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] -mt-2 overflow-hidden rounded-3xl border border-border bg-surface-low shadow-xl shadow-black/5">
        {/* Conversation list */}
        <div className="w-80 border-r border-border flex flex-col shrink-0 bg-surface/50 backdrop-blur-md">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-bold text-xl tracking-tight mb-4">Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground mt-10">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-foreground mb-1">No messages yet</p>
                <p className="text-xs">Connect with artists to start messaging.</p>
              </div>
            ) : filteredConversations.length === 0 ? (
                 <div className="p-6 text-center text-sm text-muted-foreground mt-10">
                    No results found.
                 </div>
            ) : filteredConversations.map((c) => (
              <button key={c.userId} onClick={() => setActive(c)}
                className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all duration-200",
                  active?.userId === c.userId ? "bg-primary/10 shadow-[inset_4px_0_0_0_hsl(var(--primary))]" : "hover:bg-surface-high")}>
                <Avatar name={c.name} src={c.avatar} size="md" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize font-medium truncate">{c.role || "Artist"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center p-8 bg-surface">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 rounded-full signature-gradient flex items-center justify-center mx-auto mb-6 shadow-glow opacity-90">
                <MessageSquare size={32} className="text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">Your Conversations</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Select a conversation from the sidebar or start a new connection to collaborate.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-surface relative">
            {/* Header */}
            <div className="h-[72px] border-b border-border/50 flex items-center gap-4 px-6 shrink-0 bg-surface/80 backdrop-blur-xl z-10 text-glow relative shadow-sm">
                <Avatar name={active.name} src={active.avatar} size="sm" className="ring-2 ring-surface-low" />
                <div>
                  <p className="font-bold text-base leading-tight">{active.name}</p>
                  <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">{active.role || "Artist"}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-container)/0.03),transparent_80%)]">
              {messages.length === 0 && (
                <div className="text-center py-20">
                     <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mx-auto mb-4 border border-border">
                        <MessageSquare size={24} className="text-muted-foreground opacity-60" />
                     </div>
                    <p className="text-sm font-semibold mb-1">Say hello to {active.name}! 👋</p>
                    <p className="text-xs text-muted-foreground">This is the start of your conversation.</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const mine = (msg.sender?._id || msg.sender) === currentUserId;
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id || i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                      mine ? "signature-gradient text-primary-foreground rounded-br-sm" : "bg-surface-high border border-border/50 rounded-bl-sm")}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={cn("text-[10px] mt-1.5 font-medium", mine ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left")}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-surface-high border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="p-5 bg-surface/80 backdrop-blur-xl border-t border-border/50 shrink-0">
                <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto items-end relative">
                  <textarea
                    value={text}
                    onChange={(e) => { setText(e.target.value); handleTyping(); }}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    placeholder={`Message ${active.name}...`}
                    className="flex-1 min-h-[44px] max-h-32 px-5 py-3 rounded-2xl bg-surface-low border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all custom-scrollbar pr-14"
                    rows={1}
                  />
                  <button type="submit" disabled={!text.trim() || sending}
                    className="absolute right-2 bottom-1.5 w-9 h-9 rounded-xl signature-gradient text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md">
                    <Send size={15} className="ml-0.5" />
                  </button>
                </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<DashboardLayout><div className="flex h-[calc(100vh-120px)] rounded-3xl border border-border bg-surface shimmer"></div></DashboardLayout>}>
            <MessagesContent />
        </Suspense>
    )
}
