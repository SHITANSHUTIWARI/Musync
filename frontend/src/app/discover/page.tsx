"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Search, MapPin, UserPlus, Check, Clock, X } from "lucide-react";

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Jazz", "Classical", "Rock", "Afrobeats"];
const ROLES = ["artist", "producer"];

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [genre, setGenre] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const debounce = useRef<NodeJS.Timeout>();

  const fetch = useCallback(async (params: Record<string, string>, p = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ ...params, page: String(p), limit: "12" });
      Object.keys(params).forEach((k) => !params[k] && qs.delete(k));
      const { data } = await API.get(`/discover/artists?${qs}`);
      setArtists(data.results || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.totalResults || 0);
      setPage(p);
    } catch { toast.error("Failed to load artists"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch({ q, genre, role, location }); }, []);

  const trigger = (newQ = q, newGenre = genre, newRole = role, newLoc = location) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetch({ q: newQ, genre: newGenre, role: newRole, location: newLoc }), 350);
  };

  const hasFilters = q || genre || role || location;

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Discover Artists</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{loading ? "Searching..." : `${total} creator${total !== 1 ? "s" : ""} found`}</p>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-lg">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); trigger(e.target.value); }}
            placeholder="Search by name, genre, bio..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {GENRES.map((g) => (
            <button key={g} onClick={() => { const v = genre === g ? "" : g; setGenre(v); trigger(q, v, role, location); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${genre === g ? "bg-primary/10 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
              {g}
            </button>
          ))}
        </div>

        {/* Role + Location + Clear */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <select value={role} onChange={(e) => { setRole(e.target.value); trigger(q, genre, e.target.value, location); }}
            className="h-9 px-3 rounded-xl bg-muted text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring capitalize cursor-pointer">
            <option value="">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <input value={location} onChange={(e) => { setLocation(e.target.value); trigger(q, genre, role, e.target.value); }}
            placeholder="Filter by location..."
            className="h-9 px-3 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          {hasFilters && (
            <button onClick={() => { setQ(""); setGenre(""); setRole(""); setLocation(""); fetch({}); }}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs text-muted-foreground border border-border hover:border-destructive hover:text-destructive transition-all">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : artists.length === 0 ? (
          <Card className="p-12 text-center">
            <Search size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold mb-1">No artists found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map((a) => <ArtistCard key={a._id} artist={a} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button disabled={page <= 1} onClick={() => fetch({ q, genre, role, location }, page - 1)}
              className="h-9 px-4 rounded-xl text-sm border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              ← Prev
            </button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => fetch({ q, genre, role, location }, page + 1)}
              className="h-9 px-4 rounded-xl text-sm border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function ArtistCard({ artist }: { artist: any }) {
  const [status, setStatus] = useState<null | "pending" | "connected">(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (status || loading) return;
    setLoading(true);
    try {
      await API.post("/connections/request", { recipient: artist.userId });
      setStatus("pending");
      toast.success("Request sent!");
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || "";
      if (msg.includes("already")) setStatus("connected");
      else toast.error(msg || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <Card className="overflow-hidden hover:border-primary/30 transition-all">
      <div className="h-14 bg-gradient-to-br from-primary/20 to-primary/5" />
      <div className="px-4 pb-4 -mt-6 flex flex-col items-center text-center">
        <Avatar name={artist.displayName || "?"} src={artist.avatar} size="md" className="ring-2 ring-card mb-2" />
        <p className="font-semibold text-sm leading-tight">{artist.displayName}</p>
        <p className="text-xs text-primary capitalize mt-0.5">{artist.role}</p>
        {artist.location && (
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
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
        <button onClick={connect} disabled={!!status || loading}
          className={`mt-3 w-full h-8 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            status === "connected" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default"
            : status === "pending" ? "bg-muted text-muted-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}>
          {status === "connected" ? <><Check size={12} /> Connected</>
           : status === "pending" ? <><Clock size={12} /> Sent</>
           : <><UserPlus size={12} /> {loading ? "..." : "Connect"}</>}
        </button>
      </div>
    </Card>
  );
}
