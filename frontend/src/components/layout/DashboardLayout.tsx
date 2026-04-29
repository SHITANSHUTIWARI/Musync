"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePlayer } from "@/context/PlayerContext";
import { AudioPlayer } from "@/design-system/components/AudioPlayer";

const pageVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentTrack, pauseTrack } = usePlayer();

  return (
    <div className="min-h-screen bg-obsidian text-mist flex">
      <Sidebar />
      <Topbar />

      {/* Main content — offset by sidebar (68px) and topbar (64px) */}
      <main
        className="flex-1 min-h-screen overflow-x-hidden"
        style={{ paddingLeft: 68, paddingTop: 64 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[calc(100vh-64px)] px-6 py-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <AudioPlayer track={currentTrack || undefined} onClose={pauseTrack} />
    </div>
  );
}
