"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import API from "@/lib/api";
import { setToken, getToken, removeToken } from "@/lib/auth";

interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: Record<string, string>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (token) {
      API.get("/auth/me")
        .then(({ data }) => {
          if (data.success) setUser(data.data.user);
        })
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    const token = getToken();
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (!token && !isPublic) router.push("/login");
    if (token && (pathname === "/login" || pathname === "/signup")) router.push("/dashboard");
  }, [loading, pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.error?.message || "Login failed" };
    }
  };

  const signup = async (userData: Record<string, string>) => {
    try {
      const { data } = await API.post("/auth/signup", userData);
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: "Signup failed" };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.errors?.[0]?.message || "Signup failed" };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
