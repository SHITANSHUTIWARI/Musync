"use client";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArtistCard } from "@/design-system/components/ArtistCard";
import { Button } from "@/design-system/components/Button";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Search, MapPin, UserPlus, Check, Clock, X, Compass, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats"];
const ROLES  = ["artist", "producer", "listener", "rapper", "musician", "engineer"];

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
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-headline font-black mb-2 flex items-center gap-3">
              <Compass size={32} className="text-primary" /> Global Discovery
            </h1>
            <p className="text-secondary-foreground font-body">
              {loading ? "Scanning frequencies..." : `Found ${total} verified creator${total !== 1 ? "s" : ""} in the network`}
            </p>
          </div>
        </div>

        {/* Unified Search & Control Deck */}
        <div className="bg-surface-low border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* subtle glow overlay inside */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-6">
            
            {/* Search Input Box */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); trigger(e.target.value); }}
                placeholder="Search by artist name, alias, bio..."
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface border border-white/10 text-foreground placeholder:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body text-lg shadow-inner"
              />
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center gap-4">
               
              <div className="flex items-center gap-2 bg-surface p-2 rounded-2xl border border-white/10">
                <SlidersHorizontal size={14} className="text-secondary-foreground ml-2" />
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value); trigger(q, genre, e.target.value, location); }}
                  className="bg-transparent pl-2 pr-6 py-2 text-sm text-foreground font-bold outline-none cursor-pointer placeholder:text-secondary-foreground"
                >
                  <option value="" className="bg-surface-low">All Roles</option>
                  {ROLES.map((r) => <option key={r} value={r} className="bg-surface-low">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <MapPin size={14} className="text-secondary-foreground ml-2" />
                <input
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); trigger(q, genre, role, e.target.value); }}
                  placeholder="Location..."
                  className="bg-transparent w-32 px-2 py-2 text-sm font-bold placeholder:text-secondary-foreground focus:outline-none placeholder:font-normal"
                />
              </div>

            </div>
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
             <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-secondary-foreground tracking-widest mr-2">Top Genres</span>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { const v = genre === g ? "" : g; setGenre(v); trigger(q, v, role, location); }}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                      genre === g
                        ? "bg-primary text-primary-foreground border-primary shadow-glow-sm"
                        : "border-white/10 text-secondary-foreground hover:border-primary/50 hover:text-foreground bg-surface-high"
                    )}
                  >
                    {g}
                  </button>
                ))}
             </div>
             
             <AnimatePresence>
                {hasFilters && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-destructive border border-destructive/20 hover:bg-destructive/10">
                      <X size={14} /> Clear Scan
                    </Button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                 <div key={i} className="animate-pulse bg-surface-low h-[320px] rounded-2xl border border-white/5" />
              ))}
           </div>
        ) : artists.length === 0 ? (
           <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-surface-low/30 backdrop-blur-sm">
             <Compass size={48} className="mx-auto mb-6 text-white/10" />
             <h2 className="text-xl font-headline font-bold text-foreground mb-2">No creators detected</h2>
             <p className="text-secondary-foreground font-body max-w-sm mx-auto">Try widening the search parameters or recalibrating the location frequencies.</p>
           </div>
        ) : (
           <motion.div
             key={`${q}-${genre}-${role}-${location}-${page}`}
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
           >
             {artists.map((a) => (
                <ArtistCardWrapper key={a._id} artist={a} />
             ))}
           </motion.div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16 pb-8">
            <Button
              variant="outline"
              size="lg"
              disabled={page <= 1}
              onClick={() => fetchArtists({ q, genre, role, location }, page - 1)}
              className="gap-2"
            >
              &larr; Prev
            </Button>
            <span className="text-sm font-bold text-secondary-foreground bg-surface px-6 py-3 rounded-xl border border-white/5">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="lg"
              disabled={page >= totalPages}
              onClick={() => fetchArtists({ q, genre, role, location }, page + 1)}
              className="gap-2"
            >
              Next &rarr;
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Wrapper to handle individual connect states natively using our Reusable Component
function ArtistCardWrapper({ artist }: { artist: any }) {
  const [status, setStatus]   = useState<null | "pending" | "connected">(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (status || loading) return;
    setLoading(true);
    try {
      await API.post("/connections/request", { recipient: artist.userId });
      setStatus("pending");
      toast.success("Connection request sent to " + artist.displayName);
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || "";
      if (msg.includes("already")) setStatus("connected");
      else toast.error(msg || "Could not intercept frequency");
    } finally {
      setLoading(false);
    }
  };

  const actionNode = (
    <Button
      fullWidth
      variant={status === "connected" ? "outline" : status === "pending" ? "secondary" : "default"}
      className={cn(
        "h-10 transition-all shadow-none",
        status === "connected" && "border-green-500/50 text-green-500 hover:text-green-500 hover:bg-transparent cursor-default",
        status === "pending" && "border-white/10 text-muted-foreground cursor-default"
      )}
      onClick={connect}
      disabled={!!status || loading}
    >
      {status === "connected" ? <><Check size={14} className="mr-2" /> Connected</>
       : status === "pending"  ? <><Clock size={14} className="mr-2" /> Pending</>
       : loading              ? <span className="animate-pulse">Transmitting...</span>
       :                        <><UserPlus size={14} className="mr-2" /> Connect</>}
    </Button>
  );

  return (
    <motion.div variants={item} className="h-full">
      <ArtistCard 
        name={artist.displayName || "?"} 
        role={artist.role || "Creator"}
        imageUrl={artist.avatar || "https://placehold.co/150x150/131313/5d5fef?text=" + (artist.displayName?.charAt(0) || "?")}
        location={artist.location}
        tags={artist.genres}
        endorsements={artist.endorsementsCount || 0}
        action={actionNode}
        className="h-full border-t-[3px] border-t-transparent hover:border-t-primary"
      />
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="flex justify-center mt-20"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"/></div></DashboardLayout>}>
      <DiscoverContent />
    </Suspense>
  );
}
