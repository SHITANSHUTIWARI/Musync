"use client";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Search, MapPin, UserPlus, Check, Clock, X, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats"];
const ROLES  = ["artist", "producer"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 26 } } };

function DiscoverContent() {
  const searchParams = useSearchParams();
  const [artists, setArtists]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [q, setQ]                   = useState(searchParams.get("q") || "");
  const [genre, setGenre]           = useState("");
  const [role, setRole]             = useState("");
  const [location, setLocation]     = useState("");
  const debounce = useRef<NodeJS.Timeout>();

  const fetchArtists = useCallback(async (params: Record<string, string>, p = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ ...params, page: String(p), limit: "12" });
      Object.keys(params).forEach((k) => !params[k] && qs.delete(k));
      const { data } = await API.get(`/discover/artists?${qs}`);
      setArtists(data.results || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.totalResults || 0);
      setPage(p);
    } catch {
      toast.error("Failed to load artists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArtists({ q, genre, role, location }); }, []);

  const trigger = (newQ = q, newGenre = genre, newRole = role, newLoc = location) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(
      () => fetchArtists({ q: newQ, genre: newGenre, role: newRole, location: newLoc }),
      350
    );
  };

  const hasFilters = q || genre || role || location;

  const clearAll = () => {
    setQ(""); setGenre(""); setRole(""); setLocation("");
    fetchArtists({});
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl signature-gradient flex items-center justify-center shadow-glow-sm">
              <Compass size={16} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-12">
            {loading ? "Searching…" : `${total} creator${total !== 1 ? "s" : ""} in the network`}
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-surface-low border border-border rounded-2xl p-4 mb-6 space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); trigger(e.target.value); }}
              placeholder="Search artists by name, bio, genre..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Genre chips */}
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => { const v = genre === g ? "" : g; setGenre(v); trigger(q, v, role, location); }}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  genre === g
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-surface"
                )}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            {/* Role select */}
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); trigger(q, genre, e.target.value, location); }}
              className="h-9 px-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 capitalize cursor-pointer"
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            {/* Location */}
            <input
              value={location}
              onChange={(e) => { setLocation(e.target.value); trigger(q, genre, role, e.target.value); }}
              placeholder="Filter by location..."
              className="h-9 px-3 rounded-xl bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all w-48"
            />
            {/* Clear */}
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-muted-foreground border border-border hover:border-destructive/50 hover:text-destructive transition-all bg-surface"
                >
                  <X size={12} /> Clear filters
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : artists.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-16 text-center">
              <Compass size={36} className="text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="font-bold text-lg mb-1">No creators found</p>
              <p className="text-sm text-muted-foreground">Try broadening your search or clearing filters.</p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={`${q}-${genre}-${role}-${location}-${page}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {artists.map((a) => <ArtistCard key={a._id} artist={a} />)}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => fetchArtists({ q, genre, role, location }, page - 1)}
              className="h-9 px-5 rounded-xl text-sm border border-border text-muted-foreground hover:bg-surface-high hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              ← Prev
            </button>
            <span className="text-sm text-muted-foreground font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchArtists({ q, genre, role, location }, page + 1)}
              className="h-9 px-5 rounded-xl text-sm border border-border text-muted-foreground hover:bg-surface-high hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function ArtistCard({ artist }: { artist: any }) {
  const [status, setStatus]   = useState<null | "pending" | "connected">(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (status || loading) return;
    setLoading(true);
    try {
      await API.post("/connections/request", { recipient: artist.userId });
      setStatus("pending");
      toast.success("Connection request sent!");
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || "";
      if (msg.includes("already")) setStatus("connected");
      else toast.error(msg || "Could not send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden card-hover flex flex-col p-0 h-full">
        {/* Color band */}
        <div className="h-16 bg-gradient-to-br from-primary/25 via-primary/10 to-[hsl(var(--primary-container)/0.15)] relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_140%,hsl(var(--primary)/0.4),transparent_60%)]" />
        </div>

        <div className="px-4 pb-4 -mt-8 flex flex-col items-center text-center flex-1">
          <Avatar name={artist.displayName || "?"} src={artist.avatar} size="md" className="ring-2 ring-surface-low mb-2 shadow-md" />
          <p className="font-bold text-sm leading-tight">{artist.displayName}</p>
          <p className="text-xs text-primary capitalize mt-0.5 font-semibold">{artist.role}</p>
          {artist.location && (
            <p className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-1">
              <MapPin size={9} /> {artist.location}
            </p>
          )}
          {artist.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {artist.genres.slice(0, 2).map((g: string) => (
                <Badge key={g} variant="secondary" className="text-[9px]">{g}</Badge>
              ))}
            </div>
          )}

          <button
            onClick={connect}
            disabled={!!status || loading}
            className={cn(
              "mt-3 w-full h-8 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
              status === "connected"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                : status === "pending"
                  ? "bg-surface-high text-muted-foreground border border-border cursor-default"
                  : loading
                    ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20"
            )}
          >
            {status === "connected" ? <><Check size={12} /> Connected</>
             : status === "pending"  ? <><Clock size={12} /> Pending</>
             : loading              ? <span className="animate-pulse">Sending…</span>
             :                        <><UserPlus size={12} /> Connect</>}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="grid grid-cols-4 gap-5">{[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}</div></DashboardLayout>}>
      <DiscoverContent />
    </Suspense>
  );
}
