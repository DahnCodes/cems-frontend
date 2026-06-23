"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "organizer";
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 COOKIE-BASED USER FETCH
  const refreshUser = async () => {
    try {
      const res = await api.get<{ user: User }>("api/user/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

useEffect(() => {
  const init = async () => {
    setLoading(true);
    await refreshUser();
    setLoading(false);
  };

  init();
}, []);

  const logout = async () => {
    try {
      await api.post("api/auth/logout");
      setUser(null);

      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}