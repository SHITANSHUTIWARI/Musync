"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Send, MessageSquare } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
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
        userId: c.user._id, name: c.user.displayName || c.user.username, avatar: c.user.avatar || null,
      }));
      setConversations(convs);
      const targetId = searchParams.get("user");
      if (targetId) { const found = convs.find((c: any) => c.userId === targetId); if (found) setActive(found); }
    }).catch(() => {});
  }, []);

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

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] -m-6 overflow-hidden rounded-2xl border border-border bg-card">
        {/* Conversation list */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
                Connect with artists to start messaging.
              </div>
            ) : conversations.map((c) => (
              <button key={c.userId} onClick={() => setActive(c)}
                className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-border/50",
                  active?.userId === c.userId ? "bg-primary/5" : "hover:bg-accent")}>
                <Avatar name={c.name} src={c.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Click to chat</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <MessageSquare size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-semibold mb-1">Select a conversation</p>
              <p className="text-sm text-muted-foreground">Choose from your connections to start chatting.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center gap-3 px-5 shrink-0">
              <Avatar name={active.name} src={active.avatar} size="sm" />
              <div>
                <p className="font-semibold text-sm">{active.name}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Say hello! 👋</p>
              )}
              {messages.map((msg, i) => {
                const mine = (msg.sender?._id || msg.sender) === currentUserId;
                return (
                  <div key={msg._id || i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[65%] px-4 py-2.5 rounded-2xl text-sm",
                      mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm")}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={cn("text-[10px] mt-1", mine ? "text-primary-foreground/60 text-right" : "text-muted-foreground")}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-3 shrink-0">
              <input value={text} onChange={(e) => { setText(e.target.value); handleTyping(); }}
                placeholder={`Message ${active.name}...`} autoComplete="off"
                className="flex-1 h-10 px-4 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="submit" disabled={!text.trim() || sending}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
