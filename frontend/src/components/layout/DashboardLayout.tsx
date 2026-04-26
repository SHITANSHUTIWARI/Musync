"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-foreground font-body">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 min-h-screen relative z-10 animate-fade-in">
        <div className="px-10 py-12 max-w-7xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
