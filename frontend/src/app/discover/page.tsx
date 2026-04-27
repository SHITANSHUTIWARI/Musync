"use client";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArtistCard } from "@/design-system/components/ArtistCard";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/components/ui/Card";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Search, MapPin, UserPlus, Check, Clock, X, Compass, SlidersHorizontal, Disc3 } from "lucide-react";
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
      toast.error("Failed to load network data");
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
            <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-3">
              <Compass size={28} className="text-neon-violet" /> Global Discovery
            </h1>
            <p className="text-silver font-body">
              {loading ? "Scanning network frequencies..." : `Found ${total} verified creator${total !== 1 ? "s" : ""} in the network`}
            </p>
          </div>
        </div>

        {/* Unified Search & Control Deck */}
        <Card className="p-6 relative overflow-visible border-white/5 bg-onyx">
          <div className="absolute top-0 right-0 w-64 h-64 aurora-bg blur-[80px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-6">
            
            {/* Search Input Box */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-mist" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); trigger(e.target.value); }}
                placeholder="Search by artist name, alias, bio..."
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-carbon border border-white/10 text-white placeholder:text-silver/60 focus:outline-none focus:border-neon-violet/50 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all font-body text-base"
              />
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-carbon h-14 px-2 rounded-2xl border border-white/10">
                <SlidersHorizontal size={16} className="text-silver ml-3" />
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value); trigger(q, genre, e.target.value, location); }}
                  className="bg-transparent pl-2 pr-6 py-2 text-sm text-white font-bold outline-none cursor-pointer placeholder:text-silver/60 font-body"
                >
                  <option value="" className="bg-onyx text-white">All Roles</option>
                  {ROLES.map((r) => <option key={r} value={r} className="bg-onyx text-white">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
                
                <div className="w-px h-6 bg-white/10 mx-1" />
                
                <MapPin size={16} className="text-silver ml-3" />
                <input
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); trigger(q, genre, role, e.target.value); }}
                  placeholder="Location..."
                  className="bg-transparent w-32 px-2 py-2 text-sm font-bold text-white placeholder:text-silver/60 focus:outline-none font-body"
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
             <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-silver tracking-widest mr-2 font-body">Soundscapes</span>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { const v = genre === g ? "" : g; setGenre(v); trigger(q, v, role, location); }}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all border font-body",
                      genre === g
                        ? "aurora-bg text-white border-transparent shadow-glow-sm"
                        : "border-white/10 text-silver hover:border-white/30 hover:text-white bg-carbon"
                    )}
                  >
                    {g}
                  </button>
                ))}
             </div>
             
             <AnimatePresence>
                {hasFilters && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-silver hover:text-white border border-white/10 hover:bg-white/5 font-bold text-xs">
                      <X size={14} /> Clear Scan
                    </Button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </Card>

        {/* Results Grid */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                 <div key={i} className="animate-pulse bg-onyx h-[360px] rounded-3xl border border-white/5" />
              ))}
           </div>
        ) : artists.length === 0 ? (
           <Card className="py-24 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
             <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-silver mb-6">
                <Compass size={36} />
             </div>
             <h2 className="text-xl font-headline font-bold text-white mb-2">No creators detected</h2>
             <p className="text-silver font-body max-w-sm mx-auto text-sm">Try widening the search parameters or recalibrating the location frequencies.</p>
           </Card>
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
              disabled={page <= 1}
              onClick={() => fetchArtists({ q, genre, role, location }, page - 1)}
              className="gap-2 font-bold"
            >
              &larr; Prev
            </Button>
            <span className="text-sm font-bold text-silver bg-onyx px-6 py-2 rounded-xl border border-white/5">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => fetchArtists({ q, genre, role, location }, page + 1)}
              className="gap-2 font-bold"
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
        "h-10 transition-all font-bold text-xs",
        status === "connected" && "border-emerald/50 text-emerald hover:text-emerald hover:bg-emerald/10 cursor-default shadow-none",
        status === "pending" && "border-white/10 text-silver cursor-default shadow-none"
      )}
      onClick={connect}
      disabled={!!status || loading}
    >
      {status === "connected" ? <><Check size={14} className="mr-2" /> Connected</>
       : status === "pending"  ? <><Clock size={14} className="mr-2" /> Pending</>
       : loading              ? <><Disc3 size={14} className="mr-2 animate-spin-slow" /> Transmitting</>
       :                        <><UserPlus size={14} className="mr-2" /> Connect</>}
    </Button>
  );

  return (
    <motion.div variants={item} className="h-full">
      <ArtistCard 
        name={artist.displayName || "?"} 
        role={artist.role || "Creator"}
        imageUrl={artist.avatar}
        location={artist.location}
        tags={artist.genres}
        endorsements={artist.endorsementsCount || 0}
        action={actionNode}
        className="h-full"
      />
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex justify-center items-center mt-40">
           <div className="w-12 h-12 rounded-xl aurora-bg flex items-center justify-center shadow-glow-sm animate-pulse">
             <Disc3 size={24} className="text-white animate-spin-slow" />
           </div>
        </div>
      </DashboardLayout>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
