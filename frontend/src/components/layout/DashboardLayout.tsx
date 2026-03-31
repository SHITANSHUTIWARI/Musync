"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 min-h-screen page-enter">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--surface-high))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: { iconTheme: { primary: 'hsl(var(--primary))', secondary: '#fff' } }
        }} 
      />
    </div>
  );
}
