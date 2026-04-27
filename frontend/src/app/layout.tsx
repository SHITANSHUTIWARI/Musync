import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MUSYNC — The Creative Network for Music Professionals",
  description: "Connect with elite producers, vocalists, beatmakers, and songwriters. Collaborate, create, and build your musical legacy on MUSYNC.",
  keywords: "music collaboration, producer network, music creators, artist platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              gutter={10}
              toastOptions={{
                duration: 3500,
                style: {
                  background: "var(--onyx)",
                  color: "var(--mist)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,111,224,0.1)",
                  backdropFilter: "blur(20px)",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "var(--emerald)", secondary: "var(--onyx)" },
                },
                error: {
                  iconTheme: { primary: "var(--ruby)", secondary: "var(--onyx)" },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
